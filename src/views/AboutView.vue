<template>
  <div class="publish">
    <button @click="openMedia">123456789</button>
  </div>
</template>

<script>
export default {
  created () {
    this.init()
  },
  methods: {
    // 正式启动摄像头
    openMedia () {
      // 摄像头调用配置
      const mediaOpts = {
        audio: false,
        video: {
          width: 1280,
          aspectRatio: { ideal: 16 / 9 }, // 设置期望的宽高比
          frameRate: { ideal: 30 }, // 设置期望的帧率
          facingMode: { exact: 'environment' }
        }
        // video: { facingMode: 'environment' } // 调用前置摄像头
        // video: { width: 1280, height: 720 },  //影响呈现的大小。注意不能用百分比
        //  video: { facingMode: { exact: "environment" }{ facingMode: { exact: "environment" } }// 这个是调用后置摄像头
      }

      navigator.mediaDevices
        .getUserMedia(mediaOpts)
        .then((stream) => {
          this.$router.push({
            path: '/',
            query: {
              stream
            }
          })
        })
        .catch((e) => {
          alert(e)
        })
    },
    init () {
      window.URL =
        window.URL || window.webkitURL || window.mozURL || window.msURL
      if (navigator.mediaDevices === undefined) {
        navigator.mediaDevices = {}
      }
      if (navigator.mediaDevices.getUserMedia === undefined) {
        navigator.mediaDevices.getUserMedia = function (constraints) {
          const getUserMedia =
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia ||
            navigator.msGetUserMedia
          if (!getUserMedia) {
            return Promise.reject(
              new Error('getUserMedia is not implemented in this browser')
            )
          }
          return new Promise(function (resolve, reject) {
            getUserMedia.call(navigator, constraints, resolve, reject)
          })
        }
      }
    }
  }
}
</script>
