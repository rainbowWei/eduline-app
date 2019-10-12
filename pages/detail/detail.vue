<template>
	<view v-if="fetchCurrentCourse()">
		<view style="width: 100%;" >
			<image
				:src="currentCourse.image" 
				:class="item.loaded" 
				style="width: 100%;"
				mode="aspectFill"
			></image>
		</view>
		<view class="info">
			<text>{{currentCourse.video_title}}</text>
			<view v-if="times > 0">
				<view id="countDown" style="color:#FF412E; font-size: 12px;text-align: center;padding: 6upx;">
				        <!--
				        :auto-start="false"
				        绑定为false倒计时不会自动执行 需要方法触发 默认值为true
				        不传auto-start 倒计时加载后会自动执行 请根据业务需求设置
				        -->
				        <bbs-countdown
				            :time="times"
				            :auto-start="true"
				            ref="countdown"
				        ></bbs-countdown>
				</view>
			</view>
		</view>
		<view  v-if="groupIsFull" class="cate-section" style="color:#FF412E; font-size: 12px;text-align: center;" >
			<text>该团已满人看看其他团吧！</text>
		</view>
		<!-- 分类 -->
		<view class="cate-section">
			<view class="cate-item" >
				<image src="https://eduline.sozxw.com/assets/miniapp/icon-font/build-group.png"></image>
				<text>选择课程开团/参团</text>
			</view>
			<text class="yticon icon-you"></text>
			<view class="cate-item" >
				<image src="https://eduline.sozxw.com/assets/miniapp/icon-font/invitation.png"></image>
				<text>邀请好友</text>
			</view>
			<text class="yticon icon-you"></text>
			<view class="cate-item">
				<image src="https://eduline.sozxw.com/assets/miniapp/icon-font/group.png"></image>
				<text>{{currentCourse.group_buy.number}}人成团,一起听课</text>
			</view>
		</view>
		<!-- 分类 -->
		<view class="cate-section" style="padding: 10upx 100upx;background: #fff1f9;">
			<view v-for="(member, index) in groupMembers" :key="index" class="cate-item" >
				<image src="https://eduline.sozxw.com/addons/theme/stv1/_static/images/noavatar/small.jpg"></image>
				<text>{{member.phone}}</text>
			</view>
		</view>
		<view class="detail-desc">
			<rich-text :nodes="currentCourse.group_buy.body"></rich-text>
		</view>

		<!-- 猜你喜欢 -->
		<view class="guess">
			<view class="section-tit">热门拼团</view>
			<view class="guess-list" style="margin-bottom: 100upx;">
				<view 
					v-for="(item, index) in otherGroups" :key="index"
					class="guess-item"
				>
					<view @click="navigateTo('/pages/detail/detail?id=' + item.id + '&user=' + item.group_leader)">
						<image 
							:src="item.image" 
							:class="item.loaded" 
							mode="aspectFill"
						></image>
					</view>
					<text class='title clamp' style="text-align: center; font-size: 30upx;color: #AAAAAA;" :class="{Skeleton:!loaded}">仅剩余{{item.number}}个名额！</text>
				</view>
			</view>
		</view>
		<!-- 评论 -->
		<view class="page-bottom">
			<view class="p-b-btn" @click="switchTab('/pages/index/index')">
				<text class="yticon icon-xiatubiao--copy"></text>
				<text>首页</text>
			</view>
			<view class="action-btn-group">
				<button type="primary" v-if="!currentCourse.group_buy.is_buy && !groupIsFull" class=" action-btn no-border add-cart-btn" @click="groupbuy(currentCourse)" >
					{{ group_leader ? '进团' : '开团' }}(¥{{currentCourse.group_buy.priceText}})
				</button>
				<button type="primary" v-if="currentCourse.group_buy.is_buy" class=" action-btn no-border add-cart-btn" open-type="share" >邀请好友</button>
				<button type="primary" class=" action-btn no-border add-cart-btn" @click="navigateTo('/pages/product/product?id='+id)" >去看课</button>
			</view>
		</view>
		
	</view>
</template>

<script>
	import {mapState,mapMutations} from 'vuex';
	import bbsCountdown from "@/wxcomponents/bbs-countdown/bbs-countdown.vue"
	var graceRichText = require("@/sdk/richText.js");
	export default {
		onShareAppMessage(res) {
		    if (res.from === 'button') {// 来自页面内分享按钮
		    }
			let openInfo =  uni.getStorageSync('openInfo')
			let userInfo =  uni.getStorageSync('userInfo')
			let path = '/pages/detail/detail?id=' + this.id + '&user=' + openInfo.openid
		    return {
		      title: '有空吗？这里有好课给你，快来领吧',
		      path: path
		    }
		},
		components: {
			bbsCountdown
		},
		computed: {
			...mapState(["courseDetails"]),
		},
		
		data() {
			return {
				id: 0,
				group_leader: '',
				loaded: false,
				data: {
					guessList: [{},{},{},{}] 
				},
				currentCourse: false,
				groupIsFull: false,
				groupMembers: [],
				times: 0,
				otherGroups: [],
			};
		},
		onLoad(options){
			this.id = options.id;
			this.group_leader = options.user || ''
			this.loaded = true;
		},
		onShow(){
			this.fetchCurrentCourse()
			console.log(this.group_leader);
		},
		methods:{
			
			// 现在的时间戳--必须传入
			now() {
				let now = new Date()
				return now
			},
			imageOnLoad(key,index){
				this.$set(this.data[key][index], 'loaded', 'loaded');
			},
			paid(){
				this.currentCourse.group_buy.is_buy = true
				this.getGroupMembers(this.currentCourse)
				this.getTimes(this.currentCourse)
			},
			groupbuy(course){
				let group_leader = this.groupIsFull ? 0 : this.group_leader
				this.$api.groupbuy(course.id, group_leader, this.$store.state)
				let openid = this.group_leader || uni.getStorageSync('openInfo').openid
				this.groupMembers = this.$api.groupBuy.getGroupMembers(course.group_buy, openid, this.$store.state)
			},
			getGroupMembers: async function(course){
				if(course){
					let openid = this.group_leader || uni.getStorageSync('openInfo').openid
					this.groupMembers = await this.$api.groupBuy.getGroupMembers(course.group_buy, openid, this.$store.state)
					if(this.groupMembers == this.currentCourse.group_buy.number){
						this.currentCourse.is_buy = true
					}
				}
			},
			getTimes: async function(course){
				if(course){
					let openid = this.group_leader || uni.getStorageSync('openInfo').openid
					this.times = await this.$api.groupBuy.times(course.group_buy, openid, this.$store.state)
				}
			},
			getOtherGroups: async function (course) {
				if(course){
					this.otherGroups = await this.$api.groupBuy.otherGroups(this.$store.state)
				}
			},
			fetchCurrentCourse: async function(){
				if(this.currentCourse){
					return this.currentCourse
				}
				if(!this.id){
					return false
				}
				await this.$store.dispatch('getCourseDetails', {
					id: this.id,
				});
				let courses = this.$store.state.courseDetails.filter( course => course.id == this.id);
				console.log(courses)
				if(courses.length == 0){
					return false;
				}
				let currentCourse = courses[0];
			    currentCourse.group_buy.body = graceRichText.format(currentCourse.group_buy.body);
				if(this.group_leader){
					let openid = this.group_leader || uni.getStorageSync('openInfo').openid
					this.$api.groupBuyIsFull(currentCourse.group_buy, openid, this.$store.state)
				}
				if(currentCourse){
					this.getGroupMembers(currentCourse)
					this.getTimes(currentCourse)
					this.getOtherGroups(currentCourse)
				}
				//this.getGroupMembers(currentCourse)
				uni.setNavigationBarTitle({
				　　title: currentCourse.video_title
				})
				this.currentCourse = currentCourse
				return this.currentCourse;
			},
		},
	}
</script>

<style lang="scss">
	page{
		background: $page-color-base;
	}
	.carousel {
		height: 600upx;
		position:relative;
		swiper{
			height: 100%;
		}
		.image-wrapper{
			width: 100%;
			height: 100%;
		}
		image{
			width: 100%;
		}
		.swiper-item {
			display: flex;
			justify-content: center;
			align-content: center;
			height: 750upx;
			overflow: hidden;
			image {
				width: 100%;
				height: 100%;
			}
		}
		
	}
	/*  详情 */
	.detail-desc{
		background: #fff;
		margin-top: 16upx;
		text-align: center;
		color: #666;
		padding: 12upx;
		
				
		text{
			padding: 0 20upx;
			background: #fff;
			position: relative;
			z-index: 1;
		}
		&:after{
			position: absolute;
			left: 50%;
			top: 50%;
			transform: translateX(-50%);
			width: 300upx;
			height: 0;
			content: '';
		}
	}
	/* 底部操作菜单 */
	.page-bottom{
		position:fixed;
		left: 30upx;
		bottom:30upx;
		z-index: 95;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 690upx;
		height: 100upx;
		background: rgba(255,255,255,.9);
		box-shadow: 0 0 20upx 0 rgba(0,0,0,.5);
		border-radius: 16upx;
		
		.p-b-btn{
			display:flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			font-size: $font-sm;
			color: $font-color-base;
			width: 96upx;
			height: 80upx;
			.yticon{
				font-size: 40upx;
				line-height: 48upx;
				color: $font-color-light;
			}
			&.active, &.active .yticon{
				color: $uni-color-primary;
			}
			.icon-fenxiang2{
				font-size: 42upx;
				transform: translateY(-2upx);
			}
			.icon-shoucang{
				font-size: 46upx;
			}
		}
		.action-btn-group{
			display: flex;
			height: 76upx;
			border-radius: 100px;
			width: 68%;
			overflow: hidden;
			box-shadow: 0 20upx 40upx -16upx #fa436a;
			box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
			background: linear-gradient(to right, #ffac30,#fa436a,#F56C6C);
			margin-left: 20upx;
			position:relative;
			
			.action-btn{
				display:flex;
				align-items: center;
				justify-content: center;
				width: 50%;
				height: 100%;
				font-size: $font-base ;
				padding: 0;
				border-radius: 0;
				background: transparent;
			}
		}
	}
/* 分类 */
	.cate-section {
		display: flex;
		justify-content: space-around;
		align-items: center;
		flex-wrap:wrap;
		padding: 30upx 22upx; 
		background: #fff;
		.cate-item {
			display: flex;
			flex-direction: column;
			align-items: center;
			font-size: $font-sm + 2upx;
			color: #909399;
		}
		/* 原图标颜色太深,不想改图了,所以加了透明度 */
		image {
			width: 88upx;
			height: 88upx;
			margin-bottom: 14upx;
			border-radius: 50%;
			opacity: .7;
			box-shadow: 4upx 4upx 20upx rgba(250, 67, 106, 0.3);
		}
	}
	.carousel {
		height: 200px;
		.image-wrapper{
			display: flex;
			justify-content: center;
			align-content: center;
			width: 100%;
			height: 100%;
			overflow: hidden;

			image {
				width: 100%;
				height: 100%;
			}
		}
	}
	.scroll-view-wrapper{
		display:flex;
		align-items:center;
		height: 90upx;
		padding: 20upx 0 20upx 40upx;
		background: #fff;
	}
	.episode-panel {
		white-space: nowrap;
		width: 100%;
		view {
			display: inline-block;
			margin-right: 30upx;
			width: 56upx;
			font-size: $font-lg;
			color: $font-color-base;
			&.current{
				color: #07a7a7;
			}
		}
	}

	.info {
		display: flex;
		align-items: center;
		padding: 10upx 40upx;
		background: #fff;

		.title {
			flex: 1;
			display: flex;
			flex-direction: column;
			font-size: $font-lg + 4upx;
			color: $font-color-dark;

			text:last-child {
				font-size: $font-sm;
				color: $font-color-light;
				margin-top: 4upx;
				&.Skeleton{
					width:220upx;
				}
			}
		} 
		.yticon {
			font-size: 44upx;
			color: $font-color-base;
			margin: 0 10upx 0 30upx;
		}
	}

	.actions {
		padding: 10upx 28upx;
		background: #fff;

		.yticon {
			font-size: 46upx;
			color: $font-color-base;
			padding: 10upx 12upx;
			&.active{
				color: #ff4443;
			}
			&:nth-child(2) {
				font-size: 50upx;
			}
		}
	}

	.section-tit {
		font-size: $font-base+2upx;
		color: $font-color-dark;
		margin-bottom: 30upx;
		text-align:center;
	}

	.guess {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 30upx 40upx 10upx;
		margin-top: 16upx;
		background: #fff;
	}

	.guess-list {
		display: flex;
		flex-wrap: wrap;
		width: 100%;
	}
	.guess-item {
		display: flex;
		flex-direction: column;
		flex: 1;
		overflow: hidden;
		min-width: 40%;
		margin-right: 26upx;
		padding-bottom: 40upx;
	
		&:nth-child(2n) {
			margin-right: 0;
		}
	
		image {
			width: 100%;
			height: 200upx;
			border-radius: 10upx;
		}
	
		text {
			font-size: $font-sm;
			color: $font-color-light;
			&.Skeleton{
				width: 180upx;
				&.title{
					width: 140upx;
				}
			}
			&.title{
				font-size: $font-base+2upx;
				color: $font-color-dark;
				margin-top:16upx;
				margin-bottom: 8upx;
			}
		}
	}
	.evalution{
		display:flex;
		flex-direction:column;
		background: #fff;
		margin-top: 16upx;
		padding: 40upx 0;
	}

	.eva-item{
		display:flex;
		padding: 20upx 40upx;
		image{
			width: 60upx;
			height: 60upx;
			border-radius: 50px;
			flex-shrink: 0;
			margin-right: 24upx;
		}
	}
	.eva-right{
		display:flex;
		flex-direction:column;
		flex: 1;
		font-size: $font-sm + 2upx;
		color: $font-color-light;
		position:relative;
		.zan-box{
			display:flex;
			align-items:base-line;
			position:absolute;
			top: 10upx;
			right: 10upx;
			.yticon{
				margin-left: 8upx; 
			}
		}
		.content{
			font-size: $font-base;
			color: #333;
			padding-top:20upx;
		}
	}
</style>
