<template>
  <el-dialog v-model="visible" title="单元格(单击图片可以缩放旋转)">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <el-image :src="cellImage"></el-image>
        </div>
      </template>
      <div v-for="(value, index) in textlines" key="index">
        <el-row>
          <el-col :span="12">
            <el-image :src="value.image" :preview-src-list="srcList"></el-image>
          </el-col>
          <el-col :span="12">
            <el-input
              v-model="value.textline.Text"
              @change="() => (value.textline.change = true)"
            />
          </el-col>
        </el-row>
      </div>
    </el-card>
  </el-dialog>
</template>
<script setup lang="ts">
import { clip } from 'common/Utils';
import { computed, ref, watch } from 'vue';
import { useStore } from 'vuex';
const store = useStore();
class TextImage {
  image: string;
  textline: any;
  constructor(image?: string, textline?: any) {
    this.image = image ?? '';
    this.textline = textline ?? { Text: '' };
  }
}
const visible = computed({
  get: () => (store.state.selectedCell ? true : false),
  set: (val: boolean) => {
    if (!val) store.commit('selectCell', '');
  },
});
var textlines = ref<TextImage[]>([]);
var srcList = ref(['']);
var cellImage = ref('');
watch(() => store.state.selectedCell, load);
/**
 * 根据图片和单元格区域获得单元格图片并展示文本内容
 * @param cell
 */
function load(cell: any) {
  srcList.value.length = 0;
  textlines.value.length = 0;
  cellImage.value = '';
  if (store.state.image && cell) {
    //把base64 图片加载到Image上
    let img = new Image();
    img.onload = function () {
      if (this instanceof HTMLImageElement) {
        cellImage.value = clip(this, cell.CellRegion);
        for (let textline of cell.TextLines) {
          let line = new TextImage(clip(this, textline.TextRegion), textline);
          srcList.value.push(line.image);
          textlines.value.push(line);
        }
      }
    };
    img.src = store.state.image;
  }
}
</script>
<style>
.el-image {
  border-style: dashed;
}
</style>
