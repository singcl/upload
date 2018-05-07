const path = require('path')
const express = require('express')
const formidable = require('formidable')
const fse = require('fs-extra')
const opn = require('opn')

const app = express()
const uploadDir = 'uploads'

app.use(express.static(path.resolve(__dirname, './public')))

app.listen(5000, function() {
    console.log('服务器已启动，端口：5000')
    opn('http://127.0.0.1:5000')
})