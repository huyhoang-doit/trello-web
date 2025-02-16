// export const API_ROOT = 'http://localhost:8017'
// export const API_ROOT = 'https://trello-api-e3sy.onrender.com'
let apiRoot = ''

if (process.env.BUILD_MODE === 'dev') {
  apiRoot = 'http://localhost:8017'
}

if (process.env.BUILD_MODE === 'prod') {
  apiRoot = 'http://trello-api.huyhoangdoit.io.vn:8018'
}

export const API_ROOT = apiRoot

