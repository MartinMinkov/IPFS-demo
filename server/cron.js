const IPFS = require('ipfs')

const moment = require('moment')
const fs = require('fs')
const https = require('https')

const getPool = require('./db/index')
const pool = getPool()

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

// const newDownloadPath = `${__dirname}/archives/${archiveDate}/${newArchiveFileName}`
// const newFullArchiveName = `${currentArchive}_0000.new.sql.tar.gz`

//https://ipfs.io/ipfs/<CID>

// const downloadFromIPFS = async (node, cid) => {
//     console.log('download CID', cid)
//     const stream = await node.cat(cid)

//     let data = ''
//     for await (const chunk of stream) {
//         data += chunk
//     }
//     fs.writeFileSync(newDownloadPath, data)
//     console.log('File written!')
// }

const main = async () => {
    const currentDate = moment(Date.now()).format('YYYY-MM-DD')
    const currentArchive = `mainnet-archive-dump-${currentDate}`
    const fullArchiveName = `${currentArchive}_0000.sql.tar.gz`

    const archiveURL = `https://storage.googleapis.com/mina-archive-dumps/${fullArchiveName}`
    const localDownloadPath = `${__dirname}/archives/${currentArchive}/${fullArchiveName}`

    const node = await IPFS.create()

    const dir = `${__dirname}/archives/${currentArchive}`
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir)
    }
    const downloadedArchive = fs.createWriteStream(localDownloadPath)
    https.get(archiveURL, function (response) {
        response.pipe(downloadedArchive)
    })

    await delay(5000)

    const source = fs.readFileSync(`${localDownloadPath}`)
    const file = await node.add({
        path: fullArchiveName,
        content: source,
    })
    console.log('Added file:', file.path, file.cid.toString())

    const t = new Date(Date.now()).toISOString()
    console.log('time', t)

    pool.query(
        'INSERT INTO archives(cid, origin, timestamp) VALUES ($1, $2, $3)',
        [file.cid.toString(), archiveURL, t],
        (error, results) => {
            if (error) {
                console.log(`error: ${error}`)
            } else {
                console.log(`Inserted into DB`, results)
            }
        }
    )
}

module.exports = {
    main,
}
