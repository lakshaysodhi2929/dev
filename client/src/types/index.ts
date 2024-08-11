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