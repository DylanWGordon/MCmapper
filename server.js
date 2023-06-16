import express from "express";
import postgres from "postgres";

const app = express();
dotenv.config();
const sql = postgres("postgres://localhost/example_db")

// app.use(express.static("public"));




app.listen(PORT, () => {
    console.log(`listening on Port ${PORT}`);
});