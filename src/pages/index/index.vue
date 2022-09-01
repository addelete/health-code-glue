<template>
  <view class="index">
    <view class="header">
      <button class="primary" @tap="selectImages">选择图片</button>
      <button @tap="saveTogetherImage">保存合图</button>
      <button @tap="clearImages">清空</button>
      <view class="right">
        <setting-button />
      </view>
    </view>
    <view class="preview-wrapper" id="preview-wrapper">
      <view class="preview">
        <image
          :src="together.togetherImagePath"
          :style="{
            width: `${together.previewWidth}px`,
            height: `${together.previewHeight}px`,
          }"
        />
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import Taro from "@tarojs/taro";
import { onMounted, ref, watch } from "vue";
import SettingButton from "@src/components/setting-button.vue";
import { colorBorderMap, useSettingStore } from "@src/stores/setting";
import { shareResult } from "@src/utils/shareResult";
import { useShareAppMessage } from "@tarojs/taro";

useShareAppMessage(() => {
  return shareResult;
});

const settingStore = useSettingStore();

const previewWrapperSize = ref({
  width: 1,
  height: 1,
});

interface ImageInfo {
  path: string;
  width: number;
  height: number;
}

const images = ref<ImageInfo[]>([]);

const together = ref({
  previewWidth: 0,
  previewHeight: 0,
  togetherImagePath: "",
});

const getImageInfo = async (filePath: string) => {
  return new Promise((resolve, reject) => {
    Taro.getImageInfo({
      src: filePath,
      success: (res) => {
        resolve(res);
      },
      fail: (err) => {
        reject(err);
      },
    });
  });
};

// 获取数字中位数
const getMedian = (nums: number[]) => {
  const sortedNums = [...nums].sort((a, b) => a - b);
  let middleIndex = Math.floor(sortedNums.length / 2);
  let median = 0;
  if (nums.length % 2 === 1) {
    median = sortedNums[middleIndex];
  } else {
    median = (sortedNums[middleIndex] + sortedNums[middleIndex - 1]) / 2;
  }
  return median;
};

// 选择图片
const selectImages = async () => {
  const { tempFilePaths } = await Taro.chooseImage({
    sizeType: ["compressed"],
    sourceType: ["album"],
  });
  if (tempFilePaths.length === 0) {
    return;
  }
  const imageInfos = await Promise.all(
    tempFilePaths.map((filePath) =>
      getImageInfo(filePath).then((res: any) => ({
        path: filePath,
        width: res.width as number,
        height: res.height as number,
      }))
    )
  );
  images.value.push(...imageInfos);

};

const imageMap = new Map<string, Taro.Image>();

const clearImages = () => {
  images.value.splice(0, images.value.length);
};

// 保存图片
const saveTogetherImage = () => {
  Taro.saveImageToPhotosAlbum({
    filePath: together.value.togetherImagePath,
    success() {
      Taro.showToast({
        title: "保存成功",
        icon: "success",
      });
    },
    fail() {
      Taro.showToast({
        title: "保存失败",
        icon: "error",
      });
    },
  });
};

onMounted(() => {
  const getPreviewWrapperSize = () => {
    const query = Taro.createSelectorQuery();
    query
      .select("#preview-wrapper")
      .boundingClientRect()
      .exec((res) => {
        if (!res[0]) {
          getPreviewWrapperSize();
          return;
        }
        const { width, height } = res[0];
        previewWrapperSize.value = { width, height };
      });
  };
  getPreviewWrapperSize();
});

watch(
  [images.value, () => settingStore.settings],
  async () => {
    const imageList = images.value;
    const settings = settingStore.settings;
    const res = {
      previewWidth: 0,
      previewHeight: 0,
      togetherImagePath: "",
    };
    if (imageList.length === 0) {
      together.value = res;
      return;
    }
    // 求出宽高中位数和宽高比中位数
    let imageWidth = getMedian(imageList.map((image) => image.width));
    let imageHeight = getMedian(imageList.map((image) => image.height));
    const imageHeightWidthRatio = imageHeight / imageWidth;
    let columns = 0;
    let rows = 0;
    const layout = settings.layout;
    switch (layout.type) {
      case "columns":
        columns = layout.data.columns;
        rows = Math.ceil(images.value.length / columns);
        break;
      case "rows":
        rows = layout.data.rows;
        columns = Math.ceil(images.value.length / rows);
        break;
      default:
    }
    const togetherHeightWidthRatio = (rows * imageHeightWidthRatio) / columns;
    const previewMaxWidth = previewWrapperSize.value.width - 40;
    const previewMaxHeight = previewWrapperSize.value.height - 60;
    const previewMaxHeightWidthRatio = previewMaxHeight / previewMaxWidth;
    const previewHeight =
      togetherHeightWidthRatio > previewMaxHeightWidthRatio
        ? previewMaxHeight
        : previewMaxWidth * togetherHeightWidthRatio;
    const previewWidth = previewHeight / togetherHeightWidthRatio;
    res.previewWidth = previewWidth;
    res.previewHeight = previewHeight;

    const canvasScale = Math.min(
      1,
      4000 / (columns * imageWidth),
      4000 / (rows * imageHeight)
    );

    imageWidth *= canvasScale;
    imageHeight *= canvasScale;

    const canvasWidth = columns * imageWidth;
    const canvasHeight = rows * imageHeight;
    const canvas = (Taro.createOffscreenCanvas as any)({
      type: "2d",
      width: canvasWidth,
      height: canvasHeight,
    }) as Taro.Canvas;

    const ctx = canvas.getContext("2d") as Taro.CanvasContext;
    const canvasImageList = await Promise.all(
      images.value.map((item) => {
        return new Promise((resolve) => {
          if (imageMap.has(item.path)) {
            resolve(imageMap.get(item.path));
          } else {
            const image = canvas.createImage();
            image.src = item.path;
            image.onload = () => {
              imageMap.set(item.path, image);
              resolve(image);
            };
          }
        });
      })
    );
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < columns; c++) {
        const index = r * columns + c;
        if (imageList[index]) {
          ctx.drawImage(
            canvasImageList[index] as string,
            c * imageWidth,
            r * imageHeight,
            imageWidth,
            imageHeight
          );
        }
      }
    }

    const content = (settings.text.content || "").trim();

    if (content) {
      ctx.fillStyle = settings.text.color;
      ctx.font = `bolder ${settings.text.fontSize}px sans-serif`;
      ctx.strokeStyle = colorBorderMap[settings.text.color] || "#ffffff";
      ctx.lineWidth = settings.text.fontSize / 10;
      const textWidth = ctx.measureText(content).width;
      const textHeight = settings.text.fontSize;
      switch (settings.text.place) {
        case "top":
          ctx.strokeText(
            content,
            (canvasWidth - textWidth) / 2,
            textHeight * 1.5
          );
          ctx.fillText(
            content,
            (canvasWidth - textWidth) / 2,
            textHeight * 1.5
          );
          break;
        case "bottom":
          ctx.strokeText(
            content,
            (canvasWidth - textWidth) / 2,
            canvasHeight - textHeight * 0.5
          );
          ctx.fillText(
            content,
            (canvasWidth - textWidth) / 2,
            canvasHeight - textHeight * 0.5
          );
          break;
        case "center":
          ctx.strokeText(
            content,
            (canvasWidth - textWidth) / 2,
            (canvasHeight + textHeight) / 2
          );
          ctx.fillText(
            content,
            (canvasWidth - textWidth) / 2,
            (canvasHeight + textHeight) / 2
          );
          break;
        case "watermark":
          ctx.save();
          ctx.globalAlpha = 0.5;

          const rowDiff = textHeight * 3;
          const colDiff = textWidth * 2;
          const cols = Math.ceil(canvasWidth / colDiff);
          const rows = Math.ceil(canvasHeight / rowDiff);
          ctx.translate((colDiff - textWidth) * 0.5, rowDiff * 0.5);
          for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
            for (let colIndex = 0; colIndex < cols; colIndex++) {
              ctx.rotate((-20 * Math.PI) / 180);
              ctx.fillText(content, 0, 0);
              ctx.rotate((20 * Math.PI) / 180);
              ctx.translate(colDiff, 0);
            }
            ctx.translate(-cols * colDiff, rowDiff);
          }
          ctx.restore();
        default:
      }
    }

    const base64DataUrl = canvas.toDataURL("image/jpeg", 0.92);
    const tempFilePath = `${Taro.env.USER_DATA_PATH}/temp_${Date.now()}.png`;
    const buffer = Taro.base64ToArrayBuffer(
      base64DataUrl.substring(base64DataUrl.indexOf(",") + 1)
    );
    Taro.getFileSystemManager().writeFileSync(tempFilePath, buffer, "utf8");

    res.togetherImagePath = tempFilePath;

    together.value = res;
    if (settings.autoSave) {
      saveTogetherImage();
    }
  },
  { deep: true }
);
</script>

<style lang="scss">
.index {
  height: 100vh;
  display: flex;
  flex-direction: column;
}
.header {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 16px;
  padding: 16px;
  .right {
    margin-left: auto;
    display: flex;
    align-items: center;
    gap: 16px;
    text {
      font-size: 28px;
      color: #333;
    }
  }
}
.preview-wrapper {
  flex: 1;
  background: #efefef;
  display: flex;
  align-items: center;
  justify-content: center;
  .preview {
    background: #fff;
    display: flex;
    flex-wrap: wrap;
    image {
      display: block;
    }
  }
}
.footer {
  display: flex;
  align-items: center;
  padding: 16px;
  gap: 16px;
}
</style>

