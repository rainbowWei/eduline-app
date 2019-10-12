<template>
<view class="container">
    <!-- player -->
    <view class="player">
        <!-- 直播文档 -->
        <view :style="'display: ' + toggleDocument" class :class="fullDocument" v-if="pdfView" @click="bindDocuemntFullScreen">

            <drawingboard :style="'position: relative;top:' + documentTop" :width="fullDocument?'100%':dbWidth" :height="fullDocument?documentHeight:dbHeight" v-if="dbView">
                <!--网络链接信息-->
                <cover-view class="net-info" :style="'display: ' + netConnectState.toggle&&switchPip[0]===''?'block':'none'">
                    <cover-view class="info" :style="'color: ' + netConnectState.state?'#00d449':'red'">
                        {{netConnectState.info}}
                    </cover-view>
                </cover-view>
                <cover-view class="cover" :style="'display:' + toggleCover[0]?'flex':'none' + ';background-color:' + isPublishing==1&&!isBan?'none':'black' + ';'">
                    <!-- 直播中 -->
                    <cover-view class="living" :style="'display:' + living?'flex':'none'" @click="catchLiving">
                        <cover-view class="living-box">
                            <cover-view class="circle"></cover-view>
                            <cover-view class="text">直播中</cover-view>
                        </cover-view>
                    </cover-view>
                    <!-- 用户交互 -->
                    <cover-view class="controls" :style="'display:' + toggleControls?'block':'none'" @click="catchControls">
                        <cover-view class="top" @click="catchNotice">
                            <cover-view class="notice-btn">
                                <cover-image src="https://eduline.sozxw.com/assets/miniapp/cclive/img/live/player/announcement.png"></cover-image>
                            </cover-view>
                        </cover-view>
                        <cover-view class="center">
                            <cover-view class="hint" :style="'display:' + hintLiveNot?'block':'none'">
                                {{hintLiveNotText}}
                            </cover-view>
                            <cover-view :style="'display: ' + toggleDocumentFullScreen?'block':'none'" class="document-full-screen" @click="bindDocuemntFullScreen">
                                <cover-image src="https://eduline.sozxw.com/assets/miniapp/cclive/img/live/player/full-screen.png"></cover-image>
                            </cover-view>
                            <cover-view class="btn-group">
                                <cover-view class="btn" @click="bindSwitchoverFullScreen">
                                    <cover-image :src="'https://eduline.sozxw.com/assets/miniapp/cclive/img/live/player/' + btnSwitchoverFullScreen + '.png'"></cover-image>
                                </cover-view>
                                <cover-view class="btn" @click="bindTogglePlayerLiveMode">
                                    <cover-image :src="'https://eduline.sozxw.com/assets/miniapp/cclive/img/live/player/' + btnTogglePlayerLiveMode + '.png'"></cover-image>
                                </cover-view>
                                <cover-view class="btn" @click="bindToggleSelectRoute">
                                    <cover-image src="https://eduline.sozxw.com/assets/miniapp/cclive/img/live/player/switch-router.png" class="btn"></cover-image>
                                </cover-view>
                            </cover-view>
                        </cover-view>
                        <cover-view class="bottom">
                            <cover-view class="online-peoples">
                                <cover-view class="people-box">
                                    <cover-image src="https://eduline.sozxw.com/assets/miniapp/cclive/img/live/player/people.png" class="people"></cover-image>
                                </cover-view>
                                <cover-view class="number">{{peoples}}</cover-view>
                            </cover-view>
                        </cover-view>
                    </cover-view>
                    <!-- 切换线路 -->
                    <cover-view class="switch-router" :style="'display:' + toggleSelectRoute?'block':'none'">
                        <cover-view class="switch-router-select">
                            <cover-view class="switch-router-option" :class="RouteOptionActive===index?'active':''" v-for="(item, index) in options" :key="index" wx:for-index="index" :data-index="index" @click="bindSelectRoute">
                                {{item}}
                            </cover-view>
                        </cover-view>
                    </cover-view>
                    <!-- 公告 -->
                    <cover-view class="notice-container" :style="'width:' + toggleNotice?'100%':'0' + 'rpx;height:' + toggleNotice?'422':'0' + 'rpx'">
                        <cover-view class="notice">
                            <cover-view class="head">
                                <cover-image src="https://eduline.sozxw.com/assets/miniapp/cclive/img/live/player/notice-head.png"></cover-image>
                                <cover-view class="text">直播公告</cover-view>
                            </cover-view>
                            <cover-view class="content">
                                <cover-view class="text">{{announcement}}</cover-view>
                            </cover-view>
                            <cover-view class="close" @click="catchCloseNotice">
                                <cover-image src="https://eduline.sozxw.com/assets/miniapp/cclive/img/live/player/notice-close.png"></cover-image>
                            </cover-view>
                        </cover-view>
                    </cover-view>
                </cover-view>
            </drawingboard>

        </view>
        <!-- 直播播放器 -->
        <view class="live" :class="switchPip[2]" :style="'display:' + playerView?'block':'none'">
            <live-player @touchstart="bindTouchStart" @touchend="bindTouchEnd" @click="bindDoubleTap" :min-cache="minCache" :max-cache="maxCache" id="player" :src="playerUrl" mode="live" autoplay :object-fit="objectFit" :orientation="orientation" @fullscreenchange="bindFullScreenChange" @statechange="statechange" @netstatus="netstatus">
                <!--网络链接信息-->
                <cover-view class="net-info" :style="'display: ' + netConnectState.toggle&&switchPip[0]!==''?'block':'none'">
                    <cover-view class="info" :style="'color: ' + netConnectState.state?'#00d449':'red'">
                        {{netConnectState.info}}
                    </cover-view>
                </cover-view>
                <cover-view class="exit-full-screen" @click="bindExitFullScreen" v-if="toggleExitFullScreenBtn">
                    <cover-image src="https://eduline.sozxw.com/assets/miniapp/cclive/img/live/player/full-screen.png"></cover-image>
                </cover-view>
                <cover-view class="cover" v-if="toggleCover[1]">
                    <!-- 直播中 -->
                    <cover-view class="living" v-if="living" @click="catchLiving">
                        <cover-view class="living-box">
                            <cover-view class="circle"></cover-view>
                            <cover-view class="text">直播中</cover-view>
                        </cover-view>
                    </cover-view>
                    <!-- 切换线路 -->
                    <cover-view class="switch-router" v-if="toggleSelectRoute">
                        <cover-view class="switch-router-select">
                            <cover-view class="switch-router-option" :class="RouteOptionActive===index?'active':''" v-for="(item, index) in options" :key="index" wx:for-index="index" :data-index="index" @click="bindSelectRoute">
                                {{item}}
                            </cover-view>
                        </cover-view>
                    </cover-view>
                    <!-- 公告 -->
                    <cover-view class="notice-container" v-if="toggleNotice">
                        <cover-view class="notice">
                            <cover-view class="head">
                                <cover-image src="https://eduline.sozxw.com/assets/miniapp/cclive/img/live/player/notice-head.png"></cover-image>
                                <cover-view class="text">直播公告</cover-view>
                            </cover-view>
                            <cover-view class="content">
                                <cover-view class="text">{{announcement}}</cover-view>
                            </cover-view>
                            <cover-view class="close" @click="catchCloseNotice">
                                <cover-image src="https://eduline.sozxw.com/assets/miniapp/cclive/img/live/player/notice-close.png"></cover-image>
                            </cover-view>
                        </cover-view>
                    </cover-view>
                    <!-- 用户交互 -->
                    <cover-view class="controls" v-if="toggleControls" @click="catchControls">
                        <!-- 音频模式 -->
                        <cover-view class="audio-mode" v-if="audioMode">
                            <cover-image class="audio-mode-image" src="https://eduline.sozxw.com/assets/miniapp/cclive/img/live/player/audioMode.png"></cover-image>
                            <cover-view class="text">音频模式</cover-view>
                        </cover-view>
                        <cover-view class="top" @click="catchNotice">
                            <cover-view class="notice-btn">
                                <cover-image src="https://eduline.sozxw.com/assets/miniapp/cclive/img/live/player/announcement.png"></cover-image>
                            </cover-view>
                        </cover-view>
                        <cover-view class="center">
                            <cover-view class="hint" v-if="hintLiveNot">
                                {{hintLiveNotText}}
                            </cover-view>
                            <cover-view class="btn-group" v-if="btnGroup">
                                <cover-view class="btn" @click="bindSwitchoverFullScreen">
                                    <cover-image :src="'https://eduline.sozxw.com/assets/miniapp/cclive/img/live/player/' + btnSwitchoverFullScreen + '.png'"></cover-image>
                                </cover-view>
                                <cover-view class="btn" @click="bindTogglePlayerLiveMode" :style="'display: ' + pdfView?'block':'none' + ';'">
                                    <cover-image :src="'https://eduline.sozxw.com/assets/miniapp/cclive/img/live/player/' + btnTogglePlayerLiveMode + '.png'"></cover-image>
                                </cover-view>
                                <cover-view class="btn" @click="bindToggleSelectRoute">
                                    <cover-image src="https://eduline.sozxw.com/assets/miniapp/cclive/img/live/player/switch-router.png"></cover-image>
                                </cover-view>
                            </cover-view>
                        </cover-view>
                        <cover-view class="bottom">
                            <cover-view class="online-peoples">
                                <cover-view class="people-box">
                                    <cover-image src="https://eduline.sozxw.com/assets/miniapp/cclive/img/live/player/people.png" class="people"></cover-image>
                                </cover-view>
                                <cover-view class="number">{{peoples}}</cover-view>
                            </cover-view>
                        </cover-view>
                    </cover-view>
                </cover-view>
            </live-player>
        </view>
    
	</view>
    <!-- chat -->
    <view class="chat">
        <!-- tab切换 -->
        <view class="tab">
            <view v-for="(item, key) in tabContent" :key="key" class="option" @click="bindTab(key)" style="z-index: 999;">
                <text>{{item}}</text>
                <view class="border" :class="tabOptionSelected==index?'active':''"></view>
            </view>
        </view>
        <!-- swiper -->
        <swiper class="swiper" >
            <swiper-item class="chat" v-if="tabOptionSelected==0">
                <!-- 聊天内容 -->
                <view class="content">
                    <scroll-view scroll-y  :scroll-with-animation="true" lower-threshold="10" :scroll-into-view="toChat">
                        <!-- 聊天信息 -->
                        <view class="message-box" :class="message[index].type?'message-box-right':''" v-for="(item, index) in message" :key="index" wx:for-index="index" :id="index==(chatLength-1)?'lastChat':''" v-if="message[index].status=='1'?false:true">
                            <view class="left">
                                <view class="image-box" :class="message[index].type?'image-box-right':''">
                                    <image src="https://eduline.sozxw.com/assets/miniapp/cclive/img/live/player/header.png"></image>
                                </view>
                            </view>
                            <view class="right">
                                <view class="name-box" :class="message[index].type?'name-box-right':''">
                                    <text>{{message[index].name}}</text>
                                </view>
                                <view class="msg-box" :class="message[index].type?'msg-box-right':''">
                                    <rich-text :nodes="message[index].msg"></rich-text>
                                </view>
                            </view>
                        </view>

                    </scroll-view>
                </view>
                <!-- 聊天输入框 -->
                <view class="input">
                    <view class="input-box">
                        <input :disabled="!netConnectState.state" :placeholder="netConnectState.state?'请输入文字':'网络已断开，无法输入聊天'" :value="chatMsg" :adjust-position="adjustPosition" @focus="bindChatInputFocus" @blur="bindChatInputBlur" @input="bindChatInput"></input>
                        <image :src="'https://eduline.sozxw.com/assets/miniapp/cclive/img/live/player/' + emoji + '.png'" @click="bindToggleEmoji"></image>
                    </view>
                    <view class="send">
                        <view class="btn" @click="bindSendPublicChatMsg">发送</view>
                    </view>
                </view>
                <!-- 键盘抬起输入框 -->
                <view :style="'height:' + topChatInputHeight + 'px'"></view>
                <!-- 表情 -->
                <view class="emoji" v-show="toggleEmoji">
                    <view class="emoji-row" v-for="(row, index) in emojiRow" :key="index" wx:for-index="i">
                        <view class="emoji-col" v-for="(col, index2) in emojiCol[row]" :key="index2" wx:for-index="j">
                            <view class="emoji-box" @click="bindEmoji" :data-index="col">
                                <image :src="'https://eduline.sozxw.com/assets/miniapp/cclive/img/live/player/emoji/chat_em_face' + col + '@2X.png'"></image>
                            </view>
                        </view>
                    </view>
                </view>
                <!-- 私聊 -->
                <view class="privateChat">
                </view>
            </swiper-item>
            <swiper-item class="catechism" v-if="tabOptionSelected==1">
                <!-- 问答内容展示 -->
                <view class="content">
                    <scroll-view scroll-y @scroll="bindQuestionAnswerScroll" @scrolltolower="bindQuestionAnswerScrollTolower" lower-threshold="10" :scroll-into-view="toQuestionAnswer">
                        <view class="catechism-box" v-for="(qt, index) in questions" :key="index" wx:for-index="i" :id="i==(questionAnswerLength-1)?'lastQuestionAnswer':''" v-if="(qt.type==1?true:toggleShowQuestion)&&qt.display">
                            <view class="left">
                                <view class="image-box">
                                    <image src="https://eduline.sozxw.com/assets/miniapp/cclive/img/live/player/header.png"></image>
                                </view>
                            </view>
                            <view class="right">
                                <view class="name-box">
                                    <text class="name">{{qt.name}}</text>
                                    <text class="time">{{qt.time}}</text>
                                </view>
                                <view class="question-box">
                                    <text>{{qt.question}}</text>
                                </view>
                                <view class="answers">
                                    <view class="answer-box" v-for="(as, index) in qt.answers" :key="index" wx:for-index="j" v-if="as.isPrivate===0">
                                        <text class="name">{{as.name}}:</text>
                                        <text class="answer">{{as.answer}}</text>
                                    </view>
                                </view>
                            </view>
                        </view>
                    </scroll-view>
                </view>
                <!-- 问答输入框 -->
                <view class="input">
                    <view class="input-box">
                        <view class="show" @click="bindShowQuestion">
                            <view class="hint-show-question" v-if="toggleHintShowQuestion">
                                <view class="hint-box">
                                    <text>{{hintShowQuestion}}</text>
                                </view>
                                <view class="triangle"></view>
                            </view>
                            <image :src="'https://eduline.sozxw.com/assets/miniapp/cclive/img/live/player/' + eye + '.png'"></image>
                        </view>
                        <input :disabled="!netConnectState.state" :placeholder="netConnectState.state?'请输入文字':'网络已断开，无法输入聊天'" :adjust-position="adjustPosition" @focus="bindQuestionInputFocus" @blur="bindQuestionInputBlur" @input="bindQuestionAnswerInput" :value="question"></input>
                    </view>
                    <view class="send">
                        <view class="btn" @click="bindSendQuestionMsg">发送</view>
                    </view>
                </view>
                <!-- 键盘顶起输入框 -->
                <view class="top-input" :style="'height:' + topQuestionInputHeight + 'px'"></view>
            </swiper-item>
            <swiper-item class="desc"  v-if="tabOptionSelected==2">
                <view class="title">
                    <text>{{roomTitle}}</text>
                </view>
                <view class="content" v-if="desc">
                    <rich-text :nodes="desc"></rich-text>
                </view>
            </swiper-item>
        </swiper>
        <!-- 提示信息 -->
        <view class="hint-input-blank" :wx-if="toggleCheckoutInputHint">
            <view class="hint-box">
                <text>{{checkoutInputHint}}</text>
            </view>
        </view>
        <!--抽奖-->
        <lottery :style="'display: ' + toggleLottery" class="lottery" :viewerId="viewerId" @close="bindClose" @startlottery="startLottery" @winlottery="winLottery" @misslottery="missLottery"></lottery>
        <!--随堂测-->
        <!--<practice></practice>-->
    </view>
</view>


</template>
<script>
//TODO 私聊
var cc = requirePlugin('ccsdk');
import live from "@/components/cclive/live/live/live";
import practice from "@/components/cclive/live/practice/practice";
import prize from "@/components/cclive/live/prize/prize";
import lottery from "@/components/cclive/live/lottery/lottery";

export default {
  data() {
    return {
      //实现双击，退出全屏
      touchStartTime: 0,
      touchEndTime: 0,
      lastTapTime: 0,
      lastTapTimeoutFunc: null,
      //直播模式：视频模式、文档模式 videoModel documentModel
      model: "videoModel",
      minCache: 0,
      maxCache: 1,
      dbView: true,
      dbWidth: "100%",
      dbHeight: "423rpx",
      playerUrl: "",
      //观看地址
      viewerName: "",
      //name
      viewerId: "",
      //id
      pageData: {},
      pageUrl: "",
      //文档地址
      peoples: 0,
      //在线人数    
      chatLog: [],
      //历史聊天信息
      roomTitle: "",
      //直播间标题
      desc: "",
      //简介
      toggleNotice: false,
      //切换显示隐藏公告    
      announcement: "暂无",
      //公告
      isPublishing: 0,
      //是否开始直播
      isBan: 0,
      //是否禁播
      toggleCover: [false, false],
      hintLiveNot: true,
      //直播未开始
      hintLiveNotText: "直播未开始",
      btnGroup: false,
      //按钮组    
      toggleControls: true,
      //直播文档控制器
      living: false,
      //直播中      
      pdfView: 0,
      //文档模块
      chatView: 0,
      //聊天模块
      qaView: 0,
      //问答模块
      switchPip: ["", "", ""],
      //视频文档切换
      playerView: 0,
      //视频模块
      toggleExitFullScreenBtn: false,
      //按钮图标切换
      btnSwitchoverFullScreen: "switchover",
      //switchover fullscreen
      btnTogglePlayerLiveMode: "hidden-video",
      //video-live only-audio hidden-video show-video
      toggleSwitchover: true,
      //切换开关
      togglePlayer: true,
      //切换显示隐藏视频开关
      toggleSelectRoute: false,
      //选择线路    
      options: ["主线路", "备用线路", "备用线路"],
      //线路
      RouteOptionActive: 0,
      //线路选中样式
      orientation: "vertical",
      //屏幕方向
      objectFit: "contain",
      //直播填充方式
      mode: "video",
      //默认视频模式
      audioMode: false,
      //音频模式  
      tabOptionSelected: 2,
      //swpier选项
      tabContent: ["聊天", "问答", "简介"],
      //格式 { name: 'name', msg: 'msg', type: 0 }
      message: [],
      //聊天信息
      chatLength: 0,
      toChat: "",
      toggleChatScroll: true,
      chatMsg: "",
      //发送的聊天信息
      toggleCheckoutInputHint: false,
      //提示内容 输入信息 不能为空
      checkoutInputHint: "",
      answerLog: "",
      //问历史记录
      questionLog: "",
      //答历史记录
      //格式 { name: 'name', time: '00:00', question: 'question', type: 0,encryptId:'encryptId', display:false ,answers: [{ name: 'name', answer: 'answer',isPrivate:0 }]}
      questions: [],
      //问答信息
      toQuestionAnswer: "",
      questionAnswerLength: 0,
      toggleQuestionAnswerScroll: true,
      question: "",
      //eye eye-hidden
      eye: "eye",
      toggleHintShowQuestion: false,
      //显示所有问答 只看我的问答
      hintShowQuestion: "只看我的问答",
      toggleShowQuestion: true,
      topChatInputHeight: 0,
      topQuestionInputHeight: 0,
      //emoji emoji-select
      emoji: "emoji",
      toggleEmoji: false,
      emojiRow: [0, 1, 2],
      emojiCol: [[1, 2, 3, 4, 5, 6, 7], [8, 9, 10, 11, 12, 13, 14], [15, 16, 17, 18, 19, 20, 21]],
      toggleLiveControlsTimer: {},
      chatLengthMax: -20,
      fullDocument: "",
      //文档全屏
      pageHeight: 0,
      pageWidth: 0,
      windowHeight: 0,
      windowWidth: 0,
      // toggleDocument: false,
      documentTop: 0,
      documentHeight: "",
      toggleDocumentFullScreen: false,
      netConnectState: {
        state: true,
        info: "网络已链接",
        time: 1000,
        toggle: false
      },
      netConnectStateTimer: {},
      groupid: "",
      //分组信息
      toggleLottery: "none",
      toggleDocument: "block",
      prizeDate: "",
      adjustPosition: false,
      systemInfo: {}
    };
  },

  onLoad: function (options) {
    // console.log(options);
    var self = this; //初始化player播放器

    self.ctx = cc.live.configLivePlayer(self, wx); //初始化直播参数
    self.setData({
      roomTitle: decodeURIComponent(options.roomTitle),
      desc: decodeURIComponent(options.desc),
      announcement: decodeURIComponent(options.announcement),
      pdfView: parseInt(decodeURIComponent(options.pdfView)),
      chatView: parseInt(decodeURIComponent(options.chatView)),
      qaView: parseInt(decodeURIComponent(options.qaView)),
      viewerId: decodeURIComponent(options.viewerId),
      groupid: decodeURIComponent(options.groupid),
      viewerName: decodeURIComponent(options.viewerName)
    });
    self.configWX();
    self.configSwiper();
    self.configLiveMode(); //奖杯

    cc.live.on("prize_send", function (data) {
      var data = JSON.parse(data);
      var result = "";

      if (data.viewerId == self.viewerId) {
        result = 1;
      } else {
        result = 0;
      }

      self.setData({
        prizeDate: {
          viewerName: data.viewerName,
          result: result //是否中奖

        }
      });
    });
    cc.live.on("switch_source", function (data) {
      console.log(data);
    });
    cc.live.on("kick_out", function (data) {
      wx.showModal({
        title: "提示",
        showCancel: false,
        content: "你被踢出了直播间",
        success: function () {
          wx.navigateBack({
            url: "../login/login"
          });
        }
      });
    });
    cc.live.on("network_change", function (data) {
      console.log("network_change", data);
      self.networkChange(self, data);
    }); //禁言回调

    var BAN_CHAT = {
      ban_chat_people: "直播间禁止个人聊天",
      unban_chat_people: "直播间解禁个人聊天",
      ban_chat_group: "直播间禁止聊天",
      unban_chat_group: "直播间解禁聊天"
    };
    cc.live.on("ban_chat", function (data) {
      console.log("ban_chat", data);

      var _data = JSON.parse(data);

      if (_data.mode == "1") {
        self.showModel(BAN_CHAT.ban_chat_people);
      } else if (_data.mode == "2") {
        self.showModel(BAN_CHAT.ban_chat_group);
      }
    });
    cc.live.on("unban_chat", function (data) {
      console.log("unban_chat", data);

      var _data = JSON.parse(data);

      if (_data.mode == "1") {
        self.showModel(BAN_CHAT.unban_chat_people);
      } else if (_data.mode == "2") {
        self.showModel(BAN_CHAT.unban_chat_group);
      }
    }); //切换视频文档区域

    cc.live.on("on_switch_video_doc", function (data) {
      console.log("on_switch_video_doc", data, self.toggleSwitchover);
console.log(self.btnSwitchoverFullScreen)
      switch (self.btnSwitchoverFullScreen) {
        case "switchover":
          if (data.layout_video_main) {
            console.log("视频为主");
            self.setData({
              dbView: false
            });
            self.setData({
              switchPip: ["switch-pip-document", "switch-pip-image", "switch-pip-player"],
              toggleCover: [false, true],
              playerView: 1,
              btnTogglePlayerLiveMode: "hidden-video",
              toggleSwitchover: false,
              togglePlayer: false,
              dbWidth: "240rpx",
              dbHeight: "180rpx",
              dbView: true
            });
          } else {
            console.log("文档为主");
            self.setData({
              dbView: false
            });
            self.setData({
              switchPip: ["", "", ""],
              toggleCover: [true, false],
              playerView: 1,
              btnTogglePlayerLiveMode: "hidden-video",
              toggleSwitchover: true,
              togglePlayer: false,
              dbWidth: "100%",
              dbHeight: "423rpx",
              dbView: true
            });
          }

          break;

        case "full-screen":
          self.ctx.requestFullScreen({
            success: function (res) {
              console.log("requestFullScreen success");
            },
            fail: function (res) {
              console.log("requestFullScreen fail");
            }
          });
          self.setData({
            toggleExitFullScreenBtn: true
          });
          break;
      }
    }); //是否开始直播

    cc.live.on("isPublishing_log", function (data) {
      if (typeof self.configHistoryPublishing == "function") {
        console.log("isPublishing_log", data);
        self.configHistoryPublishing(parseInt(data));
      }
    }); //是否禁播

    cc.live.on("isBan_log", function (data) {
      self.setData({
        isBan: data
      });
      self.configLiveIsBan();
    }); //历史文档页

    cc.live.on("page_change_log", function (data) {
      self.setData({
        pageData: data || ""
      });

      if (self.pageData) {
        self.setData({
          pageHeight: self.pageData.height,
          pageWidth: self.pageData.width
        });
      }
    }); //历史聊天信息

    cc.live.on("chat_log", function (data) {
      self.setData({
        chatLog: data
      });
      self.configChat();
    }); //收到问题记录

    cc.live.on("question_log", function (data) {
      self.setData({
        questionLog: data
      });
    }); //返回答案记录

    cc.live.on("answer_log", function (data) {
      self.setData({
        answerLog: data
      });
      self.configQA();
    }); //禁止播放回调

    cc.live.on("ban_stream", function () {
      self.banStream();
    }); //恢复禁播

    cc.live.on("unban_stream", function () {
      self.unbanStream();
    }); // 直播开始

    cc.live.on("publish_stream", function (data) {
      self.publishStream();
    }); // 直播结束

    cc.live.on("end_stream", function (data) {
      self.endStream();
    }); //聊天支持获取自定义消息

    cc.live.on("custom_message", function (data) {
      console.log("custom_message", data);
    }); //在线人数

    cc.live.on("room_user_count", function (data) {
      console.log("room_user_count", data); //人数长度限制

      var n = data.length > 8 ? data.split("").splice(0, 8).join("") + "+" : data;
      self.setData({
        peoples: n
      }); //删除监听事件
      // cc.live.deleteEvent("room_user_count");
    }); //禁言

    cc.live.on("information", function (data) {
      self.onInformation(data);
    }); //公告

    cc.live.on("announcement", function (data) {
      self.setData({
        announcement: data.announcement || "暂无"
      });
    }); //翻页

    cc.live.on("page_change", function (data) {
      self.setData({
        pageUrl: data.value.url,
        pageHeight: data.value.height,
        pageWidth: data.value.width
      });

      if (self.fullDocument) {
        self.alignCenter();
      }
    }); //禁言

    cc.live.on("silence_user_chat_message", function (data) {
      var data = JSON.parse(data);
      var arr = self.message;
      var obj = {};
      obj.name = data.username;
      obj.msg = cc.live.showEm(data.msg);

      if (data.userid == self.viewerId) {
        obj.type = 1;
      } else {
        obj.type = 0;
      }

      arr.push(obj);
      self.setData({
        message: arr,
        chatLength: arr.length
      });

      if (self.toggleChatScroll) {
        self.setData({
          toChat: "lastChat"
        });
      }
    }); //接收公聊

    cc.live.on("chat_message", function (data) {

      var data = JSON.parse(data);

      if (!self.isWithGroup(data)) {
        return;
      }

      var arr = self.message;
      var obj = {};
      obj.userId = data.userid;
      obj.name = data.username;
      obj.status = data.status;
      obj.chatId = data.chatId;
      obj.msg = cc.live.showEm(data.msg);

      if (data.userid == self.viewerId) {
        obj.type = 1;
        obj.status = 0;
      } else {
        obj.type = 0;
      }
console.log(self.toggleChatScroll);
      arr.push(obj);
      self.setData({
        message: arr.slice(self.chatLengthMax),
        chatLength: arr.length
      });

      if (self.toggleChatScroll) {
        self.setData({
          toChat: "lastChat"
        });
      }
    });
    cc.live.on("chat_log_manage", function (data) {
      var data = JSON.parse(data);
      var message = self.message;

      for (var i = 0; i < message.length; i++) {
        if (message[i].chatId == data.chatIds[0]) {
          message[i].status = data.status;

          if (message[i].userId == self.viewerId) {
            message[i].status = 0;
          }

          break;
        }
      }

      self.setData({
        message: message.slice(self.chatLengthMax),
        chatLength: message.length
      });

      if (self.toggleChatScroll) {
        self.setData({
          toChat: "lastChat"
        });
      }
    });
    var questionsCache = self.questions; //收到问题

    cc.live.on("question", function (data) {
      questionsCache = self.questions;
      var data = JSON.parse(data);

      if (!self.isWithGroup(data.value)) {
        return;
      }

      var qObj = {};
      qObj.name = data.value.userName;
      qObj.time = data.value.triggerTime.split(" ")[1];
      qObj.question = data.value.content;
      qObj.answers = [];

      if (data.value.userId == self.viewerId) {
        qObj.type = 1;
        qObj.display = true;
      } else {
        qObj.type = 0;
        qObj.display = false;
      }

      qObj.encryptId = data.value.id;
      questionsCache.push(qObj);
      updateQuestion();
    }); //更新问题

    var updateQuestion = function () {
      var arr = [];

      for (var i = 0; i < questionsCache.length; i++) {
        if (questionsCache[i].display) {
          arr.push(questionsCache[i]);
        }
      }

      showQuestionAnswer(arr);
    }; //返回答案


    cc.live.on("answer", function (data) {
      var data = JSON.parse(data);

      if (!self.isWithGroup(data.value)) {
        return;
      }

      var arr = questionsCache;
      var aObj = {};

      for (var i = 0; i < arr.length; i++) {
        if (arr[i].encryptId == data.value.questionId) {
          aObj.name = data.value.userName;
          aObj.answer = data.value.content;
          aObj.isPrivate = data.value.isPrivate;

          if (data.value.questionUserId == self.viewerId) {
            aObj.isPrivate = 0;
          }

          arr[i].answers.push(aObj);
        }
      }

      updateAnswer();
    }); //更新答案

    var updateAnswer = function () {
      for (var i = 0; i < questionsCache.length; i++) {
        for (var j = 0; j < questionsCache[i].answers.length; j++) {
          var answers = questionsCache[i].answers[j];

          if (answers.isPrivate === 0) {
            questionsCache[i].display = true;
            break;
          }
        }
      }

      updateQuestion();
    }; //显示问答信息


    var showQuestionAnswer = function (arr) {
      self.setData({
        questions: arr,
        questionAnswerLength: arr.length
      });

      if (self.toggleQuestionAnswerScroll) {
        self.setData({
          toQuestionAnswer: "lastQuestionAnswer"
        });
      }
    }; //发布问答


    cc.live.on("publish_question", function (data) {
      var data = JSON.parse(data);
      var id = data.value.questionId;

      for (var i = 0; i < questionsCache.length; i++) {
        if (questionsCache[i].encryptId === id) {
          questionsCache[i].display = true;
        }
      }

      updateQuestion();
    });
    cc.live.on("private_chat", function (data) {
      console.log(data);
    });
    cc.live.on("private_chat_self", function (data) {
      console.log(data);
    });
  },
  components: {
    live,
    practice,
    prize,
    lottery
  },
  props: {},
  methods: {
    alignCenter: function () {
      var height = this.windowWidth * this.pageHeight / this.pageWidth;
	  console.log(this.windowWidth)
      var top = this.windowHeight / 2 - height / 2;
      this.setData({
        documentHeight: height.toFixed(2) + "px",
        documentTop: 0
      });

      if (height >= this.windowHeight) {
        return;
      }

      this.setData({
        documentTop: top + "px"
      });
    },
    alignTop: function () {
      this.setData({
        documentTop: 0
      });
    },
    docuemntFullScreen: function () {
      if (this.fullDocument) {
        return;
      }

      this.setData({
        fullDocument: "fullDocument",
        toggleCover: [false, false]
      });

      if (this.btnTogglePlayerLiveMode === "hidden-video") {
        this.setData({
          playerView: 0
        });
      }

      this.alignCenter();
    },
    docuemntExitFullScreen: function () {
      if (!this.fullDocument) {
        return;
      }

      this.setData({
        fullDocument: "",
        toggleCover: [true, false]
      });

      if (this.btnTogglePlayerLiveMode === "hidden-video") {
        this.setData({
          playerView: 1
        });
      }

      this.alignTop();
    },
    bindDocuemntFullScreen: function (e) {
      if (this.switchPip[0] !== "") {
		  console.log(this.switchPip[0])
        return;
      }
      if (this.fullDocument) {
        this.docuemntExitFullScreen();
      } else {
        this.docuemntFullScreen();
      }
    },
    configSwiper: function () {
      var self = this;
      self.setData({
        tabContent: this.tabConetent
      });
    },
    configQA: function () {
      var self = this; //初始化问答信息

      self.setData({
        questions: formatQuestionAnswerMessage(this.questionLog, this.answerLog),
        questionAnswerLength: this.questionLog.length,
        toQuestionAnswer: "lastQuestionAnswer"
      });

      function formatQuestionAnswerMessage(question, answer) {
        var arr = [];

        for (var i = 0; i < question.length; i++) {
          if (!self.isWithGroup(question[i])) {
            continue;
          }

          var qObj = {};
          qObj.name = question[i].questionUserName;
          qObj.time = question[i].triggerTime.split(" ")[1];
          qObj.question = question[i].content;

          if (question[i].questionUserId == self.viewerId) {
            qObj.type = 1;
          } else {
            qObj.type = 0;
          }

          qObj.encryptId = question[i].encryptId;
          qObj.answers = [];

          for (var j = 0; j < answer.length; j++) {
            if (question[i].encryptId == answer[j].encryptId) {
              if (!self.isWithGroup(answer[j])) {
                continue;
              }

              var aObj = {};
              aObj.name = answer[j].answerUserName;
              aObj.answer = answer[j].content;
              aObj.isPrivate = answer[j].isPrivate;

              if (aObj.isPrivate === 0) {
                qObj.display = true;
              }

              qObj.answers.push(aObj);
            }
          }

          arr.push(qObj);
        }

        return arr;
      }
    },
    configChat: function () {
      var self = this; // 初始化聊天信息

      self.setData({
        message: formatChatMessage(this.chatLog),
        chatLength: this.chatLog.length,
        toChat: "lastChat"
      });

      function formatChatMessage(chatMsg) {
        chatMsg.sort(function (p1, p2) {
          return parseInt(p1.time) - parseInt(p2.time);
        });
        var arr = [];

        for (var i = 0; i < chatMsg.length; i++) {
          if (!self.isWithGroup(chatMsg[i])) {
            continue;
          }

          var obj = {};
          obj.name = chatMsg[i].userName;
          obj.userId = chatMsg[i].userId;
          obj.msg = cc.live.showEm(chatMsg[i].content);
          obj.status = chatMsg[i].status;
          obj.chatId = chatMsg[i].chatId;

          if (chatMsg[i].userId == self.viewerId) {
            obj.type = 1;
            obj.status = 0; //自己发的可以看到
          } else {
            obj.type = 0;
          }

          arr.push(obj);
        }

        return arr.slice(self.chatLengthMax);
      }
    },
    test: function () {
      // this.configLive();
      this.setData({
        hintLiveNot: false,
        btnGroup: true,
        toggleControls: false,
        living: true,
        playerView: 1,
        btnTogglePlayerLiveMode: "hidden-video",
        toggleDocumentFullScreen: true,
        isPublishing: 1
      });
    },
    configLive: function () {
      var self = this; //是否开始直播

      if (this.isPublishing) {
        self.setData({
          hintLiveNot: false,
          btnGroup: true,
          toggleControls: false,
          living: true,
          playerView: 1,
          btnTogglePlayerLiveMode: "hidden-video",
          toggleDocumentFullScreen: true
        });
      }
    },
    configLiveMode: function () {
      var self = this; //配置直播模式

      if (this.pdfView) {
        //文档模式
        self.setData({
          toggleCover: [true, false],
          model: "documentModel"
        });
      } else {
        //视频模式
        self.setData({
          switchPip: ["switch-pip-document", "switch-pip-image", "switch-pip-player"],
          toggleCover: [false, true],
          playerView: 1,
          btnSwitchoverFullScreen: "full-screen",
          btnTogglePlayerLiveMode: "video-live",
          model: "videoModel"
        });
      }
    },
    configLiveIsBan: function () {
      var self = this; //初始化禁播

      if (this.isBan) {
        if (this.model === "documentModel") {
          self.setData({
            dbView: false
          });
          self.setData({
            hintLiveNot: true,
            btnGroup: false,
            toggleControls: true,
            living: false,
            hintLiveNotText: "直播已封禁，请联系管理员",
            playerView: 0,
            switchPip: ["", "", ""],
            toggleCover: [true, false],
            btnTogglePlayerLiveMode: "hidden-video",
            toggleSwitchover: true,
            togglePlayer: false,
            dbWidth: "100%",
            dbHeight: "423rpx",
            dbView: true,
            toggleDocumentFullScreen: false
          });
        } else {
          //视频模式结束直播
          //退出全屏
          self.ctx.exitFullScreen({
            success: function (res) {
              console.log("exitFullScreen success");
            },
            fail: function (res) {
              console.log("exitFullScreen fail");
            }
          });
          self.ctx.stop({
            success: function (res) {
              console.log("stop success");
            },
            fail: function (res) {
              console.log("stop fail");
            }
          }); //设置结束直播参数

          self.setData({
            toggleExitFullScreenBtn: false,
            hintLiveNot: true,
            btnGroup: false,
            toggleControls: true,
            living: false,
            hintLiveNotText: "直播已封禁，请联系管理员"
          });
        }
      }
    },
    banStream: function () {
      var self = this;
      self.setData({
        isBan: 1
      });

      if (this.model === "documentModel") {
        self.setData({
          dbView: false
        });
        self.setData({
          hintLiveNot: true,
          btnGroup: false,
          toggleControls: true,
          living: false,
          hintLiveNotText: "直播已封禁，请联系管理员",
          playerView: 0,
          switchPip: ["", "", ""],
          toggleCover: [true, false],
          btnTogglePlayerLiveMode: "hidden-video",
          toggleSwitchover: true,
          togglePlayer: false,
          dbWidth: "100%",
          dbHeight: "423rpx",
          dbView: true,
          toggleDocumentFullScreen: false
        });
      } else {
        //视频模式结束直播
        //退出全屏
        self.ctx.exitFullScreen({
          success: function (res) {
            console.log("exitFullScreen success");
          },
          fail: function (res) {
            console.log("exitFullScreen fail");
          }
        });
        self.ctx.stop({
          success: function (res) {
            console.log("stop success");
          },
          fail: function (res) {
            console.log("stop fail");
          }
        }); //设置结束直播参数

        self.setData({
          toggleExitFullScreenBtn: false,
          hintLiveNot: true,
          btnGroup: false,
          toggleControls: true,
          living: false,
          // isPublishing: 0,
          hintLiveNotText: "直播已封禁，请联系管理员"
        });
      }
    },
    unbanStream: function () {
      var self = this;
      self.setData({
        isBan: 0
      });

      if (!this.isPublishing) {
        return;
      }

      if (this.model === "documentModel") {
        self.setData({
          hintLiveNot: false,
          btnGroup: true,
          toggleControls: false,
          living: true,
          playerView: 1,
          toggleDocumentFullScreen: true
        });
      } else {
        //视频模式开始直播
        //视频模式
        self.setData({
          toggleControls: false,
          hintLiveNot: false,
          btnGroup: true,
          living: true // isPublishing: 1

        });
        self.ctx.play({
          success: function (res) {
            console.log("play success", res);
          },
          fail: function (res) {
            console.log("play fail", res);
          }
        });
      }
    },
    publishStream: function () {
      var self = this;

      if (this.isBan) {
        return false;
      }

      if (this.model === "documentModel") {
        self.setData({
          hintLiveNot: false,
          btnGroup: true,
          toggleControls: false,
          living: true,
          isPublishing: 1,
          playerView: 1,
          toggleDocumentFullScreen: true
        });
      } else {
        //视频模式开始直播
        //视频模式
        self.setData({
          toggleControls: false,
          hintLiveNot: false,
          btnGroup: true,
          living: true,
          isPublishing: 1
        });
        self.ctx.play({
          success: function (res) {
            console.log("play success", res);
          },
          fail: function (res) {
            console.log("play fail", res);
          }
        });
      }
    },
    endStream: function () {
      var self = this;

      if (this.model === "documentModel") {
        self.setData({
          dbView: false
        });
        self.setData({
          hintLiveNot: true,
          btnGroup: false,
          toggleControls: true,
          living: false,
          isPublishing: 0,
          hintLiveNotText: "直播结束",
          playerView: 0,
          switchPip: ["", "", ""],
          toggleCover: [true, false],
          btnTogglePlayerLiveMode: "hidden-video",
          toggleSwitchover: true,
          togglePlayer: false,
          dbWidth: "100%",
          dbHeight: "423rpx",
          dbView: true,
          toggleDocumentFullScreen: false
        });
      } else {
        //视频模式结束直播
        //退出全屏
        self.ctx.exitFullScreen({
          success: function (res) {
            console.log("exitFullScreen success");
          },
          fail: function (res) {
            console.log("exitFullScreen fail");
          }
        });
        self.ctx.stop({
          success: function (res) {
            console.log("stop success");
          },
          fail: function (res) {
            console.log("stop fail");
          }
        }); //设置结束直播参数

        self.setData({
          toggleExitFullScreenBtn: false,
          hintLiveNot: true,
          btnGroup: false,
          toggleControls: true,
          living: false,
          isPublishing: 0,
          hintLiveNotText: "直播结束"
        });
      }
    },
    configWX: function () {
      var self = this; //保持常亮状态

      wx.setKeepScreenOn({
        keepScreenOn: true
      }); //设置小程序title

      wx.setNavigationBarTitle({
        title: this.roomTitle
      });
      var systemInfo = wx.getSystemInfoSync();
      self.setData({
        windowHeight: systemInfo.windowHeight,
        windowWidth: systemInfo.windowWidth
      });
      wx.getSystemInfo({
        success(res) {
          // console.log(res.model)
          // console.log(res.pixelRatio)
          // console.log(res.windowWidth)
          // console.log(res.windowHeight)
          // console.log(res.language)
          // console.log(res.version)
          // console.log(res.platform)
          self.setData({
            systemInfo: res
          });
        }

      });
    },
    networkChange: function (self, data) {
      clearTimeout(this.netConnectStateTimer);

      if (data.state) {
        self.setData({
          netConnectState: {
            state: true,
            info: "网络链接正常",
            time: 4000,
            toggle: true
          }
        });
      } else {
        self.setData({
          netConnectState: {
            state: false,
            info: "网络未链接",
            time: 1200,
            toggle: true
          }
        });
      }

      var netConnectStateTimerCallback = function () {
        self.setData({
          netConnectState: {
            state: self.netConnectState.state,
            info: self.netConnectState.info,
            time: self.netConnectState.time,
            toggle: false
          }
        });
      };

      this.netConnectStateTimer = setTimeout(netConnectStateTimerCallback, this.netConnectState.time);
    },
    isWithGroup: function (data) {
      var self = this;
      var groupId = data.groupId;

      if (!groupId) {
        return true;
      }

      var role = "";

      if (data.userrole) {
        role = data.userrole;
      } else if (data.userRole) {
        role = data.userRole;
      } else if (data.fromuserrole) {
        role = data.fromuserrole;
      } else if (data.answerUserRole) {
        role = data.answerUserRole;
      } else if (data.fromuserrole) {
        role = data.fromuserrole;
      } else if (data.role) {
        role = data.role;
      }

      if (role && role === "publisher") {
        return true;
      }

      if (this.groupid && this.groupid !== groupId) {
        return false;
      }

      return true;
    },
    hiddenPlayer: function () {
      this.setData({
        playerView: 0,
        btnTogglePlayerLiveMode: "show-video",
        togglePlayer: true
      });
    },
    showPlayer: function () {
      this.setData({
        playerView: 1,
        btnTogglePlayerLiveMode: "hidden-video",
        togglePlayer: false
      });
    },
    bindClose: function () {
      if (!this.isPublishing) {
        return;
      }

      this.setData({
        toggleLottery: "none"
      });

      if (this.toggleSwitchover) {
        //文档为主
        this.showPlayer();
      } else {
        //视频为主
        this.setData({
          toggleDocument: "block"
        });
      }
    },
    startLottery: function () {
      if (!this.isPublishing) {
        return;
      }

      this.setData({
        toggleLottery: "block"
      });

      if (this.toggleSwitchover) {
        //文档为主
        this.hiddenPlayer();
      } else {
        //视频为主
        this.setData({
          toggleDocument: "none"
        });
      }
    },
    winLottery: function () {
      if (!this.isPublishing) {
        return;
      }

      this.setData({
        toggleLottery: "block"
      });

      if (this.toggleSwitchover) {
        //文档为主
        this.hiddenPlayer();
      } else {
        //视频为主
        this.setData({
          toggleDocument: "none"
        });
      }
    },
    missLottery: function () {
      var self = this;

      if (!this.isPublishing) {
        return;
      }

      this.setData({
        toggleLottery: "block"
      });

      if (this.toggleSwitchover) {
        //文档为主
        this.hiddenPlayer();
      } else {
        //视频为主
        this.setData({
          toggleDocument: "none"
        });
      }

      clearTimeout(self.missLotteryTimer);
      self.missLotteryTimer = setTimeout(function () {
        self.bindClose();
      }, 5000);
    },
    configHistoryPublishing: function (isPublishing) {
      var self = this;
      self.setData({
        isPublishing: isPublishing
      });
      self.configLive();
      self.configHistoryPublishing = null;
    },
    bindHidePrize: function () {
      this.setData({
        prizeDate: ""
      });
    },
    showModel: function (info) {
      var self = this;
      self.setData({
        toggleCheckoutInputHint: true,
        checkoutInputHint: info
      });
      setTimeout(timer, 1200);

      function timer() {
        self.setData({
          toggleCheckoutInputHint: false,
          checkoutInputHint: ""
        });
      }
    },
    //如果直播推流断网，小程序live-player会自动重联一定次数不再播放，调用replay重新尝试播放
    replay: function (e) {
      // 网络断连，且经多次重连抢救无效，更多重试请自行重启播放
      if (e.detail.code === -2301 && this.ctx.domId) {
        //自动切换节点，待完成
        //重新播放
        this.ctx.play({
          success: function (res) {
            console.log("play success", res);
          },
          fail: function (res) {
            console.log("play fail", res);
          }
        });
      }
    },
    statechange: function (e) {
      this.replay(e); //统计上报功能

      cc.live.reportPlayResult(e);
    },
    netstatus: function (e) {
      //统计心跳上报功能
      cc.live.reportPlaying(e);
    },
    /// 按钮触摸开始触发的事件
    bindTouchStart: function (e) {
      this.touchStartTime = e.timeStamp;
    },
    /// 按钮触摸结束触发的事件
    bindTouchEnd: function (e) {
      this.touchEndTime = e.timeStamp;
    },
    bindDoubleTap: function (e) {
      var self = this; // 控制点击事件在350ms内触发，加这层判断是为了防止长按时会触发点击事件

      if (self.touchEndTime - self.touchStartTime < 350) {
        // 当前点击的时间
        var currentTime = e.timeStamp;
        var lastTapTime = self.lastTapTime; // 更新最后一次点击时间

        self.lastTapTime = currentTime; // 如果两次点击时间在300毫秒内，则认为是双击事件

        if (currentTime - lastTapTime < 300) {
          // 成功触发双击事件时，取消单击事件的执行
          clearTimeout(self.lastTapTimeoutFunc);

          if (this.model === "videoModel") {
            //双击退出全屏
            self.ctx.exitFullScreen({
              success: function (res) {
                console.log("exitFullScreen success");
              },
              fail: function (res) {
                console.log("exitFullScreen fail");
              }
            });
            self.setData({
              toggleExitFullScreenBtn: false
            });
          }
        }
      }
    },
    bindExitFullScreen: function () {
      var self = this; //ios live-player 不支持 bindtap

      self.ctx.exitFullScreen({
        success: function (res) {
          console.log("exitFullScreen success");
        },
        fail: function (res) {
          console.log("exitFullScreen fail");
        }
      });
      self.setData({
        toggleExitFullScreenBtn: false
      });
    },
    //选择表情
    bindEmoji: function (e) {
      var index = e.currentTarget.dataset.index;
      var msg = this.chatMsg;

      if (index !== 21) {
        var emoji = "[em2_" + (index < 10 ? "0" + index : index) + "]";
        msg += emoji;
      } else {
        //删除
        var arr = msg.split("");
        arr.pop();
        msg = arr.join("");
      }

      this.setData({
        chatMsg: msg
      });
    },
    //开关表情界面
    bindToggleEmoji: function () {
      if (!this.netConnectState.state) {
        return;
      }
      if (this.toggleEmoji) {
        this.setData({
          emoji: "emoji",
          toggleEmoji: false
        });
      } else {
        this.setData({
          emoji: "emoji-select",
          toggleEmoji: true
        });
      }
    },
    //问答输入框获取焦点
    bindQuestionInputFocus: function (e) {
      this.setData({
        topQuestionInputHeight: e.detail.height
      });
    },
    //问答输入框失去焦点
    bindQuestionInputBlur: function (e) {
      this.setData({
        topQuestionInputHeight: 0
      });
    },
    //切换问答显示模式
    bindShowQuestion: function () {
      var self = this;

      if (this.toggleShowQuestion) {
        self.setData({
          eye: "eye-hidden",
          toggleShowQuestion: false,
          toggleHintShowQuestion: true,
          hintShowQuestion: "只看我的问答"
        });
      } else {
        self.setData({
          eye: "eye",
          toggleShowQuestion: true,
          toggleHintShowQuestion: true,
          hintShowQuestion: "显示所有问答"
        });
      }

      setTimeout(timer, 1500);

      function timer() {
        self.setData({
          toggleHintShowQuestion: false,
          hintShowQuestion: ""
        });
      }

      self.setData({
        toQuestionAnswer: "lastQuestionAnswer"
      });
    },
    //验证输入框信息不能为空，小于300字
    checkoutInput: function (value) {
      var self = this;

      if (!value) {
        self.setData({
          toggleCheckoutInputHint: true,
          checkoutInputHint: "输入内容不能为空"
        });
        setTimeout(timer, 1200);
        return false;
      }

      if (value.length >= 139) {
        self.setData({
          toggleCheckoutInputHint: true,
          checkoutInputHint: "输入内容应小于140字"
        });
        setTimeout(timer, 1200);
        return false;
      }

      return true;

      function timer() {
        self.setData({
          toggleCheckoutInputHint: false,
          checkoutInputHint: ""
        });
      }
    },
    onInformation: function (info) {
      var self = this;
      self.setData({
        toggleCheckoutInputHint: true,
        checkoutInputHint: info
      });
      setTimeout(timer, 2000);

      function timer() {
        self.setData({
          toggleCheckoutInputHint: false,
          checkoutInputHint: ""
        });
      }
    },
    //发送问题
    bindSendQuestionMsg: function () {
      if (!this.checkoutInput(this.question)) {
        return;
      }

      cc.live.sendQuestionMsg(this.question);
      this.setData({
        question: ""
      });
    },
    //输入问题
    bindQuestionAnswerInput: function (e) {
      var question = e.detail.value;
      this.setData({
        question: question
      });
    },
    //用户滑动观看问答内容，禁止内容自动滑动
    bindQuestionAnswerScroll: function (e) {
      var height = e.detail.scrollHeight;
      var top = e.detail.scrollTop;

      if (height - top > 400) {
        this.setData({
          toggleQuestionAnswerScroll: false
        });
      }
    },
    //问答信息滑动到底部，开启问答内容自动更新滑动
    bindQuestionAnswerScrollTolower: function (e) {
      this.setData({
        toggleQuestionAnswerScroll: true
      });
    },
    //发送聊天信息
    bindSendPublicChatMsg: function () {
      if (!this.checkoutInput(this.chatMsg)) {
        return;
      }

      cc.live.sendPublicChatMsg(this.chatMsg);
      this.setData({
        chatMsg: "",
        emoji: "emoji",
        toggleEmoji: false
      });

      if (this.systemInfo.model == "MI 5") {
        setTimeout(() => {
          this.setData({
            chatMsg: ""
          });
        }, 200);
      }
    },
    //输入聊天信息
    bindChatInput: function (e) {
      var msg = e.detail.value;
      this.setData({
        chatMsg: msg
      });
    },
    //聊天输入框获取焦点，键盘弹起输入框
    bindChatInputFocus: function (e) {
      this.setData({
        topChatInputHeight: e.detail.height,
        emoji: "emoji",
        toggleEmoji: false
      });
    },
    //聊天输入框失去焦点
    bindChatInputBlur: function (e) {
		let self = this
		this.topChatInputHeight = 0
		self.setData({
			topChatInputHeight: 0
		});
    },
    //允许聊天内容自动滑动
    bindChatScrollTolower: function (e) {
		let self = this;
      self.setData({
        toggleChatScroll: true
      });
    },
    //禁止聊天内容自动滑动
    bindChatScroll: function (e) {
      var height = e.detail.scrollHeight;
      var top = e.detail.scrollTop;

      if (height - top > 400) {
        this.setData({
          toggleChatScroll: false
        });
      }
    },
    //文档全屏 视频全屏 切换按钮
    bindSwitchoverFullScreen: function () {
      switch (this.btnSwitchoverFullScreen) {
        case "switchover":
          if (this.toggleSwitchover) {
            this.setData({
              dbView: false
            });
            this.setData({
              switchPip: ["switch-pip-document", "switch-pip-image", "switch-pip-player"],
              toggleCover: [false, true],
              playerView: 1,
              btnTogglePlayerLiveMode: "hidden-video",
              toggleSwitchover: false,
              togglePlayer: false,
              dbWidth: "240rpx",
              dbHeight: "180rpx",
              dbView: true
            }); //文档小窗

            if (this.toggleLottery === "block") {
              this.showPlayer();
              this.setData({
                toggleDocument: "none"
              });
            }
          } else {
            this.setData({
              dbView: false
            });
            this.setData({
              switchPip: ["", "", ""],
              toggleCover: [true, false],
              playerView: 1,
              btnTogglePlayerLiveMode: "hidden-video",
              toggleSwitchover: true,
              togglePlayer: false,
              dbWidth: "100%",
              dbHeight: "423rpx",
              dbView: true
            }); //视频小窗

            if (this.toggleLottery === "block") {
              this.hiddenPlayer();
              this.setData({
                toggleDocument: "block"
              });
            }
          }

          break;

        case "full-screen":
          this.ctx.requestFullScreen({
            success: function (res) {
              console.log("requestFullScreen success");
            },
            fail: function (res) {
              console.log("requestFullScreen fail");
            }
          });
          this.setData({
            toggleExitFullScreenBtn: true
          });
          break;
      }
    },
    //全屏事件回调
    bindFullScreenChange: function (e) {
      if (e.detail.fullScreen) {
        this.setData({
          toggleCover: [false, false],
          orientation: "horizontal" // toggleControls:

        });
      } else {
        this.setData({
          toggleCover: [false, true],
          orientation: "vertical"
        });
      }
    },
    //切换音频视频模式
    bindTogglePlayerLiveMode: function () {
      switch (this.btnTogglePlayerLiveMode) {
        case "hidden-video":
        case "show-video":
          //抽奖时隐藏小窗
          if (this.toggleLottery === "block") {
            return;
          }

          if (this.toggleSwitchover) {
            if (this.togglePlayer) {
              this.setData({
                playerView: 1,
                btnTogglePlayerLiveMode: "hidden-video",
                togglePlayer: false
              });
            } else {
              this.setData({
                playerView: 0,
                btnTogglePlayerLiveMode: "show-video",
                togglePlayer: true
              });
            }
          } else {
            this.setData({
              dbView: false
            });
            this.setData({
              switchPip: ["", "", ""],
              toggleCover: [true, false],
              playerView: 0,
              btnTogglePlayerLiveMode: "show-video",
              toggleSwitchover: true,
              togglePlayer: true,
              dbWidth: "100%",
              dbHeight: "423rpx",
              dbView: true
            });
          }

          break;

        case "video-live":
        case "only-audio":
          if (this.audioMode) {
            this.setData({
              mode: "video",
              audioMode: false,
              //视频模式
              btnTogglePlayerLiveMode: "video-live"
            });
          } else {
            this.setData({
              mode: "audio",
              audioMode: true,
              //音频模式
              btnTogglePlayerLiveMode: "only-audio"
            });
          }

          cc.live.streamMode(this.mode);
          break;
      }
    },
    //线路选择菜单开关
    bindToggleSelectRoute: function () {
      if (this.toggleSelectRoute) {
        this.setData({
          toggleSelectRoute: false
        });
      } else {
        this.setData({
          toggleSelectRoute: true
        });
      }
    },
    //选择线路
    bindSelectRoute: function (e) {
      var route = e.target.dataset.index;

      switch (route) {
        case 0:
          cc.live.streamRoute(0);
          break;

        case 1:
          cc.live.streamRoute(1);
          break;

        case 2:
          cc.live.streamRoute(2);
          break;
      }

      this.setData({
        toggleSelectRoute: false,
        //选择线路  
        RouteOptionActive: route
      });
    },
    //直播中
    catchLiving: function () {
      var self = this;
      self.setData({
        toggleControls: true,
        living: false
      });
      this.toggleLiveControlsTimer = setTimeout(function () {
        if (!this.isPublishing || this.isBan) {
          return;
        }

        self.setData({
          toggleControls: false,
          living: true,
          toggleSelectRoute: false
        });
      }, 5000);
    },
    //控制面板
    catchControls: function () {
      var self = this;

      if (!this.isPublishing || this.isBan) {
        return;
      }

      clearTimeout(this.toggleLiveControlsTimer);
      self.setData({
        toggleControls: false,
        living: true,
        toggleSelectRoute: false
      });
    },
    //公告
    catchNotice: function () {
      this.setData({
        toggleNotice: true
      });
    },
    //公告
    catchCloseNotice: function () {
		let self = this;
		self.setData({
			toggleNotice: false
		});
    },
    //选项卡
    bindTab: function (i) {
      this.setData({
        tabOptionSelected: i
      });
	  console.log(this.tabOptionSelected)
    },
    //选中样式
    bindSwiperChange: function (e) {
      if (e.detail.source === "touch") {
        var index = e.detail.current;
        this.setData({
          tabOptionSelected: index
        });
      }
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
/* 全局flex布局 player chat */

.container {
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
}

/* player */

.container .player {
    height: 423rpx;
    width: 100%;
}

/*网络链接提示*/

.container .net-info {
    position: absolute;
    left: 30rpx;
    top:20rpx;
    z-index: 1;
}

.container .net-info .info {
    font-size: 26rpx;
}

/* 退出全屏按钮 */

.container .player .live live-player .exit-full-screen {
    width: 70rpx;
    height: 70rpx;
    margin-left: 30rpx;
    margin-top: 30rpx;
    /* transform: rotate(30deg); */
}

.container .player .live live-player .exit-full-screen cover-image {
    width: 70rpx;
    height: 70rpx;
}

/* 文档 */

.container .player .document {
    height: 422rpx;
    width: 100%;
    background-color: #fff;
}

.container .player .document image {
    height: 422rpx;
    width: 100%;
}

/*文档全屏*/

.container .player .fullDocument{
    position: absolute;
    width: 100%;
    height: 100%;
    z-index:1;
}

/* 切换 */

.container .player .switch-pip-document {
    position: absolute;
    top: 508rpx;
    width: 240rpx;
    height: 180rpx;
    right: 0;
    z-index: 1;
}

.container .player .document .switch-pip-image {
    width: 240rpx;
    height: 180rpx;
}

/* 音频模式 */

.container .player .live live-player .controls .audio-mode {
    position: absolute;
    width: 449rpx;
    height: 194rpx;
    top: 114rpx;
    left: 151rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.container .player .live live-player .controls .audio-mode .audio-mode-image {
    width: 449rpx;
    height: 132rpx;
    margin-bottom: 30rpx;
}

.container .player .live live-player .controls .audio-mode .text {
    opacity: 0.5;
    font-size: 32rpx;
    color: #fff;
    text-align: center;
}

/* 直播中 */

.container .player .living {
    position: absolute;
    height: 100%;
    top: 0;
    width: 100%;
    display: flex;
    justify-content: flex-end;
    margin-top: 33rpx;
}

.container .player .live live-player .living {
}

.container .player .living .living-box {
    background-color: rgba(0, 0, 0, 0.3);
    border-radius: 100rpx;
    width: 125rpx;
    height: 52rpx;
    margin-right: 30rpx;
    display: flex;
    align-items: center;
    justify-content: center;
}

.container .player .living .living-box .circle {
    background: #f83f3f;
    box-shadow: 1rpx 1rpx 1rpx 0rpx rgba(0, 0, 0, 0.50);
    width: 12rpx;
    height: 12rpx;
    border-radius: 100%;
    float: left;
    margin-right: 5rpx;
}

.container .player .living .living-box .text {
    font-size: 26rpx;
    color: #fff;
    text-shadow: 1rpx 1rpx 0rpx rgba(102, 102, 102, 0.50);
    float: left;
}

/* 切换线路 */

.container .player .switch-router {
    position: absolute;
    z-index: 1;
    /* top:234rpx; */
    top: 210rpx;
    left: 440rpx;
}

.container .player .switch-router .switch-router-select {
    background-color: rgba(30, 31, 33, 0.5);
    width: 190rpx;
    margin-right: 20rpx;
    margin-top: 0rpx;
}

.container .player .switch-router .switch-router-option {
    width: 100%;
    height: 60rpx;
    font-size: 26rpx;
    color: #fff;
    text-shadow: 0px 1px 0px #666;
    text-align: center;
    line-height: 60rpx;
    border-bottom: 1rpx solid rgba(255, 255, 255, 0.30);
}

.container .player .switch-router .active {
    color: #fc7c00;
    text-shadow: 0px 1px 0px #666;
}

.container .player .switch-router .switch-router-option:last-child {
    border: none;
}

/* 公告 */

.container .player .notice-container {
    position: absolute;
    top: 0;
    left: 0;
    height: 422rpx;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.69);
    z-index: 1;
}

.container .player .notice-container .notice {
    margin: 0 auto;
    width: 650rpx;
    /* display: flex;
  flex-direction: column;
  align-items: center; */
}

/* head */

.container .player .notice-container .head {
    width: 650rpx;
    height: 60rpx;
    margin: 40rpx 0 30rpx;
}

.container .player .notice-container .head image {
    width: 100%;
    height: 100%;
}

.container .player .notice-container .head .text {
    position: relative;
    left: 278rpx;
    top: -45rpx;
    font-size: 28rpx;
    color: #fff;
    line-height: 38rpx;
}

/* content */

.container .player .notice-container .content {
    width: 600rpx;
    height: 135rpx;
    overflow-y: scroll;
    margin-bottom: 47rpx;
}

.container .player .notice-container .content .text {
    width: 100%;
    font-size: 30rpx;
    color: #fff;
    white-space: normal;
    word-wrap: break-word;
    line-height: 40rpx;
}

/* close */

.container .player .notice-container .close {
    width: 80rpx;
    height: 80rpx;
    margin: 47rpx auto 0rpx;
}

.container .player .notice-container .close image {
    width: 80rpx;
    height: 80rpx;
}

.container .player .notice-container .close cover-image {
    width: 80rpx;
    height: 80rpx;
}

/* 用户交互层 */

.container .player .cover {
    position: absolute;
    height: 422rpx;
    width: 100%;
    top: 0;
}

.container .player .controls {
    position: absolute;
    height: 100%;
    width: 100%;
    top: 0;
}

/* top */

.container .player .controls .top {
    transition: all 0.8s;
    /* background-image: linear-gradient(180deg, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.00) 100%); */
    height: 68rpx;
}

.container .player .controls .top .notice-btn {
    font-size: 28rpx;
    color: #fff;
    text-shadow: 0rpx 2rpx 0rpx #666;
    float: right;
    margin-top: 20rpx;
    margin-right: 40rpx;
}

.container .player .controls .top .notice-btn cover-image {
    width: 59rpx;
    height: 30rpx;
}

/* center */

.container .player .document .controls .center {
    height: 292rpx;
}

.container .player .live .controls .center {
    height: 292rpx;
}

/*TODO  */

.container .player .controls .center .hint {
    font-size: 36rpx;
    color: #fff;
    text-align: center;
    line-height: 294rpx;
    text-shadow: 0rpx 2rpx 0rpx #666;
}

/*文档全屏*/
.container .player .controls .center .document-full-screen{
    position: absolute;
    margin-top: 20rpx;
    margin-left: 30rpx;
}

.container .player .controls .center .document-full-screen cover-image{
    width: 70rpx;
    height: 70rpx;
}


.container .player .controls .center .btn-group {
    float: right;
    /* margin-right: 30rpx; */
    margin-top: 20rpx;
}

.container .player .controls .center .btn-group .btn {
    width: 100rpx;
    height: 90rpx;
}

.container .player .controls .center .btn-group .btn cover-image {
    width: 70rpx;
    height: 70rpx;
}

/* bottom */

.container .player .controls .bottom {
    height: 60rpx;
    /* padding-top: 22rpx; */
    box-sizing: border-box;
}

.container .player .controls .bottom .online-peoples {
    margin-left: 30rpx;
    background-color: rgba(0, 0, 0, 0.3);
    border-radius: 100rpx;
    display: inline-block;
}

.container .player .controls .bottom .online-peoples .people-box {
    float: left;
}

.container .player .controls .bottom .online-peoples .people-box .people {
    width: 30rpx;
    height: 30rpx;
    float: left;
    margin: 10rpx 6rpx 0rpx 10rpx;
    text-shadow: 0rpx 2rpx 0rpx #666;
}

.container .player .controls .bottom .online-peoples .number {
    opacity: 0.8;
    font-size: 24rpx;
    color: #fff;
    float: left;
    line-height: 30rpx;
    text-shadow: 0rpx 2rpx 0rpx #666;
    margin: 10rpx 10rpx 0rpx 0rpx;
}

/* 直播视频 */

.container .player .live {
    width: 240rpx;
    height: 180rpx;
    position: absolute;
    right: 0;
    top: 506rpx;
    z-index: 1;
}

.container .player .live live-player {
    width: 100%;
    height: 100%;
}

.container .player .switch-pip-player {
    top: 0;
    height: 422rpx;
    width: 100%;
}

/* chat */

.container .chat {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    flex: 1;
}

/* tab */

.container .chat .tab {
    width: 100%;
    height: 80rpx;
    display: flex;
    background: #fff;
    /* box-shadow: 0rpx 1rpx 3rpx 0rpx rgba(0, 0, 0, 0.2); *//* margin-bottom: 3rpx; */
    border-top: 1rpx #e8e8e8 solid;
    border-bottom: 1rpx #e8e8e8 solid;
}

.container .chat .tab .option {
    flex: 1;
    display: flex;
    align-items: center;
    flex-direction: column;
    padding-top: 18rpx;
}

.container .chat .tab .option text {
    font-size: 30rpx;
    color: #333;
    flex:9;
}

.container .chat .tab .option .border {
    width: 100rpx;
    height: 4rpx;
}

.container .chat .tab .option .active {
    background: #ff7d00;
}

/* swiper */

.container .chat .swiper {
    flex: 1;
    height: 58%;
}

/* swiper 聊天 */

.container .chat .swiper .chat {
    display: flex;
    flex-direction: column;
}

.container .chat .swiper .chat .content {
    flex: 1;
    background: #f3f3f3;
    overflow: scroll;
    height: 86%;
}

.container .chat .swiper .chat .content scroll-view {
    height: 100%;
}

/* 聊天内容 */

.container .chat .swiper .chat .content scroll-view .message-box {
    display: flex;
    margin: 20rpx 0rpx 30rpx 30rpx;
    line-height: 36rpx;
}

.container .chat .swiper .chat .content scroll-view .message-box-right {
    display: flex;
    flex-direction: row-reverse;
    margin: 20rpx 0rpx 30rpx 30rpx;
    line-height: 36rpx;
}

.container .chat .swiper .chat .content scroll-view .message-box .left {
}

.container .chat .swiper .chat .content scroll-view .message-box .left .image-box {
    margin-right: 22rpx;
}

.container .chat .swiper .chat .content scroll-view .message-box .left .image-box-right {
    margin-left: 22rpx;
}

.container .chat .swiper .chat .content scroll-view .message-box .left .image-box image {
    width: 70rpx;
    height: 70rpx;
}

.container .chat .swiper .chat .content scroll-view .message-box .right {
}

.container .chat .swiper .chat .content scroll-view .message-box .right .name-box {
    margin-bottom: 16rpx;
    line-height: 24rpx;
}

.container .chat .swiper .chat .content scroll-view .message-box .right .name-box text {
    font-size: 24rpx;
    color: #666;
}

.container .chat .swiper .chat .content scroll-view .message-box .right .name-box-right {
    margin-bottom: 16rpx;
    line-height: 24rpx;
    text-align: right;
}

.container .chat .swiper .chat .content scroll-view .message-box .right .name-box-right text {
    font-size: 24rpx;
    color: #666;
}

.container .chat .swiper .chat .content scroll-view .message-box .right .msg-box {
    background: #fff;
    /* border: 1rpx solid #d1d1d1; */
    box-shadow: inset 0rpx 2rpx 1rpx 0rpx rgba(255, 255, 255, 0.50);
    border-radius: 4rpx;
    width: 100%;
    max-width: 489rpx;
    box-sizing: border-box;
    padding: 20rpx;
    padding-left: 25rpx;
}

.container .chat .swiper .chat .content scroll-view .message-box .right .msg-box rich-text {
    font-size: 26rpx;
    color: #333;
    word-wrap: break-word;
}

.container .chat .swiper .chat .content scroll-view .message-box .right .msg-box-right {
    background: #ff7d00;
    border-radius: 4rpx;
    width: 100%;
    max-width: 489rpx;
    box-sizing: border-box;
    padding: 20rpx;
    padding-left: 25rpx;
    border: none;
    box-shadow: none;
}

.container .chat .swiper .chat .content scroll-view .message-box .right .msg-box-right rich-text {
    font-size: 26rpx;
    color: #fff;
    word-wrap: break-word;
}

/* 输入框 */

.container .chat .swiper .chat .input {
    margin-top: 2rpx;
    /* flex-basis: 1; */
    height: 90rpx;
    background: #f0f0f0;
    box-shadow: 0px -1rpx 0rpx 0rpx #ddd, inset 0rpx -1rpx 0rpx 0rpx #ddd;
    display: flex;
    box-sizing: border-box;
    padding: 13rpx 24rpx;
    /* border-top: 1px rgb(220,220,220) solid;    */
}

.container .chat .swiper .chat .input .input-box {
    margin-right: 26rpx;
    background: #fff;
    border: 1rpx solid #ddd;
    border-radius: 4rpx;
    width: 556rpx;
    height: 62rpx;
}

.container .chat .swiper .chat .input .input-box input {
    width: 456rpx;
    font-size: 30rpx;
    /* text-indent: 20rpx; */
    margin-left: 20rpx;
    height: 100%;
}

.container .chat .swiper .chat .input .input-box image {
    width: 48rpx;
    height: 48rpx;
    position: relative;
    left: 493rpx;
    top: -56rpx;
}

.container .chat .swiper .chat .input .send {
    background-image: linear-gradient(90deg, #ff8e00 0%, #ff5301 100%);
    border-radius: 6rpx;
    width: 120rpx;
    height: 64rpx;
    text-align: center;
    line-height: 64rpx;
}

.container .chat .swiper .chat .input .send .btn {
    font-size: 30rpx;
    color: #fff;
}

.container .chat .swiper .chat .emoji {
    margin-top: 40rpx;
    margin-left: 45rpx;
}

.container .chat .swiper .chat .emoji .emoji-row {
    display: flex;
}

.container .chat .swiper .chat .emoji .emoji-row  .emoji-col {
}

.container .chat .swiper .chat .emoji .emoji-row .emoji-col .emoji-box {
    margin-right: 40rpx;
    margin-bottom: 54rpx;
}

.container .chat .swiper .chat .emoji .emoji-row .emoji-col .emoji-box  image {
    height: 60rpx;
    width: 60rpx;
}

/* swiper 问答 */

.container .chat .swiper .catechism {
    display: flex;
    flex-direction: column;
}

.container .chat .swiper .catechism .content {
    flex: 1;
    background: #f3f3f3;
    overflow: scroll;
    height: 86%;
}

.container .chat .swiper .catechism .content scroll-view {
    height: 100%;
}

.container .chat .swiper .catechism .content scroll-view .catechism-box {
    display: flex;
    padding: 30rpx 0rpx 20rpx 30rpx;
    background-color: #fff;
    border-bottom: 20rpx solid #f3f3f3;
}

.container .chat .swiper .catechism .content scroll-view .catechism-box:last-child {
    border-bottom: none;
}

.container .chat .swiper .catechism .content scroll-view .catechism-box .left {
    margin-right: 22rpx;
}

.container .chat .swiper .catechism .content scroll-view .catechism-box .left .image-box {
}

.container .chat .swiper .catechism .content scroll-view .catechism-box .left .image-box image {
    border: 2rpx solid #fff;
    /* box-shadow: 0rpx 1rpx 3rpx 0rpx rgba(0, 0, 0, 0.24); */
    width: 76rpx;
    height: 76rpx;
    border-radius: 100%;
}

.container .chat .swiper .catechism .content scroll-view .catechism-box .right {
}

.container .chat .swiper .catechism .content scroll-view .catechism-box .right .name-box {
    margin-bottom: 16rpx;
    line-height: 24rpx;
}

.container .chat .swiper .catechism .content scroll-view .catechism-box .right .name-box .name {
    font-size: 24rpx;
    color: #666;
    margin-right: 19rpx;
}

.container .chat .swiper .catechism .content scroll-view .catechism-box .right .name-box .time {
    font-size: 24rpx;
    color: #999;
    line-height: 24rpx;
}

.container .chat .swiper .catechism .content scroll-view .catechism-box .right .question-box {
    width: 100%;
    max-width: 590rpx;
    margin-bottom: 16rpx;
    line-height: 36rpx;
}

.container .chat .swiper .catechism .content scroll-view .catechism-box .right .question-box text {
    font-size: 26rpx;
    color: #333;
    word-wrap: break-word;
}

.container .chat .swiper .catechism .content scroll-view .catechism-box .right .answers {
    background: #fafafa;
    /* box-shadow: 0px -1px 0px 0px #e8e8e8, inset 0px -1px 0px 0px #e8e8e8; */
    width: 590rpx;
}

.container .chat .swiper .catechism .content scroll-view .catechism-box .right .answers .answer-box {
    padding: 20rpx;
    border-bottom: 1rpx solid #e8e8e8;
}

.container .chat .swiper .catechism .content scroll-view .catechism-box .right .answers .answer-box:last-child {
    border-bottom: none;
}

.container .chat .swiper .catechism .content scroll-view .catechism-box .right .answers .answer-box .name {
    font-size: 24rpx;
    color: #666;
}

.container .chat .swiper .catechism .content scroll-view .catechism-box .right .answers .answer-box .answer {
    font-size: 24rpx;
    color: #333;
    word-wrap: break-word;
}

/* 问答输入框 */

.container .chat .swiper .catechism .input {
    margin-top: 2rpx;
    /* flex-basis: 1; */
    height: 90rpx;
    background: #f0f0f0;
    box-shadow: 0px -1rpx 0rpx 0rpx #ddd, inset 0rpx -1rpx 0rpx 0rpx #ddd;
    display: flex;
    box-sizing: border-box;
    padding: 13rpx 24rpx;
    /* border-top: 1px rgb(220,220,220) solid; */
}

.container .chat .swiper .catechism .input .input-box {
    margin-right: 26rpx;
    background: #fff;
    border: 1rpx solid #ddd;
    border-radius: 4rpx;
    width: 556rpx;
    height: 62rpx;
    display: flex;
}

.container .chat .swiper .catechism .input .input-box input {
    width: 456rpx;
    font-size: 30rpx;
    /* text-indent: 20rpx; */
    margin-left: 20rpx;
    height: 100%;
}

.container .chat .swiper .catechism .input .input-box .show {
    padding: 5rpx 5rpx;
    border-right: 1px #ddd solid;
    position: relative;
}

.container .chat .swiper .catechism .input .input-box .show .hint-show-question {
    position: absolute;
    left: 15rpx;
    top: -107rpx;
}

.container .chat .swiper .catechism .input .input-box .show .hint-show-question .triangle {
    width: 0rpx;
    height: 0rpx;
    border-left: 15rpx solid transparent;
    border-right: 15rpx solid transparent;
    border-top: 15rpx solid rgba(20, 20, 20, 0.8);
    margin-left: 15rpx;
}

.container .chat .swiper .catechism .input .input-box .show .hint-show-question .hint-box {
    background-color: rgba(20, 20, 20, 0.8);
    border-radius: 5rpx;
    width: 234rpx;
    line-height: 68rpx;
    text-align: center;
}

.container .chat .swiper .catechism .input .input-box .show .hint-show-question .hint-box text {
    font-size: 26rpx;
    color: #fff;
}

.container .chat .swiper .catechism .input .input-box .show image {
    width: 70rpx;
    height: 54rpx;
}

.container .chat .swiper .catechism .input .send {
    background-image: linear-gradient(90deg, #ff8e00 0%, #ff5301 100%);
    border-radius: 6rpx;
    width: 120rpx;
    height: 64rpx;
    text-align: center;
    line-height: 64rpx;
}

.container .chat .swiper .catechism .input .send .btn {
    font-size: 30rpx;
    color: #fff;
}

/* swiper 简介 */

.container .chat .swiper .desc {
    background: #f3f3f3;
    overflow-y: scroll;
}

.container .chat .swiper .desc .title {
    background: #fff;
    box-shadow: 0px 1rpx 0px 0px #e8e8e8;
    line-height: 45rpx;
    margin-bottom: 2rpx;
    box-sizing: border-box;
    padding: 30rpx;
}

.container .chat .swiper .desc .title text {
    font-size: 32rpx;
    color: #ff7d00;
    word-break: break-all;
    word-wrap: break-word;
}

.container .chat .swiper .desc .content {
    background: #fff;
    box-sizing: border-box;
    padding: 30rpx;
}

.container .chat .swiper .desc .content rich-text {
    font-size: 30rpx;
    color: #333;
}

/* 输入不能为空 提示信息 */

.container .chat .hint-input-blank {
    position: absolute;
    width: 100%;
    top: 85%;
    display: flex;
    justify-content: center;
}

.container .chat .hint-input-blank .hint-box {
    background-color: rgba(20, 20, 20, 0.8);
    border-radius: 5rpx;
    padding: 15rpx 55rpx;
    display: flex;
}

.container .chat .hint-input-blank text {
    font-size: 24rpx;
    color: #fff;
}

/*抽奖*/
.container .chat .lottery{
    position: fixed;
    height: 71%;
    width: 100%;
    flex: 1;
}

/*奖杯*/
.container .chat .prize{
    position: absolute;
    height: 65%;
    width: 100%;
    flex: 1;
}

</style>