import Vue from 'vue'

import Cookies from 'js-cookie'

import Element from 'element-ui'
import './assets/styles/element-variables.scss'

import '@/assets/styles/index.scss' // global css
import '@/assets/styles/ruoyi.scss' // ruoyi css
import App from './App'
import store from './store'
import router from './router'
import directive from './directive' // directive
import plugins from './plugins' // plugins
import { download } from '@/utils/request'

import './assets/icons' // icon
import './permission' // permission control
import { getDicts } from '@/api/system/dict/data'
import { getConfigKey } from '@/api/system/config'
import { addDateRange, handleTree, parseTime, resetForm, selectDictLabel, selectDictLabels } from '@/utils/ruoyi'
// 分页组件
import Pagination from '@/components/Pagination'
// 自定义表格工具组件
import RightToolbar from '@/components/RightToolbar'
// 富文本组件
import Editor from '@/components/Editor'
// 文件上传组件
import FileUpload from '@/components/FileUpload'
// 图片上传组件
import ImageUpload from '@/components/ImageUpload'
// 图片预览组件
import ImagePreview from '@/components/ImagePreview'
// 字典标签组件
import DictTag from '@/components/DictTag'
// 头部标签组件
import VueMeta from 'vue-meta'
// 字典数据组件
import DictData from '@/components/DictData'

import { BaiduMap } from 'vue-baidu-map'

//导入 dispatch orderType product status stockout subware supplier task 组件
import customer from '@/components/detail/customer.vue'
import order from '@/components/detail/order.vue'
import dispatch from '@/components/detail/dispatch.vue'
import orderType from '@/components/detail/orderType.vue'
import product from '@/components/detail/product.vue'
import status from '@/components/detail/status.vue'
import stockout from '@/components/detail/stockout.vue'
import subware from '@/components/detail/subware.vue'
import supplier from '@/components/detail/supplier.vue'
import task from '@/components/detail/task.vue'
import user from '@/components/detail/user.vue'
import substation from '@/components/detail/substation.vue'
import taskvo from '@/components/detail/taskvo.vue'
import dataV from '@jiaminghi/data-view'
import iostatus from '@/components/detail/iostatus'
import taskType from '@/components/detail/taskType'
import ProductSelect from '@/components/Pop/Product/index.vue'
import SubwareSelect from '@/components/Pop/Subware/index.vue'
import SupplierSelect from '@/components/Pop/Supplier/index.vue'
import LocalProductPop from '@/components/Pop/LocalProduct/index'
//引入echart
import * as echarts from 'echarts'
import Axios from 'axios'
import moment from 'moment'

Vue.use(dataV)

Vue.prototype.$echarts = echarts

Vue.use(BaiduMap, { ak: 'zEHMzU0K51Kr5Q9vgPFvV1xHRwYjGlnM' })
// 全局方法挂载
Vue.prototype.getDicts = getDicts
Vue.prototype.getConfigKey = getConfigKey
Vue.prototype.parseTime = parseTime
Vue.prototype.resetForm = resetForm
Vue.prototype.addDateRange = addDateRange
Vue.prototype.selectDictLabel = selectDictLabel
Vue.prototype.selectDictLabels = selectDictLabels
Vue.prototype.download = download
Vue.prototype.handleTree = handleTree

// 全局组件挂载
Vue.component('DictTag', DictTag)
Vue.component('Pagination', Pagination)
Vue.component('RightToolbar', RightToolbar)
Vue.component('Editor', Editor)
Vue.component('FileUpload', FileUpload)
Vue.component('ImageUpload', ImageUpload)
Vue.component('ImagePreview', ImagePreview)

//自定义组件挂载
Vue.component('customer', customer)
Vue.component('order', order)
Vue.component('dispatch', dispatch)
Vue.component('orderType', orderType)
Vue.component('product', product)
Vue.component('status', status)
Vue.component('stockout', stockout)
Vue.component('subware', subware)
Vue.component('supplier', supplier)
Vue.component('task', task)
Vue.component('user', user)
Vue.component('substation', substation)
Vue.component('taskvo', taskvo)
Vue.component('iostatus', iostatus)
Vue.component('taskType', taskType)

Vue.component('ProductSelect', ProductSelect)
Vue.component('SubwareSelect', SubwareSelect)
Vue.component('SupplierSelect', SupplierSelect)
Vue.component('LocalProductPop', LocalProductPop)
Vue.use(directive)
Vue.use(plugins)
Vue.use(VueMeta)
DictData.install()

Vue.prototype.$axios = Axios
Axios.defaults.baseURL = 'http://localhost:8004'
Axios.defaults.headers.post['Content-Type'] = 'application/json'
Vue.config.productionTip = false
Vue.prototype.$moment = moment //UTC时间格式转换

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */

Vue.use(Element, {
  size: Cookies.get('size') || 'medium' // set element-ui default size
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
