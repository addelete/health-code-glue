

<template>
  <button @tap="openPopup">设置</button>
  <popup title="设置" :open="popupOpen" @close="popupOpen = false">
    <!-- <text>{{JSON.stringify(editingData)}}</text> -->
    <view v-if="editingData">
      <view class="form-item">
        <label class="form-item__label">图片排列</label>
        <view class="form-item__control">
          <layout-setting v-model="editingData.layout" />
          <view class="helper">图片自动按限制行数或列数排列</view>
        </view>
      </view>

      <view class="form-item">
        <label class="form-item__label">文本内容</label>
        <view class="form-item__control">
          <input
            type="text"
            v-model="editingData.text.content"
            placeholder="请输入文字"
          />
          <view class="helper">显示在合图上的文字，例如：姓名</view>
        </view>
      </view>
      <view class="form-item">
        <label class="form-item__label">文本颜色</label>
        <view class="form-item__control">
          <color-picker
            v-model="editingData.text.color"
            :options="textColorOptions"
          />
          <view class="helper">合图上的文字颜色</view>
        </view>
      </view>
      <view class="form-item">
        <label class="form-item__label">文本位置</label>
        <view class="form-item__control">
          <radio-picker
            v-model="editingData.text.place"
            :options="textPlaceOptions"
          />
          <view class="helper">合图上的文字位置</view>
        </view>
      </view>
      <view class="form-item">
        <label class="form-item__label">文本字号</label>
        <view class="form-item__control">
          <input
            type="number"
            v-model="editingData.text.fontSize"
            placeholder="请输入字号"
          />
          <view class="helper">合图上的文字字号大小</view>
        </view>
      </view>
      <view class="form-item">
        <label class="form-item__label">自动保存</label>
        <view class="form-item__control">
          <my-switch v-model="editingData.autoSave"></my-switch>
          <view class="helper">开启时，选择图片合图成功后，自动保存到相册</view>
        </view>
      </view>
      <button class="primary block submit-button" @tap="submitPopup">
        确定
      </button>
    </view>
  </popup>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import {
  SettingsData,
  textPlaceOptions,
  textColorOptions,
  useSettingStore,
} from "@src/stores/setting";
import ColorPicker from "@src/components/color-picker.vue";
import RadioPicker from "@src/components/radio-picker.vue";
import Popup from "@src/components/popup.vue";
import MySwitch from "@src/components/my-switch.vue";
import LayoutSetting from "@src/components/layout-setting.vue";

const settingStore = useSettingStore();

const popupOpen = ref(false);
const editingData = ref<SettingsData | undefined>(undefined);

// 打开设置弹窗
const openPopup = () => {
  popupOpen.value = true;
  editingData.value = JSON.parse(JSON.stringify(settingStore.settings));
};

// 确定并关闭设置弹窗
const submitPopup = () => {
  popupOpen.value = false;
  settingStore.updateSettings(editingData.value as SettingsData);
  editingData.value = undefined;
};
</script>

<style lang="scss">
.form-item {
  display: flex;
  padding: 18px 0;
  &__label {
    height: 70px;
    line-height: 70px;
    width: 160px;
    flex-shrink: 0;
    font-size: 32px;
  }
  &__control {
    flex: 1;
    .helper {
      font-size: 24px;
      margin-top: 8px;
      color: #999;
    }
  }
}
.form-item + .form-item {
  border-top: 1px solid #efefef;
}

.submit-button {
  margin-bottom: 32px;
}
</style>