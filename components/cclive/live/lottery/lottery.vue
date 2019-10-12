<template>
<view class="container" :style="'display: ' + toggle">
    <view class="header">
        <view class="lottery">
            <text class="lottery-text">抽奖啦</text>
        </view>
        <view class="close" @tap="bindClose">
            <image class="close-image" src="https://eduline.sozxw.com/assets/miniapp/cclive/img/live/player/lottery/close.png"></image>
        </view>
    </view>
    <view class="body">
        <text class="prize-text">{{prizeText}}</text>
        <view class="prize">
            <rich-text class="rich-text" :nodes="prize"></rich-text>
            <text>{{winText}}</text>
        </view>
        <text class="prize-info">{{prizeInfo}}</text>
    </view>
</view>

</template>
<script>
var cc = requirePlugin('ccsdk');

export default {
  data() {
    return {
      isWin: false,
      prize: [],
      prizeText: "",
      prizeInfo: "",
      winText: "",
      winClass: "",
	  currentViewerId: this.viewerId,
    };
  },

  components: {},
  props: {
	    viewerId: {
	      type: String,
	      value: ""
	    }
  },
  methods: {
    /**
     * 组件的方法列表
     */
      bindClose: function () {
        this.$emit("close", {}, {});
      },
      startLottery: function () {
        this.setData({
          prize: [{
            name: "img",
            attrs: {
              // src: "https://eduline.sozxw.com/assets/miniapp/cclive/img/live/player/lottery/prize.gif",
              src: "https://static.csslcloud.net/img/lottery/prize.gif",
              style: "width:227px;height:149px;background-color:#FFE1E1"
            }
          }],
          prizeText: "",
          prizeInfo: "",
          winText: "",
          winClass: "",
          isWin: false
        });
        this.$emit("startlottery", {}, {});
      },
      winLottery: function (num) {
        this.setData({
          prize: [{
            name: "img",
            attrs: {
              // src: "/static/cclive/img/live/player/lottery/win_lottery.png",
              src: "https://static.csslcloud.net/img/lottery/win_lottery.png",
              style: "width:237px;height:118px;"
            }
          }],
          prizeText: "恭喜您中奖啦！",
          prizeInfo: "请牢记您的中奖码",
          winText: num,
          winClass: "win-text",
          isWin: true
        });
        this.$emit("winlottery", {}, {});
      },
      missLottery: function (name) {
        this.setData({
          prize: [{
            name: "img",
            attrs: {
              // src: "/static/cclive/img/live/player/lottery/miss_lottery.png",
              src: "https://static.csslcloud.net/img/lottery/miss_lottery.png",
              style: "width:237px;height:118px;"
            }
          }],
          prizeText: "哎呀，就差一点！",
          prizeInfo: "中奖者",
          winText: name,
          winClass: "miss-text"
        });
        this.$emit("misslottery", {}, {});
      },
      stopLottery: function () {}
    },
    ready: function () {
      var self = this;
      cc.live.on("start_lottery", function (data) {
        console.log("start_lottery", data);

        var _data = JSON.parse(data);

        self.startLottery();
      });
      cc.live.on("win_lottery", function (data) {
        console.log("win_lottery", data);

        var _data = JSON.parse(data);

        if (_data.viewerId === this.currentViewerId) {
          self.winLottery(_data.lotteryCode);
        } else {
          if (!this.isWin) {
            self.missLottery(_data.viewerName);
          }
        }
      });
      cc.live.on("stop_lottery", function (data) {
        console.log("stop_lottery", data);
        self.stopLottery();
      });
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
  },
  computed: {},
  watch: {}
};
</script>
<style>
/* components/live/lottery/lottery.css */
.container {
    background-color: #FFFFFF;
    height: 100%;
    width: 100%;
}

.container .header {
    height: 40px;
    box-shadow: 1px 1px 10px #eeeeee;
    line-height: 40px;
}

.container .header .lottery {
    width: 46px;
    height: 16px;
    margin: 0 auto;
}

.container .header .lottery .lottery-text {
    color: #38404B;
    font-size: 15px;
}

.container .header .close {
    position: absolute;
    right: 10px;
    top: 6px;
}

.container .header .close .close-image {
    width: 28px;
    height: 28px;
}

.container .body {
    height: 83%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
}

.container .body .prize-text {
    margin-bottom: 25px;
    color: #FF412E;
    font-size: 17px;
}

.container .body .prize {
    width: 227px;
    height: 124px;
    position: relative;
    text-align: center;
    line-height: 124px;
}

.container .body .prize .rich-text {

}

.container .body .prize .win-text {
    position: relative;
    top: -175px;
    color: #FF412E;
    font-size: 36px;
}

.container .body .prize .miss-text {
    color: #38404B;
    font-size: 18px;
    position: relative;
    top: -175px;
}

.container .body .prize-info {
    margin-top: 20px;
    color: #79808B;
    font-size: 14px;
}


</style>