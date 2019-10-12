import Vue from 'vue'
import Vuex from 'vuex'
import env from '@/env.js'
Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		hasLogin: false,
		userInfo: {},
		openInfo: {},
		videoAddress: '',
		playingVideo: false,
		homeBanner: [],
		starCourses: [],
		recommendCourses: [],
		starTeachTools: [],
		recommendQuestions: [],
		allCourseCategories: [],
		allCourses: [],
		allQuestions: [],
		questionDetail: {},
		allTeachTools: [],
		myCourses: [],
		courseDetails: [],
		goodsDetails:[],
		payInfo: {},
		locations: [],
		allLives: [],
		liveDetails: [],
		address: {},
	},
	mutations: {
		login(state, provider) {
			state.hasLogin = true;
			state.userInfo = {
				uid: provider.uid
			};
			uni.setStorage({//缓存用户登陆状态
			    key: 'userInfo',  
			    data: provider  
			}) 
		},
		logout(state) {
			state.hasLogin = false;
			state.userInfo = {};
			uni.removeStorage({  
                key: 'userInfo'  
            })
		},
		setOpenInfo(state, data){
			uni.setStorage({
				key: 'openInfo',
				data: data,
			})
			state.openInfo = data
		},
		setState(state, data){
			state[data.key] = data.data
		}
	},
	actions: {
		getMyCourses(context){
			uni.showLoading({
				title: '加载中'
			});
			uni.request({
				url: env.host + '/?app=basic&mod=ApiUser&act=courses',
				header: {
					'bearer-user': JSON.stringify(context.state.userInfo),
					'bearer-open': JSON.stringify(context.state.openInfo),
				},
			})
			.then((data) => {
				uni.hideLoading();
				var [error, res]  = data;
				if(res.data.redirect){
					let pages = getCurrentPages()
					if(res.data.redirect != ('/' + pages[pages.length - 1].route)){
						uni.navigateTo({
							url: res.data.redirect
						});
					}
					return
				}
				context.commit('setState', {
					key: 'myCourses',
					data: res.data,
				})
			})
		},
		getliveDetails(context, params){
			
			let course = context.state.liveDetails.filter(course => course.id == params.id);
			if (course.length){
				return course;
			}
			uni.showLoading({
				title: '加载中'
			});
			uni.request({
				url: env.host + '/?app=basic&mod=ApiLive&act=detail',
				data: params,
				header: {
					'bearer-user': JSON.stringify(context.state.userInfo),
					'bearer-open': JSON.stringify(context.state.openInfo),
				},
			})
			.then((data) => {
				uni.hideLoading();
				var [error, res]  = data;
				if(res.data.redirect){
					let pages = getCurrentPages()
					if(res.data.redirect != ('/' + pages[pages.length - 1].route)){
						uni.navigateTo({
							url: res.data.redirect
						});
					}
					return
				}
				let liveDetails = context.state.liveDetails.concat([res.data])
				context.commit('setState', {
					key: 'liveDetails',
					data: liveDetails,
				})
			})
		},
		getAllLives(context){
			uni.showLoading({
				title: '加载中'
			});
			uni.request({
				url: env.host + '/?app=basic&mod=ApiCourse&act=all&live=1'
			})
			.then(data => {
				uni.hideLoading();
				var [error, res]  = data;
				if(res.data.redirect){
					let pages = getCurrentPages()
					if(res.data.redirect != ('/' + pages[pages.length - 1].route)){
						uni.navigateTo({
							url: res.data.redirect
						});
					}
					return
				}
				context.commit('setState', {
					key: 'allLives',
					data: res.data,
				})
			})
		},
		getAddress(context, params){
			if ( !context.state.userInfo || !context.state.openInfo ) {
				uni.navigateTo({
					url: '/pages/public/login',
				});
				return
			}
			if(params.id){
				context.commit('setState', {
					key: 'address',
					data: params
				})
				return;
			}
			uni.showLoading({
				title: '加载中'
			});
			uni.request({
				url: env.host + '/?app=basic&mod=ApiLocation&act=detail',
				header: {
					'bearer-user': JSON.stringify(context.state.userInfo),
					'bearer-open': JSON.stringify(context.state.openInfo),
				},
			})
			.then((data) => {
				uni.hideLoading();
				var [error, res]  = data;
				if(res.data.redirect){
					let pages = getCurrentPages()
					if(res.data.redirect != ('/' + pages[pages.length - 1].route)){
						uni.navigateTo({
							url: res.data.redirect
						});
					}
					return
				}
				context.commit('setState', {
					key: 'address',
					data: res.data,
				})
			})
		},
		getLocations(context){
			if ( !context.state.userInfo || !context.state.openInfo ) {
				uni.navigateTo({
					url: '/pages/public/login',
				});
				return
			}
			uni.showLoading({
				title: '加载中'
			});
			uni.request({
				url: env.host + '/?app=basic&mod=ApiLocation&act=index',
				header: {
					'bearer-user': JSON.stringify(context.state.userInfo),
					'bearer-open': JSON.stringify(context.state.openInfo),
				},
			})
			.then((data) => {
				uni.hideLoading()
				var [error, res]  = data;
				if(res.data.redirect){
					let pages = getCurrentPages()
					if(res.data.redirect != ('/' + pages[pages.length - 1].route)){
						uni.navigateTo({
							url: res.data.redirect
						});
					}
					return
				}
				context.commit('setState', {
					key: 'locations',
					data: res.data,
				})
			})
		},
		getPayInfo(context, params){
			if ( !context.state.userInfo || !context.state.openInfo ) {
				uni.navigateTo({
					url: '/pages/public/login',
				});
				return
			}
			let path = '/?app=basic&mod=ApiCourse&act=courseInfo'
			if('course' == params.type){
				path = '/?app=basic&mod=ApiCourse&act=courseInfo'
			}
			if ('goods' == params.type){
				path = '/?app=basic&mod=ApiTeachTool&act=info'
			}
			uni.showLoading({
				title: '加载中'
			});
			uni.request({
				url: env.host + path,
				data: params,
				header: {
					'bearer-user': JSON.stringify(context.state.userInfo),
					'bearer-open': JSON.stringify(context.state.openInfo),
				},
			})
			.then((data) => {
				
				uni.hideLoading();
				var [error, res]  = data;
				
				if(res.data.redirect){
					let pages = getCurrentPages()
					if(res.data.redirect != ('/' + pages[pages.length - 1].route)){
						uni.navigateTo({
							url: res.data.redirect
						});
					}
					return
				}
				context.commit('setState', {
					key: 'payInfo',
					data: res.data,
				})
			})
		},
		getCourseDetails(context, params){
			let course = context.state.courseDetails.filter(course => course.id == params.id);
			if (course.length){
				return course;
			}
			
			uni.showLoading({
				title: '加载中'
			});
			uni.request({
				url: env.host + '/?app=basic&mod=ApiCourse&act=detail',
				data: params,
				header: {
					'bearer-user': JSON.stringify(context.state.userInfo),
					'bearer-open': JSON.stringify(context.state.openInfo),
				},
			})
			
			.then((data) => {
				uni.hideLoading()
				var [error, res]  = data;
				if (res.data.msg){
					uni.showToast({
						title: res.data.msg,
						duration: 1500,
						mask: false,
						icon: 'none'
					})
					setTimeout(()=>{
						uni.navigateBack()
					}, 1500) 
					return;
				}
				if(res.data.redirect){
					let pages = getCurrentPages()
					console.log(pages[pages.length - 1].route)
					if(res.data.redirect != ('/' + pages[pages.length - 1].route)){
						uni.navigateTo({
							url: res.data.redirect
						});
					}
					return
				}
				let courseDetails = context.state.courseDetails.concat([res.data])
				context.commit('setState', {
					key: 'courseDetails',
					data: courseDetails,
				})
			})
		},
		getGoodsDetails(context, params){
			let goods = context.state.goodsDetails.filter(goods => goods.id == params.id);
			if (goods.length){
				return goods;
			}
			uni.showLoading({
				title: '加载中'
			})
			uni.request({
				url: env.host + '/?app=basic&mod=ApiTeachTool&act=detail',
				data: params,
				header: {
					'bearer-user': JSON.stringify(context.state.userInfo),
					'bearer-open': JSON.stringify(context.state.openInfo),
				},
			})
			.then((data) => {
				uni.hideLoading()
				var [error, res]  = data;
				if(res.data.redirect){
					let pages = getCurrentPages()
					console.log(res.data.redirect, pages[pages.length - 1])
					if(res.data.redirect != ('/' + pages[pages.length - 1].route)){
						uni.navigateTo({
							url: res.data.redirect
						});
					}
				}
				let goodsDetails = context.state.goodsDetails.concat([res.data])
				context.commit('setState', {
					key: 'goodsDetails',
					data: goodsDetails,
				})
			})
		},
		getAllTeachTools(context, params){
			uni.showLoading({
				title: '加载中'
			})
			uni.request({
				url: env.host + '/?app=basic&mod=ApiTeachTool&act=all',
				data: params,
			})
			.then(data => {
				uni.hideLoading()
				var [error, res]  = data;
				if(res.data.redirect){
					let pages = getCurrentPages()
					console.log(res.data.redirect, pages[pages.length - 1])
					if(res.data.redirect != ('/' + pages[pages.length - 1].route)){
						uni.navigateTo({
							url: res.data.redirect
						});
					}
				}
				context.commit('setState', {
					key: 'allTeachTools',
					data: res.data,
				})
			})
		},
		getRecommendQuestions(context, params){
			uni.showLoading({
				title: '加载中'
			})
			uni.request({
				url: env.host + '/?app=basic&mod=ApiQuestion&act=recommends',
				data: params,
			})
			.then(data => {
				uni.hideLoading()
				var [error, res]  = data;
				if(res.data.redirect){
					let pages = getCurrentPages()
					console.log(res.data.redirect, pages[pages.length - 1])
					if(res.data.redirect != ('/' + pages[pages.length - 1].route)){
						uni.navigateTo({
							url: res.data.redirect
						});
					}
				}
				context.commit('setState', {
					key: 'recommendQuestions',
					data: res.data,
				})
			})
		},
		getAllQuestions(context, params){
			uni.showLoading({
				title: '加载中'
			})
			uni.request({
				url: env.host + '/?app=basic&mod=ApiQuestion&act=all',
				data: params,
			})
			.then(data => {
				uni.hideLoading()
				var [error, res]  = data;
				if(res.data.redirect){
					let pages = getCurrentPages()
					console.log(res.data.redirect, pages[pages.length - 1])
					if(res.data.redirect != ('/' + pages[pages.length - 1].route)){
						uni.navigateTo({
							url: res.data.redirect
						});
					}
				}
				let allQuestions = context.state.allQuestions ? context.state.allQuestions : []
				allQuestions = allQuestions.concat(res.data);
				context.commit('setState', {
					key: 'allQuestions',
					data: allQuestions,
				})
			})
		},
		getQuestionDetail(context, params){
			uni.showLoading({
				title: '加载中'
			})
			uni.request({
				url: env.host + '/?app=basic&mod=ApiQuestion&act=detail',
				data: params,
			})
			.then(data => {
				uni.hideLoading()
				var [error, res]  = data;
				if(res.data.redirect){
					let pages = getCurrentPages()
					console.log(res.data.redirect, pages[pages.length - 1])
					if(res.data.redirect != ('/' + pages[pages.length - 1].route)){
						uni.navigateTo({
							url: res.data.redirect
						});
					}
				}
				context.commit('setState', {
					key: 'questionDetail',
					data: res.data,
				})
				uni.setNavigationBarTitle({
				　　title: res.data.wd_title
				})
			})
		},
		getAllCourses(context){
			uni.showLoading({
				title: '加载中'
			})
			uni.request({
				url: env.host + '/?app=basic&mod=ApiCourse&act=all'
			})
			.then(data => {
				uni.hideLoading()
				var [error, res]  = data;
				if(res.data.redirect){
					let pages = getCurrentPages()
					console.log(res.data.redirect, pages[pages.length - 1])
					if(res.data.redirect != ('/' + pages[pages.length - 1].route)){
						uni.navigateTo({
							url: res.data.redirect
						});
					}
				}
				context.commit('setState', {
					key: 'allCourses',
					data: res.data,
				})
			})
		},
		getAllCourseCategories(context){
			uni.showLoading({
				title: '加载中'
			})
			uni.request({
				url: env.host + '/?app=basic&mod=ApiCourseCategory&act=all'
			})
			.then(data => {
				uni.hideLoading()
				var [error, res]  = data;
				if(res.data.redirect){
					let pages = getCurrentPages()
					console.log(res.data.redirect, pages[pages.length - 1])
					if(res.data.redirect != ('/' + pages[pages.length - 1].route)){
						uni.navigateTo({
							url: res.data.redirect
						});
					}
				}
				context.commit('setState', {
					key: 'allCourseCategories',
					data: res.data,
				})
			})
		},
		getHomeBanner(context) {
			uni.showLoading({
				title: '加载中'
			})
			uni.request({
				url: env.host + '/?app=basic&mod=ApiCarousel&act=index'
			})
			.then(data => {//data为一个数组，数组第一项为错误信息，第二项为返回数据
				uni.hideLoading()
				var [error, res]  = data;
				if(res.data.redirect){
					let pages = getCurrentPages()
					console.log(res.data.redirect, pages[pages.length - 1])
					if(res.data.redirect != ('/' + pages[pages.length - 1].route)){
						uni.navigateTo({
							url: res.data.redirect
						});
					}
				}
				context.commit('setState', {
					key: 'homeBanner',
					data: res.data,
				})
			})
		},
		getStarCourses(context){
			uni.showLoading({
				title: '加载中'
			})
			uni.request({
				url: env.host + '/?app=basic&mod=ApiCourse&act=stars'
			})
			.then(data => {
				uni.hideLoading()
				var [error, res]  = data;
				if(res.data.redirect){
					let pages = getCurrentPages()
					console.log(res.data.redirect, pages[pages.length - 1])
					if(res.data.redirect != ('/' + pages[pages.length - 1].route)){
						uni.navigateTo({
							url: res.data.redirect
						});
					}
				}
				context.commit('setState', {
					key: 'starCourses',
					data: res.data,
				})
			})
		},
		getRecommendCourses(context){
			uni.showLoading({
				title: '加载中'
			})
			uni.request({
				url: env.host + '/?app=basic&mod=ApiCourse&act=recommends'
			})
			.then(data => {
				uni.hideLoading()
				var [error, res]  = data;
				if(res.data.redirect){
					let pages = getCurrentPages()
					if(res.data.redirect != ('/' + pages[pages.length - 1].route)){
						uni.navigateTo({
							url: res.data.redirect
						});
					}
					return
				}
				context.commit('setState', {
					key: 'recommendCourses',
					data: res.data,
				})
			})
		},
		getStarTeachTools(context){
			uni.showLoading({
				title: '加载中'
			})
			uni.request({
				url: env.host + '/?app=basic&mod=ApiTeachTool&act=stars'
			})
			.then(data => {
				uni.hideLoading()
				var [error, res]  = data;
				if(res.data.redirect){
					let pages = getCurrentPages()
					if(res.data.redirect != ('/' + pages[pages.length - 1].route)){
						uni.navigateTo({
							url: res.data.redirect
						});
					}
					return
				}
				context.commit('setState', {
					key: 'starTeachTools',
					data: res.data,
				})
			})
		},
		bind(context, params){
			let openInfo = uni.getStorageSync('openInfo') || ''
			if(openInfo){
				uni.showLoading({
					title: '加载中'
				})
				uni.request({
					url : env.host + '/?app=basic&mod=ApiUser&act=bind&type=' + env.mp.type,
					data: params,
				})
				.then(data => {
					uni.hideLoading()
					let [error, res]  = data;
					data = res.data
					if(data.msg){
						uni.showToast({
							title: data.msg,
							icon: 'none',
						})
						return;
					}
					if(res.data.redirect){
						let pages = getCurrentPages()
						if(res.data.redirect != ('/' + pages[pages.length - 1].route)){
							uni.navigateTo({
								url: res.data.redirect
							});
						}
						return
					}
					if(res.data.userInfo){
						context.commit('login', res.data.userInfo)
						uni.navigateBack();  
					}
				})
			}
		},
		doLogin(context){
			/*
			let openInfo = uni.getStorageSync('openInfo') || ''
			let userInfo = uni.getStorageSync('userInfo') || ''
			console.log(context.state.hasLogin, getCurrentPages())
			if(openInfo && userInfo){
				context.commit('setOpenInfo', openInfo)
				context.commit('login', userInfo)
				//uni.navigateBack()
				return
			}
			*/
			let name = env.mp.name
			let provider = env.mp.login_provider
			uni.login({
				provider: provider,
				success: function(loginRes) {
					let code = loginRes.code;
					//2.将用户登录code传递到后台置换用户SessionKey、OpenId等信息
					uni.showLoading({
						title: '加载中'
					})
					uni.request({
						url: env.host + '/?app=basic&mod=ApiAuth&act=' + name,
						data: {
							code: code,
						},
					})
					.then(data => {
						uni.hideLoading()
						let [error, res]  = data;
						context.commit('setOpenInfo', res.data.openInfo)
						console.log(res.data.userInfo)
						if(res.data.userInfo){
							context.commit('login', res.data.userInfo)
							console.log(res.data.userInfo)
							uni.navigateBack()
						}
						if(res.data.redirect){
							let pages = getCurrentPages()
							if(res.data.redirect != ('/' + pages[pages.length - 1].route)){
								uni.navigateTo({
									url: res.data.redirect
								});
							}
							return
						}
						/*if(!res.data.userInfo){
							uni.navigateTo({
								url: '/pages/public/login',
							});
							return;
						}
						context.commit('login', res.data.userInfo)
						*/
					})
			   },
			});
			
		},
	}
})

export default store
