import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import modelRoutes from './routes/modelRoutes.js';

dotenv.config();

const app = express();

// ✅ FIXED CORS — allow both ports
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174"],
  methods: ["GET", "POST", "DELETE", "PUT"],
}));

app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/models', modelRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log("MongoDB error:", err));

// Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running on", PORT));
