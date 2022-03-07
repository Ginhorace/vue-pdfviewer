<template>
  <el-button type="primary" @click="openSampleRepo">打开样本库</el-button>
  <el-button type="primary" @click="saveStat">保存本次测试结果</el-button>
  <el-button type="primary" @click="listResult">查看测试结果列表</el-button>
  <el-row>
    <el-col :span="8">
      <el-table :data="resultList">
        <el-table-column label="测试名称">
          <template #default="scope">
            {{ scope.row }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button type="primary" @click="getStatInfo(scope.row)">加载统计</el-button>
            <el-button type="primary" @click="downloadResult(scope.row)">下载文件</el-button>
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
    <el-col :span="16">
      <el-descriptions title="测试统计" :column="4" size="small" border>
        <el-descriptions-item label="表格总数：">{{ statInfo.allTableCount }}</el-descriptions-item>
        <el-descriptions-item label="识别错误的表格数：">{{
          statInfo.errTableCount
        }}</el-descriptions-item>
        <el-descriptions-item label="识别正确的表格数：">{{
          statInfo.allTableCount - statInfo.errTableCount
        }}</el-descriptions-item>
        <el-descriptions-item label="表格识别正确率：">{{
          1 - statInfo.errTableCount / statInfo.allTableCount
        }}</el-descriptions-item>

        <el-descriptions-item label="单元格总数">{{ statInfo.allCellCount }}</el-descriptions-item>
        <el-descriptions-item label="识别正确的单元格数：">{{
          statInfo.allCellCount - statInfo.errCellCount
        }}</el-descriptions-item>
        <el-descriptions-item label="识别错误的单元格数：">{{
          statInfo.errCellCount
        }}</el-descriptions-item>
        <el-descriptions-item label="单元格识别正确率：">{{
          1 - statInfo.errCellCount / statInfo.allCellCount
        }}</el-descriptions-item>
      </el-descriptions>
      <el-scrollbar height="800px" always>
        <el-table :data="statInfo.extraInfos">
          <el-table-column label="文件名称" prop="fileName"> </el-table-column>
          <el-table-column label="行" prop="row"> </el-table-column>
          <el-table-column label="列" prop="col"> </el-table-column>
          <el-table-column label="错误原因" prop="err"> </el-table-column>
        </el-table>
      </el-scrollbar>
    </el-col>
  </el-row>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import * as axios from 'common/Axios';
var curPage = ref(1);
var total = ref(1);
var pageCount = ref(10);
var resultList = ref([]);
var statInfo = ref([]);
var loading = ref(false);

function openSampleRepo() {
  window.open('http://10.200.125.202:4001/tests/p/%7B8B2FEB4E-A824-4103-A484-5528809FCBAB%7D');
}

function saveStat() {
  axios.saveStat();
}
function listResult() {
  axios.listResult(curPage.value, pageCount.value, (pagehelper) => {
    total.value = pagehelper.total;
    resultList.value = pagehelper.data;
  });
}
function getStatInfo(row: any) {
  if (row)
    axios.getStatInfo(row, (info) => {
      statInfo.value = info;
    });
}
function downloadResult(row: any) {
  if (row) location.href = '/valid/stat/zip?dir=' + row;
}
onMounted(() => {
  listResult();
});
</script>
