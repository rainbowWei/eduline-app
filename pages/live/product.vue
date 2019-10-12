<template>
	<view class="container" v-show="currentLive" >
		<view class="carousel">
			<view class="image-wrapper">
				<image
					:src="currentLive.image" 
					class="loaded" 
					mode="aspectFill"
				/>
				<!-- <video v-show="playingVideo" :src="courseAddress" controls 
					class="video" ></video> -->
			</view>
		</view>
		
		<view class="introduce-section">
			<text class="title">{{currentLive.video_title}}</text>
			<view class="price-box">
				<text class="price-tip">¥</text>
				<text class="price">{{currentLive.t_price}}</text>
				<text class="coupon-tip">{{currentLive.video_order_count_mark}}在学习</text>
			</view>
		</view>
		<view class="navbar">
			<view 
				v-for="(item, index) in navList" :key="index" 
				class="nav-item" 
				:class="{current: tabCurrentIndex === index}"
				@click="tabClick(index)"
			>
				{{item.text}}
			</view>
		</view>
		<!-- 课程介绍 -->
		<view v-show="tabCurrentIndex == 0" class="detail-desc">
			<rich-text :nodes="currentLive.video_intro"></rich-text>
		</view>
		<!-- 课程详情 -->
		<view v-show="tabCurrentIndex == 1">
			<view 
				v-for="(item,index) in currentLive.sections" :key="index"
				class="top-section-item"
			>
				<view class="section-item" @click="playLive(item)" >
					<image class="icon" src="https://eduline.sozxw.com/assets/miniapp/icon-font/play.png"></image>
					<view class="section-desc">
						<view style="margin-left: 20upx;">
							<text>{{item.title}}</text> 
							<text style="color:#FA436A; margin-left: 20upx; font-size: 20upx;;"> {{item.liveStatusText}} </text>
						</view>
						<text class="time" style="margin-left: 20upx;">{{item.start}} ~ {{item.end}}</text>
					</view>
				</view>
			</view>
		</view>
		<!-- 评价 -->
		<view v-show="tabCurrentIndex == 2" class="eva-section">
			<view class="e-header">
				<text class="tit">评价</text>
				<text>({{currentLive.comments.length}})</text>
				<text class="tip">好评率 100%</text>
				<text class="yticon icon-you"></text>
			</view> 
			<view v-for="(comment, id) in currentLive.comments" :key="id" class="eva-box">
				<image class="portrait" src="https://www.xingxiwang.net/addons/theme/stv1/_static/images/noavatar/middle.jpg" mode="aspectFill"></image>
				<view class="right">
					<text class="name">{{ comment.uname }}</text>
					<text class="con">{{ comment.review_description }}</text>
					<view class="bot">
						<text class="time">{{comment.ctime}}</text>
					</view>
				</view>
			</view>
		</view>
		
		
		<!-- 底部操作菜单 -->
		<view class="page-bottom">
			<navigator url="/pages/index/index" open-type="switchTab" class="p-b-btn">
				<text class="yticon icon-xiatubiao--copy"></text>
				<text>首页</text>
			</navigator>
			<view class="p-b-btn" :class="{active: favorite}" >
				<text class="yticon icon-shoucang"></text>
				<text>收藏</text>
			</view>
			<view class="action-btn-group">
				<button type="primary" class=" action-btn no-border buy-now-btn">¥{{currentLive.t_price}}</button>
				<button type="primary" v-show="!currentLive.is_buy" class=" action-btn no-border add-cart-btn"  @click="buy(currentLive)">马上购买</button>
				<button type="primary" v-show="currentLive.is_buy" class=" action-btn no-border add-cart-btn" >已经购买</button>
			</view>
		</view>
	
	</view>
</template>

<script>
	import {mapState,mapMutations} from 'vuex';
	var graceRichText = require("@/sdk/richText.js");
	export default{
		data() {
			return {
				tabCurrentIndex: 1,
				navList: [
					{
						state: 0,
						text: '课程介绍',
						loadingType: 'more',
						orderList: []
					},
					{
						state: 1,
						text: '课程目录',
						loadingType: 'more',
						orderList: []
					},
					{
						state: 2,
						text: '评论',
						loadingType: 'more',
						orderList: []
					},
				],
				id: 0,
				hideSections: [],
				videoHeight:300,
				showSmallVideo: false,
			};
		},
		computed: {
			...mapState(["liveDetails"]),
			
			currentLive: function(){
				let courses = this.$store.state.liveDetails.filter( course => course.id == this.id);
				if(courses.length == 0){
					return false;
				}
				let currentCourse = courses[0];
                currentCourse.video_intro = graceRichText.format(currentCourse.video_intro);
				
				uni.setNavigationBarTitle({
				　　title: currentCourse.video_title
				})
				
				let basePath = '/pages/live/product?id='
				let history = uni.getStorageSync('history') || []
				let index = history.findIndex((el)=>(el.path == basePath+currentCourse.id));
				if(index > -1){
					let front = history.slice(0, index)
					let behind = history.slice(index + 1, history.length)
					history = front.concat(behind)
				}
				history.unshift({
					image:  currentCourse.image,
					path: '/pages/live/product?id=' + currentCourse.id
				})
				uni.setStorage({
					key: 'history', 
					data: history
				})
				return currentCourse;
			},
		},
		
		onLoad(options){
			
			this.id = options.id;
			
			this.$store.dispatch('getliveDetails', {
				id: options.id,
			});
		},

		methods:{
			buy(course){
				uni.navigateTo({
					url: `/pages/money/pay?type=live&id=`+ course.id
				})
			},
			paid(){
				this.currentCourse.is_buy = true
			},
			stopPrevent(){},
			//顶部tab点击
			tabClick(index){
				this.tabCurrentIndex = index;
			},
			
			playLive(section){
				if('直播中...' !== section.liveStatusText){
					this.$api.msg('不在直播时间段')
					return
				}
				this.$api.playLive(this.$store, section)
			},
		},
		
	}
</script>

<style lang='scss'>
	page{
		background: $page-color-base;
		padding-bottom: 160upx;
	}
	
	.top-section-item{
		padding: 40upx 20upx ;
		background: #fff;
		margin-bottom: 40upx;
		font-size: 30upx;
		color: $font-color-dark;
		.top-section-title{
			display:flex;
			align-items:center;
			padding-bottom: 10upx;
			position: sticky;
			top: 82upx;
			z-index: 10;
			background: #fff;
			border-bottom: 1px solid #eee;
			text{
				width: 90%;
				font-size: 36upx;
			}
			image{
				width: 36upx;
				height: 36upx;
			}
		}
		.section-item{
			display: flex;
			border-bottom: 2upx solid #eee;
			padding: 6upx 40upx;
			line-height: 60upx;
			image{
				width: 66upx;
				height: 66upx;
				margin-top: 20upx;
			}
			.section-desc{
				display: flex; flex-direction: column;
				.time{
					color: #888;
				}
			}
		}
	}
	.icon{
		height: 34upx;
		width: 34upx;
	}
	.navbar{
		display: flex;
		height: 80upx;
		padding: 0 5px;
		background: #fff;
		box-shadow: 0 1px 5px rgba(0,0,0,.06);
		position: sticky;
		top: 0;
		z-index: 10;
		.nav-item{
			flex: 1;
			display: flex;
			justify-content: center;
			align-items: center;
			height: 100%;
			font-size: 15px;
			color: $font-color-dark;
			position: relative;
			&.current{
				color: $base-color;
				&:after{
					content: '';
					position: absolute;
					left: 50%;
					bottom: 0;
					transform: translateX(-50%);
					width: 44px;
					height: 0;
					border-bottom: 2px solid $base-color;
				}
			}
		}
	}
	
	.icon-you{
		font-size: $font-base + 2upx;
		color: #888;
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
	
	/* 标题简介 */
	.introduce-section{
		background: #fff;
		padding: 20upx 30upx;
		
		.title{
			font-size: 32upx;
			color: $font-color-dark;
			height: 50upx;
			line-height: 50upx;
		}
		.price-box{
			display:flex;
			align-items:baseline;
			height: 64upx;
			padding: 10upx 0;
			font-size: 26upx;
			color:$uni-color-primary;
		}
		.price{
			font-size: $font-lg + 2upx;
		}
		.m-price{
			margin:0 12upx;
			color: $font-color-light;
			text-decoration: line-through;
		}
		.coupon-tip{
			align-items: center;
			padding: 4upx 20upx;
			background: $uni-color-primary;
			font-size: $font-sm;
			color: #fff;
			border-radius: 6upx;
			line-height: 1;
			transform: translateY(-4upx); 
		}
		.bot-row{
			display:flex;
			align-items:center;
			height: 50upx;
			font-size: $font-sm;
			color: $font-color-light;
			text{
				flex: 1;
			}
		}
	}
	
	/* 评价 */
	.eva-section{
		display: flex;
		flex-direction: column;
		padding: 20upx 30upx;
		background: #fff;
		margin-top: 16upx;
		.e-header{
			display: flex;
			align-items: center;
			height: 70upx;
			font-size: $font-sm + 2upx;
			color: $font-color-light;
			.tit{
				font-size: $font-base + 2upx;
				color: $font-color-dark;
				margin-right: 4upx;
			}
			.tip{
				flex: 1;
				text-align: right;
			}
			.icon-you{
				margin-left: 10upx;
			}
		}
	}
	.eva-box{
		display: flex;
		padding: 20upx 0;
		.portrait{
			flex-shrink: 0;
			width: 80upx;
			height: 80upx;
			border-radius: 100px;
		}
		.right{
			flex: 1;
			display: flex;
			flex-direction: column;
			font-size: $font-base;
			color: $font-color-base;
			padding-left: 26upx;
			.con{
				font-size: $font-base;
				color: $font-color-dark;
				padding: 20upx 0;
			}
			.bot{
				display: flex;
				justify-content: space-between;
				font-size: $font-sm;
				color:$font-color-light;
			}
		}
	}
	/*  详情 */
	.detail-desc{
		background: #fff;
		margin-top: 16upx;
		.d-header{
			display: flex;
			justify-content: center;
			align-items: center;
			height: 80upx;
			font-size: $font-base + 2upx;
			color: $font-color-dark;
			position: relative;
				
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
				border-bottom: 1px solid #ccc; 
			}
		}
	}
	
	/* 规格选择弹窗 */
	.attr-content{
		padding: 10upx 30upx;
		.a-t{
			display: flex;
			image{
				width: 170upx;
				height: 170upx;
				flex-shrink: 0;
				margin-top: -40upx;
				border-radius: 8upx;;
			}
			.right{
				display: flex;
				flex-direction: column;
				padding-left: 24upx;
				font-size: $font-sm + 2upx;
				color: $font-color-base;
				line-height: 42upx;
				.price{
					font-size: $font-lg;
					color: $uni-color-primary;
					margin-bottom: 10upx;
				}
				.selected-text{
					margin-right: 10upx;
				}
			}
		}
		.attr-list{
			display: flex;
			flex-direction: column;
			font-size: $font-base + 2upx;
			color: $font-color-base;
			padding-top: 30upx;
			padding-left: 10upx;
		}
		.item-list{
			padding: 20upx 0 0;
			display: flex;
			flex-wrap: wrap;
			text{
				display: flex;
				align-items: center;
				justify-content: center;
				background: #eee;
				margin-right: 20upx;
				margin-bottom: 20upx;
				border-radius: 100upx;
				min-width: 60upx;
				height: 60upx;
				padding: 0 20upx;
				font-size: $font-base;
				color: $font-color-dark;
			}
			.selected{
				background: #fbebee;
				color: $uni-color-primary;
			}
		}
	}
	
	/*  弹出层 */
	.popup {
		position: fixed;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		z-index: 99;
		
		&.show {
			display: block;
			.mask{
				animation: showPopup 0.2s linear both;
			}
			.layer {
				animation: showLayer 0.2s linear both;
			}
		}
		&.hide {
			.mask{
				animation: hidePopup 0.2s linear both;
			}
			.layer {
				animation: hideLayer 0.2s linear both;
			}
		}
		&.none {
			display: none;
		}
		.mask{
			position: fixed;
			top: 0;
			width: 100%;
			height: 100%;
			z-index: 1;
			background-color: rgba(0, 0, 0, 0.4);
		}
		.layer {
			position: fixed;
			z-index: 99;
			bottom: 0;
			width: 100%;
			min-height: 40vh;
			border-radius: 10upx 10upx 0 0;
			background-color: #fff;
			.btn{
				height: 66upx;
				line-height: 66upx;
				border-radius: 100upx;
				background: $uni-color-primary;
				font-size: $font-base + 2upx;
				color: #fff;
				margin: 30upx auto 20upx;
			}
		}
		@keyframes showPopup {
			0% {
				opacity: 0;
			}
			100% {
				opacity: 1;
			}
		}
		@keyframes hidePopup {
			0% {
				opacity: 1;
			}
			100% {
				opacity: 0;
			}
		}
		@keyframes showLayer {
			0% {
				transform: translateY(120%);
			}
			100% {
				transform: translateY(0%);
			}
		}
		@keyframes hideLayer {
			0% {
				transform: translateY(0);
			}
			100% {
				transform: translateY(120%);
			}
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
			overflow: hidden;
			box-shadow: 0 20upx 40upx -16upx #fa436a;
			box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
			background: linear-gradient(to right, #ffac30,#fa436a,#F56C6C);
			margin-left: 20upx;
			position:relative;
			&:after{
				content: '';
				position:absolute;
				top: 50%;
				right: 50%;
				transform: translateY(-50%);
				height: 28upx;
				width: 0;
				border-right: 1px solid rgba(255,255,255,.5);
			}
			.action-btn{
				display:flex;
				align-items: center;
				justify-content: center;
				width: 180upx;
				height: 100%;
				font-size: $font-base ;
				padding: 0;
				border-radius: 0;
				background: transparent;
			}
		}
	}
	.video{
		height: 100%;
		width: 100%;
	}
	.video-demo {
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		right: 0;
		background: #ffac30;
	}
	.video-demo-fixed {
		position: fixed;
		right: 10upx;
		top: 150upx;
		width: 340upx;
		height: 240upx;
		z-index: 1000;
	}
	
</style>
