<template>
  <view class="about-page">
    <view class="qa-item">
      <view class="question"> 这个小程序可以做什么用？ </view>
      <view class="answer">
        学校防疫要求家长将学生同住人的健康码和行程码合并成一张图，并标注姓名。为了节省大家的时间，开发此工具，可批量选择健康码和行程码截图，一键生成合并后的图片。代码开源地址：
        <text :userSelect="true" class="link"
          >https://github.com/addelete/health-code-glue</text
        >
      </view>
    </view>

    <view class="qa-item">
      <view class="question"> 图片会上传到其他地方吗？ </view>
      <view class="answer">
        不会。本小程序对相册与图片的操作仅限于选择相册内的图片、在手机本地合并图片，保存图片到相册。
      </view>
    </view>

    <view class="qa-item">
      <view class="question"> 下次如何找到这个小程序？ </view>
      <view class="answer">
        <view
          >方法一：点击右上角三个点，选择“添加到我的小程序”。下次在微信首页下拉，我的小程序内打开“橘猫合图”。</view
        >
        <view>方法二：在微信首页下拉，最近使用的小程序内打开“橘猫合图”。</view>
        <view>方法三：在“发现-小程序”中，最近使用列表内打开“橘猫合图”。</view>
        <view>方法五：在“发现-小程序”中，搜索“橘猫合图”进入小程序。</view>
      </view>
    </view>

    <view class="qa-item">
      <view class="question"> 如何分享给其他人？ </view>
      <view class="answer">
        <view>点击右上角三个点，选择“转发给朋友”。</view>
      </view>
    </view>

    <view class="qa-item">
      <view class="question"> 如何报告bug或提交建议？ </view>
      <view class="answer">
        <view>
          添加开发者微信：<text :userSelect="true" class="link">twoPikachus</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { shareResult } from "@src/utils/shareResult";
import { useShareAppMessage } from "@tarojs/taro";

useShareAppMessage(() => {
  return shareResult;
});
</script>

<style lang="scss">
.about-page {
  .qa-item {
    margin-top: 32px;
    font-size: 32px;
    padding: 0 32px;
    position: relative;
    .question {
      font-weight: bold;
    }
    .answer {
      margin-top: 20px;
      line-height: 1.7em;
      color: #666;
      font-size: 24px;
    }
  }
}
.link {
  color: #1aad19;
}
</style>