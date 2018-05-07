const path = require('path')
const express = require('express')
const formidable = require('formidable')
const fse = require('fs-extra')
const co = require('@singcl/co')
const concat = require('concat-files')
// const opn = require('opn')

const app = express()
const uploadDir = 'uploads'
const uploadTempDir = 'temp'

// 设置静态资源目录
app.use(express.static(path.resolve(__dirname, './public')))

// 检查文件的MD5
app.get('/check/file', function(req, res) {
    const query = req.query
    const fileName = query.fileName
    const fileMd5Value = query.fileMd5Value

    // 获取文件Chunk列表
    const filePath = path.resolve(__dirname, uploadDir, fileName)
    const folderPath = path.resolve(__dirname, uploadDir, fileMd5Value)

    // co generator function 异步编程
    co(getChunkList, filePath, folderPath).then((v) => {
        res.send(v)
    }).catch(function(e) {
        res.status(500).send(e)
    })
})


// 获取文件Chunk列表
function* getChunkList(filePath, folderPath) {
    let result = {}
    try {
        // 检查上传的文件是否存在, 如果存在直接返回结果
        yield fse.access(filePath)
        result = {
            stat: 1,
            file: {
                isExist: true,
                name: filePath
            },
            desc: 'file is exist'
        }
    } catch (e) {
        // 检查上传的文件是否存在，非ENOENT异常直接抛出异常
        if (e.code !== 'ENOENT') throw e
        // 检查上传的文件是否存在, 如果不存在则检查相应的MD5文件是否存在
        // 如果对应的MD5文件夹存在，则返回已经上传的chunk
        try {
            const files = yield fse.readdir(folderPath)
            result = {
                stat: 1,
                chunkList: files,
                desc: 'folder list'
            }
        } catch (e) {
            // 非ENOENT异常直接抛出异常
            if (e.code !== 'ENOENT') throw e
            // 如果对应的MD5目录不存在
            result = {
                stat: 1,
                chunkList: [],
                desc: 'folder is not exist'
            }
        }
    }

    // co promise resolve value.
    return result
}

// chunk 上传
app.post('/upload', function(req, res) {
    co(function*() {
        // 创建temp文件夹 不存在则创建 存在则继续下一步
        try {
            yield fse.mkdir(uploadTempDir)
        } catch (e) {
            // 非EEXIST异常直接抛出异常
            if (e.code !== 'EEXIST') throw e
        }
        const form = new formidable.IncomingForm({
            uploadDir: uploadTempDir
        })

        let folder
        let fields
        let file
        try {
            const formParsePromise = co.promisify(form.parse)
            const result = yield formParsePromise.call(form, req)
            fields = result[0]
            file = result[1]
            folder = path.resolve(__dirname, uploadDir, fields.fileMd5Value)
        } catch (e) {
            throw e
        }

        try {
            // https://github.com/jprichardson/node-fs-extra/blob/master/docs/ensureDir.md
            yield fse.ensureDir(folder)
        } catch (e) {
            // 非EEXIST异常直接抛出异常
            if (e.code !== 'EEXIST') throw e
        }

        const destFile = path.resolve(folder, fields.index)
        try {
            yield fse.rename(file.data.path, destFile)
            return fields.index
        } catch (e) {
            throw e
        }
    }).then(function(v) {
        res.send({
            stat: 1,
            desc: 'chunk:' + v + ' has success'
        })
    }).catch(function(e) {
        console.log('co:', e)
        res.send({
            stat: 0,
            desc: e
        })
    })
})

// 合并文件
app.get('/merge', function(req, res) {
    co(function*() {
        const query = req.query
        const md5 = query.md5
        // const size = query.size
        const fileName = query.fileName
        const srcDir = path.join(uploadDir, md5)

        let mergeRes

        try {
            const files = yield fse.readdir(srcDir)
            for (let i = 0; i < files.length; i++) {
                files[i] = path.join(srcDir, files[i])
            }
            console.log(files)
            const concatPromise = co.promisify(concat)
            yield concatPromise(files, path.join(uploadDir, fileName))
            console.log('Merge Success!')
            mergeRes = {
                stat: 1,
                chunkList: files,
                desc: 'Merge Success!'
            }
        } catch (e) {
            throw e
        }
        
        return mergeRes
    }).then(function(v) {
        res.send(v)
    }).catch(function(e) {
        console.error(e)
        res.status(500).send(e)
    })
})

app.listen(5000, function() {
    console.log('服务器已启动，端口：5000')
    // opn('http://127.0.0.1:5000')
})
