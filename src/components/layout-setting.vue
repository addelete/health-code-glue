<template>
  <radio-group class="layout-setting" @change="onChangeType">
    <label
      class="layout-setting__option"
      v-for="option in layoutOptions"
      :key="option"
    >
      <view class="layout-setting__option__radio">
        <radio :value="option" :checked="modelValue.type === option" />
      </view>
      <view class="layout-setting__option__label" v-if="option === 'columns'">
        限制
        <input
          class="num_input"
          type="number"
          :value="modelValue.data.columns"
          @input="(e) => onChangeData(e, 'columns')"
        />
        列
      </view>
      <view class="layout-setting__option__label" v-if="option === 'rows'">
        限制
        <input
          class="num_input"
          type="number"
          :value="modelValue.data.rows"
          @input="(e) => onChangeData(e, 'rows')"
        />
        行
      </view>
    </label>
  </radio-group>
</template>

<script lang="ts" setup>
import { LayoutData, layoutOptions } from "@src/stores/setting";

const props = defineProps<{
  modelValue: LayoutData;
}>();
const emit = defineEmits<{
  (event: "update:modelValue", newValue: LayoutData): void;
}>();

const onChangeType = (e: any) => {
  const newValue = {
    ...props.modelValue,
    type: e.detail.value,
  };
  emit("update:modelValue", newValue);
};

const onChangeData = (e: any, key: keyof LayoutData["data"]) => {
  if (!e.detail.value) {
    return;
  }
  const num = Math.min(99, Math.max(1, e.detail.value));
  const newValue = {
    ...props.modelValue,
    data: {
      ...props.modelValue.data,
      [key]: num,
    },
  };
  emit("update:modelValue", newValue);
};
</script>

<style lang="scss">
.layout-setting {
  &__option {
    display: flex;
    height: 70px;
    align-items: center;
    &__radio {
      flex: 0 0 auto;
      margin-right: 0.5rem;
    }
    &__label {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      .num_input {
        width: 80px;
        height: 50px;
        text-align: center;
        background: #000;
        color: #fff;
        // color: #55B637;
      }
    }
  }
}
</style>