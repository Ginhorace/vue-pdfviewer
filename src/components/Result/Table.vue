<template>
  <el-table
    ref="refTable"
    :data="collectTable(table)"
    :width="600"
    @cell-click="showRect"
    @cell-dblclick="showDetail"
  >
    <el-table-column
      v-for="key in getHeader(table)"
      :key="key"
      :prop="key"
      :label="key"
      :formatter="formatter"
    >
    </el-table-column>
  </el-table>
</template>
<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { DrawRect } from 'common/Models';
import { useStore } from 'vuex';
import { clip } from 'common/Utils';
const store = useStore();
const props = defineProps<{
  table: any;
}>();
const threshold = computed(() => store.state.confidenceThreshold);
watch(
  () => threshold.value,
  (val) => {
    if (tables.value) {
      refTable.value.$forceUpdate();
    }
  }
);
const tables = computed({
  get: () => store.state.tableResult,
  set: (val: any) => store.commit('setTableResult', val),
});

var refTable = ref();

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
    cell.text = getText(cell);
    cell.image = getImage(cell);
    // @ts-ignore
    group[cell.RowIndex][cell.ColIndex] = cell;
  }
  return group;
}
function getHeader(table: any) {
  let header = new Set();
  for (let i = 0; i < table.Col; i++) {
    header.add(i + '');
  }
  return header;
}
function formatter(row: any, column: any, cell: any) {
  let res = '';
  if (cell) {
    for (let textLine of cell.TextLines) {
      res += textLine.Text;
    }
  }
  return res;
}
function getText(cell: any) {
  let res = '';
  if (cell) {
    for (let textLine of cell.TextLines) {
      res += textLine.Text;
    }
  }
  return res;
}
function getImage(cell: any) {
  if (store.state.imageElement && cell) {
    return clip(store.state.imageElement, cell.CellRegion);
  }
  return '';
}

function showRect(row: any, column: any) {
  let cell = row[column.property];
  let array = [new DrawRect(cell.CellRegion, 'horizontal')];
  for (let textLine of cell.TextLines) {
    array.push(new DrawRect(textLine.TextRegion, 'vertical'));
  }
  store.commit('setDrawRect', array);
}

function showDetail(row: any, column: any) {
  let cell = row[column.property];
  store.commit('selectCell', cell);
}
</script>
