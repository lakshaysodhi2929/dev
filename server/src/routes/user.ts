import {productInfoParams, productsForCategoryParams, removeOrderInput, signinInput, signupInput, trendingProductsParams, updateCartInput } from '../../../common/types/index';
import express from 'express';
import jwt from "jsonwebtoken";
import { Order, Product, User } from '../db';
import { authenticateJwt } from '../middleware';
import mongoose from 'mongoose';

const router = express.Router();

const SECRET = 'userLakshay';

router.post('/signup', async (req, res)=>{
    let parsedInput = signupInput.safeParse(req.body)
    if (!parsedInput.success) {
      return res.status(403).json({
        msg: "error in input",
        body: req.body
      });
    }
    const username = parsedInput.data.username; 
    const password = parsedInput.data.password;
    const address = parsedInput.data.address;
    const phoneNumber = parsedInput.data.phoneNumber;
    
    const user = await User.findOne({ username: parsedInput.data.username });
    if (user) {
      res.status(403).json({ message: 'User already exists' });
    } else {
      const newUser = new User({ username, password, address, phoneNumber, cart: [], productsViewed: [] });
      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, SECRET, { expiresIn: '1h' });
      res.json({ message: 'User created successfully', token });
    }
});

router.post('/login', async (req, res) => {
    let parsedInput = signinInput.safeParse(req.body)
    if (!parsedInput.success) {
      return res.status(403).json({
        msg: "error in input"
      });
    }

    const username = parsedInput.data.username; 
    const password = parsedInput.data.password;

    const user = await User.findOne({ username, password });
    if (user) {
      const token = jwt.sign({ id: user._id }, SECRET, { expiresIn: '1h' });
      res.json({ message: 'Logged in successfully', token });
    } else {
      res.status(403).json({ message: 'Invalid username or password' });
    }
  });

router.get('/api/product/trendingProducts', authenticateJwt(SECRET), async (req, res) => {
  let parsedInput = trendingProductsParams.safeParse(req.query);
    if (!parsedInput.success) {
      return res.status(403).json({
        msg: "error in input"
      });
    }
    const noOfProducts = parsedInput.data.noOfProducts;
    try{
      const topProducts = await Product.find()
      .sort({ productMonthlyViewCnt: -1 })
      .limit(noOfProducts)
      .select('name image price description _id')
      .exec();
      res.status(201).json(topProducts);
  }catch(err){
      res.status(401).json({message: 'Error in fetching Trending Products'});
  }
})


router.get('/api/product/categoryDict', authenticateJwt(SECRET), async (req, res) => {
  try{
    const uniqueCategories = await Product.distinct('category');
      res.status(201).json(uniqueCategories);
  }catch(err){
      res.status(401).json({message: 'Error in fetching Categories'});
  }
})

router.get('/api/product/category/:categoryName', authenticateJwt(SECRET), async (req, res) => {
  let parsedInput = productsForCategoryParams.safeParse(req.params);
    if (!parsedInput.success) {
      return res.status(403).json({
        msg: "error in input"
      });
    }
  try{
    const productsForReqCategory = await Product.find({category: parsedInput.data.categoryName})
    .select('name image price description _id');
      res.status(201).json(productsForReqCategory);
  }catch(err){
      res.status(401).json({message: 'Error in fetching Products for Required Categorie'});
  }
})

router.put('/api/cart/update', authenticateJwt(SECRET), async (req, res) => {
  let parsedInput = updateCartInput.safeParse(req.body);
  if (!parsedInput.success) {
    return res.status(400).json({
      message: "Invalid request body",
      errors: parsedInput.error.details, // Include specific validation errors
    });
  }

  try {
    const qty = Number(parsedInput.data.quantity);
    const userId = req.headers["userId"];
    const productId = parsedInput.data.productId; // Use productId for clarity

    if (isNaN(qty) || qty < 0) {
      return res.status(400).json({ message: "Invalid quantity value" });
    }

    const orderedProduct = await Product.findOne({ _id: productId });
    if (!orderedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    let updatedUser;

    if (qty > 0) {
      updatedUser = await User.findOneAndUpdate(
        { _id: userId, "cart.product": productId },
        { $set: { "cart.$.quantity": qty } },
        { new: true }
      );
    } else {
      updatedUser = await User.findByIdAndUpdate(
        userId,
        { $pull: { cart: { product: productId } } },
        { new: true }
      );
    }

    if (!updatedUser) {
      // User might exist but product not in cart (for qty > 0)
      // or User might not exist (for qty === 0)
      if (qty > 0) {
        const user = await User.findById(userId);
        if (user) {
          user.cart.push({ product: productId, quantity: qty });
          await user.save();
          updatedUser = user;
        } else {
          return res.status(404).json({ message: "User not found" });
        }
      } else {
        return res.status(404).json({ message: "Product not found in cart" });
      }
    }

    res.json({ message: 'Product updated in cart successfully', updatedCart: updatedUser.cart });
  } catch (err) {
    console.error('Error in updating product in cart:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.post('/api/order/add', authenticateJwt(SECRET) ,async (req, res)=>{
  try{
    const userId = req.headers["userId"];
    const user = await User.findOne({_id: userId});
    if(user) {
      user.cart.forEach(item => {
        Product.findByIdAndUpdate(
          item.product,
          { $inc: { productOrderCnt: 1 } },
        )
      });
      const newOrder = new Order({
        products: user.cart,
        date: new Date(),
        user: user._id,
        status: 'Active'
      })
      await newOrder.save();
      await User.findByIdAndUpdate(
        userId,
        {
          $set: {
            cart: []
          },
          $push: {
            orderHistory: newOrder._id
          }
        }
      );

      res.json({ message: 'Order added successfully', orderId: newOrder._id });
    } else {
      res.status(401).json({message: 'User or orderProduct Not found'});
    }
  }catch(err){
      res.status(401).json({message: 'Error in adding product'});
  }
})

router.post('/api/order/remove', authenticateJwt(SECRET), async (req, res) => {
  let parsedInput = removeOrderInput.safeParse(req.body);
    if (!parsedInput.success) {
      return res.status(403).json({
        msg: "error in input"
      });
    }
  try{
    const orderId = parsedInput.data.orderId;
      await Order.findByIdAndDelete(orderId);
      res.json({ message: 'order removed successfully'});
  }catch(err){
      res.status(401).json({message: 'Error in removing order'});
  }
})

router.get('/api/user', authenticateJwt(SECRET), async (req, res) => {
  try {
    const userId = req.headers["userId"];

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    const user = await User.findOne({ _id: userId }).populate({
      path: 'cart.product',
      model: 'Product'
    }).populate({
      path: 'orderHistory',
      model: 'Order'
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(201).json(user);
  } catch (err) {
    console.error('Error in getting user details:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.get('/api/product/productInfo/:productId', authenticateJwt(SECRET), async (req, res) => {
  let parsedInput = productInfoParams.safeParse(req.params);
  if (!parsedInput.success) {
    return res.status(403).json({
      msg: "error in input"
    });
  }
  try {
    const userId = req.headers["userId"];
    const user = await User.findOne({_id: userId});
    const productId = parsedInput.data.productId;

    // Check for valid product ID format
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid product ID format" });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { $inc: { productMonthlyViewCnt: 1 } },
      { new: true }
    );

    // Check if product exists
    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    console.log(updatedProduct);
    try {
      const objId = new mongoose.Types.ObjectId(productId);
      if (user) {
        user.productsViewed.push(objId);
        await user.save();
      } else {
        console.error('User not found');
      }
    } catch (err) {
      console.error('error in saving user viewed Product', err);
    }

    res.status(201).json(updatedProduct);
  } catch (err) {
    // Handle specific errors like mongoose.Error.CastError
    if (err instanceof mongoose.Error.CastError) {
      return res.status(400).json({ message: "Invalid request data" });
    } else {
      console.error('Error in getting product details', err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
});

export default router;