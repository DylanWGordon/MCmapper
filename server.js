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


//get all poi Rv1.3
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

//get one poi R1v1.1
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

//create one poi ProtoCv1.4(needs data validation for Cv1.0)
app.post('/poi', async (req, res) => {

    try {
        const { npName, npBio, npKind, npComm } = req.body;
        const x = req.body.npCoord[0]
        const y = req.body.npCoord[1]
        const z = req.body.npCoord[2]

        const result = await client.query('INSERT INTO poi(poi_name, biome, kind, coordinates, user_comments) VALUES ($1, $2, $3, ST_MakePoint($4, $5, $6), $7) RETURNING *', [npName, npBio, npKind, x, y, z, npComm]);
        res.json(result.rows[0])
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error')
    }
})

//Delete one poi Dv1.0
app.delete(`/poi/:id`, async (req, res) => {
    const { id } = req.params;
    if (isNaN(Number.isInteger(id))) {
        res.status(400).send('Bad Request')
    } else {
        try {
            const result = await client.query('DELETE FROM poi WHERE poi_id = $1 RETURNING *', [id])
            res.json(result.rows[0])
        } catch (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            console.error('Internal Server Error')
        }
    }
})

//update one poi Uv1.0)
app.patch('/poi/:id', (req, res) => {
    const { id } = req.params;
    const patchData = req.body;
    if (isNaN(parseInt(id))) {
        res.status(400).type('text/plain').send('Bad Request');
    }
    const keyList = Object.keys(patchData)
    let sqlString = "UPDATE poi SET";
    let inputs = '';
    for (let i = 0; i < keyList.length; i++) {
        if (patchData[keyList[i]] === undefined || patchData[keyList[i]] === '') {
            res.status(400).send('Bad request');
            return;
        }
        if (keyList[i] !== 'npCoord') {
            patchData[keyList[i]] = '\'' + patchData[keyList[i]] + '\'';
        } else { //
            if (!Array.isArray(patchData[keyList[i]])) {
                res.status(400).type('text/plain').send('Bad Request');
                return;
            }
            for (let elem of patchData[keyList[i]]) {
                if (isNaN(parseInt(patchData[keyList[i]]))) {
                    res.status(400).type('text/plain').send('Bad Request');
                    return;
                }
            }
        } if (i < keyList.length - 1) {// for each key found in patchdata,
            //  update the preexisting data's value and separate with commas
            inputs += keyList[i] + ' = ' + patchData[keyList[i]] + ',';
        } else { //last item, no comma
            inputs += keyList[i] + ' = ' + patchData[keyList[i]]
        }
    }
    sqlString += inputs;
    sqlString += ' WHERE poi_id = ' + '\'' + id + 'RETURNING *\'';
    try {
        const result = sqlString;
        console.log(result)
        if (result.rowCount === '0') {
            res.status(404).send('Not Found')
        } else {
            res.json(result)
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error')
    }
})




app.listen(PORT, () => {
    console.log(`listening on Port ${PORT}`);
});