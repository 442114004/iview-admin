export default {
  bind: (el, binding) => {
    if (binding.value) {
      el.style.display = 'none'
    }
  },
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
