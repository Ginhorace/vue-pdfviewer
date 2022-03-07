<template>
  <detail-dialog></detail-dialog>
  <header-dialog></header-dialog>
  <image-dialog></image-dialog>
  <el-row>
    <el-col>
      <Param />
    </el-col>
  </el-row>
  <el-row>
    <el-col :span="10">
      <div v-if="store.getters.isPdf">
        <pdf-viewer />
      </div>
      <div v-else>
        <image-viewer />
      </div>
    </el-col>
    <el-col :span="14">
      <el-scrollbar height="800px" always>
        <el-row>
          <el-col :span="9"> ID:{{ uuid }} </el-col>
          <el-col :span="6" v-if="store.state.tableResult">
            <el-tooltip
              class="box-item"
              effect="dark"
              content="表格中红色文本表示置信度低于该阈值"
              placement="left"
            >
              置信度阈值
            </el-tooltip>
            <el-input-number
              style="width: 120px"
              :min="0"
              :max="1"
              :step="0.1"
              v-model="confidenceThreshold"
          /></el-col>
          <el-col :span="6">
            <el-select
              v-if="store.state.tableResult"
              v-model="imageLabel"
              placeholder="选择图片类型"
              size="small"
            >
              <el-option
                v-for="(item, index) in imageType"
                :key="index"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="3">
            <el-button
              size="small"
              type="primary"
              @click="commitTable"
              v-if="store.state.tableResult"
              v-loading="uploadLoading"
            >
              上传到样本库
            </el-button>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <result-vue />
          </el-col>
          <el-col>
            <text-vue></text-vue>
          </el-col>
        </el-row>
      </el-scrollbar>
    </el-col>
  </el-row>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue';
import PdfViewer from 'components/Param/PdfViewer/index.vue';
import ImageViewer from 'components/Param/ImageViewer/index.vue';
import ResultVue from 'components/Result/TableResult.vue';
import Param from 'components/Param/index.vue';
import TextVue from 'components/Result/Text.vue';
import DetailDialog from 'components/Result/DetailDialog.vue';
import HeaderDialog from 'components/Result/HeaderDialog.vue';
import ImageDialog from 'components/Result/ImageDialog.vue';
import { uploadSample } from 'common/Utils';
import { imageType } from 'common/Models';
import { useStore } from 'vuex';

import { useRoute } from 'vue-router';
const store = useStore();
//todo 增加文件名
const confidenceThreshold = computed({
  get: () => store.state.confidenceThreshold,
  set: (val: number) => store.commit('setConfidenceThreshold', val),
});
const route = useRoute();
if (typeof route.query.thd == 'string') {
  confidenceThreshold.value = Number.parseFloat(route.query.thd);
}
const uuid = computed(() => store.state.uuid);

var uploadLoading = ref(false);

var imageLabel = ref('');

function commitTable() {
  if (!imageLabel.value) {
    alert('选择图片类型!');
    return;
  }
  let image = store.state.image;
  let tables = store.state.tableResult;
  for (let table of tables) {
    if (!table.label) {
      alert('有未打标签的表格!');
      return;
    }
  }
  uploadLoading.value = true;
  let fileName = store.state.file.name;
  uploadSample(image, tables, imageLabel.value, fileName, uploadLoading);
}
</script>
