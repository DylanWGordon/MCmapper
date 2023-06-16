import express from "express";
import postgres from "pg";

const app = express();
dotenv.config();
const sql = postgres("postgres://localhost/example_db")
const PORT = process.env.PORT;

// app.use(express.static("public"));




app.listen(PORT, () => {
    console.log(`listening on Port ${PORT}`);
});