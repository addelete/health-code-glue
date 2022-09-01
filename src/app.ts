import { createApp } from "vue";
import { createPinia } from "pinia";
import { checkUpdateVersion } from "@src/utils/checkUpdateVersion";
import "./app.scss";

const pinia = createPinia();

const App = createApp({
  onShow() {
    checkUpdateVersion(); // 检查更新
  },
});

App.use(pinia);

export default App;
