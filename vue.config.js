const modifyResponse = require('node-http-proxy-json');

function rewriteURLs(obj, oldURL, newURL) {
  if (typeof obj === 'object') {
    Object.keys(obj).forEach((k) => {
      if (typeof obj[k] === 'string' && obj[k].includes(oldURL)) {
        obj[k] = obj[k].replace(oldURL, newURL);
      } else if (obj[k] && typeof obj[k] === 'object') {
        rewriteURLs(obj[k], oldURL, newURL);
      }
    });
  }
}

function rewriteResponse(proxyRes, req, res) {
  modifyResponse(res, proxyRes, (body) => {
    rewriteURLs(body, process.env.DEV_PROXY_URL, 'http://localhost:8080/');
    return body;
  });
}

function rewriteRequest(proxyReq, req) {
  modifyResponse(proxyReq, req, (body) => {
    rewriteURLs(body, 'http://localhost:8080/', process.env.DEV_PROXY_URL);
    return body;
  });
}

const config = {
  publicPath: '/',
  transpileDependencies: [
    'resize-detector'
  ]
};

if (process.env.DEV_PROXY_URL) {
  config.devServer = {
    proxy: {
      '/api': {
        target: process.env.DEV_PROXY_URL,
        onProxyRes: rewriteResponse,
        onProxyReq: rewriteRequest,
        secure: false
      },
      '/monitoring': {
        target: process.env.DEV_PROXY_URL,
        onProxyRes: rewriteResponse,
        onProxyReq: rewriteRequest,
        secure: false
      }
    }
  };
}

module.exports = config;
