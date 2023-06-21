import express from "express";
import postgres from "postgres";
import pkg from 'pg'
const { Pool } = pkg
import cors from 'cors';
import dotenv from 'dotenv'



const app = express();
app.use(cors({ origin: '*' }))
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
        const result = await client.query(`SELECT * FROM poi ORDER BY id ASC`)
        res.json(result.rows)
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal server error');
        console.error('Internal Server Error')
    }
})

//get one poi R1v1.1
app.get(`/search`, async (req, res) => {
    console.log('hit')
    let { val } = req.query.term;
    console.log(val)
    const corVal = `'%${val}'`;
    val = `'%${val}%'`
        try {
            const result = await client.query(`SELECT name, biome, kind, x, y, z, comments FROM poi WHERE name LIKE $1 OR biome LIKE $1 OR x LIKE $2 OR y LIKE $2 OR z LIKE $2 OR comments LIKE $1;`, [val, corVal])
            res.json(result.rows)
        } catch (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
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
            const result = await client.query('SELECT name, biome, kind, x, y, z, comments FROM poi WHERE id = $1', [id])
            res.json(result.rows[0])
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
        const { name, biome, kind, x, y, z, comments } = req.body;

        const result = await client.query('INSERT INTO poi(name, biome, kind, x, y, z, comments) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *', [name, biome, kind, x, y, z, comments]);
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
            const result = await client.query('DELETE FROM poi WHERE id = $1 RETURNING *', [id])
            res.json(result.rows[0])
        } catch (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            console.error('Internal Server Error')
        }
    }
})

//update one poi Uv1.0)
app.patch('/poi/:id', async (req, res) => {
    const { id } = req.params;
    const patchData = req.body;
    if (isNaN(parseInt(id))) {
        res.status(400).type('text/plain').send('Bad Request');
    }
    const keyList = Object.keys(patchData)
    let sqlString = 'UPDATE poi SET ';
    let inputs = '';
    for (let i = 0; i < keyList.length; i++) {
        if (patchData[keyList[i]] === undefined || patchData[keyList[i]] === '') {
            res.status(400).send('Bad request');
            return;
        }
        if (keyList[i] !== 'x' || 'y' || 'z') {
            patchData[keyList[i]] = '\'' + patchData[keyList[i]] + '\'';
        } else { //
            if (isNaN(parseInt(patchData[keyList[i]]))) {
                res.status(400).type('text/plain').send('Bad Request');
                return;
            }
        } if (i < keyList.length - 1) {// for each key found in patchdata,
            //  update the preexisting data's value and separate with commas
            inputs += keyList[i] + ' = ' + patchData[keyList[i]] + ',';
        } else { //last item, no comma
            inputs += keyList[i] + ' = ' + patchData[keyList[i]]
        }
    }
    sqlString += inputs;
    sqlString += ' WHERE id = ' + '\'' + id + '\' RETURNING *';
    try {
        const result = await client.query(sqlString);
        if (result.rowCount === '0') {
            res.status(404).send('Not Found')
        } else {
            res.json(result.rows[0])
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error')
    }
})




app.listen(PORT, () => {
    console.log(`listening on Port ${PORT}`);
});