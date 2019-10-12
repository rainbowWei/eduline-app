	import env from '@/env.js';
	// 课程列表
	export const getCourseLists = (state, params) => {
		return uni.request({
			url: env.host + '/?app=basic&mod=ApiOrder&act=courses',
			// url: 'https://www.easy-mock.com/mock/5d121c84a9c50f15f3066896/api/courseLists',
			data: {
				...params
			},
			header: {
				'bearer-user': JSON.stringify(state.userInfo),
				'bearer-open': JSON.stringify(uni.getStorageSync('openInfo')),
			},
		})
	};
	// 教具列表
	export const getGoodsLists = (state, params) => {
		return uni.request({
			url: env.host + '/?app=basic&mod=ApiOrder&act=teachTools',
			// url: 'https://www.easy-mock.com/mock/5d121c84a9c50f15f3066896/api/courseLists',
			data: {
				...params
			},
			header: {
				'bearer-user': JSON.stringify(state.userInfo),
				'bearer-open': JSON.stringify(uni.getStorageSync('openInfo')),
			},
		})
	};