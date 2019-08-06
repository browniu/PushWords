#! /usr/bin/env node
const processC = require('child_process');
const request = require('request')

// 指令处理
const word = process.argv.slice(2).join(' ')
if (!word) {
    console.log('使用方式：c <word>')
    process.exit()
}
//常量
const serves = {
    dict: 'http://dict.youdao.com/w/',
    book: 'https://test-1257187612.cos.ap-shanghai.myqcloud.com/data.json',
    push: 'https://api.day.app/NmAByzvdmM8EfTtNsYMGEo/'
}

async function handleCheck() {
    const result = await requestTarget(serves.dict)
    console.log(result)
}

function requestTarget(target) {
    return new Promise(resolve => {
        request(target, (error, response) => {
            resolve(response.body)
        })
    })
}

handleCheck()
