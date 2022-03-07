<template>
  <el-scrollbar id="imageViewer" height="800px" width="400px">
    <canvas id="image"></canvas>
    <el-affix
      v-if="imageStr"
      position="bottom"
      target="#imageViewer"
      :offset="50"
      :style="{
        position: 'absolute',
        buttom: '15px',
        left: 0,
        width: '98%',
        'text-align': 'right',
      }"
    >
      <el-button :v-if="imageStr" @click="restoreScale()">加载原图</el-button>
    </el-affix>
  </el-scrollbar>
</template>
<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { drawLine } from 'common/Utils';
import { useStore } from 'vuex';
const store = useStore();

var imageStr = ref<string>();
const baseHeight = 1000;
const baseWidth = 600;
var scale = ref(1);
watch(
  () => store.state.file,
  (val) => {
    if (val) {
      loadImage(val);
    }
  }
);

watch(
  () => store.state.drawRect,
  (val, old) => {
    let canvas = document.getElementById('image') as HTMLCanvasElement;
    if (old) {
      for (var rect of old) {
        rect.color = '#FFFFFFFF';
        drawLine(rect, canvas, scale.value);
      }
    }
    if (val) {
      for (var rect of val) {
        drawLine(rect, canvas, scale.value);
      }
    }
  }
);
function loadImage(val: File | undefined) {
  if (val) {
    //读取本地文件
    let reader = new FileReader();
    //结果处理
    reader.onloadend = function () {
      if (typeof this.result == 'string') {
        //提交给父组件
        store.commit('setImage', this.result);
        //获得base64字符串
        imageStr.value = this.result;
        //画在画布上
        let canvas = document.getElementById('image') as HTMLCanvasElement;
        let ctx = canvas.getContext('2d');
        //把base64 图片加载到Image上
        let img = new Image();
        img.onload = function () {
          if (this instanceof HTMLImageElement) {
            scale.value = baseHeight / this.height;
            if (scale.value * this.width > baseWidth) {
              scale.value = baseWidth / this.width;
            }
            canvas.width = scale.value * this.width;
            canvas.height = scale.value * this.height;
            ctx?.drawImage(this, 0, 0, scale.value * this.width, scale.value * this.height);
          }
        };
        img.src = this.result;
      }
    };
    reader.readAsDataURL(val);
  }
}
function restoreScale() {
  //画在画布上
  let canvas = document.getElementById('image') as HTMLCanvasElement;
  let ctx = canvas.getContext('2d');
  //把base64 图片加载到Image上
  let img = new Image();
  img.onload = function () {
    if (this instanceof HTMLImageElement) {
      canvas.width = this.width;
      canvas.height = this.height;
      ctx?.drawImage(this, 0, 0, this.width, this.height);
    }
  };
  if (imageStr.value) {
    img.src = imageStr.value;
    scale.value = 1;
  }
}
onMounted(() => {
  loadImage(store.state.file);
});
</script>
