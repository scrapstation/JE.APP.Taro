export default {
  pages: [
    'pages/rider/deliveries-history/index',
    'pages/index/index',
    'pages/rider/index',
    'pages/order/index',
    'pages/order/detail/index',
    'pages/payment/index',
    'pages/payment/remark/index',
    'pages/consignee/index',
    'pages/personal/index',
    'pages/consignee/add/index'
  ],
  window: {
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black',
    backgroundColor: '#f8f8f8',
  },
  tabBar: {
    color: '#999999',
    selectedColor: '#343434',
    borderStyle: 'white',
    backgroundColor: '#F7F7F7',
    fontSize: '16px',
    iconWidth: '30px',
    list: [
      {
        pagePath: 'pages/index/index',
        iconPath: 'static/tabBar/mart.png',
        selectedIconPath: 'static/tabBar/mart_selected.png',
        text: '购物',
      },
      {
        pagePath: 'pages/order/index',
        iconPath: 'static/tabBar/my.png',
        selectedIconPath: 'static/tabBar/my_selected.png',
        text: '订单',
      },
      {
        pagePath: 'pages/personal/index',
        iconPath: 'static/tabBar/my.png',
        selectedIconPath: 'static/tabBar/my_selected.png',
        text: '个人',
      },
    ],
  },
};
