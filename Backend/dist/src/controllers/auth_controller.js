"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_model_1 = __importDefault(require("../models/user_model"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Register route");
    const email = req.body.email;
    try {
        let user = yield user_model_1.default.findOne({ email: email });
        console.log("user:", user);
        if (user) {
            res.status(400).json({ message: "User already exists" });
        }
    }
    catch (err) {
        return sendError(res);
    }
    const password = req.body.password;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    if (!email || !password || !firstName || !lastName) {
        return sendError(res);
    }
    console.log("user:", email, password, firstName, lastName);
    try {
        let salt = yield bcrypt_1.default.genSalt(10);
        let hashedPassword = yield bcrypt_1.default.hash(password, salt);
        const user = new user_model_1.default({
            firstName: firstName,
            lastName: lastName,
            email: email,
            passwordHash: hashedPassword,
        });
        let newUser = yield user.save();
        console.log("newUser:", newUser);
        res
            .status(200)
            .json({ message: "User created successfully", data: newUser });
    }
    catch (error) {
        sendError(res, "failed to create user");
    }
});
function sendError(res, msg = "Invalid request") {
    return res.status(400).send({
        status: "error",
        message: msg,
    });
}
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    {
        const email = req.body.email;
        const password = req.body.password;
        if (!email || !password) {
            return sendError(res, "bed email or password");
        }
        try {
            let user = yield user_model_1.default.findOne({ email: email });
            if (!user) {
                return sendError(res, "User not found");
            }
            let isMatch = user.isValidPassword(password);
            if (!isMatch) {
                return sendError(res, "Invalid credentials");
            }
            const accessToken = yield jsonwebtoken_1.default.sign({ userId: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_LIFE });
            const refreshToken = yield jsonwebtoken_1.default.sign({ userId: user._id }, process.env.REFRESH_TOKEN_SECRET);
            if (user.tokens) {
                user.tokens = [refreshToken];
            }
            else {
                user.tokens.push(refreshToken);
            }
            yield user.save();
            res
                .status(200)
                .send({ accessToken: accessToken, refreshToken: refreshToken });
        }
        catch (error) {
            return sendError(res);
        }
    }
});
const refreshToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token === null)
        res.sendStatus(401);
    jsonwebtoken_1.default.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, userInfo) => __awaiter(void 0, void 0, void 0, function* () {
        if (err)
            return res.status(403).send(err.message);
        if (!userInfo)
            return res.status(403).send("Invalid token payload.");
        try {
            const user = yield user_model_1.default.findById(userInfo._id);
            if (user === null)
                return res.status(403).send("Invalid request");
            if (!user.tokens.includes(token)) {
                user.tokens = []; // Invalidate all user tokens
                yield user.save();
                return res.status(403).send("Invalid request");
            }
            const accessToken = yield jsonwebtoken_1.default.sign({ _id: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.JWT_TOKEN_EXPIRATION });
            const refreshToken = yield jsonwebtoken_1.default.sign({ _id: user._id }, process.env.REFRESH_TOKEN_SECRET);
            // Replace the old token with the new refresh token in the user's tokens array
            user.tokens[user.tokens.indexOf(token)] = refreshToken;
            yield user.save();
            res.status(200).send({ accessToken, refreshToken });
        }
        catch (err) {
            res.status(403).send(err.message);
        }
    }));
});
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token === null)
        res.sendStatus(401);
    jsonwebtoken_1.default.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, userInfo) => __awaiter(void 0, void 0, void 0, function* () {
        if (err)
            return res.status(403).send(err.message);
        if (!userInfo)
            return res.status(403).send("Invalid token payload.");
        try {
            const user = yield user_model_1.default.findById(userInfo._id);
            if (user === null)
                return res.status(403).send("Invalid request");
            if (!user.tokens.includes(token)) {
                user.tokens = []; // Invalidate all user tokens
                yield user.save();
                return res.status(403).send("Invalid request");
            }
            user.tokens.splice(user.tokens.indexOf(token), 1);
            yield user.save();
            res.status(200).send("User logged out successfully");
        }
        catch (err) {
            res.status(403).send(err.message);
        }
    }));
});
exports.default = {
    login,
    register,
    refreshToken,
    logout,
};
//# sourceMappingURL=auth_controller.js.map