import env from '@/env.js'

export default{
	isLiveOpen(){
		let res = uni.request({
			url: env.host + '?app=basic&mod=ApiCourse&act=isLiveOpen',
			header: {
				'Content-Type': 'application/json',
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
		return res.res
	},
}