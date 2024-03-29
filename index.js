const request = require('request');
const urlencode = require('urlencode');
const fs = require('fs');
const COS = require('cos-nodejs-sdk-v5');

const serves = {
    book: 'https://test-1257187612.cos.ap-shanghai.myqcloud.com/pushwords.json',
    push: 'https://api.day.app/NmAByzvdmM8EfTtNsYMGEo/'
};

const dataPath = './data.json';
const now = new Date().getTime();

exports.run = async () => {
    let list = await requestTarget(serves.book);
    list = JSON.parse(list);

    for (let i = 0; i < list.length; i++) {
        const item = list[i];
        const during = abhs(item.review.length);
        console.log(during, now - item.date)
        if (now - item.date >= during) {
            item.review.push(now);
            await push(item);
            await recordCloud(list);
            return {item: item, date: new Date()}
        }
    }
    console.log('没有可复习的内容')
    return {info: 'pass'}
}

// 艾宾浩斯
function abhs(x) {
    switch (x) {
        case 0:
            return 0;
        case 1:
            return 5 * 60000;
        case 2:
            return 30 * 60000;
        case 3:
            return 12 * 60 * 60000;
        case 4:
            return 1 * 24 * 60 * 60000;
        case 5:
            return 2 * 24 * 60 * 60000;
        case 6:
            return 4 * 24 * 60 * 60000;
        case 7:
            return 7 * 24 * 60 * 60000;
        case 8:
            return 15 * 24 * 60 * 60000;
        default:
            return (Math.pow(2, x - 4) - 1) * 24 * 60 * 60000
    }
}

// 推送
function push(item) {
    return new Promise(resolve => {
        let content = item.word + '\n' + item.result;
        request(serves.push + urlencode(content), (error) => {
            if (error) throw (error);
            resolve(console.log('推送成功:', item.word, ' ' + new Date()))
        })
    })
}

// HTTP请求
function requestTarget(target) {
    return new Promise(resolve => {
        request(target, (error, response) => {
            resolve(response.body)
        })
    })
}

// 读取数据
function readJSON(path) {
    return new Promise(resolve => {
        fs.readFile(path, 'utf-8', (err, data) => {
            if (err) throw (err);
            resolve(JSON.parse(data))
        })
    })
}

// 上传记录
async function recordCloud(record) {
    const key = await readJSON('./key.json');
    const cos = new COS({
        SecretId: key.sSecretId,
        SecretKey: key.SecretKey
    });

    cos.putObject({
        Bucket: 'test-1257187612',
        Region: 'ap-shanghai',
        Key: 'pushwords.json',
        Body: JSON.stringify(record),
    }, (err) => {
        if (err) throw (err)
    });
}

