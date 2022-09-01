import Taro from "@tarojs/taro";

/**
 * 检查版本更新
 */
export function checkUpdateVersion() {
  if (Taro.canIUse("getUpdateManager")) {
    const updateManager = Taro.getUpdateManager();
    updateManager.onCheckForUpdate(function(res) {
      if (res.hasUpdate) {
        updateManager.onUpdateReady(function() {
          updateManager.applyUpdate();
        });
        updateManager.onUpdateFailed(function() {
          Taro.showModal({
            title: "已经有新版本喽~",
            content:
              "请您到微信 “发现-小程序” 页删除当前小程序，重新搜索打开哦~"
          });
        });
      }
    });
  } else {
    Taro.showModal({
      title: "溫馨提示",
      content: "当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。"
    });
  }
}
