
import express from "express";
import mongoose from "mongoose";
import adminRouter from './routes/admin';
import userRouter from './routes/user';
const app = express();

const port = 3000;
import cors from "cors";

// TODO: serve client from here instead and remove cors from dependencies
app.use(cors());
app.use(express.json());

app.use('/admin',adminRouter);
app.use('/user',userRouter);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

//TODO: change the mongoose link
mongoose.connect('mongodb://localhost:27017/courses', { dbName: "selling-app" });
