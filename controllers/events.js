import { db } from "../db.js";
export const getEvents = (req, res) => {
  const q = "SELECT * FROM events order by created_at DESC";

  db.query(q, (err, data) => {
    if (err) return res.status(500).send(err);

    return res.status(200).json(data);
  });
};


export const getEvent = (req, res) => {
  const q = "SELECT p.id, `meta_title`, `meta_key`, `meta_desc`, `event_name`, `event_date`, `image_url` FROM events WHERE id = ?";

  db.query(q, [req.params.id], (err, data) => {
    if (err) return res.status(500).json(err);

    return res.status(200).json(data[0]);
  });
};

export const addEvent = async (req, res) => {
  try {

    const { meta_title, meta_key, meta_desc, event_name, event_date, img} = req.body;

 
    

    const q = "INSERT INTO events(`meta_title`, `meta_key`, `meta_desc`, `event_name`, `event_date`, `image_url`) VALUES (?)";
    const values = [meta_title, meta_key, meta_desc, event_name, event_date, img];
    

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.json("Post has been created.");
    });
  } catch (error) {
    return res.status(400).json(error.message);
  }
};



export const deleteEvent = (req, res) => {

    const postId = req.params.id;
    const q = "DELETE FROM events WHERE `id` = ? ";

    db.query(q, [postId], (err, data) => {
      if (err) return res.status(403).json("You can delete only your post!");

      return res.json("Post has been deleted!");
    });

};
export const updateEvent = (req, res) => {
  try {

      const { meta_title, meta_key, meta_desc, event_name, event_date, img, active } = req.body;
      // console.log(req.body)
      const postId = req.params.id;
      let q;
      let values;
      if (active === false) {
        q = "UPDATE events SET active = ? WHERE id = ?";
        values = [false, postId];
      } else if (active === true) {
        q = "UPDATE events SET active = ? WHERE id = ?";
        values = [true, postId];
      }
      else {
        q = "UPDATE events SET `meta_title`=?, `meta_key`=?, `meta_desc`=?, `event_name`=?, `event_date`=?, `image_url`=?, `active`=? WHERE `id` = ?";

      values = [
        meta_title,
        meta_key,
        meta_desc,
        event_name,
        event_date,
        img,
        true,
        postId
      ].filter(value => value !== undefined && value !== null && value !== '');
    }
      db.query(q, values, (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json("Post has been updated.");
      });

  } catch (error) {
    return res.status(400).json(error.message);
  }
};
