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
const post_model_1 = __importDefault(require("../models/post_model")); // Assuming Post is properly typed in its own definition
const base_controller_1 = __importDefault(require("./base_controller"));
class postController extends base_controller_1.default {
    constructor() {
        super(post_model_1.default);
    }
    getPosts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const posts = yield post_model_1.default.find();
                res.status(200).json(posts);
                console.log("Posts retrieved successfully: ", posts);
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
            return; // Explicitly indicate the end of the function
        });
    }
    createPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Request body: ", req.body);
            const post = new post_model_1.default({
                userId: req.body.userId,
                content: req.body.content,
                location: req.body.location,
                image: req.body.image,
            });
            console.log("Post object: ", post);
            try {
                const newPost = yield post.save();
                res.status(201).json(newPost);
                console.log("Post created successfully: ", newPost);
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
    }
    deletePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield post_model_1.default.findByIdAndDelete(req.params.id);
                if (!result) {
                    res.status(404).json({ message: "Post not found" });
                    return; // Early return to stop execution
                }
                res.json({ message: "Post deleted" });
                console.log("Post deleted successfully");
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
    }
}
exports.default = new postController();
//# sourceMappingURL=post_controller.js.map