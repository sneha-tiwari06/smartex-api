import mysql from "mysql";

export const db = mysql.createConnection({
  dbname: "ecis_smartex",
  user: "ecis_smaruser",
  host: "localhost",
  password: "W]u@,^=7DX^i",
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the database');
});