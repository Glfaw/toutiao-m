import Vue from 'vue'
import dayjs from 'dayjs'

// 默认语言是英文, 加载中文语言包
import 'dayjs/locale/zh-cn'

// 全局使用
dayjs.locale('zh-cn')

// 加载相对时间插件
import relativeTime from 'dayjs/plugin/relativeTime'

// 配置使用处理相对时间的插件
dayjs.extend(relativeTime)

// dayjs()获取当前最新时间
// dayjs().format('YYYY-MM-DD')

// 定义一个全局过滤器，然后就可以在任何组件的模板中使用了
Vue.filter('relativeTime', date => dayjs().to(dayjs(date)))