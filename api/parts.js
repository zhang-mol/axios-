/**
  * 数据模块接口列表
  */
import qs from 'qs' // 根据需求是否导入qs模块
import axios from '../axios' // 导入http中创建的axios实例
import base from './base' // 导入接口域名列表

const parts = {
  // 配件列表
  getPartsList () {
    return axios.get(`${base.url1}/partsList`)
  },
  // 配件详情,演示
  articleDetail (id, params) {
    return axios.get(`${base.url1}/partsDetail/${id}`, {
      params: params
    })
  },
  // post提交
  login (params) {
    return axios.post(`${base.url1}/accesstoken`, qs.stringify(params))
  }
  // 其他接口…………
}
export { parts }
