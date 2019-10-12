<template>
<view class="container" :style="'display: ' + toggle">
    <view class="prize-wrap">
        <image class="prize" src="https://eduline.sozxw.com/assets/miniapp/cclive/img/live/player/prize/prize.png"></image>
        <view class="prize-text-wrap">
            <view class="prize-text" :style="'display: ' + prizeDate.result?'none':'block'">恭喜<text class="name">{{prizeDate.viewerName}}</text>获得奖杯</view>
            <view class="prize-text" :style="'display: ' + prizeDate.result?'block':'none'">太棒了，恭喜你获得奖杯</view>
        </view>
    </view>
</view>
</template>
<script>

export default {
  data() {
    return {
      toggle: "none"
    };
  },

  components: {},
  props: {
	  prizeDate: {
	    type: Object,
	    value: "",
	  
	    observer(newVal) {
	      if (newVal) {
	        this.showPrize();
	      }
	    }
	  
	  }
  },
  methods: {

    /**
     * 组件的方法列表
     */
      showPrize() {
        this.setData({
          toggle: "flex"
        });
        setTimeout(() => {
          this.setData({
            toggle: "none"
          });
          console.log(this);
          this.hidePrize();
        }, 2500);
      },

      hidePrize() {
        this.$emit("hideprize", {}, {});
    },
    setData: function (obj) {
      let that = this;
      let keys = [];
      let val, data;
      Object.keys(obj).forEach(function (key) {
        keys = key.split('.');
        val = obj[key];
        data = that.$data;
        keys.forEach(function (key2, index) {
          if (index + 1 == keys.length) {
            that.$set(data, key2, val);
          } else {
            if (!data[key2]) {
              that.$set(data, key2, {});
            }
          }

          data = data[key2];
        });
      });
    }
  },
  computed: {},
  watch: {}
};
</script>
<style>
.container {
    position: absolute;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
}

.container .prize-wrap {
    width: 500rpx;
    height: 584rpx;
    text-align: center;
}

.container .prize-wrap .prize {
    width: 500rpx;
    height: 454rpx;
}

.container .prize-wrap .prize-text-wrap {
    display: inline-block;
    padding: 5rpx 38rpx;
    height: 60rpx;
    background: rgba(0, 0, 0, 0.3);
    border-radius: 40rpx;
    margin-top: 24rpx;
}

.container .prize-wrap .prize-text-wrap .prize-text {
    height: 40rpx;
    font-size: 28rpx;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
    line-height: 60rpx;
    text-align: center;
}

.container .prize-wrap .prize-text-wrap .prize-text .name {
    display: inline-block;
    color: #F58833;
    max-width: 246rpx;
    height: 42rpx;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>