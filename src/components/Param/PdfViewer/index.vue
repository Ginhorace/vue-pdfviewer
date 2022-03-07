<template>
  <el-row>
    <el-col>
      <div id="pageContainer" style="position: absolute">
        <div id="viewer" class="viewer"></div>
        <el-affix
          v-if="file"
          position="bottom"
          target="#pageContainer"
          :offset="50"
          :style="{
            position: 'absolute',
            buttom: '15px',
            left: 0,
            width: '98%',
            'text-align': 'right',
          }"
        >
          <el-input-number :v-if="file" v-model="curPage" :min="1" :max="pageCount" label="页码" />
          <el-button :v-if="file" @click="saveImage">保存当前页</el-button>
        </el-affix>
      </div>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';

// @ts-ignore
import { PDFSinglePageViewer, EventBus } from 'pdfjs-dist/web/pdf_viewer';
import { computed, onMounted, ref, watch } from 'vue';
import { drawLine } from 'common/Utils';
import { useStore } from 'vuex';
const store = useStore();
const viewScale = 3 / 4;

GlobalWorkerOptions.workerPort = store.state.pdfWorker;
var pdfViewer: PDFSinglePageViewer;
var scale = ref(1);
var pageCount = ref<number>(1);

watch(
  () => store.state.drawRect,
  (val, old) => {
    let canvas = pdfViewer.getPageView(curPage.value - 1).canvas;
    if (old) {
      for (var rect of old) {
        rect.color = '#FFFFFFFF';
        drawLine(rect, canvas, viewScale / scale.value);
      }
    }
    if (val) {
      for (var rect of val) {
        drawLine(rect, canvas, viewScale / scale.value);
      }
    }
  }
);
const file = computed(() => store.state.file);
watch(
  () => store.state.file,
  (val) => {
    if (val) {
      curPage.value = 1;
      loadPdf(val);
    }
  }
);
var curPage = ref(1);
watch(
  () => curPage.value,
  (newPage, old) => {
    let pageView = pdfViewer.getPageView(old - 1);
    pageView.reset();
    focus(newPage);
  }
);
const image = computed({
  get: () => store.state.image,
  set: (val) => store.commit('setImage', val),
});

/**
 * 初始化PDFViewer
 */
function initialize(container: HTMLElement) {
  pdfViewer = new PDFSinglePageViewer({
    container,
    eventBus: new EventBus(),
    annotationMode: 1,
  });
}
/**
 * 加载PDF
 */
function loadPdf(val: File) {
  val.arrayBuffer().then((res: any) => {
    //打开PDF
    getDocument({
      data: res,
      cMapUrl: '/static/cmaps/',
      cMapPacked: true,
    }).promise.then((pdfDocument) => {
      //前端显示
      pdfViewer.setDocument(pdfDocument);
      //获取页码
      pageCount.value = pdfDocument.numPages;
      focus(1);
    });
  });
}
/**
 * 翻页
 */
function focus(page: number) {
  if (page && pdfViewer) {
    if (page > pageCount.value) {
      page = pageCount.value;
    }

    let pdfPage: Promise<any> = pdfViewer.pdfDocument.getPage(page);
    pdfPage.then((pageProxy) => {
      //设置缩放比例
      //如果宽长高短
      //todo 页面的缩放会对输出有影响
      if (pageProxy.view[2] > pageProxy.view[3]) {
        scale.value = (2000 / pageProxy.view[3]) * viewScale;
      } else {
        scale.value = (2000 / pageProxy.view[2]) * viewScale;
      }
      //保存宽度为2000时的图片
      let viewport = pageProxy.getViewport({ scale: scale.value / viewScale });
      let canvas = document.createElement('canvas');
      let context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      let renderContext = {
        canvasContext: context,
        viewport: viewport,
      };

      pageProxy.render(renderContext).promise.then(() => {
        image.value = canvas.toDataURL('image/jpeg');
        //页面展示
        pdfViewer.scrollPageIntoView({
          pageNumber: page,
          destArray: [null, { name: 'XYZ' }, 0, 0, 3 / 4],
        });
      });
    });
  }
}

/**
 * 将页面保存为图片
 */
function saveImage() {
  const link = document.createElement('a');
  if (image.value) {
    link.href = image.value;
    link.download = concatName(file.value?.name, curPage.value); // 自定义文件名
    link.click();
  }
}
function concatName(filename: any, page: any) {
  let dot = filename.lastIndexOf('.');
  if (dot == -1) {
    return filename + '_' + page + '.jpg';
  } else {
    return filename.substring(0, dot) + '_' + page + '.jpg';
  }
}

onMounted(() => {
  var container = document.getElementById('pageContainer');
  if (container) {
    initialize(container);
  }
  if (file.value) {
    loadPdf(file.value);
  }
});
</script>

<style>
@import 'pdfjs-dist/web/pdf_viewer.css';
.viewer-border {
  border: 1px solid var(--el-border-color-base);
  border-radius: 0;
}
</style>
