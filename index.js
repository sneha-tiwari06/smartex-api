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
  const { urls } = req.body;

  if (!urls || !Array.isArray(urls)) {
    return res.status(400).json({ error: 'URLs array is required' });
  }

  try {
    const deleteResults = await Promise.all(
      urls.map(async (url) => {
        const publicId = url.match(/\/([^/]+?)\.[a-z]{3,4}$/i)[1];
        const result = await cloudinary.uploader.destroy(publicId);
        console.log(`Cloudinary delete result for ${publicId}: ${JSON.stringify(result)}`);
        return result;
      })
    );

    // Check if all deletions were successful
    const allDeleted = deleteResults.every(result => result.result === 'ok');

    if (allDeleted) {
      res.status(200).json({ message: 'Files deleted successfully' });
    } else {
      res.status(400).json({ error: 'Failed to delete all files' });
    }
  } catch (err) {
    console.error('Cloudinary delete error:', err);
    res.status(500).json({ error: 'Error deleting files' });
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
