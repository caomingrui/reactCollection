
const {createProxyMiddleware} = require('http-proxy-middleware')

module.exports = function (app) {

    app.use(createProxyMiddleware("/data", {
        target: "https://testcmr.utools.club", //配置你要请求的服务器地址
        pathRewrite: {'^/data': ''},
        changeOrigin: true,
    }))
}