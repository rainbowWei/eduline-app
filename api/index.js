import env from '@/env.js'

import groupBuy from '@/api/services/groupBuy.js'
import order from '@/api/services/order.js'
import course from '@/api/services/course.js'
export default {
	course: course,
	groupBuy: groupBuy,
	order: order,
	currentPage(){
		let pages = getCurrentPages();
		let page = pages[pages.length - 1];
		// #ifdef H5
		return page;
		// #endif
		
		// #ifdef MP-ALIPAY
		return page.rootVM;
		// #endif
		
		return page.$vm;
	},
	
	prePage(){
		let pages = getCurrentPages();
		let prePage = pages[pages.length - 2];
		// #ifdef H5
		return prePage;
		// #endif
		
		// #ifdef MP-ALIPAY
		return prePage.rootVM;
		// #endif
		
		return prePage.$vm;
	},
	
	msg(title, duration=1500, mask=false, icon='none'){
		//统一提示方便全局修改
		if(Boolean(title) === false){
			return;
		}
		uni.showToast({
			title,
			duration,
			mask,
			icon
		});
	},
	
	match:{
		phone: (data) => {
			let reg = new RegExp("^((13[0-9])|(14[5,7])|(15[0-3,5-9])|(17[0,1,3,5-8])|(18[0-9])|166|198|199|(147))\\d{8}$");
			return reg.test(data)
		},
		notEmpty: (data) => {
			return !!data
		},
		inArray: (val, arr) => {
			let res = arr.find(el => el == val)
			return res
		},
	},
	
	groupBuyIsFull(groupBuy, openid, state){
		console.log(state)
		uni.request({
			url: env.host + '?app=basic&mod=ApiOrderGroupBuy&act=full',
			data: {
				group_buy_id: groupBuy.id || 0,
				openid: openid,
			},
			header: {
				'Content-Type': 'application/json',
				'bearer-user': JSON.stringify(state.userInfo),
				'bearer-open': JSON.stringify(state.openInfo),
			},
		})
		.then(data=>{
			let [error, res]  = data;
			if(res.data.msg){
				return this.msg(res.data.msg)
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
			this.currentPage().groupIsFull = !!res.data.res
			if(this.currentPage().currentCourse.group_buy.is_buy && this.currentPage().groupIsFull){
				this.currentPage().currentCourse.is_buy = true
			}
		})
	},
	/* isBuyCourse(course, state){
		console.log(state)
		uni.request({
			url: env.host + '?app=basic&mod=ApiCourse&act=isBuy',
			data: {id: course.id || 0},
			header: {
				'Content-Type': 'application/json',
				'bearer-user': JSON.stringify(state.userInfo),
				'bearer-open': JSON.stringify(state.openInfo),
			},
		})
		.then(data=>{
			let [error, res]  = data;
			if(res.data.msg){
				return this.msg(res.data.msg)
			}
			if(res.data.redirect){
				uni.navigateTo({
						url: res.data.redirect
					});
				return
			}
			this.currentPage().currentCourse.is_buy = !!res.data.res
		})
	}, */
	gainCode(mobile){
		if( !this.match.phone(mobile) ){
			this.msg('电话输入有误');
			return;
		}
		
		uni.request({
			url: env.host + '/?app=basic&mod=ApiMessage&act=send',
			data: {
				mobile
			},
		})
		.then(data => {
			let [error, res]  = data;
			this.msg(res.data.msg)
		})
	
	},
	saveUser(state, user){
		uni.request({
			url: env.host + '?app=basic&mod=ApiUser&act=set',
			data: user,
			header: {
				'Content-Type': 'application/json',
				'bearer-user': JSON.stringify(state.userInfo),
				'bearer-open': JSON.stringify(state.openInfo),
			},
		})
		.then(data=>{
			let [error, res]  = data;
			if(res.data.msg){
				return this.msg(res.data.msg)
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
			this.msg(`操作成功`);
			let userInfo = uni.getStorageSync('userInfo') || {}
			userInfo.sex = user.sex,
			userInfo.child_name = user.child_name
			userInfo.uname = user.uname
			userInfo.child_gender = user.child_gender
			uni.setStorageSync('userInfo', userInfo)
			setTimeout(()=>{
				uni.navigateBack()
			}, 800)
		})
	},
	saveLocation(state, data){
		uni.request({
			url: env.host + '?app=basic&mod=ApiLocation&act=save',
			data: data,
			header: {
				'Content-Type': 'application/json',
				'bearer-user': JSON.stringify(state.userInfo),
				'bearer-open': JSON.stringify(state.openInfo),
			}
		})
		.then(data=>{
			let [error, res]  = data;
			if(res.data.msg){
				return msg(res.data.msg)
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
			this.msg(`操作成功`);
			this.prePage().refreshList()
			setTimeout(()=>{
				uni.navigateBack()
			}, 800)
		})
	},
	groupbuy(courseId, group_leader, state){
		let mp = env.mp.name
		let request = uni.request({
			url: env.host + '/?app=basic&mod=ApiPay&act=groupBuy',
			data: {
				mp: mp,
				id: courseId,
				code: group_leader,
			},
			header: {
				'bearer-user': JSON.stringify(state.userInfo),
				'bearer-open': JSON.stringify(state.openInfo),
			}
		})
		if(env.mp.name == 'ali'){
			this.alipay(request)
		}
		if(env.mp.name == 'wx'){
			request.then(data => {
				let [error, res]  = data;
				if(res.data.msg){
					return this.msg(res.data.msg)
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
				// 调起支付
				uni.requestPayment({
					provider: 'wxpay',
					timeStamp: res.data.timeStamp,
					nonceStr: res.data.nonceStr,
					package: res.data.package,
					signType: 'MD5',
					paySign: res.data.paySign,
					success: (result) => {
						this.currentPage().paid()
					},
					fail: function(err) {
						console.log('fail:' + JSON.stringify(err));
					}
				});
			})
		}
	},
	pay(type, id, addressId, state){
		let mp = env.mp.name
		let request = uni.request({
			url: env.host + '/?app=basic&mod=ApiPay&act=' + mp,
			data: {
				type: type,
				addressId: addressId,
				id: id,
			},
			header: {
				'bearer-user': JSON.stringify(state.userInfo),
				'bearer-open': JSON.stringify(state.openInfo),
			}
		})
		if(env.mp.name == 'ali'){
			this.alipay(request)
		}
		if(env.mp.name == 'wx'){
			this.wxpay(request)
		}
	},
	alipay(request){
		request.then(data => {
			let [error, res]  = data;
			if(res.data.msg){
				return msg(res.data.msg)
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
			// 调起支付
			console.log(res.data, res.data.trade_no)
			my.tradePay({
				tradeNO: res.data.trade_no,  
				success: (result) => {
					let prePage = this.prePage
					console.log(this, this.prePage, prePage())
					if(this.prePage().paid()){
						this.prePage().paid()
					}
					uni.navigateBack()
				},
				fail: function(err) {
					console.log('fail:' + JSON.stringify(err));
				}
			});
		})
	},
	wxpay: function(request){
		request.then(data => {
			let [error, res]  = data;
			if(res.data.msg){
				return msg(res.data.msg)
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
			// 调起支付
			uni.requestPayment({
				provider: 'wxpay',
				timeStamp: res.data.timeStamp,
				nonceStr: res.data.nonceStr,
				package: res.data.package,
				signType: 'MD5',
				paySign: res.data.paySign,
				success: (result) => {
					if(this.prePage().paid()){
						this.prePage().paid()
					}
					uni.navigateBack()
				},
				fail: function(err) {
					console.log('fail:' + JSON.stringify(err));
				}
			});
		})
	},
	
	playLive: function(context, section){
		uni.request({
			url: env.host + '/?app=basic&mod=ApiLive&act=playUrl',
			data: {
				id: section.id
			},
			header: {
				'bearer-user': JSON.stringify(context.state.userInfo),
				'bearer-open': JSON.stringify(context.state.openInfo),
			}
		})
		.then((data) => {
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
			if(!res.data.is_buy){
				uni.navigateTo({
					url: '/pages/money/pay?id='+res.data.id
				})
				return
			}
			
			uni.setClipboardData({ data: res.data.url, success:(data) => {
				this.msg(res.data.msg, 3000)
			}, fail:function(err){}, complete:function(res){} })
			
			let cc = requirePlugin('ccsdk');
		})
	},
	
	playVideo: function(context, section){
		uni.request({
			url: env.host + '/?app=basic&mod=ApiCourse&act=playUrl',
			data: {
				id: section.id
			},
			header: {
				'bearer-user': JSON.stringify(context.state.userInfo),
				'bearer-open': JSON.stringify(context.state.openInfo),
			}
		})
		.then((data) => {
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
				key: 'playingVideo',
				data: false,
			})
			if(!res.data.is_buy){
				uni.navigateTo({
					url: '/pages/money/pay?id='+res.data.id
				})
				return
			}
			console.log(res.data.url)
			context.commit('setState', {
				key: 'videoAddress',
				data: res.data.url,
			})
			context.commit('setState', {
				key: 'playingVideo',
				data: true,
			})
			this.currentPage.currentCourse.is_buy = true
		})
	}
}