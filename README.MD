# PushWords

> 命令行词典，查询可自动同步入单词本，并根据艾宾浩斯曲线定时推送复习

## 安装

```bash
npm i pushwords -g
```

## 使用

`c`命令即`查`或`check`，不考虑冲突，就这么简单粗暴

```bash
c hello
```

控制台将返回结果：

```bash
int.喂;哈罗 n.表示问候，惊奇或唤起注意时的用语 n.(Hello)人名;(法)埃洛
```

或 使用中文

```bash
c 组件
```

```bash
module element subassembly
```

这在确定一些变量命名时非常有用！

## 记录

工具会自动将查询过的有效值按照一下格式存储为`JSON`文件：

```json
[
  {
    "word": "hello",
    "result": "int.喂;哈罗 n.表示问候，惊奇或唤起注意时的用语 n.(Hello)人名;(法)埃洛 ",
    "date": 1565149458931
  },
  {
    "word": "组件",
    "result": "module element subassembly",
    "date": 1565149525330
  },
  {
    "word": "请求",
    "result": "requestbeg demandask",
    "date": 1565157721312
  }
]
```

## 复习

## 相关

* [腾讯云](https://cloud.tencent.com)
* [Bark](https://github.com/Finb/Bark)
* [yddict](https://github.com/kenshinji/yddict)
