import PageTools from './pageTools/index.vue'
import UploadExcel from './UploadExcel/index.vue'
import ImageUpload from './ImageUpload/index.vue'
import Print from 'vue-print-nb'

export default {
  install(Vue) {
    Vue.component('PageTools', PageTools)
    Vue.component('UploadExcel', UploadExcel)
    Vue.component('ImageUpload', ImageUpload)
    Vue.use(Print)
  }
}
