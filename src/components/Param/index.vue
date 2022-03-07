<template>
  <el-row>
    <el-col :span="10" :gutter="30">
      <el-row>
        <el-col :span="6">
          <el-upload :http-request="uploadFile" :show-file-list="false" action="">
            <el-button type="primary">点击上传PDF或图片</el-button>
          </el-upload>
        </el-col>
        <el-col :span="10">
          <span>服务选择：</span>
          <el-select v-model="serviceUrl" style="width: 50%">
            <el-option
              v-for="item in allService"
              :key="item.name"
              :label="item.name"
              :value="item.url"
            >
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="24">
          <span>文件名：{{ filePath }}</span>
        </el-col>
      </el-row>
    </el-col>
    <el-col :span="14">
      <el-row justify="end">
        <el-col :span="8">
          <span>业务选择：</span>
          <el-select v-model="param.bizModel" value-key="id">
            <el-option
              v-for="(item, index) in allBiz"
              :key="index"
              :label="item.name"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="12">
          <el-button type="primary" @click="recog(1)" v-loading="ocrLoading">表格识别</el-button>
          <el-button type="primary" @click="recog(3)" v-loading="ocrLoading">文本识别</el-button>
          <el-button
            type="primary"
            @click="recog(2)"
            v-loading="ocrLoading"
            :disabled="!serviceUrl.includes('/fdc')"
          >
            全页识别
          </el-button>
        </el-col>
        <!-- <el-col>
          <param-form v-model:param="param" v-if="serviceUrl.includes('/fdc')"></param-form>
        </el-col> -->
      </el-row>
    </el-col>
  </el-row>
</template>
<script setup lang="ts">
import { DrawRect, Enables, TableRecogParam, allBiz, allService } from 'common/Models';
import { ocrAll, ocrTable, ocrText } from 'common/Axios';
import { ElMessage } from 'element-plus';
import { computed, ref, watch } from 'vue';
import ParamForm from './Form.vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
const store = useStore();
const route = useRoute();

var param = ref(new TableRecogParam());
param.value.bizModel = Enables.fiReport();
if (typeof route.query.biz == 'string') {
  for (let biz of allBiz) {
    if (biz.name == route.query.biz) {
      param.value.bizModel = new Enables(biz);
    }
  }
}

var serviceUrl = ref('/fdc');
if (typeof route.query.service == 'string') {
  for (let service of allService) {
    if (service.name == route.query.service) {
      serviceUrl.value = service.url;
    }
  }
}

var ocrLoading = ref(false);
watch(
  () => store.state.image,
  (val) => (param.value.image = val)
);
const filePath = computed(() => store.state.file?.name);
/**
 * 获取文件
 */
function uploadFile(request: { file: File }) {
  store.commit('uploadFile', request.file);
}

function recog(type: number) {
  if (!store.state.image) {
    alert('请打开文件！');
    return;
  }
  ocrLoading.value = true;
  store.commit('setTableResult', undefined);
  store.commit('setTextResult', undefined);
  let reqfun = ocrTable;
  if (type == 1) {
    reqfun = ocrTable;
  } else if (type == 2) {
    reqfun = ocrAll;
  } else if (type == 3) {
    reqfun = ocrText;
  }

  reqfun(
    serviceUrl.value,
    param.value,
    (res) => {
      if (!res.Result) {
        ElMessage('请求结果异常！' + res.ErrInfo);
      } else {
        store.commit('setRequestUuid', res.ErrInfo);
        if (type > 1) {
          let textLines = [];
          for (let textblock of res.Data.TextBlocks) {
            // console.log(textblock);
            textLines.push(...textblock.TextLines);
          }
          // store.commit('setTextResult', res.Data.TextBlocks[0].TextLines);
          store.commit('setTextResult', textLines);
        }
        if (type < 3) {
          store.commit('setTableResult', res.Data.Tables);
          let array = [];
          for (let table of res.Data.Tables) {
            array.push(new DrawRect(table.TableRegion, 'cell'));
            if (table.Extend.TableHeader) {
              array.push(new DrawRect(table.Extend.TableHeader.HeaderRegion, 'cell', '#00ff00'));
            }
          }
          store.commit('setDrawRect', array);
        }
      }
    },
    () => {
      ocrLoading.value = false;
    }
  );
}
</script>
