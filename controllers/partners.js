import { db } from "../db.js";
import jwt from "jsonwebtoken";

export const getPartners = (req, res) => {
  const q = "SELECT * FROM partners order by created_at DESC";

  db.query(q, (err, data) => {
    if (err) return res.status(500).send(err);

    return res.status(200).json(data);
  });
};


export const getPartner = (req, res) => {
  const q = "SELECT p.id, `alt`, `image_url` FROM partners WHERE id = ?";

  db.query(q, [req.params.id], (err, data) => {
    if (err) return res.status(500).json(err);

    return res.status(200).json(data[0]);
  });
};
export const addPartner = async (req, res) => {
  try {

    const { alt, image_urls } = req.body;
    const values = image_urls.map(image_url => [alt, image_url]);
    const q = "INSERT INTO partners(`alt`, `image_url`) VALUES ?";

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.json("Posts have been created.");
    });
  } catch (error) {
    return res.status(400).json(error.message);
  }
};


export const deletePartner = (req, res) => {

    const postId = req.params.id;
    const q = "DELETE FROM partners WHERE `id` = ? ";

    db.query(q, [postId], (err, data) => {
      if (err) return res.status(403).json("You can delete only your post!");

      return res.json("Post has been deleted!");
    });

};
export const updatePartner = (req, res) => {
  try {
      const { alt_tag, image_urls, active } = req.body;
      const postId = req.params.id;

      let q;
      let values = [];

      if (typeof active !== 'undefined') {
        q = "UPDATE partners SET `active` = ? WHERE `id` = ?";
        values = [active, postId];
      } else {
        q = "UPDATE partners SET `alt_tag` = ?, `image_urls` = ? WHERE `id` = ?";
        values = [alt_tag || null, image_urls || null, postId];
      }

      db.query(q, values, (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json("Post has been updated.");
      });

  } catch (error) {
    return res.status(400).json(error.message);
  }
};

