# 前言
本项目是我毕设时候写的项目，主要目的是练习整个产品的全流程，从前期的prd到原型图，从项目架构到开发到优化等等，因此比较适合新人学习<(￣ˇ￣)/。
Fisoa在我毕业答辩的时候是线上的网站，当时使用了阿里云的ECS和OSS，因此在代码中有一些上线相关的脚本和代码，现在租的阿里云服务器已经过期了，因此将上传接口全部打到本地了，所以会有一些无关的脚本和代码等，阅读的时候请略过ㄟ( ▔, ▔ )ㄏ。

请勿轻易将本项目用作商业领域！w(ﾟДﾟ)w  毕竟是我半年多的劳动结果(￣△￣；) 虽然是MIT的(´-ι_-｀)
如果有同学想当做毕设的话请多做修改~(￣m￣）(但是还是要提示小伙伴们毕设自己做哟~)

关于上传js、css到阿里云OSS服务器的脚本请参考scripts/makeVersionFile.js文件

关于koa2上传图片到OSS的接口请参考/node/utils/uploadImage.js文件(强行使用阿里云的sdk的koa1，加了一层co和Promise(・-・*))

注：项目中的后台页面需要管理员权限才能登陆，第一个管理员权限需要在数据库里面更改，将注册后的用户的status更改为5即可，之后的用户权限可以在管理后台的用户管理中更改~( σ'ω')σ

再注：开发的时候使用的是mac，因此不是很确定在windows环境下能不能运行起来，不过感觉问题应该不大，除了shell脚本之外好像没有什么关于系统的东西( >﹏<。)～

最后注：如果有同学想要在阿里云的服务器上面玩耍的话，只需要按照config配置文件填写即可~如果有配置项不知道在哪里查看的话直接百度就可以了(๑>◡<๑)

绝对没有注的注：求✨Star✨~~~( ͡° ͜ʖ ͡°) 

再有注我是狗：有什么问题直接留issue，但是可能回复的比较慢，如果我也不知道的那我就没有办法了(ÒωÓױ)呃！！！！

# Fisoa项目
Fisoa是一个基于React/Node的在线PC端问答社区产品，拥有类似知乎和头条的部分功能┌|*´∀｀|┘。
主要实现的功能包括：文章书写与展示、图片处理、邮件发送服务、收藏评论、登录注册等简单常见功能（＞人＜；）。
前端代码主要使用的antd库，但是后来发现打包体积太大了，因此逐步自己写了一些组件替代了antd的，不过没有完全替代，然后就，咕咕咕了(⊙⊙！) 

## 项目概要

项目包括node层(node)、前端(public)两层代码。两层代码的依赖均在node_modules中，依赖项在package.json内。
开发时请在IDE中开启Eslint插件。

## 开发环境

- 操作系统：macOS@10.12.6
- 数据库：Mysql@5.7 + Redis@4.0.1
- 前端：React@15.6.1
- 后端：Node@8.9.4
- 服务端：阿里云ECS + 阿里云OSS (已废弃，采用本地环境)

## 项目技术栈
- 前端: React + Redux + Sass + Webpack + antd
- 后端: Node.js + Koa2.0 + Pug
- 数据: Mysql + Redis

## 项目目录

- config: 存放各种配置文件(config.*.json), 本地部署时使用config.local.json
```json
{
  "server_port": 8089,
  "debug": true,
  "amplitudeToken": "xxxxxxxxxxxxxxxxxxxxx",
  "picPath": "xxxxxxxxxxxxxxxxxx",
  "localPath": "//localhost:3300/assets/",
  "AccessKey": "x*****************x",
  "AccessKeySecret": "G*****************************s",
  "Bucket": "xxxxx",
  "endPoint": "xxx-xx-xxx"
}
```

- public: 前端代码
- node: node层代码
- template: pug模板
- static: 静态资源
- test: 测试脚本(咕咕咕ヾ(´∀`o)+ 懒得写了)

## 依赖版本
- node使用8.0.0以上版本
- mysql使用5.7以上版本
- redis使用3.0.2以上版本

## 启动方法

### 安装依赖
`npm install`

### 启动redis
> 请先安装redis，并配置环境变量

`redis-server`

### 启动数据库
> 请先安装数据库Mysql

首先在终端中创建数据库

`create database imofish_DB;`

调整node/lib/mysql/config.js中的配置代码
```js
{
  host: '127.0.0.1',
  user: 'your mysql username',
  password: 'your mysql password',
  port: '3306',
  database: 'db_name',
  charset: 'utf8mb4_unicode_ci'
};
```

运行生成数据表代码
`node ./scripts/create-mysql.js`

### 启动node开发环境
`npm run start`

### 启动前端开发环境
`npm run startfe`

### 生产环境启动node(不需要此步了)
项目从线上环境下线之后不需要此步了，有兴趣的可以玩玩
`npm run build`

生产环境改为pm2方式启动node，启动完成之后可以***简单***通过以下指令查看
具体指令请通过查看官方文档查看 [QuickStart](http://pm2.keymetrics.io/docs/usage/quick-start/)
> 若没有安装全局pm2插件`npm install -g pm2`，请使用node_modules/pm2/bin/pm2来调用

|          指令      |       作用      |
|-------------------|-----------------|
|`pm2 start app.js`|通过pm2启动node服务器|
|`pm2 logs [name]`|查看node的实时日志|
|`pm2 list [name]`|查看进程的详细信息|

## 数据统计

数据统计使用amplitude平台，如果需要的话，请自己在amplitude上注册账号，并替换/template/common/counter.pug中的sdk

## 关于错误日志
开发过程中node打印的错误日志请到errorLog.log文件中查看

## 项目截图

等我之后想起来再上传━━(￣ー￣*|||━━

## 其他
应该没有其他要说的把。(ﾟｰﾟ)

