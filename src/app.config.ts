export default defineAppConfig({
  pages: ["pages/index/index", "pages/about/about"],

  window: {
    backgroundTextStyle: "light",
    navigationBarBackgroundColor: "#fff",
    navigationBarTitleText: "橘猫合图",
    navigationBarTextStyle: "black",
    backgroundColor: '#ffffff',
  },

  tabBar: {
    color: "#8a8a8a",
    selectedColor: "#07c160",
    backgroundColor: "#ffffff",
    list: [
      {
        pagePath: "pages/index/index",
        iconPath: "assets/home-o.png",
        selectedIconPath: "assets/home.png",
        text: "首页"
      },
     
      {
        pagePath: "pages/about/about",
        iconPath: "assets/about-o.png",
        selectedIconPath: "assets/about.png",
        text: "关于"
      }
    ]
  }
});
