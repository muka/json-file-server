
const config = {
    port: process.env.PORT || '3002',
    basePath: process.env.BASE_PATH || './'
}

const app = require('express')()
const fs = require('fs')
const path = require('path')

const stat = async (basepath) => {
    return new Promise(function(resolve, reject) {
        fs.stat(basepath, function(err, stats) {

            if (err) return reject(err)

            if (!(stats.isDirectory() || stats.isFile())) {
                return reject(new Error('Unmanaged type'))
            }

            const info = {
                size: stats['size'],
                type: stats.isDirectory() ? 'dir' : 'file',
            }

            resolve(info)
        })
    })
}

const list = async (basepath) => {
    return new Promise(function(resolve, reject) {
        fs.readdir(basepath, function(err, items) {
            if (err) return reject(err)
            Promise.all(items.map(async (filename) => {
                const fullpath = path.join(basepath, filename)
                const info = await stat(fullpath)
                info.name = fullpath.replace(`${config.basePath}/`, '')
                return info
            })).then((data) => resolve(data))
        })
    })
}

const serve = () => {
    app.get('/*', async (req, res) => {

        const filepath = path.join(config.basePath, req.path)

        const info = await stat(filepath)
        if (info.type === 'file') {
            console.log(`Start download of ${filepath}`)
            res.sendFile(filepath)
            return
        }

        console.log(`List files in ${filepath}`)
        const files = await list(filepath)
        res.json(files)
    })
    app.listen(config.port)
}

const req = (path = '', opts = {}) => {
    const axios = require('axios')
    return axios.get(`http://localhost:${config.port}/${path}`)
}

const test = async () => {
    const res = await req()
    console.log(res.data)
}

const main = async () => {

    config.basePath = path.resolve(config.basePath)

    if (!fs.existsSync(config.basePath)) {
        console.log(`Path does not exists: ${config.basePath}`)
        process.exit(1)
    }

    serve()

    // await test()
}

module.exports = {
    serve, main, test, stat, list
}
