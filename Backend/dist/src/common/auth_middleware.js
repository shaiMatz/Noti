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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];
        if (token == null) {
            res.sendStatus(401);
            return;
        }
        jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET, // Ensure non-null assertion or provide a fallback
        (err, decoded) => {
            if (err) {
                return res.sendStatus(403); // Token verification failed
            }
            req.user = decoded;
            next();
        });
    }
    catch (error) {
        // Log the error or handle it as per your error-handling logic
        console.error('Authentication Error:', error);
        res.sendStatus(500); // Internal Server Error
    }
});
exports.default = authenticate;
//# sourceMappingURL=auth_middleware.js.map