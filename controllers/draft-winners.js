import { db } from "../db.js";
export const getDrafts = (req, res) => {
  const query = "SELECT * FROM draft_winners ORDER BY date DESC"

  db.query(query, (err, data) => {
    if (err) return res.status(500).send(err);
    return res.status(200).json(data);
  });
};




export const getDraft = (req, res) => {
  const q =
    "SELECT id, `title`, `img`, `date`, `alt_tag` FROM draft_winners WHERE id = ? ";

  db.query(q, [req.params.id], (err, data) => {
    if (err) return res.status(500).json(err);

    return res.status(200).json(data[0]);
  });
};


export const addDraft = async (req, res) => {
  try {
   
    const q =
      "INSERT INTO draft_winners(`title`, `img`, `date`, `alt_tag`) VALUES (?)";

    const values = [
      req.body.title,
      req.body.img,
      req.body.date,
      req.body.alt_tag,
    ];

    db.query(q, [values], (err, data) => {
     
      if (err) return res.status(500).json(err);
      return res.json("Post has been created.");
    });
  } catch (error) {
    return res.status(400).json(error.message);
  }
};


export const deleteDraft = (req, res) => {

    const postId = req.params.id;
    const q = "DELETE FROM draft_winners WHERE `id` = ?";

    db.query(q, [postId], (err, data) => {
      if (err) return res.status(403).json("You can delete only your post!");

      return res.json("Post has been deleted!");
    });

};
export const updateDraft = (req, res) => {
    try {
      const postId = req.params.id;
      const {
        title,
        img,
        date,
        alt_tag,
      } = req.body;
        
      const q = "UPDATE draft_winners SET `title`=?, `img`=?, `date`=?, `alt_tag`=? WHERE `id` = ? ";
      const values = [
        title,
        img,
        date,
        alt_tag,
        postId
      ];
  
      db.query(q, values, (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json("Draft has been updated.");
      });
  
    } catch (error) {
      return res.status(400).json(error.message);
    }
  };
  export const publishDraft = async (req, res) => {
    const postId = req.params.id;
    const { title, date, img, alt_tag } = req.body;
  
    const insertQuery = "INSERT INTO winners(`title`, `date`, `img`, `alt_tag`) VALUES (?)";
    const deleteQuery = "DELETE FROM draft_winners WHERE `id` = ?";
  
    try {
      await new Promise((resolve, reject) => {
        db.query(insertQuery, [[title, date, img, alt_tag]], (err, result) => {
          if (err) return reject(err);
          resolve(result);
        });
      });
  
      await new Promise((resolve, reject) => {
        db.query(deleteQuery, [postId], (err, result) => {
          if (err) return reject(err);
          resolve(result);
        });
      });
  
      return res.json("Draft published and deleted successfully.");
    } catch (err) {
      return res.status(500).json(err);
    }
  };
  