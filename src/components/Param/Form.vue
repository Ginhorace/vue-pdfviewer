<template>
  <el-form :inline="true" :model="param">
    <el-form-item label="提取表头">
      <el-switch
        v-model="param.bizModel.tableHead"
        active-text="是"
        inactive-text="否"
        inline-prompt
      >
      </el-switch>
    </el-form-item>
    <el-form-item label="旋转矫正">
      <el-switch
        v-model="param.bizModel.tiltCorrection"
        active-text="是"
        inactive-text="否"
        inline-prompt
      >
      </el-switch>
    </el-form-item>
    <el-form-item label="识别去印章">
      <el-switch
        v-model="param.bizModel.rmSealWhenOCR"
        active-text="是"
        inactive-text="否"
        inline-prompt
      >
      </el-switch>
    </el-form-item>
    <el-form-item label="切割去印章">
      <el-switch
        v-model="param.bizModel.rmSealWhenCut"
        active-text="是"
        inactive-text="否"
        inline-prompt
      >
      </el-switch>
    </el-form-item>
    <el-form-item label="财报科目">
      <el-switch
        v-model="param.bizModel.fiRecMode"
        active-text="是"
        inactive-text="否"
        inline-prompt
      >
      </el-switch>
    </el-form-item>
    <el-form-item label="数字识别">
      <el-switch v-model="param.bizModel.number" active-text="是" inactive-text="否" inline-prompt>
      </el-switch>
    </el-form-item>
    <el-form-item label="彩图识别">
      <el-switch
        v-model="param.bizModel.colorImage"
        active-text="是"
        inactive-text="否"
        inline-prompt
      >
      </el-switch>
    </el-form-item>
  </el-form>
</template>
<script setup lang="ts">
import { TableRecogParam } from 'common/Models';
import { ref, watch } from 'vue';
const props = defineProps<{
  param: TableRecogParam;
}>();
const emit = defineEmits(['update:param']);
var param = ref(props.param);
watch(
  () => props.param,
  (val) => (param.value = val)
);
watch(
  () => param.value,
  (val) => emit('update:param', val)
);
</script>
