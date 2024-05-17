import express from 'express';
import { Product } from '../db';


const router = express.Router();

router.get('api/trendingProducts',async (req, res) => {
    const noOfProducts = req.query.noOfProducts;
    try{
        const topProducts = await Product.find().sort({productMonthlyViewCnt: -1}).limit(noOfProducts).exec();
        return topProducts;
    }catch(err){
        console.log('Error in fetching Trending Products', err);
        return [];
    }
})

export default router;