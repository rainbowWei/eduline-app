<template>
	<view class="container">
		<view class="left-bottom-sign"></view>
		<view class="right-top-sign"></view>
		<!-- 设置白色背景防止软键盘把下部绝对定位元素顶上来盖住输入框等 -->
		<view class="wrapper">
			<view class="left-top-sign">LOGIN</view>
			<view class="welcome">
				绑定手机号！
			</view>
			<view class="input-content">
				<view class="input-item">
					<text class="tit">手机号码</text>
					<input 
						type="number" 
						:value="mobile" 
						placeholder="请输入手机号码"
						maxlength="11"
						data-key="mobile"
						@input="inputChange"
					/>
				</view>
				<view class="valid-input-item">
					<text class="tit">验证码</text>
					<input 
						type="number" 
						placeholder="请获取验证码"
						placeholder-class="input-empty"
						maxlength="20"
						data-key="code"
						@input="inputChange"
						@confirm="toLogin"
					/>
					<button type="warn" size="mini" @click="gainCode" :disabled="sending" >获取验证码</button>
				</view>
			</view>
			<button class="confirm-btn" @click="toLogin" :disabled="logining">提交</button>
		</view>
	</view>
</template>

<script>

	import {mapState,mapMutations, mapActions} from 'vuex';
	
	export default{
		data(){
			return {
				mobile: '',
				code: 0,
				logining: false,
				sending: false
			}
		},
		computed:{
			...mapState(["openInfo"]),
		},
		onLoad(){
			// #ifdef MP-WEIXIN
			wx.clearStorage()
			// #endif
			this.$store.dispatch('doLogin')
		},
		methods: {
			...mapMutations(['login']),
			...mapActions(['bind']),
			inputChange(e){
				const key = e.currentTarget.dataset.key;
				this[key] = e.detail.value;
			},
			navBack(){
				uni.navigateBack();
			},
			gainCode(){
				this.sending = true
				this.$api.gainCode(this.mobile)
				setTimeout(()=>{
					this.sending = true
				}, 60000)
			},
			toLogin(){
				const {mobile, code} = this;
				if( !this.$api.match.phone(mobile) ){
					this.$api.msg('电话输入有误');
					return;
				}
				if (!this.$api.match.notEmpty(code)){
					this.$api.msg('验证码不能为空');
					return;
				}
				let openInfo = uni.getStorageSync('openInfo')
				const sendData = {
					mobile: mobile,
					code: code,
					open_id: openInfo.openid,
					session_key: openInfo.session_key,
				};
				this.bind(sendData);
			}
		},

	}
</script>

<style lang='scss'>
	page{
		background: #fff;
	}
	.container{
		padding-top: 115px;
		position:relative;
		width: 100vw;
		height: 100vh;
		overflow: hidden;
		background: #fff;
	}
	.wrapper{
		position:relative;
		z-index: 90;
		background: #fff;
		padding-bottom: 40upx;
	}
	.back-btn{
		position:absolute;
		left: 40upx;
		z-index: 9999;
		padding-top: var(--status-bar-height);
		top: 40upx;
		font-size: 40upx;
		color: $font-color-dark;
	}
	.left-top-sign{
		font-size: 120upx;
		color: $page-color-base;
		position:relative;
		left: -16upx;
	}
	.right-top-sign{
		position:absolute;
		top: 80upx;
		right: -30upx;
		z-index: 95;
		&:before, &:after{
			display:block;
			content:"";
			width: 400upx;
			height: 80upx;
			background: #b4f3e2;
		}
		&:before{
			transform: rotate(50deg);
			border-radius: 0 50px 0 0;
		}
		&:after{
			position: absolute;
			right: -198upx;
			top: 0;
			transform: rotate(-50deg);
			border-radius: 50px 0 0 0;
			/* background: pink; */
		}
	}
	.left-bottom-sign{
		position:absolute;
		left: -270upx;
		bottom: -320upx;
		border: 100upx solid #d0d1fd;
		border-radius: 50%;
		padding: 180upx;
	}
	.welcome{
		position:relative;
		left: 50upx;
		top: -90upx;
		font-size: 46upx;
		color: #555;
		text-shadow: 1px 0px 1px rgba(0,0,0,.3);
	}
	.input-content{
		padding: 0 60upx;
	}
	.input-item{
		display:flex;
		flex-direction: column;
		align-items:flex-start;
		justify-content: center;
		padding: 0 30upx;
		background:$page-color-light;
		height: 120upx;
		border-radius: 4px;
		margin-bottom: 50upx;
		&:last-child{
			margin-bottom: 0;
		}
		.tit{
			height: 50upx;
			line-height: 56upx;
			font-size: $font-sm+2upx;
			color: $font-color-base;
		}
		input{
			height: 60upx;
			font-size: $font-base + 2upx;
			color: $font-color-dark;
			width: 100%;
		}	
	}
	.valid-input-item{
		display:flex;
		align-items:flex-start;
		justify-content: center;
		padding: 32upx 20upx;
		background:$page-color-light;
		height: 120upx;
		border-radius: 4px;
		margin-bottom: 50upx;
		&:last-child{
			margin-bottom: 0;
		}
		.tit{
			height: 50upx;
			line-height: 56upx;
			font-size: $font-base+2upx;
			color: $font-color-base;
		}
		input{
			height: 60upx;
			padding-left: 10upx;
			font-size: $font-base + 2upx;
			color: $font-color-dark;
			width: 50%;
		}	
		button{
			font-size: $font-sm+2upx;
			height: 60upx;
			line-height: 60upx;
		}
	}
	
	.confirm-btn{
		width: 630upx;
		height: 76upx;
		line-height: 76upx;
		border-radius: 50px;
		margin-top: 70upx;
		background: $uni-color-primary;
		color: #fff;
		font-size: $font-lg;
		&:after{
			border-radius: 100px;
		}
	}
	.forget-section{
		font-size: $font-sm+2upx;
		color: $font-color-spec;
		text-align: center;
		margin-top: 40upx;
	}
	.register-section{
		position:absolute;
		left: 0;
		bottom: 50upx;
		width: 100%;
		font-size: $font-sm+2upx;
		color: $font-color-base;
		text-align: center;
		text{
			color: $font-color-spec;
			margin-left: 10upx;
		}
	}
</style>
