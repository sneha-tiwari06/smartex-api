import { db } from "../db.js";
import jwt from "jsonwebtoken";

export const getWinners = (req, res) => {
  const q = "SELECT * FROM winners order by created_at DESC";

  db.query(q, (err, data) => {
    if (err) return res.status(500).send(err);

    return res.status(200).json(data);
  });
};


export const getWinner = (req, res) => {
  const q = "SELECT p.id, `title`, `date`, `img`, `alt_tag`,  FROM winners WHERE id = ?";

  db.query(q, [req.params.id], (err, data) => {
    if (err) return res.status(500).json(err);

    return res.status(200).json(data[0]);
  });
};

export const addWinners = async (req, res) => {
  try {

    const { title, date, img, alt_tag} = req.body;

    const q = "INSERT INTO winners(`title`, `date`, `img`, `alt_tag`) VALUES (?)";
    const values = [title, date, img, alt_tag];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.json("Post has been created.");
    });
  } catch (error) {
    return res.status(400).json(error.message);
  }
};



export const deleteWinners = (req, res) => {
  const postId = req.params.id;
  const q = "DELETE FROM winners WHERE `id` = ?";

  db.query(q, [postId], (err, data) => {
    if (err) return res.status(403).json("You can delete only your post!");

    return res.json("Post has been deleted!");
  });
};

export const updateWinners = (req, res) => {
  try {
    const { title, date, img, alt_tag, active } = req.body;
    const postId = req.params.id;

    let q;
    let values = [];

    
    if (active === false || active === true) {
      q = "UPDATE winners SET active = ? WHERE id = ?";
      values = [active, postId];
    } else {
     
      q = "UPDATE winners SET `title`=?, `date`=?, `img`=?, `alt_tag`=?, `active`=? WHERE `id` = ?";
      values = [
        title,
        date,
        img,
        alt_tag,
        active !== undefined ? active : true,
        postId
      ].filter(value => value !== undefined && value !== null && value !== '');
    }

    db.query(q, values, (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to update winner." });
      }
      return res.json("Winner has been updated.");
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: error.message });
  }
};

