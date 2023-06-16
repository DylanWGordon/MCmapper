import express from "express";
import postgres from "pg";
import dotenv from 'dotenv'

const app = express();
dotenv.config();
const PORT = process.env.PORT;
const dburl = process.env.DATABASE_URL;

app.use(express.static("public"));




app.listen(PORT, () => {
    console.log(`listening on Port ${PORT}`);
});