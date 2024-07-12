import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from 'url';
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import starRoutes from "./routes/star.js";
import winnersRoutes from "./routes/winners.js";
import ceremonyRoutes from "./routes/ceremony.js";
import upcomingRoutes from "./routes/upcoming.js";
import eventRoutes from "./routes/events.js";
import partnersRoutes from "./routes/partners.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { cloudinary } from './cloudinary.config.js';



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const corsOptions = {
  origin: function (origin, callback) {
    callback(null, origin); 
  },
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json({ limit: '100mb' }));
app.use(cookieParser());


const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "uploads",
    format: async (req, file) => "webp",
    public_id: (req, file) => file.originalname,
  },
});
const upload = multer({ storage: storage });
app.post("/api/upload", upload.single("file"), async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path);
    res.status(200).json({ url: result.secure_url, public_id: result.public_id }); 
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Upload failed" });
  }
});



app.post('/api/multiupload', upload.array('files', 100), async (req, res) => {
  try {
    const promises = req.files.map(file => cloudinary.uploader.upload(file.path));
    const results = await Promise.all(promises);
    const fileUrls = results.map(result => ({ url: result.secure_url, public_id: result.public_id }));
    res.json({ fileUrls });
  } catch (err) {
    res.status(500).json({ error: 'Failed to upload files' });
  }
});
app.delete('/api/delete', async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  const publicId = url.split('/').slice(-1)[0].split('.')[0];

  try {
    const result = await cloudinary.uploader.destroy(publicId);
    console.log(`Cloudinary delete result: ${JSON.stringify(result)}`);

    if (result.result === "ok") {
      res.status(200).json({ message: 'File deleted successfully' });
    } else {
      res.status(400).json({ error: 'Failed to delete file' });
    }
  } catch (err) {
    console.error('Cloudinary delete error:', err);
    res.status(500).json({ error: 'Error deleting file' });
  }
});




app.put('/posts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    const post = await post.findByIdAndUpdate(id, updatedData, { new: true });
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// app.use('/uploads', express.static(uploadPath));
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/star", starRoutes);
app.use("/api/winners", winnersRoutes);
app.use("/api/ceremony", ceremonyRoutes);
app.use("/api/event", eventRoutes);
app.use("/api/upcoming", upcomingRoutes);
app.use("/api/partners", partnersRoutes);

app.listen(8800, () => {
  console.log("Connected!");
});
