import axios from '@/libs/api.request'

export const login = ({
  userName,
  password,
  code,
  uniqueId
}) => {
  const data = {
    username: userName,
    password,
    captcha: code,
    captchaKey: uniqueId
  }
  return axios.request({
    url: '/api/login',
    data,
    method: 'post'
  })
}

export const getUserInfo = () => {
  return axios.request({
    url: '/api/current-admin',
    method: 'get'
  })
}

export const getUserCenter = () => {
  return axios.request({
    url: '/api/current-user',
    method: 'get'
  })
}

export const logout = () => {
  return axios.request({
    url: '/api/logout',
    method: 'delete'
  })
}

export const getUniqueId = () => {
  return axios.request({
    url: '/api/unique-id',
    method: 'get'
  })
}
