# lxd-manager frontend

[![!lxd-manager docs](https://img.shields.io/badge/docs-lxd--manager-success)](https://lxd-manager.github.io/)
![GitHub Workflow Status](https://img.shields.io/github/workflow/status/lxd-manager/frontend/Docker%20Image%20CI)
![GitHub issues](https://img.shields.io/github/issues/lxd-manager/frontend)
![GitHub](https://img.shields.io/github/license/lxd-manager/frontend)

frontend application for the [lxd-manager backend](https://github.com/lxd-manager/backend)

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

If the API is located on a different host the `DEV_PROXY_URL` environment variable can be used to proxy and rewrite URLs without having to adjust any CORS settings in the backend.
For example: `DEV_PROXY_URL='https://lxd-manager.example.org/' npm run serve`

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### LICENSE
MIT
