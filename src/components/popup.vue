<template>
  <view
    class="popup"
    :class="{
      open,
    }"
  >
    <view class="popup__mask" @tap="close"></view>
    <view class="popup__content">
      <view class="popup__content__header">
        <view class="popup__content__header__title" v-if="title">{{
          title
        }}</view>
        <view class="popup__content__header__close" @tap="close">
          <image :src="closeIcon" class="icon" />
        </view>
      </view>
      <view class="popup__content__body">
        <slot></slot>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import closeIcon from "@src/assets/close.png";

defineProps<{
  title?: string;
  open?: boolean;
}>();

const emit = defineEmits<{
  (event: "close"): void;
}>();

const close = () => {
  console.log("close");
  emit("close");
};
</script>

<style lang="scss">
.popup {
  &__mask {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 100;
  }
  &__content {
    position: fixed;
    z-index: 101;
    bottom: -100vh;
    left: 0;
    width: 100%;
    background: #fff;
    border-radius: 24px 24px 0 0;
    transition: bottom 200ms ease-in-out;
    &__header {
      border-bottom: 1px solid #efefef;
      &__title {
        font-size: 32px;
        font-weight: bold;
        color: #333;
        padding: 20px;
        text-align: center;
      }
      &__close {
        position: absolute;
        top: 16px;
        right: 16px;
        opacity: 0.5;
        .icon {
          width: 48px;
          height: 48px;
        }
      }
    }
    &__body {
      padding: 0 32px;
    }
  }

  &.open &__mask {
    display: block;
  }
  &.open &__content {
    bottom: 0;
  }
}
</style>