#! /usr/bin/env node
const processC = require('child_process');
const request = require('request')

// 指令处理
const word = process.argv.slice(2).join(' ')
if (!word) {
    console.log('使用方式：c <word>')
    process.exit()
}

const target = 'https://test-1257187612.cos.ap-shanghai.myqcloud.com/data.json'

async function handleCheck() {
    const result = await requestTarget(target)
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
