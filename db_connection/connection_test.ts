const mysql = require("mysql");
const connection = mysql.createConnection({
  host: "127.0.0.1",
  user: "< MySQL username >",
  password: "< MySQL password >",
  database: "syl_db",
});

connection.connect();

connection.query("SELECT * from Users", (error, rows, fields) => {
  if (error) throw error;
  console.log("User info is: ", rows);
});

connection.end();
