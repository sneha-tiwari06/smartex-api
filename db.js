import mysql from "mysql";

export const db = mysql.createConnection({
  host: "W]u@,^=7DX^i",
  user: "ecis_smaruser",
  host: "localhost",
  password: "ecis_smartex",
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the database');
});