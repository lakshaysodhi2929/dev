import express from 'express';
import jwt from "jsonwebtoken";
import { Product, User } from '../db';
import { z } from "zod";
import { authenticateJwt } from '../middleware';

const signupInput = z.object({
    username: z.string(),
    password: z.string(),
    address: z.string(),
    phoneNumber: z.string()
});

const signinInput = z.object({
    username: z.string(),
    password: z.string()
});


const router = express.Router();

router.post('/signup', async (req, res)=>{
    let parsedInput = signupInput.safeParse(req.body)
    if (!parsedInput.success) {
      return res.status(403).json({
        msg: "error"
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
        msg: "error"
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
    const noOfProducts = req.query.noOfProducts;
    try{
      const topProducts = await Product.find().sort({productMonthlyViewCnt: -1}).limit(noOfProducts).exec();
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
  try{
    const productsForReqCategory = await Product.find({category: req.params.categoryName});
      res.status(201).json(productsForReqCategory);
  }catch(err){
      res.status(401).json({message: 'Error in fetching Products for Required Categorie'});
  }
})

router.put('/api/order/add', authenticateJwt, async (req, res) => {
  try{
    const userId = req.headers["userId"];
    const orderedProduct = await Product.findOne({_id: req.body.productId});
    const user = await User.findOne({_id: userId});
    if(user && orderedProduct) {
      user.cart.push(orderedProduct);
      await user.save();
      res.json({ message: 'Order added successfully' });
    } else {
      res.status(401).json({message: 'User or orderProduct Not found'});
    }
  }catch(err){
      res.status(401).json({message: 'Error in adding product'});
  }
})

router.put('/api/order/remove', authenticateJwt, async (req, res) => {
  try{
    const userId = req.headers["userId"];
    const orderedProduct = await Product.findOne({_id: req.body.productId});
    if(orderedProduct) {
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $pull: { cart: orderedProduct._id } },
        {new: true}
      );
      if(updatedUser){
        res.json({ message: 'order removed successfully', updatedCart: updatedUser.cart });
      } else {
        res.status(401).json({message: 'User Not found'});
      }
    } else {
      res.status(401).json({message: 'OrderProduct Not found'});
    }
  }catch(err){
      res.status(401).json({message: 'Error in removing product'});
  }
})

router.get('/api/user', authenticateJwt, async (req, res) => {
  try{
    const userId = req.headers["userId"];
    const user = User.findOne({_id: userId});
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
  try{
    const userId = req.headers["userId"];
    const user = User.findOne({_id: userId});
    const productId = req.params.productId;
    const updatedProduct= await User.findByIdAndUpdate(
      productId,
      { $inc: { productMonthlyViewCnt: 1 } },
      {new: true}
    );
    try{
      user.productsViewed.push(productId);
      await user.save();
    } catch (err){
      // if user data is not saved even then we want the product info to be served
      if(productId && updatedProduct){
        res.status(201).json(updatedProduct);
      } else {
        res.status(401).json({message: "product doesn't exist"});
      }
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