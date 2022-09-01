<template>
  <radio-group class="radio-picker" @change="onChange">
    <label
      class="radio-picker__option"
      v-for="option in options"
      :key="option.value"
    >
      <view class="radio-picker__option__radio">
        <radio :value="option.value" :checked="modelValue === option.value" />
      </view>
      <text class="radio-picker__option__label">{{ option.label }}</text>
    </label>
  </radio-group>
</template>

<script setup lang="ts">
defineProps<{
  options: {
    value: string;
    label: string;
  }[];
  modelValue: string;
}>();
const emit = defineEmits<{
  (event: "update:modelValue", newValue: string): void;
}>();

const onChange = (e: any) => {
  emit("update:modelValue", e.detail.value);
};
</script>

<style lang="scss">
.radio-picker {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 24px;
  &__option {
    display: flex;
    align-items: center;
    height: 70px;
  }
}
</style>