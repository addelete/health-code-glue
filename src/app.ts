import { createApp } from "vue";
import { createPinia } from "pinia";
import { checkUpdateVersion } from "@src/utils/checkUpdateVersion";
import cover from "@src/assets/cover.jpg";
import "./app.scss";

const pinia = createPinia();

const App = createApp({
  onShow() {
    checkUpdateVersion(); // 检查更新
  },
  onShareAppMessage() {
    return {
      title: '橘猫合图',
      imageUrl: cover,
    };
  }
});

App.use(pinia);

export default App;
