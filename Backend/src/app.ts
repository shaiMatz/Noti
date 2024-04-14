import express, { Express } from "express";
const app = express();
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import postRoute from "./routes/post_routes";
import bodyParser from "body-parser";
import authRoute from "./routes/auth_route";

const initApp = () => {
    const promise = new Promise<Express>((resolve) => {
        const db = mongoose.connection;
        console.log("Connecting to database");
        db.on("error", (err) => console.log(err));
        db.once("open", () => console.log("Database connected"));
        const mongoURI = process.env.MONGO_URI || ""; 
        mongoose.connect(mongoURI).then(() => {
            app.use(bodyParser.json());
            app.use(bodyParser.urlencoded({ extended: true }));
            app.use("/auth", authRoute); 
            app.use("/post", postRoute);
            resolve(app);
        })
    });
    return promise;
};

export default initApp;