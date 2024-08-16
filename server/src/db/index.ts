import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    username: String,
    password: String,
});

const itemsSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, required: true }
  });

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    address: String,
    phoneNumber: String,
    cart: [itemsSchema],
    productsViewed: [{type: mongoose.Schema.Types.ObjectId, ref: 'Product'}],
    orderHistory: [{type: mongoose.Schema.Types.ObjectId, ref: 'Order'}]
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
    products: [itemsSchema],
    date: Date,
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    status: String
});
//status can be active, completed or rejected

export const Admin = mongoose.model('Admin', adminSchema);
export const User = mongoose.model('User', userSchema);
export const Product = mongoose.model('Product', productSchema);
export const Order = mongoose.model('Order', orderSchema);
