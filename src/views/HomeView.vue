<template>
  <div class="home" id="id">
    <div style="position: relative; z-index: 999">
      <button id="openMedia" @click="openMedia()">打开</button>
      <button @click="closeMedia()">关闭</button>
      <button @click="drawMedia()">截取</button>
    </div>

    <div class="mask">
      <div class="top"></div>
      <div class="center">
        <div class="left"></div>
        <div class="cc" id="idCardImg">
          <img class="idImg" src="@/assets/idBorder.png" alt="" />
          <!-- 摄像展示要用video标签 -->
          <video
            autoplay
            id="video"
            ref="videoDom"
            class="bg"
            muted
            controlsList="nodownload"
            disablePictureInPicture
            webkit-playsinline="true"
            playsinline="true"
          ></video>
        </div>
        <div class="right"></div>
      </div>

      <div class="down"></div>
    </div>

    <!-- 截取的照片用canvas标签展示 -->

    <canvas id="qr-canvas" ref="canvasRef"></canvas>
  </div>
</template>

<script>
export default {
  name: 'HomeView',
  data () {
    return {
      video: document.querySelector('video'),
      canvas1: document.getElementById('qr-canvas'),
      flag: false,
      mediaStreamTrack: null,
      context1: null
    }
  },
  created () {
    this.successFun(this.$route.query.stream)
  },
  mounted () {
    this.openMedia()
  },
  methods: {
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
    },

    // 正式启动摄像头
    openMedia () {
      console.log(123)
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

      console.log(this.video)
      navigator.mediaDevices
        .getUserMedia(mediaOpts)
        .then((stream) => {
          this.successFun(stream)
        })
        .catch((e) => {
          alert(e)
        })
    },
    successFun (stream) {
      console.log(stream)
      this.mediaStreamTrack = stream
      console.log(1)
      this.video = document.querySelector('video')
      console.log(2)
      if ('srcObject' in this.video) {
        console.log(3)
        this.video.srcObject = this.mediaStreamTrack
      } else {
        console.log(4)
        this.video.src =
          (window.URL && window.URL.createObjectURL(stream)) || stream
      }
      console.log(5, this.video.srcObject)

      document.getElementById('openMedia').addEventListener(
        'click',
        () => {
          this.video.play()
        },
        false
      )
    },
    // 关闭摄像头
    closeMedia () {
      this.mediaStreamTrack.getVideoTracks().forEach(function (track) {
        track.stop()
        this.canvas1 = document.getElementById('qr-canvas')
        this.content1 = this.canvas1.getContext('2d')
        this.context1.clearRect(
          0,
          0,
          this.context1.width,
          this.context1.height
        ) // 清除画布
      })
    },

    // 截取视频
    drawMedia () {
      const canvas = this.$refs.canvasRef
      const video = this.$refs.videoDom
      const ctx = canvas.getContext('2d')
      canvas.width = 600
      canvas.height = 800
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      const img = new Image()
      img.src = canvas.toDataURL('image/png')
      document.getElementById('id').appendChild(img)
      this.downFile(img.src, '截图.jpg')
    },
    downFile (data, fileName) {
      const link = document.createElement('a')

      link.href = data
      link.download = fileName
      link.click()
      // 释放内存
      window.URL.revokeObjectURL(link.href)
    }
  }
}
</script>
<style scoped lang="scss">
video::-webkit-media-controls {
  display: none !important;
}
video::-webkit-media-controls-play-button {
  display: none !important;
  -webkit-appearance: none !important;
}
video::-webkit-media-controls-fullscreen-button {
  display: none !important;
}
video::-webkit-media-controls-enclosure {
  display: none;
}
.home {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  .mask {
    position: relative;
    z-index: 99999;
    display: flex;
    flex-direction: column;
    .top {
      height: 30vh;
      background-color: rgba(0, 0, 0, 1);
    }
    .center {
      display: flex;
      height: 200px;
      .left,
      .right {
        width: 15px;
        height: 100%;
        position: relative;
        z-index: 0;
        background-color: rgba(0, 0, 0, 1);
      }
      .cc {
        position: relative;
        flex: 1;
        .idImg {
          width: 100%;
          height: 200px;
        }
      }
    }
    .down {
      background-color: rgba(0, 0, 0, 1);
      height: 46vh;
    }
  }
  .bg {
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: -1;
  }
}
</style>
