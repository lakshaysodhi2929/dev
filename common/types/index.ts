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

export type SignUpParams = z.infer<typeof signupInput>;

export type SignInParams = z.infer<typeof signinInput>;