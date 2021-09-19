const getPool = require('./index')

const dropTableSQL = `DROP TABLE IF EXISTS archives;`
const createTableSQL = `
    CREATE TABLE archives(
        id 		SERIAL PRIMARY KEY,
        cid 		VARCHAR(255) UNIQUE NOT NULL,
        origin 		VARCHAR(255) NOT NULL,
        timestamp 	timestamp NOT NULL
    );`

;(async () => {
    const pool = getPool()
    try {
        await pool.query(dropTableSQL)
        console.log('Dropped table: archives')
        await pool.query(createTableSQL)
        console.log('Created table: archives')
    } catch (error) {
        console.error(error.stack)
    } finally {
        await pool.end()
    }
})()
