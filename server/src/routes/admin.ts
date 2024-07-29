import jwt from 'jsonwebtoken';
import express from 'express';
import { z } from "zod";
import { authenticateJwt } from '../middleware';
import { Admin, Order, Product, User } from '../db';

const router = express.Router();

const signinInput = z.object({
    username: z.string(),
    password: z.string()
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

    const admin = await Admin.findOne({ username, password });
    if (admin) {
      const token = jwt.sign({ id: admin._id }, 'lakshay', { expiresIn: '1h' });
      res.json({ message: 'Logged in successfully', token });
    } else {
      res.status(403).json({ message: 'Invalid username or password' });
    }
});

router.get('/api/order/orderList', authenticateJwt, async(req, res) => {
    const {start, limit} = req.query;
    try{
        const activeOrders = await Order.find({ status: 'active' })
        .sort({ date: -1 })
        .skip(start)
        .limit(limit)
        .populate('product')
        .populate('user');

        res.status(201).json(activeOrders);
    } catch (err) {
        res.status(401).json({message: 'Error in fetching orderList'});
    }
});

router.put('/api/order/rejectOrder', authenticateJwt, async(req, res) => {
    const {orderId} = req.body;
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

router.put('/api/order/markOrderComplete', authenticateJwt, async(req, res) => {
  const {orderId} = req.body;
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

router.get('/api/product/productsViewed', authenticateJwt, async(req, res)=>{
  const userId = req.headers["userId"];
  try{
    const user = await User.findById(userId);
    res.json({productsViewed: user.productsViewed});
  } catch (err) {
    res.status(401).json({message: 'User not found.'});
  }
})

router.get('/api/order/mostOrdered', authenticateJwt, async(req, res)=>{
  const noOfProducts = req.query.noOfProducts;
    try{
      const topProducts = await Product.find().sort({productOrderCnt: -1}).limit(noOfProducts).exec();
      res.status(201).json(topProducts);
  }catch(err){
      res.status(401).json({message: 'Error in fetching most ordered Products'});
  }
})

export default router;