<template>
  <el-dialog title="表头信息" v-model="visible">
    <el-table :data="store.state.showHeader.TextLines" @row-click="clickHeader">
      <el-table-column label="表头内容" prop="Text"> </el-table-column>
    </el-table>
  </el-dialog>
</template>
<script setup lang="ts">
import { DrawRect } from 'common/Models';
import { computed, ref, watch } from 'vue';
import { useStore } from 'vuex';
const store = useStore();

const visible = computed({
  get: () => (store.state.showHeader ? true : false),
  set: (val: boolean) => {
    if (!val) store.commit('setShowHeader', '');
  },
});

function clickHeader(row: any) {
  store.commit('setDrawRect', [new DrawRect(row.TextRegion, 'vertical')]);
}
</script>
