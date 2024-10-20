import express from "express";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import mysql from "mysql2";

const connection = mysql.createConnection({
  host: "localhost",
  user: "kei",
  password: "u01n8sxm",
  database: "list_app",
});

connection.connect((err) => {
  if (err) {
    console.error("データベースへの接続に失敗しました: " + err.stack);
    return;
  }
  console.log("データベースに接続しました。接続ID: " + connection.threadId);
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// JSONとURLエンコードされたデータの解析を有効にする
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));

// フォームデータを受け取るルート

app.get("/", (req, res) => {
  res.render("top.ejs");
});

app.get("/index", (req, res) => {
  connection.query("SELECT * FROM items", (error, results) => {
    res.render("index.ejs", { items: results });
  });
});

app.get("/new", (req, res) => {
  res.render("new.ejs");
});

app.post("/create", (req, res) => {
  // データベースに追加する処理を書いてください
  connection.query(
    "INSERT INTO items (name) VALUES (?)",
    [req.body.itemName],
    (error, results) => {
      if (error) throw error;
      res.redirect("/index");
    }
  );
});

app.post("/delete/:id", (req, res) => {
  connection.query(
    "DELETE FROM items WHERE id =?",
    [req.params.id],
    (error, results) => {
      if (error) throw error;
      res.redirect("/index");
    }
  );
});

app.get("/edit/:id", (req, res) => {
  connection.query(
    "SELECT * FROM items WHERE id =?",
    [req.params.id],
    (error, results) => {
      res.render("edit.ejs", { item: results[0] });
    }
  );
});

app.post("/update/:id", (req, res) => {
  connection.query(
    "UPDATE items SET name =? WHERE id =?",
    [req.body.itemName, req.params.id],
    (error, results) => {
      if (error) throw error;
      res.redirect("/index");
    }
  );
});

app.listen(3001);

export default app;
