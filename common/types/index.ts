import { z } from "zod";

export const signupInput = z.object({
    username: z.string().email(),
    password: z.string().min(1),
    address: z.string().min(1),
    phoneNumber: z.string().min(10)
});

export const signinInput = z.object({
    username: z.string().email(),
    password: z.string().min(1)
});

export const trendingProductsParams = z.object({
    noOfProducts: z.preprocess((val) => Number(val), z.number())
});

export const productsForCategoryParams = z.object({
    categoryName: z.string()
});

export const productInfoParams = z.object({
    productId: z.string()
});

export const updateCartInput = z.object({
    productId: z.string(),
    quantity: z.preprocess((val) => Number(val), z.number())
});

export const removeOrderInput = z.object({
    orderId: z.string()
});

export const addProductInput = z.object({
    name: z.string(),
    category: z.string(),
    video: z.string(),
    image: z.string(),
    price: z.preprocess((val) => Number(val), z.number()),
    description: z.string()
});

export const removeProductInput = z.object({
    productId: z.string()
});

export const orderListInput = z.object({
    start: z.preprocess((val) => Number(val), z.number()),
    limit: z.preprocess((val) => Number(val), z.number())
});

export const changeOrderStatusInput = z.object({
    orderId: z.string()
});

export type SignUpParams = z.infer<typeof signupInput>;

export type SignInParams = z.infer<typeof signinInput>;

export type TrendingProductsParams = z.infer<typeof trendingProductsParams>;

export type UpdateCartInput = z.infer<typeof updateCartInput>;

export type RemoveOrderInput = z.infer<typeof removeOrderInput>;

export type AddProductInput = z.infer<typeof addProductInput>;

export type RemoveProductInput = z.infer<typeof removeProductInput>;

export type OrderListInput = z.infer<typeof orderListInput>;

export type ChangeOrderStatusInput = z.infer<typeof changeOrderStatusInput>;
