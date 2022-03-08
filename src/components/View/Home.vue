<template>
  <detail-dialog></detail-dialog>
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
import { useStore } from 'vuex';
const store = useStore();
</script>
