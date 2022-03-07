<template>
  <el-tabs type="border-card" v-if="tables">
    <el-tab-pane v-for="(table, index) in tables" :key="index" :label="'表格' + index">
      <el-row>
        <el-col :span="6">
          <div class="grid-content bg-purple">
            <el-button
              v-if="table.Extend"
              size="small"
              type="primary"
              @click="showTableHeader(table)"
              >查看表头信息
            </el-button>
            <el-button v-if="table.Extend" size="small" type="primary" @click="showTiltImage(table)"
              >查看矫正后图片
            </el-button>
          </div>
        </el-col>
        <el-col :span="9">
          <el-descriptions>
            <el-descriptions-item label="表格方向：">{{
              table.Extend?.TableDir
            }}</el-descriptions-item>
            <el-descriptions-item label="表格类型：">{{
              table.Extend?.TableType
            }}</el-descriptions-item>
            <el-descriptions-item label="表格颜色：">{{
              table.Extend?.Color
            }}</el-descriptions-item>
          </el-descriptions>
        </el-col>
        <el-col :span="6">
          <span>识别结果：</span>
          <el-select v-model="table.label" placeholder="选择表格标签" size="small">
            <el-option
              v-for="(item, index) in tableOption"
              :key="index"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="3">
          <div class="grid-content bg-purple">
            <el-button type="success" size="small" @click="copyTable(table)"> 复制表格 </el-button>
          </div>
        </el-col>
      </el-row>
      <el-tooltip
        class="box-item"
        effect="dark"
        content="单击单元格可以查看位置，双击可以修改文本"
        placement="top"
        :show-after="1500"
      >
        <table-vue :table="table" />
      </el-tooltip>
    </el-tab-pane>
  </el-tabs>
</template>
<script setup lang="ts">
import { computed, watch } from 'vue';
import { ElMessage } from 'element-plus';
import useClipboard from 'vue-clipboard3';
import TableVue from './Table.vue';
import { useStore } from 'vuex';
import { tableOption } from 'common/Models';
const store = useStore();
const tables = computed({
  get: () => store.state.tableResult,
  set: (val: any) => store.commit('setTableResult', val),
});

const { toClipboard } = useClipboard();
/**
 * 复制表格
 */
const copyTable = (table: any) => {
  try {
    let data = collectTable(table) as Array<any>;
    let headTable = '',
      contentTable = '';
    let { Col } = table;
    // 表格内容
    // console.log(data);
    for (let m = 0; m < data.length; m++) {
      // 行
      for (let n = 0; n < Col; n++) {
        // 列
        let s = '';
        if (data[m][n]) {
          s = data[m][n].TextLines.map((item: any) => {
            return item.Text;
          }).join(''); //单元格多行文字
        }
        contentTable += s;
        if (n !== Col - 1) {
          contentTable += '\t';
        }
      }
      if (m !== data.length - 1) {
        contentTable += '\n';
      }
    }
    toClipboard(contentTable);
    ElMessage.success('复制成功');
  } catch (e) {
    console.error(e);
    ElMessage.error('复制失败');
  }
};

function collectTable(table: any) {
  let group = [];

  for (let row = 0; row < table.Row; row++) {
    group[row] = {};
    for (let col = 0; col < table.Col; col++) {
      // @ts-ignore
      group[row][col] = undefined;
    }
  }
  for (let cell of table.Cells) {
    // @ts-ignore
    group[cell.RowIndex][cell.ColIndex] = cell;
  }
  return group;
}

function showTableHeader(table: any) {
  if (table.Extend?.TableHeader) {
    store.commit('setShowHeader', table.Extend?.TableHeader);
  } else {
    ElMessage('没有表头识别结果');
  }
}

function showTiltImage(table: any) {
  if (table.Extend?.Image) {
    store.commit('setShowImage', table.Extend?.Image);
  } else {
    ElMessage('没有矫正图片结果');
  }
}
</script>

<style scoped>
.el-row {
  margin-bottom: 20px;
}
.el-col {
  border-radius: 4px;
}
.grid-content {
  font-size: 16px;
  border-radius: 4px;
  height: 36px;
  line-height: 36px;
}
.bg-purple-float {
  float: right;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
.el-table .cell {
  white-space: pre-wrap;
}
</style>
