export default {
  pages: [
    'pages/index/index',
    'pages/my/index',
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
        "iconPath": "static/tabBar/shop.png",
        "selectedIconPath": "static/tabBar/shopfill.png",
        "text": "购物"
      },
      {
        "pagePath": "pages/my/index",
        "iconPath": "static/tabBar/my.png",
        "selectedIconPath": "static/tabBar/myfill.png",
        "text": "订单"
      }
    ]
  }
}
