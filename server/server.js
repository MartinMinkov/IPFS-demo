const cron = require('node-cron')
const express = require('express')
const ipfs_cron = require('./cron')

const getPool = require('./db/index')
const pool = getPool()

const app = express()

// At 6PM everyday, run this cron job
cron.schedule('0 18 * * *', async () => {
    console.log('running cron job')
    await ipfs_cron.main()
})

app.get('/archives', (_req, res) => {
    pool.query('SELECT * FROM archives', [], (error, results) => {
        if (error) {
            throw error
        }
        res.status(200).json(results.rows)
    })
})

app.listen(3001, () => {
    console.log('Listening on port 3001')
})
