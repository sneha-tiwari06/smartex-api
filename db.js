import mysql from "mysql";

export const db = mysql.createConnection({
  host: "smartex.cluster-czysu0somdb2.eu-north-1.rds.amazonaws.com",
  user: "admin",
  port: 3306,
  password: "PSOODqb96lduXDRjCizX",
  database: "smartex"
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the database');
});