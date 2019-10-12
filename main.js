import Vue from 'vue'
import store from './store'
import App from './App'
import api from './api'
//import Json from './Json' //测试用数据
/**
 *  因工具函数属于公司资产, 所以直接在Vue实例挂载几个常用的函数
 *  所有测试用数据均存放于根目录json.js
 *  
 *  css部分使用了App.vue下的全局样式和iconfont图标，有需要图标库的可以留言。
 *  示例使用了uni.scss下的变量, 除变量外已尽量移除特有语法,可直接替换为其他预处理器使用
 */

Vue.config.productionTip = false
Vue.prototype.$fire = new Vue();
Vue.prototype.$store = store;
Vue.prototype.$api = api;

Vue.prototype.switchTab = (url)=>{
	uni.switchTab({
		url
	});
};
Vue.prototype.navigateTo = (url)=>{
	uni.navigateTo({
		url
	});
};

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()