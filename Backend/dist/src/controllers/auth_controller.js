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
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Register route");
    const email = req.body.email;
    try {
        let user = yield user_model_1.default.findOne({ email: email });
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
    try {
        let salt = yield bcrypt_1.default.genSalt(10);
        let hashedPassword = yield bcrypt_1.default.hash(password, salt);
        const user = new user_model_1.default({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: hashedPassword,
        });
        let newUser = yield user.save();
        res
            .status(200)
            .json({ message: "User created successfully", data: newUser });
    }
    catch (error) {
        return sendError(res, "failed to create user");
    }
});
const logout = (req, res) => {
    res.status(200).json({ message: "Logout route" });
    res.status(400).json({ message: "Logout failed" });
};
const login = (req, res) => {
    res.status(200).json({ message: "Login route" });
    res.status(400).json({ message: "Login failed" });
};
function sendError(res, msg = "Invalid request") {
    return res.status(400).send({
        status: "error",
        message: msg,
    });
}
exports.default = {
    login,
    register,
    logout,
};
//# sourceMappingURL=auth_controller.js.map