import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    address: String,
    phoneNumber: String,
    cart: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    productsViewed: [{type: mongoose.Schema.Types.ObjectId, ref: 'Product'}]
});

const productSchema = new mongoose.Schema({
    name: String,
    category: String,
    video: String,
    image: String,
    price: Number,
    description: String,
    productOrderCnt: Number,
    productMonthlyViewCnt: Number
});

const orderSchema = new mongoose.Schema({
    productID: {type: mongoose.Schema.Types.ObjectId, ref: 'Product'},
    Date: Date,
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    Quantity: Number,
    Status: String
});

export const User = mongoose.model('User', userSchema);
export const Product = mongoose.model('Product', productSchema);
export const Order = mongoose.model('Product', orderSchema);
