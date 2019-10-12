<template>
	<view class="content">
		<view class="row b-b">
			<text class="tit">昵称</text>
			<input class="input" type="text" v-model="user.uname" placeholder="昵称" placeholder-class="placeholder" />
		</view>
		<view class="row b-b">
			<text class="tit">性别</text>
			<view>
				 <radio-group @change="changeSex">
					<label v-for="(item, index) in genders" :key="item.value" class="radio">
						<radio :value="item.value" :checked="item.value==user.sex" />{{item.name}}
					</label>
				</radio-group>
			</view>
		</view>
		<view class="row b-b">
			<text class="tit">孩子名字</text>
			<input class="input" type="text" v-model="user.child_name" placeholder="孩子名字" placeholder-class="placeholder" />
		</view>
		<view class="row b-b">
			<text class="tit">孩子性别</text>
			<view>
				<radio-group @change="changeChildGender">
					<label v-for="(item, index) in genders" :key="item.value" class="radio">
						<radio :value="item.value" :checked="item.value==user.child_gender" />{{item.name}}
					</label>
				</radio-group>
            </view>
		</view>
		<view class="row b-b">
			<text class="tit">孩子生日</text>
			<ruiDatePicker
				fields="day"
				start="2000-00-00"
				end="2030-12-30"
				class="input"
				:value="user.child_birthday"
				@change="birthdayChange"
				@cancel="birthdayCancel"
			></ruiDatePicker>
		</view>
		<button class="add-btn" @click="confirm">提交</button>
	</view>
</template>

<script>
	
	import {mapState,mapMutations} from 'vuex';
	import ruiDatePicker from '@/components/rattenking-dtpicker/rattenking-dtpicker.vue';
	
	export default {
		components: {ruiDatePicker},
		computed: {
			...mapState(['userInfo']),
		},
		data() {
			return {
				user: {},
				genders: [
					{ name: '男', value: 1 },
					{ name: '女', value: 2 },
				]
			}
		},
		onLoad(option){
			this.user = uni.getStorageSync('userInfo') || {}
			if(!this.user){
				uni.navigateTo({
					url: '/pages/public/login'
				})
			}
		},
		methods: {
			birthdayChange: function(val){
				this.user.child_birthday = val
			},
			birthdayCancel: function(val){
				console.log(val)
			},
			changeSex: function(evt) {
				this.user.sex = evt.target.value
				for (let i = 0; i < this.genders.length; i++) {
					if (this.genders[i].value === evt.target.value) {
						//this.current = i;
						break;
					}
				}
			},
			changeChildGender: function(evt) {
				this.user.child_gender = evt.target.value
				for (let i = 0; i < this.genders.length; i++) {
					if (this.genders[i].value === evt.target.value) {
						this.current = i;
						break;
					}
				}
			},
			//提交
			confirm(){
				let data = {
					uname: this.user.uname,
					sex: this.user.sex,
					child_name: this.user.child_name,
					child_gender: this.user.child_gender,
				}
				if(!this.$api.match.notEmpty(data.uname)){
					this.$api.msg('请填写昵称');
					return;
				}
				if(!this.$api.match.inArray(data.sex, [1,2])){
					this.$api.msg('请选择正确的性别');
					return;
				}
				if(!this.$api.match.notEmpty(data.child_name)){
					this.$api.msg('请填写孩子姓名');
					return;
				}
				if(!this.$api.match.inArray(data.child_gender, [1,2])){
					this.$api.msg('孩子性别格式有误');
					return;
				}
				
				this.$api.saveUser(this.$store.state, data)
			},
		}
	}
</script>

<style lang="scss">
	page{
		background: $page-color-base;
		padding-top: 16upx;
	}
	.icon-calendar{
		height: 40upx;
		width: 40upx;
	}
	.radio{
		padding-right: 20upx;
	}
	.row{
		display: flex;
		align-items: center;
		position: relative;
		padding:0 30upx;
		height: 110upx;
		background: #fff;
		
		.tit{
			flex-shrink: 0;
			width: 180upx;
			font-size: 30upx;
			color: $font-color-dark;
		}
		.input{
			flex: 1;
			font-size: 30upx;
			color: $font-color-dark;
		}
		.icon-shouhuodizhi{
			font-size: 36upx;
			color: $font-color-light;
		}
	}
	.default-row{
		margin-top: 16upx;
		.tit{
			flex: 1;
		}
		switch{
			transform: translateX(16upx) scale(.9);
		}
	}
	.add-btn{
		display: flex;
		align-items: center;
		justify-content: center;
		width: 690upx;
		height: 80upx;
		margin: 60upx auto;
		font-size: $font-lg;
		color: #fff;
		background-color: $base-color;
		border-radius: 10upx;
		box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
	}
</style>
