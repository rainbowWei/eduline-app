import env from '@/env.js'

export default {
	otherGroups(state){
		let groups = uni.request({
			url: env.host + '?app=basic&mod=ApiOrderGroupBuy&act=ing',
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
				console.log(pages[pages.length - 1].route)
				if(res.data.redirect != ('/' + pages[pages.length - 1].route)){
					uni.navigateTo({
						url: res.data.redirect
					});
				}
				return
			}
			return res.data
		})
		return groups
	},
	getGroupMembers(groupBuy, openid, state){
		 
		let members = uni.request({
			url: env.host + '?app=basic&mod=ApiOrderGroupBuy&act=members',
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
				console.log(pages[pages.length - 1].route)
				if(res.data.redirect != ('/' + pages[pages.length - 1].route)){
					uni.navigateTo({
						url: res.data.redirect
					});
				}
				return
			}
			return res.data
		})
		return members
	},
	
	times(groupBuy, openid, state){
		let times = uni.request({
			url: env.host + '?app=basic&mod=ApiOrderGroupBuy&act=expired',
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
				console.log(pages[pages.length - 1].route)
				if(res.data.redirect != ('/' + pages[pages.length - 1].route)){
					uni.navigateTo({
						url: res.data.redirect
					});
				}
				return
			}
			return res.data.res
		})
		return times
	}
}