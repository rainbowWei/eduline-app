import env from '@/env.js'


export default {
	findAllGroupBuy(state){
		let orders = uni.request({
			url: env.host + '?app=basic&mod=ApiUser&act=groupBuyOrders',
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
			return res.data
		})
		return orders
	}
}