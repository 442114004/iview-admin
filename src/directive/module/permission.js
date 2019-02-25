import store from '@/store'

export default {
  bind: (el, binding) => {
    if (store.state.user.superAdmin) return
    const permissions = store.state.user.permissions,
      value = binding.value.split(' ')
    for (let index = 0; index < permissions.length; index++) {
      const p = permissions[index]
      if (value[0] == p.url && value[1] == p.requestType) {
        return
      }
    }
    el.style.display = 'none'
  }
  // ,
  // inserted: (el, binding) => {
  //   debugger
  // },
  // update: (el, binding) => {
  //   debugger
  // },
  // unbind: (el, binding) => {
  //   debugger
  // },
  // componentUpdated: (el, binding) => {
  //   debugger
  // },
  // unbind: (el, binding) => {
  //   debugger
  // }
}