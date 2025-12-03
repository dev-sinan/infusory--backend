import Model from "../models/Model.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";

export const uploadModel = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    // Upload file to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "auto",
      folder: "glb_models",
    });

    // Save to MongoDB
    const model = await Model.create({
      name: req.file.originalname,
      url: result.secure_url,
      publicId: result.public_id,
    });

    // Remove local file after upload
    fs.unlinkSync(req.file.path);

    res.status(201).json({ message: "Uploaded successfully", model });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getModels = async (req, res) => {
  try {
    const models = await Model.find().sort({ createdAt: -1 });
    res.json({ models });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteModel = async (req, res) => {
  try {
    const { id } = req.params;

    const model = await Model.findById(id);
    if (!model) return res.status(404).json({ message: "Model not found" });

    console.log("Deleting:", model.publicId);

    // If Cloudinary publicId exists
    if (model.publicId) {
      await cloudinary.uploader.destroy(model.publicId, {
        resource_type: "raw", // IMPORTANT for FBX and GLB
        invalidate: true
      });
    }

    await model.deleteOne();

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("DELETE ERROR:", err);
    res.status(500).json({ message: "Delete failed", error: err.message });
  }
};
