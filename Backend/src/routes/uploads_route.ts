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

router.post("/image",upload.single("file"), (req, res) => {
    console.log("upload, req: ", req);   
    if (!req.file) {
          // If no file is uploaded, return an error response
          return res.status(400).json({ message: "No file uploaded" });
        }
        // If file uploaded successfully, send a success response
        res.status(200).json({ message: "File uploaded successfully" });
      });




export default router;