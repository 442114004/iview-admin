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
  let params = null
  if (url == "/api/org/") {
    params = {
      orgId: id
    }
  } else {
    params = {
      id
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

export const setActivated = (url, data) => {
  if (url == '/api/dictionary/isActivated/') {
    url += data.id
    return axios.request({
      url,
      method: 'get'
    })
  } else {
    return axios.request({
      url,
      method: 'put',
      data
    })
  }
}

export const setIsLocked = url => {
  return axios.request({
    url,
    method: 'get'
  })
}

export const resetPassword = id => {
  return axios.request({
    url: `/api/user/resetPassword/${id}`,
    method: 'get'
  })
}