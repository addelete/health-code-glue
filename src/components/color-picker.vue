<template>
  <view class="color-picker">
    <view class="color-picker__option" v-for="option in options" :key="option" @tap="select(option)">
      <view
        class="color-picker__option__color"
        :class="{
          active: option === modelValue,
        }"
        :style="{
          backgroundColor: option,
        }"
      >{{option === modelValue ? '✓' : ''}}</view>
    </view>
  </view>
</template>

<script lang="ts" setup>
defineProps<{
  options: string[];
  modelValue: string;
}>();

const emit = defineEmits<{
  (event: 'update:modelValue', newValue: string): void;
}>();

const select = (option: string) => {
  emit('update:modelValue', option);
};

</script>

<style lang="scss">
.color-picker {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  &__option {
    width: 70px;
    height: 70px;
    padding: 10px;
    box-sizing: border-box;
    &__color {
      width: 100%;
      height: 100%;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      &.active {
        box-shadow: 6px 6px 6px 3px rgba(0,0,0,0.3);
      }
    }
    
  }
}
</style>