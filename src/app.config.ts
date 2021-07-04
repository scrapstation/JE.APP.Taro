export default {
  pages: [
    'pages/index/index',
    'pages/personal/index',
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    'color': '#000',
    'selectedColor': '#56abe4',
    'backgroundColor': '#fff',
    'borderStyle': 'white',
    "list": [
      {
        "pagePath": "pages/index/index",
        "iconPath": "static/tabBar/mart.png",
        "selectedIconPath": "static/tabBar/mart_selected.png",
        "text": "购物"
      },
      // {
      //   "pagePath": "pages/my/index",
      //   "iconPath": "static/tabBar/my.png",
      //   "selectedIconPath": "static/tabBar/my_selected.png",
      //   "text": "订单"
      // },
      {
        "pagePath": "pages/personal/index",
        "iconPath": "static/tabBar/my.png",
        "selectedIconPath": "static/tabBar/my_selected.png",
        "text": "个人"
      }
    ]
  }
}
