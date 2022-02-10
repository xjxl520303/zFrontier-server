# zFrontier-server
使用 Nuxt 仿 zFrontier 装备在线网站服务器实现

## 集成功能

- JWT授权登录
- 第三方授权登录
- 腾讯云
    - 短信服务
    - 验证服务
- OpenAPI文档
- Prisma + PostgreSQL

## 计划

- [ ] 用户登录/注册
    - [ ] 手机号登录/注册
    - [ ] 第三方授权登录/注册
        - [ ] 微信快速登录
        - [ ] QQ快速登录
        - [ ] Facebook快速登录
        - [ ] Google快速登录
- [ ] JWT授权
- [ ] Docker部署

## 一些问题

1. 项目依赖库 `p-queue` 和 `p-retry` 由于新版本使用了纯 ESM 模块，目前在项目中运行会出错，所以不要升级这两个库。

能运行的当前最高版本为：

```
"p-queue": "^6.6.2"
"p-retry": "^4.6.1"
```

2. Nest.js 引入一些 Express 中间件问题

如果不能使用 `import csurf from 'csurf';` 来引入库，则需要在 `tsconfig.json` 中添加配置：

```
"esModuleInterop": true
```

否者需要使用 `import * as csurf from 'csurf'` 这种方式，不然报错。