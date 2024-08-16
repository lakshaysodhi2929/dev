export interface IProduct {
    _id: string;
    name: string;
    category?: string;
    video?: string;
    image: string;
    price: number;
    description: string;
    productOrderCnt?: number;
    productMonthlyViewCnt?: number;
}

export interface IItems {
    product: IProduct;
    quantity: number;
}
export interface IUser {
    _id: string;
    username: string;
    password: string;
    address: string;
    phoneNumber: string;
    cart: IItems[];
    productsViewed: string[];
    orderHistory: IOrder[];
}

export interface IOrder {
    _id: string;
    products: IItems[];
    date: Date;
    user: string;
    status: string;
}