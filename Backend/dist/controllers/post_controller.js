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
exports.deletePost = exports.createPost = exports.getPosts = void 0;
const post_model_1 = __importDefault(require("../models/post_model")); // Assuming Post is properly typed in its own definition
const getPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
exports.getPosts = getPosts;
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Request body: ", req.body);
    const post = new post_model_1.default({
        title: req.body.title,
        content: req.body.content,
    });
    try {
        const newPost = yield post.save();
        res.status(201).json(newPost);
        console.log("Post created successfully: ", newPost);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.createPost = createPost;
const deletePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield post_model_1.default.findByIdAndDelete(req.params.id);
        if (!result) {
            res.status(404).json({ message: 'Post not found' });
            return; // Early return to stop execution
        }
        res.json({ message: 'Post deleted' });
        console.log("Post deleted successfully");
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.deletePost = deletePost;
//# sourceMappingURL=post_controller.js.map