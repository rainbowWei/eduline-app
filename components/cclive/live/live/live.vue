<template>
<view class="container">
    <live-player>
        <slot></slot>
    </live-player>
</view>

</template>
<script>

export default {
  data() {
    return {};
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
    methods: {},
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
/* components/live/player/player.css */
</style>