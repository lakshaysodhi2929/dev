import {productInfoParams, productsForCategoryParams, removeOrderInput, signinInput, signupInput, trendingProductsParams, updateCartInput } from '../../../common/types/index';
import express from 'express';
import jwt from "jsonwebtoken";
import { Order, Product, User } from '../db';
import { authenticateJwt } from '../middleware';
import mongoose from 'mongoose';

const router = express.Router();

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
      const token = jwt.sign({ id: newUser._id }, 'lakshay', { expiresIn: '1h' });
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
      const token = jwt.sign({ id: user._id }, 'lakshay', { expiresIn: '1h' });
      res.json({ message: 'Logged in successfully', token });
    } else {
      res.status(403).json({ message: 'Invalid username or password' });
    }
  });

router.get('/api/product/trendingProducts', authenticateJwt, async (req, res) => {
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


router.get('/api/product/categoryDict', authenticateJwt, async (req, res) => {
  try{
    const uniqueCategories = await Product.distinct('category');
      res.status(201).json(uniqueCategories);
  }catch(err){
      res.status(401).json({message: 'Error in fetching Categories'});
  }
})

router.get('/api/product/category/:categoryName', authenticateJwt, async (req, res) => {
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

router.put('/api/cart/update', authenticateJwt, async (req, res) => {
  let parsedInput = updateCartInput.safeParse(req.body);
    if (!parsedInput.success) {
      return res.status(403).json({
        msg: "error in input"
      });
    }
  try{
    const qty = Number(parsedInput.data.quantity);
    const userId = req.headers["userId"];
    const orderedProduct = await Product.findOne({_id: parsedInput.data.productId});
    if(orderedProduct) {
      let updatedUser;
      if(qty>0){
        updatedUser = await User.findOneAndUpdate(
          { _id: userId, 'cart.product': orderedProduct._id },
          { $set: { 'cart.$.quantity': qty } },
          {new: true}
        );
      } else {
        updatedUser = await User.findByIdAndUpdate(
          userId,
          {
            $pull: {
              cart: {
                product: orderedProduct._id
              }
            }
          },
          {new: true}
        );
      }
      if(updatedUser){
        res.json({ message: 'product update in cart successfully', updatedCart: updatedUser.cart });
      } else {
        res.status(401).json({message: 'User Not found'});
      }
    } else {
      res.status(401).json({message: 'OrderProduct Not found'});
    }
  }catch(err){
      res.status(401).json({message: 'Error in updateing product in cart'});
  }
})

router.post('api/order/add', authenticateJwt ,async (req, res)=>{
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

router.post('/api/order/remove', authenticateJwt, async (req, res) => {
  let parsedInput = removeOrderInput.safeParse(req.params);
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

router.get('/api/user', authenticateJwt, async (req, res) => {
  try{
    const userId = req.headers["userId"];
    const user = User.findOne({_id: userId}).populate({
      path: 'cart.product',
      model: 'Product'
    }).populate({
      path: 'orderHistory',
      model: 'Order'
    });
    if(user){
      res.status(201).json(user);
    } else {
      res.status(401).json({message: "user doesn't exist"});
    }
  } catch (err) {
    res.status(401).json({message: 'Error in getting User Details'});
  }
})

router.get('/api/product/productInfo/:productId', authenticateJwt, async (req, res) => {
  let parsedInput = productInfoParams.safeParse(req.params);
    if (!parsedInput.success) {
      return res.status(403).json({
        msg: "error in input"
      });
    }
  try{
    const userId = req.headers["userId"];
    const user = await User.findOne({_id: userId});
    const productId = parsedInput.data.productId;
    const updatedProduct= await User.findByIdAndUpdate(
      productId,
      { $inc: { productMonthlyViewCnt: 1 } },
      {new: true}
    );
    try{
      const objId = new mongoose.Types.ObjectId(productId)
      if(user){
        user.productsViewed.push(objId);
        await user.save();
      } else new Error('user not found');
    } catch (err){
      // if user data is not saved even then we want the product info to be served
      console.log('error in saving user viewed Product', err);
    }

    if(productId && updatedProduct){
      res.status(201).json(updatedProduct);
    } else {
      res.status(401).json({message: "product doesn't exist"});
    }
  } catch (err) {
    res.status(401).json({message: 'Error in getting product Details'});
  }
})

export default router;