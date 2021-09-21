const IPFS = require('ipfs')
const cron = require('node-cron')
const express = require('express')
const ipfs_cron = require('./cron')

const getPool = require('./db/index')
const pool = getPool()

const app = express()

let node
;(async () => {
    node = await IPFS.create()
})()

// Run every 6 hours
cron.schedule('0 */6 * * *', async () => {
    console.log('running cron job')
    await ipfs_cron.main(node)
})

app.get('/api/archives', (_req, res) => {
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
