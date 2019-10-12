<template>
<view>
<button @tap="toggleParctice" class="toggle-parctice">显/隐随堂测</button>
<view class="container" :style="'display: ' + toggleContainer">
    <button @tap="getPracticeInfo">获取随堂测信息</button>
    <button @tap="submitPractice">提交随堂测</button>
    <button @tap="getPracticeStatis">获取随堂测统计信息</button>
    <button @tap="getPracticeRank">获取排名数据</button>
    <view class="options">
        <view v-if="practice.type == 1">
            单选
            <radio-group class="radio-group" bindchange="radioChange">
                <label class="radio" v-for="(item, index) in practice.options" :key="index">
                    <radio :value="item.id"></radio>
                    {{item.index}}
                </label>
            </radio-group>
        </view>
        <view v-if="practice.type == 2">
            多选
            <checkbox-group bindchange="checkboxChange">
                <label class="checkbox" v-for="(item, index) in practice.options" :key="index">
                    <checkbox :value="item.id"></checkbox>
                    {{item.index}}
                </label>
            </checkbox-group>
        </view>
    </view>
</view>
</view>
</template>
<script>
var cc = getApp().globalData.ccsdk; // components/live/practice/practice.js

export default {
  data() {
    return {
      practiceId: "XXXX2345",
      toggleContainer: "none",
      practice: "",
      options: ""
    };
  },

  components: {},
  props: {},
  methods: {
    /**
     * 组件的属性列表
     */
    properties: {},

    /**
     * 组件的方法列表
     */
    methods: {
      toggleParctice: function () {
        if (this.toggleContainer === "none") {
          this.setData({
            toggleContainer: "block"
          });
        } else {
          this.setData({
            toggleContainer: "none"
          });
        }
      },
      getPracticeInfo: function () {
        var self = this; //获取随堂测信息接口API

        cc.live.getPracticeInfo({
          practiceId: this.practiceId,
          success: function (res) {
            console.log("getPracticeInfo success", this.datas);
            wx.showModal({
              title: "获取随堂测信息接口API",
              content: JSON.stringify(this.datas),
              showCancel: false
            });
            self.setData({
              practice: this.datas.practice
            });
          },
          fail: function (error) {
            console.log("getPracticeInfo fail", error);
          }
        });
      },
      checkboxChange: function (e) {
        console.log("checkbox发生change事件，携带value值为：", e.detail.value);
        var options = "";
        var values = e.detail.value;

        for (var i = 0; i < values.length; i++) {
          options += values[i] + ",";
        }

        options.trim();
        options = options.substr(0, options.length - 1);
        this.setData({
          options: options
        });
      },
      radioChange: function (e) {
        console.log("radio发生change事件，携带value值为：", e.detail.value);
        this.setData({
          options: e.detail.value
        });
      },
      uniq: function (array) {
        var temp = []; //一个新的临时数组

        for (var i = 0; i < array.length; i++) {
          if (temp.indexOf(array[i]) == -1) {
            temp.push(array[i]);
          }
        }

        return temp;
      },
      submitPractice: function () {
        var self = this;
        var options = this.options; //提交随堂测接口API

        cc.live.submitPractice({
          practiceId: this.practiceId,
          options: options,
          success: function (res) {
            console.log("submitPractice success", this.datas);
            wx.showModal({
              title: "提交随堂测接口API",
              content: JSON.stringify(this.datas),
              showCancel: false
            });
          },
          fail: function (error) {
            console.log("submitPractice fail", error);
          }
        });
      },
      getPracticeStatis: function () {
        var self = this; //获取随堂测统计信息接口API

        cc.live.getPracticeStatis({
          practiceId: this.practiceId,
          success: function (res) {
            console.log("getPracticeStatis success", this.datas);
            wx.showModal({
              title: "获取随堂测统计信息接口API",
              content: JSON.stringify(this.datas),
              showCancel: false
            });
          },
          fail: function (error) {
            console.log("getPracticeStatis fail", error);
          }
        });
      },
      getPracticeRank: function () {
        var self = this; //获取排名数据接口API

        cc.live.getPracticeRank({
          practiceId: this.practiceId,
          success: function (res) {
            console.log("getPracticeRank success", this.datas);
            wx.showModal({
              title: "获取排名数据接口API",
              content: JSON.stringify(this.datas),
              showCancel: false
            });
          },
          fail: function (error) {
            console.log("getPracticeRank fail", error);
          }
        });
      }
    },
    ready: function () {
      var self = this; //发布随堂测事件

      cc.live.on("practice_publish", function (data) {
        console.log("practice_publish", data);

        var _data = JSON.parse(data);

        self.setData({
          practiceId: _data.practiceId
        });
        wx.showModal({
          title: "发布随堂测",
          content: JSON.stringify(data),
          showCancel: false
        });
        self.setData({
          options: ""
        });
      }); //停止随堂测事件

      cc.live.on("practice_stop", function (data) {
        console.log("practice_stop", data);

        var _data = JSON.parse(data);

        self.setData({
          practiceId: _data.practiceId
        });
        wx.showModal({
          title: "停止随堂测",
          content: JSON.stringify(data),
          showCancel: false
        });
      }); //关闭随堂测事件

      cc.live.on("practice_close", function (data) {
        console.log("practice_close", data);

        var _data = JSON.parse(data);

        self.setData({
          practiceId: _data.practiceId
        });
        wx.showModal({
          title: "关闭随堂测",
          content: JSON.stringify(data),
          showCancel: false
        });
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
    }
  },
  computed: {},
  watch: {}
};
</script>
<style>
/* components/live/practice/practice.css */
.container{
    position: fixed;
    top:50%;
    left: 100px;
    z-index: 999;
    height: 200px;
    overflow: auto;
}

.toggle-parctice{
    position: fixed;
    top:45%;
    left: 100px;
    z-index: 999;
}
</style>