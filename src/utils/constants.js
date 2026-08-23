// export const API_ROOT = 'http://localhost:8017'
// export const API_ROOT = 'https://trello-api-e3sy.onrender.com'
let apiRoot = ''

if (process.env.BUILD_MODE === 'dev') {
  apiRoot = 'http://localhost:8017'
}

if (process.env.BUILD_MODE === 'prod') {
  // apiRoot = 'https://trello-api.lvhhoangg.io.vn'
  apiRoot = 'https://trello-api-brqm.onrender.com'
}

export const DEFAULT_PAGE = 1
export const DEFAULT_ITEMS_PER_PAGE = 12

export const API_ROOT = apiRoot
