<template>
  <el-dialog title="倾斜矫正结果" v-model="visible">
    <el-image :src="'data:image/png;base64,' + store.state.showImage"></el-image>
  </el-dialog>
</template>
<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useStore } from 'vuex';
const store = useStore();

const visible = computed({
  get: () => (store.state.showImage ? true : false),
  set: (val: boolean) => {
    if (!val) store.commit('setShowImage', '');
  },
});
</script>
