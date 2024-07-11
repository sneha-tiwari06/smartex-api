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

const uploadPath = path.join(__dirname, '../admin-smartex/upload');
// console.log("Upload path:", uploadPath);
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});
const upload = multer({ storage });
app.post("/api/upload", upload.single("file"), function (req, res) {
   const file = req.file;
   console.log("Uploaded file:", file);
   res.status(200).json(file.filename);
});



app.post('/api/multiupload', upload.array('files', 100), (req, res) => {
  try {
    const files = req.files;
    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }
    const fileUrls = files.map(file => ({ filename: file.filename, path: `/upload/${file.filename}` }));
    res.json({ fileUrls });  
  } catch (err) {
    res.status(500).json({ error: 'Failed to upload files' });
  }
});

// File deletion
app.delete('/api/delete/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(uploadPath, filename);

  fs.unlink(filePath, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error deleting file' });
    }
    res.status(200).json({ message: 'File deleted successfully' });
  });
});

app.delete('/api/delete/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(uploadPath, filename);

  fs.unlink(filePath, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error deleting file' });
    }
    res.status(200).json({ message: 'File deleted successfully' });
  });
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
app.use('/uploads', express.static(uploadPath));
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
