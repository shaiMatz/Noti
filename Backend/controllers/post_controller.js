const Post = require('../models/post_model')

const getPosts = async (req, res) => {
      try {
         const posts = await Post.find()
         res.status(200).json(posts)
         console.log("Posts retrieved successfully: ", posts)
      } catch (error) {
         res.status(500).json({ message: error.message })
      }
   };
   
   const createPost = async (req, res) => {
      console.log("Request body: ", req.body)
      const post = new Post({
         title: req.body.title,
         content: req.body.content
      });
      try {
         const newPost = await post.save()
         res.status(201).json(newPost)
         console.log("Post created successfully: ", newPost)
      } catch (error) {
         res.status(400).json({ message: error.message })
      }
   };

   const deletePost = async (req, res) => {
      try {
         const post = await Post.findById(req.params.id)
         if (post == null) {
            return res.status(404).json({ message: 'Post not found' })
         }
         await post.remove()
         res.json({ message: 'Post deleted' })
         console.log("Post deleted successfully: ", post)
      } catch (error) {
         return res.status(500).json({ message: error.message })
      }
   };



module.exports = { getPosts, createPost, deletePost };