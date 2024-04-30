import express from "express";
import multer from 'multer'

const router = express.Router();

const storage = multer.diskStorage({
 destination: function (req, file, cb) {
 cb(null, 'uploads/')
 },
 filename: function (req, file, cb) {
 cb(null, file.originalname) 
 }
})
const upload = multer({ storage: storage });

/**
 * @swagger
 * tags:
 *   name: Uploads
 *   description: File upload operations
 */

/**
 * @swagger
 * /upload/image:
 *   post:
 *     summary: Uploads an image file
 *     tags: [Uploads]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Image file to upload
 *     responses:
 *       200:
 *         description: File uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: File uploaded successfully
 *       400:
 *         description: No file uploaded or error in upload process
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No file uploaded
 */
router.post("/image",upload.single("file"), (req, res) => {
    console.log("uploading file");   
    if (!req.file) {
          // If no file is uploaded, return an error response
          return res.status(400).json({ message: "No file uploaded" });
        }
        // If file uploaded successfully, send a success response
        res.status(200).json({ message: "File uploaded successfully" });
      });




export default router;