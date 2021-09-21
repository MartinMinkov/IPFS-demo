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

const main = async (node) => {
    const currentDate = moment(Date.now()).format('YYYY-MM-DD')
    const currentArchive = `mainnet-archive-dump-${currentDate}`
    const fullArchiveName = `${currentArchive}_0000.sql.tar.gz`

    const archiveURL = `https://storage.googleapis.com/mina-archive-dumps/${fullArchiveName}`
    const localDownloadPath = `${__dirname}/archives/${currentArchive}/${fullArchiveName}`

    const dir = `${__dirname}/archives/${currentArchive}`
    console.log('Writing to dir, ', dir)
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir)
    }

    const downloadedArchive = fs.createWriteStream(localDownloadPath)
    console.log('Downloading from: ', archiveURL)
    https.get(archiveURL, function (response) {
        response.pipe(downloadedArchive)
    })

    console.log('Waiting for download (20 sec).')
    await delay(20000)
    console.log('Waiting done.')

    const source = fs.readFileSync(`${localDownloadPath}`)
    console.log('Reading from: ', localDownloadPath)
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
