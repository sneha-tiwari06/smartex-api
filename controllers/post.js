import { db } from "../db.js";

// Fetch all posts or only active ones based on the showAll query parameter
export const getPosts = (req, res) => {
  const showAll = req.query.showAll;
  const query = showAll
    ? "SELECT * FROM posts ORDER BY date DESC"
    : "SELECT * FROM posts WHERE active = 1 ORDER BY date DESC LIMIT 5";

  db.query(query, (err, data) => {
    if (err) return res.status(500).send(err);
    return res.status(200).json(data);
  });
};

// Fetch a single post by ID
export const getPost = (req, res) => {
  const q =
    "SELECT p.id, `title`, `desc`, p.img, u.img AS userImg, `cat`, `date`, `meta_title`, `meta_keywords`, `meta_desc`, `blog_by`, `blog_date`, `blog_image_title` FROM posts WHERE p.id = ? ";

  db.query(q, [req.params.id], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data[0]);
  });
};

// Add a new post
export const addPost = async (req, res) => {
  try {
    const q =
      "INSERT INTO posts(`title`, `desc`, `img`, `cat`, `date`, `meta_title`, `meta_keywords`, `meta_desc`, `blog_by`, `blog_date`, `blog_image_title`) VALUES (?)";

    const values = [
      req.body.title,
      req.body.desc,
      req.body.img,
      req.body.cat,
      req.body.date,
      req.body.meta_title,
      req.body.meta_keywords,
      req.body.meta_desc,
      req.body.blog_by,
      req.body.blog_date,
      req.body.blog_image_title
    ];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.json("Post has been created.");
    });
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

// Delete a post by ID
export const deletePost = (req, res) => {
  const postId = req.params.id;
  const q = "DELETE FROM posts WHERE `id` = ?";

  db.query(q, [postId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.json("Post has been deleted!");
  });
};

// Update a post by ID
export const updatePost = (req, res) => {
  try {
    const postId = req.params.id;
    const {
      title,
      desc,
      img,
      cat,
      meta_title,
      meta_keywords,
      meta_desc,
      blog_by,
      blog_date,
      blog_image_title,
      active
    } = req.body;

    let q;
    let values;

    if (active === false) {
      q = "UPDATE posts SET active = ? WHERE id = ?";
      values = [false, postId];
    } else if (active === true) {
      q = "UPDATE posts SET active = ? WHERE id = ?";
      values = [true, postId];
    } else {
      q = "UPDATE posts SET `title`=?, `desc`=?, `img`=?, `cat`=?, `meta_title`=?, `meta_keywords`=?, `meta_desc`=?, `blog_by`=?, `blog_date`=?, `blog_image_title`=?, `active`=? WHERE `id` = ?";
      values = [
        title,
        desc,
        img,
        cat,
        meta_title,
        meta_keywords,
        meta_desc,
        blog_by,
        blog_date,
        blog_image_title,
        true, // default to true if active is not explicitly set to true or false
        postId,
      ];
    }

    db.query(q, values, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.json("Post has been updated.");
    });
  } catch (error) {
    return res.status(400).json(error.message);
  }
};
