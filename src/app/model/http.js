import axios from "axios";
import JSEncrypt from "jsencrypt"
import store from "store";
import MessAge from "./message"
const baseURL = "http://127.0.0.1:3000"
const pubKeyName = 'ua_publicKay'
const tokenName = "token"

const requestMap = {
  "login": {
    setToken: true,
    url: "/admin/register",
    method: "POST",
    rsaKey: "password"
  },
  "sign": {
    setToken: true,
    url: "/admin/login",
    method: "POST",
    rsaKey: "password"
  },
  "PubKey": {
    url: "/keys",
    method: "GET"
  },
  'getUserInfo': {
    url: '/user',
    method: 'GET',
  },
  'putUserInfo': {
    url: '/user',
    method: 'PUT',
  },
  "search": {
    withToken: false,
    url: "/search",
    method: "POST"
  },
  "likes": {
    rest: true,
    url: "/articles/likes/:id",
    method: "POST"
  },
  "articles": {
    url: "/api/rest/articles",
    method: "GET"
  },
  'postArticle': {
    url: '/api/rest/articles',
    method: 'POST'
  },
  "article": {
    url: "/api/rest/articles/:id",
    method: "GET"
  },
  'getArticleById': {
    rest: true,
    url: '/api/rest/articles/:id',
    method: 'GET'
  },
  "comment": {
    url: "/api/rest/comment",
    method: "GET"
  },
  'postComment': {
    url: '/api/rest/comments',
    method: 'POST'
  },
  "columns": {
    url: "/api/rest/columns",
    method: "GET"
  },
  'postColumn': {
    url: '/api/rest/column',
    method: 'POST'
  },

  'uploadArticle': {
    url: '/upload/article',
    method: 'POST'
  },
  'userInfo': {
    url: '/user',
    method: 'GET'
  },
  'putUserInfo': {
    url: '/user',
    method: 'PUT'
  }
}

// function encrypt(publicKey, value) {
//     let encrypt = new JSEncrypt();
//     encrypt.setPublicKey(publicKey);
//     return encrypt.encrypt(value)
// }
async function encrypt(value) {
  let key = store.get(pubKeyName)
  try {
    if (!key || key === 'undefined') {
      let result = await instance.get('/keys')
      key = result.pubKey
      key = key.replace(/\. +/g, '')
      key = key.replace(/[\r\n]/g, '')
      store.set(pubKeyName, key)
    }
    let encrypt = new JSEncrypt()
    encrypt.setPublicKey(key)
    return encrypt.encrypt(value)
  } catch (err) {
    console.log(err)
  }
}

axios.defaults.baseURL = baseURL

let instance = axios.create()

instance.interceptors.request.use(async (config) => {
  let token = sessionStorage.getItem("token")
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`
  }
  console.log(config);
  return config
}, (error) => {
  return Promise.reject(error);
});


instance.interceptors.response.use((response) => {
  let result = response.data
  return result?.data;
}, (error) => {
  return Promise.reject(error);
});

export default async function Http({ type, data }) {
  if (!(type in requestMap)) {
    throw new Error('API请求错误')
  }
  let { url, method, noMessage = false, rsaKey = false, rest = false, setToken = false } = requestMap[type]
  try {
    method = method.toLowerCase()
    if (rest) {
      let restSymbol = url.match(/:(.*)$/)[1]
      url = url.replace(/:(.*)$/, data[restSymbol])
    }
    if (rsaKey && data[rsaKey]) {
      data[rsaKey] = await encrypt(data[rsaKey])
    }
    data = method === 'get' ? { params: data } : data
    let result = await instance[method](url, data)
    if (setToken) {
      let token = result.token.token
      let uid = result.userId
      let nickname = result.nickname

      sessionStorage.setItem("uid", uid)
      sessionStorage.setItem("token", token)
      sessionStorage.setItem("nickname", nickname)
    }

    return result
  } catch (error) {
    if (error.response) {
      let message = error.response.data.message
      if (!noMessage) {
        new MessAge(message).danger()
      }
    }
    return Promise.reject(error);
  }
}