<template>
	<view class="container">
		<view class="goods">
			<image :src="currentGoods.image" />
		</view>
		<view class="goods-section">
			<text class="title">{{currentGoods.title}}</text>
			<view class="price-box">
				<text class="price-tip">¥</text>
				<text class="price">{{currentGoods.t_price}}</text>
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
		
		
		<!-- 教具介绍 -->
		<view v-show="tabCurrentIndex == 0" class="detail-desc">
			<rich-text :nodes="currentGoods.info"></rich-text>
		</view>
		<!-- 评价 -->
		<view v-show="tabCurrentIndex == 1" class="eva-section">
			<view class="e-header">
				<text class="tit">评价</text>
				<text>({{currentGoods.comments.length}})</text>
				<text class="tip">好评率 100%</text>
				<text class="yticon icon-you"></text>
			</view> 
			<view v-for="(review, id) in currentGoods.comments" :key="id" class="eva-box">
				<image class="portrait" src="https://www.xingxiwang.net/addons/theme/stv1/_static/images/noavatar/middle.jpg" mode="aspectFill"></image>
				<view class="right">
					<text class="name">{{ review.uname }}</text>
					<text class="con">{{ review.review_description }}</text>
					<view class="bot">
						<text class="time">{{review.ctime}}</text>
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
				<button type="primary" class=" action-btn no-border buy-now-btn">¥{{currentGoods.t_price}}</button>
				<button type="primary" v-show="!currentGoods.is_buy" class=" action-btn no-border add-cart-btn"  @click="buy(currentGoods)">马上购买</button>
				<button type="primary" v-show="currentGoods.is_buy" class=" action-btn no-border add-cart-btn" >已经购买</button>
			</view>
		</view>
			
		</view>
	</view>
</template>

<script>
	import {mapState,mapMutations} from 'vuex';
	import env from '@/env.js';
	var graceRichText = require("@/sdk/richText.js");
	export default{
		data(){
			return{
				tabCurrentIndex: 0,
				navList: [
					{
						state: 0,
						text: '教具介绍',
						loadingType: 'more',
						orderList: []
					},
					
					{
						state: 1,
						text: '评论',
						loadingType: 'more',
						orderList: []
					},
				],
				id: 0,
			}
		},
		
		computed:{
			...mapState(["goodsDetails"]),
			currentGoods: function(){
				let goods = this.$store.state.goodsDetails.filter( goods => goods.id == this.id);
				if(goods.length == 0){
					return false;
				}
				let currentGoods = goods[0];
			    currentGoods.info = graceRichText.format(currentGoods.info);
				
				uni.setNavigationBarTitle({
				　　title: currentGoods.title
				})
				
				let basePath = '/pages/product/goodsDetails?id='
				let history = uni.getStorageSync('history') || []
				let index = history.findIndex((el)=>(el.path == basePath+currentGoods.id));
				if(index > -1){
					let front = history.slice(0, index)
					let behind = history.slice(index + 1, history.length)
					history = front.concat(behind)
				}
				history.unshift({
					image:  currentGoods.image,
					path: '/pages/product/goodsDetails?id=' + currentGoods.id
				})
				uni.setStorage({
					key: 'history', 
					data: history
				})
				
				return currentGoods;
			},
			
		},
		onLoad(options){
			
			//接收传值,id里面放的是标题，因为测试数据并没写id 
			this.id = options.id;
			this.$store.dispatch('getGoodsDetails', {
				id: options.id,
			});
		},
		methods: {
			...mapMutations,
			//顶部tab点击
			tabClick(index){
				this.tabCurrentIndex = index;
			},
			//支付
			buy(goods){
				uni.navigateTo({
					url: `/pages/money/pay?type=goods&id=`+ goods.id
				})
			},
		}
	}
	
</script>

<style lang='scss'>
	page{
		background: $page-color-base;
		padding-bottom: 160upx;
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

	
	/* 标题简介 */
	.goods-section{
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
		font-size: 34upx;
		line-height: 50upx;
		padding: 30upx 20upx;
		.d-header{
			display: flex;
			justify-content: center;
			align-items: center;
			height: 80upx;
			font-size: $font-base;
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
	
</style>
