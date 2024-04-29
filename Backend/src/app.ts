import express, { Express } from "express";
const app = express();
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import postRoute from "./routes/post_routes";
import bodyParser from "body-parser";
import authRoute from "./routes/auth_route";
import userRoute from "./routes/user_route";
import uploadsRoute from "./routes/uploads_route";
import swaggerUi from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";
if(process.env.NODE_ENV == "development") {
    console.log(
      "Example app listening at http://localhost:" + process.env.PORT+"/api-docs"
    );
    const options = {
        definition: {
            openapi: "3.0.0",
            info: {
                title: "Noti API",
                version: "1.0.0",
                description: "Noti API",
            },
            servers: [
                {
                    url: "http://localhost:3000",
                },
            ],
        },
        apis: ["./src/routes/*.ts"],
    };
    const specs = swaggerJsDoc(options);
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
}
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
            app.use("/user", userRoute);
            app.use("/upload", uploadsRoute);
            app.use('/uploads', express.static('uploads'));

            resolve(app);
        })
    });
    return promise;
};

export default initApp;