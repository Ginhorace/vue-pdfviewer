<template>
  <detail-dialog></detail-dialog>
  <el-row>
    <el-col>
      <el-table :data="tableData" :height="300" style="width: 100%" @row-click="showResult">
        <el-table-column prop="ob_object_id" label="ID" />
        <el-table-column prop="sample_type" label="样本类型" width="180" />
        <el-table-column prop="label" label="标签" width="180" />
        <!-- <el-table-column prop="oper_user" label="创建人" /> -->
        <el-table-column prop="rp_gen_datetime" label="生成时间" />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">
              删除样本
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="block" v-loading="loading">
        <el-pagination
          v-model:currentPage="curPage"
          layout="prev,pager, next,jumper"
          :page-size="pageCount"
          :total="total"
        >
        </el-pagination>
      </div>
    </el-col>
  </el-row>
  <el-row>
    <el-col :span="10">
      <span>{{ dataInfo.fileName }}</span>
      <image-viewer :img-result="dataInfo.image" />
    </el-col>
    <el-col :span="14">
      <el-select
        v-if="store.state.tableResult"
        v-model="imageLabel"
        placeholder="选择图片类型"
        size="small"
      >
        <el-option v-for="(item, index) in imageType" :key="index" :label="item" :value="item">
        </el-option>
      </el-select>
      <el-button v-if="dataInfo.id" size="small" type="primary" @click="handleUpdate(dataInfo.id)">
        更新样本
      </el-button>
      <result-vue />
    </el-col>
  </el-row>
</template>
<script setup lang="ts">
import DetailDialog from 'components/Result/DetailDialog.vue';
import ImageViewer from 'components/Param/ImageViewer/index2.vue';
import ResultVue from 'components/Result/TableResult.vue';
import { showSample, deleteSample, updateSample, pageCount } from 'common/Axios';
import { onMounted, ref, watch } from 'vue';
import { imageType } from 'common/Models';
import { useStore } from 'vuex';
const store = useStore();
var tableData = ref([]);
var curPage = ref(1);
var total = ref(1);
var loading = ref(false);
var imageLabel = ref('');
var dataInfo = ref({ id: '', image: '', fileName: '' });

watch(() => curPage.value, loadSample);
function loadSample(page: number) {
  loading.value = true;
  showSample(
    page,
    (val: any) => {
      total.value = val.totalNum;
      curPage.value = val.beginPage;
      tableData.value = val.pageData;
    },
    () => {
      loading.value = false;
    }
  );
}

function showResult(row: any) {
  dataInfo.value = { id: row.ob_object_id, image: '', fileName: '' };
  let sample = JSON.parse(row.sample);
  dataInfo.value.image = sample.data;
  if (sample.attach?.fileName) {
    dataInfo.value.fileName = sample.attach?.fileName;
  }
  store.commit('setTableResult', JSON.parse(row.correct_result));
}
function handleDelete(index: number, row: any) {
  loading.value = true;
  deleteSample(row.ob_object_id, () => {
    (loading.value = false), (row.ob_object_id = '');
  });
  //todo set Button disabled
}
function handleUpdate(id: string) {
  if (!id) {
    alert('请选择样本');
    return;
  }
  updateSample(id, store.state.tableResult, imageLabel.value, () => (loading.value = false));
  //todo 不能放在列表中，需要拿出来
}

onMounted(() => loadSample(1));
</script>
