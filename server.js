import express from "express";
import { Pool } from "pg";
import dotenv from 'dotenv'

const app = express();
dotenv.config();
const PORT = process.env.PORT;
const URL = process.env.DATABASE_URL;

const client = new Pool({
    connectionString: `${URL}`
})

app.use(express.json())
app.use(express.static("public"));


//get all poi
app.get("/", async (req, res) => {
    try {
        const result = await client.query(`SELECT * FROM poi`)
        res.json(result.rows)
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal server error');
        console.error('Internal Server Error')
    }
})



app.listen(PORT, () => {
    console.log(`listening on Port ${PORT}`);
});