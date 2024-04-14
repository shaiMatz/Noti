"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const router = express.Router();
const PostController = require("../controllers/post_controller");
router.get("/", PostController.getPosts);
router.get("/:id", PostController.getPosts);
router.post("/", PostController.createPost);
router.delete("/:id", PostController.deletePost);
exports.default = router;
//# sourceMappingURL=post_routes.js.map