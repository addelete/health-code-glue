<template>
  <switch :checked="modelValue" @change="onChange"></switch>
</template>

<script lang="ts" setup>
const props = defineProps<{
  modelValue: boolean;
}>();
const emit = defineEmits<{
  (event: "update:modelValue", newValue: boolean): void;
}>();

const onChange = () => {
  emit("update:modelValue", !props.modelValue);
};
</script>

<style>
</style>