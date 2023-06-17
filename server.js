import express from "express";
import pkg from "pg";
const { Pool } = pkg
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
app.get("/poi", async (req, res) => {
    try {
        const result = await client.query(`SELECT * FROM poi`)
        res.json(result.rows)
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal server error');
        console.error('Internal Server Error')
    }
})

//get one poi by id
app.get(`/poi/:id`, async (req, res) => {
    const { id } = req.params;
    if (isNaN(Number.isInteger(id))) {
        res.status(400).send('Bad Request')
    } else {
        try {
            const result = await client.query('SELECT * FROM poi WHERE poi_id = $1', [id])
            res.json(result.rows)
        } catch (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            console.error('Internal Server Error')
        }
    }
})

app.delete(`/poi/:id`, async (req, res) => {
    const { id } = req.params;
    if (isNaN(Number.isInteger(id))) {
        res.status(400).send('Bad Request')
    } else {
        try {
            const result = await client.query('DELETE FROM poi WHERE poi_id = $1', [id])
            console.log(result)
        } catch (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            console.error('Internal Server Error')
        }
    }
})

app.post('/poi', async (req, res) => {
    try {
        const { npName, npBio, npKind, npComm } = req.body;
        const npCoord = parseInt(req.body.npCoord)
        const result = await client.query('INSERT INTO poi(poi_name, biome, kind, coordinates, user_comments) VALUES ($1, $2, $3, ST_MakePoint($4), $5)', [npName, npBio, npKind, npCoord, npComm]);
        console.log(result)
        res.json(result.rows)
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error')
    }
})



app.listen(PORT, () => {
    console.log(`listening on Port ${PORT}`);
});