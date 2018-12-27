import {
  login,
  logout,
  getUserInfo
} from '@/api/user'
import {
  setToken,
  getToken,
  setMenu,
  getMenu,
  formatMenu
} from '@/libs/util'

export default {
  state: {
    userName: '',
    userId: '',
    gender: '',
    avatorImgPath: '',
    token: getToken(),
    hasGetInfo: false,
    menu: getMenu()
  },
  mutations: {
    setAvator(state, avatorPath) {
      state.avatorImgPath = avatorPath
    },
    setGender(state, gender) {
      state.gender = gender
    },
    setUserId(state, id) {
      state.userId = id
    },
    setUserName(state, name) {
      state.userName = name
    },
    setToken(state, token) {
      state.token = token
      setToken(token)
    },
    setHasGetInfo(state, status) {
      state.hasGetInfo = status
    }
  },
  getters: {

  },
  actions: {
    // 登录
    handleLogin({
      state,
      commit
    }, {
      userName,
      password,
      code,
      uniqueId
    }) {
      userName = userName.trim()
      return new Promise((resolve, reject) => {
        login({
          userName,
          password,
          code,
          uniqueId
        }).then(res => {
          commit('setToken', res.token)
          setMenu(res.data)
          state.menu = formatMenu(res.data)
          resolve()
        }).catch(err => {
          commit('setToken', '')
          reject(err)
        })
      })
    },
    // 退出登录
    handleLogOut({
      state,
      commit
    }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('setToken', '')
          resolve()
        }).catch(err => {
          commit('setToken', '')
          reject(err)
        })
      })
    },
    // 获取用户相关信息
    getUserInfo({
      state,
      commit
    }) {
      return new Promise((resolve, reject) => {
        try {
          getUserInfo(state.token).then(res => {
            commit('setAvator', res.avator)
            commit('setUserName', res.username)
            commit('setUserId', res.id)
            commit('setGender', res.gender.label)
            commit('setHasGetInfo', true)
            resolve(res)
          }).catch(err => {
            reject(err)
          })
        } catch (error) {
          reject(error)
        }
      })
    }
  }
}
