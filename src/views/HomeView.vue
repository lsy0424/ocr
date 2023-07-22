<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
    <p style="margin-top: 100px">
      <button id="openMedia" @click="openMedia()">打开</button>
      <button @click="closeMedia()">关闭</button>
      <button @click="drawMedia()">截取</button>
    </p>
    <!-- 摄像展示要用video标签 -->
    <video autoplay id="video" class="bg"></video>
    <!-- 截取的照片用canvas标签展示 -->
    <canvas id="qr-canvas"></canvas>
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'HomeView',
  data () {
    return {
      video: document.querySelector('video'),
      canvas1: document.getElementById('qr-canvas'),
      mediaStreamTrack: null,
      context1: null
    }
  },
  created () {
    // this.openMediaBefore()
  },
  methods: {
    openMediaBefore () {
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
      // 摄像头调用配置
      const mediaOpts = {
        audio: false,
        video: {
          facingMode: { exact: 'environment' },
          width: 1280,
          height: 720
        }
        // video: { facingMode: 'environment' } // 调用前置摄像头
        // video: { width: 1280, height: 720 },  //影响呈现的大小。注意不能用百分比
        //  video: { facingMode: { exact: "environment" } }// 这个是调用后置摄像头
      }

      console.log(this.video)
      navigator.mediaDevices
        .getUserMedia(mediaOpts)
        .then((stream) => {
          console.log(stream)
          this.mediaStreamTrack = stream
          console.log(1)
          this.video = document.querySelector('video')
          console.log(2)
          if ('srcObject' in this.video) {
            console.log(3)
            this.video.srcObject = stream
          } else {
            console.log4()
            this.video.src =
              (window.URL && window.URL.createObjectURL(stream)) || stream
          }
          console.log(5)
          document.getElementById('openMedia').addEventListener(
            'click',
            () => {
              this.video.play()
            },
            false
          )
        })
        .catch((e) => {
          alert(e)
        })
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
      this.canvas1.setAttribute('width', this.video.videoWidth)
      this.canvas1.setAttribute('height', this.video.videoHeight)
      this.content1 = this.canvas1.getContext('2d')
      this.context1.drawImage(
        this.video,
        0,
        0,
        this.video.videoWidth,
        this.video.videoHeight
      )
    }
  }
}
</script>
<!-- <script type="text/javascript">
// var video = document.querySelector("video");
// var text = document.getElementById("text");
// var canvas1 = document.getElementById("qr-canvas");
var context1 = canvas1.getContext("2d");
var mediaStreamTrack;

// 一堆兼容代码
window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL;
if (navigator.mediaDevices === undefined) {
  navigator.mediaDevices = {};
}
if (navigator.mediaDevices.getUserMedia === undefined) {
  navigator.mediaDevices.getUserMedia = function (constraints) {
    var getUserMedia =
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia ||
      navigator.msGetUserMedia;
    if (!getUserMedia) {
      return Promise.reject(
        new Error("getUserMedia is not implemented in this browser")
      );
    }
    return new Promise(function (resolve, reject) {
      getUserMedia.call(navigator, constraints, resolve, reject);
    });
  };
}
</script> -->
