<template>
  <canvas id="image"></canvas>
</template>
<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { drawLine } from 'common/Utils';
import { useStore } from 'vuex';
const store = useStore();

const baseHeight = 1000;
const baseWidth = 600;
var scale = ref(1);
const props = defineProps<{
  imgResult: string;
}>();
watch(
  () => props.imgResult,
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
function loadImage(val: string) {
  if (val) {
    //提交给父组件
    store.commit('setImageWithResult', val);
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
    img.src = val;
  }
}
onMounted(() => {
  loadImage('');
});
</script>
