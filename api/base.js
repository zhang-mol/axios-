/**
  * 接口域名的管理(多个接口域名,删除axios中的环境切换配置)
  * 不管有多少个都可以通过这里进行接口的定义。即使修改起来，也是很方便的
  */
const base = {
  url1: 'https://xxxx111111.com/api/v1',
  url2: 'http://xxxxx22222.com/api'
}

export default base
