<template>
	<view class="content">
		<scroll-view scroll-y class="left-aside">
			<view v-for="item in allCourseCategories" :key="item.id" class="f-item b-b" :class="{active: item.id == currentId}" @click="tabtap(item)">
				{{item.title}}
			</view>
		</scroll-view>
		<scroll-view scroll-with-animation scroll-y="true" class="right-aside " @scroll="asideScroll" :scroll-top="tabScrollTop">
			<!-- 列表 -->
			<view class="cart-list">
				<block v-for="(item, index) in allCourses" :key="index">
					<view class="cart-item" @click="navigateTo('/pages/product/product?id='+item.id)" :class="'main-'+item.category_id" >
						<view class="image-wrapper">
							<image :src="item.image" 
								class="loaded" 
								mode="aspectFill"
							/>
						</view>
						<view class="item-right">
							<text class="title">{{item.title}}</text>
							<text class="attr">{{item.study_numbers}}在学习</text>
							<text class="price">¥{{item.t_price}}</text>
						</view>
					</view>
				</block>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import {mapState,mapMutations} from 'vuex'
	export default {
		data() {
			return {
				sizeCalcState: false,
				tabScrollTop: 0,
				currentId: 1,
			}
		},
		computed: {
			 ...mapState(["allCourseCategories", "allCourses"])
		},
		onLoad(){
			this.$store.dispatch('getAllCourseCategories')
			this.$store.dispatch('getAllCourses')
		},
		methods: {
			//一级分类点击
			tabtap(item){
				if(!this.sizeCalcState){
					this.calcSize();
				}
				setTimeout(()=>{
					this.currentId = item.id;
					let index = this.allCourses.findIndex(sitem=>sitem.category_id === item.id);
					this.tabScrollTop = this.allCourses[index].top;
					console.log(this.tabScrollTop)
				}, 100)
			},
			//右侧栏滚动
			asideScroll(e){
				console.log(e)
				if(!this.sizeCalcState){
					this.calcSize();
				}
				let scrollTop = e.detail.scrollTop;
				let tabs = this.allCourses.filter(item=>item.top <= scrollTop).reverse();
				console.log(tabs)
				if(tabs.length > 0){
					this.currentId = tabs[0].category_id;
				}
			},
			//计算右侧栏每个tab的高度等信息
			calcSize(){
				let h = 0;
				this.allCourses.forEach(item=>{
					let view = uni.createSelectorQuery().select(".cart-item");
					view.fields({
						size: true
					}, data => {
						item.top = h;
						h += data.height;
						item.bottom = h;
					}).exec(function(){
						
					});
				})
				this.sizeCalcState = true;
			},
		}
	}
</script>

<style lang='scss'>
	page,
	.content {
		height: 100%;
		background-color: #f8f8f8;
	}

	.content {
		display: flex;
	}
	.left-aside {
		flex-shrink: 0;
		width: 200upx;
		height: 100%;
		background-color: #fff;
		position: sticky;
		top: 0;
	}
	.f-item {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100upx;
		font-size: 28upx;
		color: $font-color-base;
		position: relative;
		&.active{
			color: $base-color;
			background: #f8f8f8;
			&:before{
				content: '';
				position: absolute;
				left: 0;
				top: 50%;
				transform: translateY(-50%);
				height: 36upx;
				width: 8upx;
				background-color: $base-color;
				border-radius: 0 4px 4px 0;
				opacity: .8;
			}
		}
	}

	.right-aside{
		flex: 1;
		overflow: hidden;
	}
	.s-item{
		display: flex;
		align-items: center;
		height: 70upx;
		padding-top: 8upx;
		font-size: 28upx;
		color: $font-color-dark;
	}
	.t-list{
		display: flex;
		flex-wrap: wrap;
		width: 100%;
		background: #fff;
		padding-top: 12upx;
		&:after{
			content: '';
			flex: 99;
			height: 0;
		}
	}
	.t-item{
		flex-shrink: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		width: 176upx;
		font-size: 26upx;
		color: #666;
		padding-bottom: 20upx;
		
		image{
			width: 140upx;
			height: 140upx;
		}
	}
	
	/* 购物车列表项 */
	.cart-item{
		display:flex;
		position:relative;
		padding:10upx 20upx;
		background: #fff;
		margin-bottom: 20upx;
		.image-wrapper{
			width: 230upx;
			height: 230upx;
			image{
				width: 100%;
				height: 100%;
				border-radius:8upx;
			}
		}
		.item-right{
			display:flex;
			flex-direction: column;
			flex: 1;
			overflow: hidden;
			position:relative;
			padding-left: 30upx;
			padding-top: 20upx;
			.title{
				font-size:$font-base - 4upx;
				line-height: 50upx;
			}
			.price{
				font-size:$font-base + 2upx;
				color: $font-color-dark;
				height: 100upx;
				line-height: 100upx;
			}
			.attr{
				font-size: $font-sm + 2upx;
				color: $font-color-light;
				height: 50upx;
				line-height: 50upx;
			}
			.price{
				height: 50upx;
				line-height:50upx;
				color:$uni-color-primary;
			}
		}
		.del-btn{
			padding:4upx 10upx;
			font-size:34upx; 
			height: 50upx;
			color: $font-color-light;
		}
	}
</style>
