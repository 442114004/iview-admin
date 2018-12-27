import axios from '@/libs/api.request'

export const getTableData = (url, pageNumber = 1, pageSize = 10, param = {}) => {
  return axios.request({
    url,
    method: 'get',
    params: {
      pageNumber,
      pageSize,
      ...param,
      deleted: false
    }
  })
}

export const getTreeData = url => {
  return axios.request({
    url,
    method: 'get',
    params: {
      deleted: false
    }
  })
}

export const addTableData = (url, data = {}, method = 'post') => {
  return axios.request({
    url,
    method,
    data
  })
}

export const deleteTableData = (url, id) => {
  let params=null
  if(url =="/api/org/"){
   params= {
      orgId: id
    }
  }else{
    params= {
      id: id
    }
  }
  return axios.request({
    url,
    method: 'delete',
    params
  })
}

export const getInfo = url => {
  return axios.request({
    url,
    method: 'get',
    loading: true
  })
}

export const setActivated = (url, row) => {
  if(url == '/api/dictionary/isActivated/'){
    url+=row.id
    return axios.request({
      url,
      method: 'get'
    })
  }else{
    let data =  Object.assign({},row)
    return axios.request({
      url,
      method: 'put',
      data
    })
  }
}
