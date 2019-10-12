<template>
	<view>
		<view class="evalution">
			<view class="eva-list" >
				<view  v-for="(item, index) in allQuestions" :key="index"
					class="eva-item"
				>
					<view class="eva-left">
						<image :src="item.user.head" mode="aspectFill"></image>
						<text>{{item.user.uname}}</text>
					</view>
					<view class="eva-right" @click="navigateTo('/pages/thinkTank/detail?id='+item.id)">
						<text>{{item.wd_title}}</text>
						<text>{{item.ctime}}</text>
						<text class="content">{{item.wd_description}}</text>
					</view>
				</view>
				<uni-load-more :status="loadingType"></uni-load-more>
			</view>
		</view>
	</view>
</template>

<script>
	import {mapState,mapMutations, mapActions} from 'vuex'
	
	export default {
		data() {
			return {
				loadingType: 'more', //加载更多状态
				params: {
					p: 1
				}
			};
		},
		computed:{
			...mapState(['allQuestions']),
		},
		onLoad(){
			this.$store.commit('setState', 'allQuestions', []);
			this.$store.dispatch('getAllQuestions', this.params);
		},
		onPullDownRefresh(){
			this.loadData('refresh');
		},
		onReachBottom(){
			this.loadData();
		},
		methods:{
			...mapActions(['getAllQuestions']),
			//加载商品 ，带下拉刷新和上滑加载
			loadData(type='add', loading) {
				this.computedPage(type);
				if( 'nomore' == this.loadingType){
					return;
				}
				let questionCount = this.allQuestions.length;
				this.getAllQuestions(this.params);
				
				this.loadingType  = questionCount == this.allQuestions.length ? 'nomore' : 'more';
				if(type === 'refresh'){
					if(loading == 1){
						uni.hideLoading()
					}else{
						uni.stopPullDownRefresh();
					}
				}
			},
			computedPage(type){
				if(type === 'add'){
					if(this.loadingType === 'nomore'){
						return;
					}
					this.loadingType = 'loading';
				}else{
					this.loadingType = 'more'
				}
				this.params.p += 1;
				if(type === 'refresh'){
					this.params.p = 1;
					this.$store.commit('setState', 'allQuestions', []);
				}
			}
		},
		
	}
</script>

<style lang="scss">
	page{
		background: $page-color-base;
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
		margin: 16upx;
		padding: 40upx 0;
	}

	.eva-item{
		display:flex;
		padding: 20upx 40upx;
		max-height: 380upx;
		border-bottom: 1px solid #eee;
		image{
			width: 60upx;
			height: 60upx;
			border-radius: 50px;
			flex-shrink: 0;
			margin-right: 24upx;
		}
	}
	.eva-left{
		display:flex;
		flex-direction:column;
		flex: 0.2;
		font-size: $font-sm + 2upx;
		color: $font-color-light;
		position:relative;
		padding-left: 10upx;
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
			display:-webkit-box;  
			-webkit-box-orient:vertical;  
			-webkit-line-clamp:3;  
			overflow:hidden;  
		}
	}
</style>
