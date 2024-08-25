import jwt from 'jsonwebtoken';
import express from 'express';
import { z } from "zod";
import { authenticateJwt } from '../middleware';
import { Admin, Order, Product, User } from '../db';
import { addProductInput, changeOrderStatusInput, orderListInput, removeProductInput } from '../../../common/types';

const router = express.Router();

const signinInput = z.object({
    username: z.string(),
    password: z.string()
});
const SECRET = 'adminLakshay';

router.post('/login', async (req, res) => {
    let parsedInput = signinInput.safeParse(req.body)
    if (!parsedInput.success) {
      return res.status(403).json({
        msg: "error"
      });
    }

    const username = parsedInput.data.username; 
    const password = parsedInput.data.password;

    const admin = await Admin.findOne({ username, password });
    if (admin) {
      const token = jwt.sign({ id: admin._id }, SECRET, { expiresIn: '1h' });
      res.json({ message: 'Logged in successfully', token });
    } else {
      res.status(403).json({ message: 'Invalid username or password' });
    }
});

router.post('/api/product/addProduct', authenticateJwt(SECRET), async(req, res) => {
  let parsedInput = addProductInput.safeParse(req.body);
  if (!parsedInput.success) {
    return res.status(403).json({
      msg: "error in input"
    });
  }
  try{
    const newProduct = new Product({
      name: parsedInput.data.name,
      category: parsedInput.data.category,
      video: parsedInput.data.video,
      image: parsedInput.data.image,
      price: parsedInput.data.price,
      description: parsedInput.data.description,
      productOrderCnt: 0,
      productMonthlyViewCnt: 0

    });
    await newProduct.save();
      res.json({ message: 'added product Successfully', productId: newProduct._id});
  } catch (err) {
    res.status(401).json({message: 'Error in adding Product'});
  }
});

router.post('/api/product/removeProduct', authenticateJwt(SECRET), async(req, res) => {
  let parsedInput = removeProductInput.safeParse(req.body);
  if (!parsedInput.success) {
    return res.status(403).json({
      msg: "error in input"
    });
  }
  try{
    await Product.findByIdAndDelete(parsedInput.data.productId);
    res.json({ message: 'removed product Successfully'});
  } catch (err) {
    res.status(401).json({message: 'Error in removing Product'});
  }
});

router.get('/api/product/getProductList',authenticateJwt(SECRET), async (req,res) => {
  try{
    console.log('hi');
    const productList = await Product.find();
    res.json({ message: 'product List fetched Successfully', productList});
  }catch(err) {
    res.status(401).json({message: 'Error in fetching Product List'});
  }
});

router.get('/api/order/orderList', authenticateJwt(SECRET), async(req, res) => {
  let parsedInput = orderListInput.safeParse(req.query);
  if (!parsedInput.success) {
    return res.status(403).json({
      msg: "error in input"
    });
  }
    try{
        const activeOrders = await Order.find({ status: "Active" })
        .sort({ date: -1 })
        .skip(parsedInput.data.start)
        .limit(parsedInput.data.limit)
        .populate({
          path: 'products.product',
          model: 'Product'
        })
        .populate('user');

        res.status(201).json(activeOrders);
    } catch (err) {
        res.status(401).json({message: 'Error in fetching orderList'});
    }
});

router.put('/api/order/rejectOrder', authenticateJwt(SECRET), async(req, res) => {
  let parsedInput = changeOrderStatusInput.safeParse(req.body);
  if (!parsedInput.success) {
    return res.status(403).json({
      msg: "error in input"
    });
  }
    const orderId = parsedInput.data.orderId;
    try{
      await Order.findByIdAndUpdate(
        orderId,
        { $set: {status: 'rejected'}}
      );
        res.json({ message: 'order rejected successfully'});
    } catch (err) {
      res.status(401).json({message: 'Error in removing order'});
    }
});

router.put('/api/order/markOrderComplete', authenticateJwt(SECRET), async(req, res) => {
  let parsedInput = changeOrderStatusInput.safeParse(req.body);
  if (!parsedInput.success) {
    return res.status(403).json({
      msg: "error in input"
    });
  }
    const orderId = parsedInput.data.orderId;
    try{
        await Order.findByIdAndUpdate(
          orderId,
          { $set: {status: 'completed'}}
        );
        res.json({ message: 'order marked to complete successfully'});
    } catch (err) {
      res.status(401).json({message: 'Error in marking order to complete.'});
    } 
});

router.get('/api/product/productsViewed', authenticateJwt(SECRET), async(req, res)=>{
  //make this client specific
  const userId = req.headers["userId"];
  try{
    const user = await User.findById(userId);
    res.json({productsViewed: user.productsViewed});
  } catch (err) {
    res.status(401).json({message: 'User not found.'});
  }
})

router.get('/api/order/mostOrdered', authenticateJwt(SECRET), async(req, res)=>{
  const noOfProducts = req.query.noOfProducts;
    try{
      const topProducts = await Product.find().sort({productOrderCnt: -1}).limit(noOfProducts).exec();
      res.status(201).json(topProducts);
  }catch(err){
      res.status(401).json({message: 'Error in fetching most ordered Products'});
  }
})

export default router;