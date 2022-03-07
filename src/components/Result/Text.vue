<template>
  <el-table :data="texts" @cell-click="showRect" :width="600" v-if="texts">
    <el-table-column prop="Text" label="内容" show-overflow-tooltip> </el-table-column>
  </el-table>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue';
import { DrawRect } from 'common/Models';
import { useStore } from 'vuex';
const store = useStore();
const texts = computed({
  get: () => store.state.textResult,
  set: (val: any) => store.commit('setTextResult', val),
});
function showRect(row: any) {
  store.commit('setDrawRect', [new DrawRect(row.TextRegion, 'cell')]);
}
</script>
