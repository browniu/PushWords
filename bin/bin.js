#! /usr/bin/env node
// 依赖组件
const request = require('request');
const urlencode = require('urlencode');
const cheerio = require('cheerio');
const isChinese = require('is-chinese');
const chalk = require('chalk');
const fs = require('fs');
const COS = require('cos-nodejs-sdk-v5');
// 指令处理
const word = process.argv.slice(2).join(' ');
if (!word) {
    console.log('使用方式：c <word>');
    console.log(require('../package').version);
    process.exit()
}
const isCh = isChinese(word);

//常量
const serves = {
    dict: 'http://dict.youdao.com/w/',
    dictCh: 'https://dict.youdao.com/w/eng/',
    book: 'https://test-1257187612.cos.ap-shanghai.myqcloud.com/pushwords.json',
    push: 'https://api.day.app/NmAByzvdmM8EfTtNsYMGEo/'
};
const dataPath = './data.json';

// 数据解析
async function handleCheck() {

    if (word === 'CLEAR') await clear();

    const body = await requestTarget((isCh ? serves.dictCh : serves.dict) + urlencode(word));
    const $ = cheerio.load(body);
    let result = '';

    if (isCh) {
        $('div.trans-container > ul').find('p.wordGroup').each(function () {
            result += $(this).children('span.contentTitle').text().replace(/\s+/g, '').substr(0, 50) + ' '
        });
        result = result.replace(/;/g, ' ').replace(/\s*$/g, '');
        if (result) console.log(chalk.green(result))
    } else {
        $('div#phrsListTab > div.trans-container > ul').find('li').each(function () {
            result += $(this).text().replace(/\s+/g, '').substr(0, 30) + ' '
        });
        result = result.replace(/；/g, ';').replace(/\s*$/g, '');
        if (result) console.log(chalk.blue(result))
    }
    if (!result) console.log(chalk.red('查询无果'));
    else await recordAdd({word: word, result: result, date: new Date().getTime(), review: []})
}

// 发送请求
function requestTarget(target) {
    return new Promise(resolve => {
        request(target, (error, response) => {
            resolve(response.body)
        })
    })
}

// 记录
async function recordAdd(item) {
    let list = await requestTarget(serves.book);
    list = list ? JSON.parse(list) : [];
    //查重
    let repeatIndex = await repetition(item, list);
    if (repeatIndex) list[repeatIndex].review = [];
    else list.push(item);
    // 云端写入
    await recordCloud(list)
}

// 读取数据
function readJSON(path) {
    return new Promise(resolve => {
        fs.readFile(path, 'utf-8', (err, data) => {
            if (err) throw (err);
            console.log(data);
            resolve(JSON.parse(data))
        })
    })
}

// 上传记录
async function recordCloud(record) {
    const key = {
        SecretId: 'AKIDGNK6iAo7I1BA4un7byFRTPQJ2Z3MYUL7',
        SecretKey: 'lfOzRiyHVYXFtPkyDKLCtPnMm8IsIXou',
        Bucket: 'test-1257187612'
    };
    const cos = new COS({
        SecretId: key.SecretId,
        SecretKey: key.SecretKey
    });

    cos.putObject({
        Bucket: key.Bucket,
        Region: 'ap-shanghai',
        Key: 'pushwords.json',
        StorageClass: 'STANDARD',
        Body: JSON.stringify(record),
    }, (err) => {
        if (err) throw (err)
    });
}

// 查重
async function repetition(item, list) {
    return new Promise(resolve => {
        const items = list.map(e => e.word);
        for (let i = 0; i < items.length; i++) {
            if (items[i] === item.word) resolve(i)
        }
        resolve(null)
    })
}

// 清空
async function clear() {

    const key = await readJSON('./key.json');

    const cos = new COS({
        SecretId: key.SecretId,
        SecretKey: key.SecretKey
    });

    cos.putObject({
        Bucket: 'test-1257187612',
        Region: 'ap-shanghai',
        Key: 'pushwords.json',
        Body: JSON.stringify([]),
    }, (err) => {
        if (err) throw (err)
        console.log(chalk.cyan('清空数据库成功'))
        process.exit()
    });
}

handleCheck();
