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
    noOfProducts: z.number()
});

export const productsForCategoryParams = z.object({
    categoryName: z.string()
});

export const productInfoParams = z.object({
    productId: z.string()
});

export const addCartInput = z.object({
    productId: z.string(),
    quantity: z.number()
});

export const removeCartInput = z.object({
    productId: z.string(),
    quantity: z.number()
})

export type SignUpParams = z.infer<typeof signupInput>;

export type SignInParams = z.infer<typeof signinInput>;

export type TrendingProductsParams = z.infer<typeof trendingProductsParams>;

export type AddCartInput = z.infer<typeof addCartInput>;

export type RemoveCartInput = z.infer<typeof removeCartInput>;