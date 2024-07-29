"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const admin_1 = __importDefault(require("./routes/admin"));
const user_1 = __importDefault(require("./routes/user"));
const app = (0, express_1.default)();
const port = 3000;
const cors_1 = __importDefault(require("cors"));
// TODO: serve client from here instead and remove cors from dependencies
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/admin', admin_1.default);
app.use('/user', user_1.default);
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
mongoose_1.default.connect('mongodb+srv://lakshaysodhi2929:lakshay423@cluster0.meyacar.mongodb.net/selling-app', { dbName: "selling-app" }).then(() => console.log('connected successfully to mongodb'))
    .catch(() => console.log('not connected to db'));
// mongodb+srv://lakshaysodhi2929:lakshay423@cluster0.meyacar.mongodb.net/
