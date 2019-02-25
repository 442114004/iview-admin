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
  setPermissions,
  getPermissions,
  formatMenu
} from '@/libs/util'
import router from '@/router'

export default {
  state: {
    userName: '',
    userId: '',
    gender: '',
    avatorImgPath: '',
    token: getToken(),
    hasGetInfo: false,
    superAdmin: false,
    menu: getMenu(),
    permissions: getPermissions()
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
    setSuperAdmin(state, superAdmin) {
      state.superAdmin = superAdmin
    },
    setToken(state, token) {
      state.token = token
      setToken(token)
    },
    setHasGetInfo(state, status) {
      state.hasGetInfo = status
    }
  },
  actions: {
    // 登录
    handleLogin({
      state,
      commit,
      getters
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
          setMenu(res.menus)
          setPermissions(res.permissions)
          state.menu = formatMenu(res.menus)
          state.permissions = res.permissions
          // 登录后需要单独加载一下路由
          router.addRoutes(getters.dynamicRouters)
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
            commit('setSuperAdmin', res.superAdmin)
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
