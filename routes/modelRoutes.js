import express from 'express';
import multer from 'multer';
import { uploadModel, getModels, deleteModel } from '../controllers/modelController.js';

const router = express.Router();

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

// Upload route
router.post("/upload", upload.single("file"), uploadModel);

// Fetch all models
router.get("/", getModels);

// Delete model
router.delete("/:id", deleteModel);

export default router;
