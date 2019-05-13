import Axios from 'axios'
import qs from 'qs'
import { Message } from 'iview'

// 环境变量
// const env = process.env.NODE_ENV || 'development'
const baseUrl = {
  development: 'http://apitest.17.ysa365.com', // 开发
  test: 'http://apitest.17.ysa365.com', // 测试
  production: 'http://apitest.17.ysa365.com' // 生产
}
const options = { // 不使用Axios.create(options);axios.defaults.timeout = 5000
  baseURL: baseUrl.test, // 环境切换
  timeout: 5000, // axios.defaults.timeout = 5000;不使用Axios.create(options)
  headers: { // axios.defaults.headers.post['Content-Type']=''
    post: { // post请求头
      // 'Content-type': 'application/x-www-form-urlencoded;charset=UTF-8;'
    }
  }
}
const axios = Axios.create(options)

/**
  * 提示框
*/
const tip = msg => {
  Message.error({
    content: msg,
    top: 50,
    duration: 1
  })
}

/**
  * 跳转登录页
  * 携带当前页面路由，以期在登录页面完成登录后返回当前页面
*/
const toLogin = () => {
  // router.replace({
  //   path: '/login',
  //   query: {
  //     redirect: router.currentRoute.fullPath
  //   }
  // })
}

/**
  * 请求失败后的错误统一处理
  * @param {Number} status 请求失败的状态码
*/
const errorHandle = (status, other) => {
  // 状态码判断
  switch (status) {
    // 401: 未登录状态，跳转登录页
    case 401:
      toLogin()
      break
    // 403 token过期
    // 清除token并跳转登录页
    case 403:
      tip('登录过期，请重新登录')
      localStorage.removeItem('token')
      // store.commit('loginSuccess', null)
      setTimeout(() => {
        toLogin()
      }, 1000)
      break
    // 404请求不存在
    case 404:
      tip('请求的资源不存在')
      break
    default:
      tip('未知错误')
  }
}

/**
  * 请求拦截器
  * 每次请求前，如果存在token则在请求头中携带token
  */
axios.interceptors.request.use(config => {
  // 登录流程控制中，根据本地是否存在token判断用户的登录情况
  // 但是即使token存在，也有可能token是过期的，所以在每次的请求头中携带token
  // 后台根据携带的token判断用户的登录情况，并返回给我们对应的状态码
  // 而后我们可以在响应拦截器中，根据状态码进行一些统一的操作。
  // const token = store.state.token
  // token && (config.headers.Authorization = token)
  if (config.method === 'POST') { // POST传参序列化
    config.data = qs.stringify(config.data)
  }
  return config
}, error => {
  tip('请求超时')
  Promise.error(error)
})

// 响应拦截器
axios.interceptors.response.use(
  // 请求成功
  // res => res.status === 200 ? Promise.resolve(res) : Promise.reject(res),
  res => {
    if (res.status === 200) {
      if (res.data.code === 0) {
        return Promise.resolve(res)
      }
      if (res.data.code === 1) {
        return Promise.reject(res.data.msg)
      }
      return
    } else {
      if (res.status === 204) {
        return
      } else {
        return Promise.reject(res)
      }
    }
  },
  // 请求失败
  error => {
    const { response } = error
    if (response) {
      // 请求已发出，但是不在2xx的范围
      errorHandle(response.status, response.data.msg)
      return Promise.reject(response)
    } else {
      // 处理断网的情况
      // eg:请求超时或断网时，更新state的network状态
      // network状态在app.vue中控制着一个全局的断网提示组件的显示隐藏
      // 关于断网组件中的刷新重新获取数据，会在断网组件中说明
      // store.commit('changeNetwork', false)
      tip('未知错误')
    }
  })

export default axios
