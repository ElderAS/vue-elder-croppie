import CroppieComponent from './src/component.vue'

const install = Vue => {
  Vue.component('croppie-component', CroppieComponent)
}

export default {
  install,
}

export { CroppieComponent, install as CroppieComponentInstaller }
