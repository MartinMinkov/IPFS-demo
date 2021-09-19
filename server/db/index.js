const Pool = require('pg').Pool

const getPool = () => {
    return new Pool({
        user: process.env.DB_USER || 'postgres',
        host: process.env.DB_HOST || 'localhost',
        database: process.env.DB_NAME || 'archives',
        password: process.env.DB_PASS || 'password',
        port: process.env.DB_PORT || 5432,
    })
}

module.exports = getPool
