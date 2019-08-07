# PushWords

> 命令行词典，查询可自动同步入单词本，并根据艾宾浩斯曲线定时推送复习

## 安装

```bash
npm i pushwords -g
```

## 使用

`c`命令即`查`或`check`，不考虑什么命令冲突，就这么简单粗暴！

```bash
c hello
```

控制台将返回结果：

```bash
int.喂;哈罗 n.表示问候，惊奇或唤起注意时的用语 n.(Hello)人名;(法)埃洛
```

或查询中文

```bash
c 组件
```

```bash
module element subassembly
```

这在确定一些变量命名时非常有用！

如果你需要的只是一个词典工具，那以下就不需要看了。

------

## 记录

### STEP 1 本地存储

`PushWords` 会自动将查询过的有效值按照以下数据结构存储为`JSON`文件：

每次记录前会对查询值进行查重，如果出现重复，则清空该数据的`review`属性，以获得在之后复习算法中更高的权重。

```json
[
  {
    "word": "hello",
    "result": "int.喂;哈罗 n.表示问候，惊奇或唤起注意时的用语 n.(Hello)人名;(法)埃洛",
    "date": 1565162037987,
    "review": []
  },
  {
    "word": "模块",
    "result": "module modules",
    "date": 1565162046624,
    "review": []
  },
  {
    "word": "复习",
    "result": "review goover",
    "date": 1565162051449,
    "review": []
  }
]
```

### STEP 2 云端同步

`PushWords` 自动将`JSON`文件同步到腾讯云**对象存储**之中，通过这种方式来代替数据库存储和分发服务器的部署，优点是简单、安全、百万请求数以下完全免费。对象存储的相关密匙需要自行申请配置。

```javascript
    const cos = new COS({
        SecretId: key.SecretId,
        SecretKey: key.SecretKey
    });
```

> 相关配置请参考官方文档 [对象存储SDK](https://cloud.tencent.com/document/product/436/8629)

## 复习

`PushWords`  的主要价值并不仅仅是实现一个命令行词典（这类工具已经有很多更完善的了）。查询只是数据的来源，获取数据之后就能根据算法制定一些复习计划，通过手机推送达到巩固学习的目的，最终要达到的效果是，一经查询，自动安排复习，终身不忘。

### STEP 1 复习策略

#### 艾宾浩斯记忆曲线	

通过相关资料获得以下数据，将数据拟合成一个曲线函数，根据每个项目的复习次数获取下一次复习的**艾宾浩斯时差**。

| 复习周期 | 与初次记忆间隔（min） |
| -------- | --------------------- |
| 1        | 5                     |
| 2        | 30                    |
| 3        | 12 * 60               |
| 4        | 24 * 60               |
| 5        | 2 * 24 * 60           |
| 6        | 4 * 24 * 60           |
| 7        | 7 * 24 * 60           |
| 8        | 15 * 24 * 60          |
| …….      | …...                  |

如果当前时间与项目生成时间的差大于当次复习间隔的艾宾浩斯时差，就进行一次推送复习。

```javascript
if (now - item.date >= during) {push(content)}
```

`PushWords`  通过将复习的时间戳存入`review`属性来获取复习的总次数，每成功推送一次，就将推送的时间戳存入`review`数组

```javascript
   "review": [
      1565170632429,
      1565170664356
    ]
```

### STEP 2 推送	

通过配置[Bark](https://github.com/Finb/Bark)和佩戴小米手环实现实时的复习推送。

```javascript
request(serves.push + urlencode(content), (error) => {if(err)throw(error)})
```

### STEP 3 云函数部署	

通过云函数实现无服务器部署定时查询复习进度的远程服务。

> [腾讯云函数SDK](https://cloud.tencent.com/product/scf/getting-started)

## 相关技术

* [腾讯云](https://cloud.tencent.com)
* [Bark](https://github.com/Finb/Bark)

## 更新日志
### 0.0.2 20190807
* 增加查重机制
### 0.0.1 
* 发布测试版
