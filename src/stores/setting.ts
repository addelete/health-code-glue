import Taro from "@tarojs/taro";
import { defineStore } from "pinia";

export interface TextData {
  content: string;
  place: string;
  color: string;
  fontSize: number;
  watermarkOpacity: number;
}

export type LayoutData = {
  type: "columns" | "rows";
  data: {
    columns: number;
    rows: number;
  };
};

export interface SettingsData {
  autoSave: boolean;
  text: TextData;
  layout: LayoutData;
}

export const textPlaceMap: {
  [key: string]: string;
} = {
  watermark: "水印",
  top: "顶部",
  center: "居中",
  bottom: "底部"
};

export const textPlaceOptions = Object.keys(textPlaceMap).map(key => ({
  value: key,
  label: textPlaceMap[key]
}));

export const textColorOptions = [
  "#000000",
  "#DD5331",
  "#58BD6A",
  "#3271CF",
  "#EFAF3F"
];

export const colorBorderMap = {
  "#000000": '#ffffff',
  "#DD5331": '#ffffff',
  "#58BD6A": '#ffffff',
  "#3271CF": '#ffffff',
  "#EFAF3F": '#ffffff',
}

export const layoutOptions = ["columns", "rows"];

export const useSettingStore = defineStore("setting", {
  state: () => {
    return {
      settings: Taro.getStorageSync<SettingsData>("settings") || {
        autoSave: false,
        text: {
          place: Object.keys(textPlaceMap)[0],
          color: textColorOptions[0],
          fontSize: 100,
          watermarkOpacity: 50,
          content: '',
        },
        layout: {
          type: layoutOptions[0],
          data: {
            columns: 2,
            rows: 2,
          }
        }
      },
    };
  },
  actions: {
    updateSettings(settings: SettingsData) {
      this.settings = settings;
      Taro.setStorageSync("settings", settings);
    },
  }
});
