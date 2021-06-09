import { View, ScrollView, Image } from '@tarojs/components'
import Taro from '@tarojs/taro';
import { useEffect, useState } from 'react';
import './index.scss'

const Index: React.FC = () => {
  const [scrollHeight, setScrollHeight] = useState<number>(400);
  const [scrollTopSize, setScrollTopSize] = useState<number>(0);
  const [fillHeight, setFillHeight] = useState<number>(0);
  const [leftArray, setLeftArray] = useState<string[]>([]);
  const [mainArray, setMainArray] = useState<{ title: string, list: string[] }[]>([]);
  const [topArr, setTopArr] = useState<any[]>([]);
  const [leftIndex, setLeftIndex] = useState<number>(0);
  const [scrollInto, setScrollInto] = useState<string>('');
  const [leftIntoView, setLeftIntoView] = useState<string>(`left-0`);
  useEffect(() => {
    getElementTop()
  }, [leftArray, mainArray])

  useEffect(() => {
    initScrollView()
    getListData();
  }, [])

  /* 初始化滚动区域 */
  const initScrollView = () => {
    return new Promise<void>((resolve, reject) => {
      let view = Taro.createSelectorQuery().select('#scroll-panel');
      view.boundingClientRect(res => {

        if (res === null)
          return;
        setScrollTopSize(res.top)
        setScrollHeight(res.height)
        resolve()
      }).exec();
    });
  }

  /* 获取列表数据 */
  const getListData = () => {
    // Promise 为 ES6 新增的API ，有疑问的请自行学习该方法的使用。
    new Promise<{ left: string[], main: { title: string, list: string[] }[] }>((resolve, reject) => {
      /* 因无真实数据，当前方法模拟数据。正式项目中将此处替换为 数据请求即可 */
      Taro.showLoading();
      setTimeout(() => {
        let left: string[] = []
        let main: { title: string, list: string[] }[] = []
        for (let i = 0; i < 25; i++) {
          left.push(`${i + 1}类商品`);

          let list: string[] = [];
          let r = Math.floor(Math.random() * 10);
          r = r < 1 ? 3 : r;
          for (let j = 0; j < r; j++) {
            list.push(j.toString());
          }
          main.push({
            title: `第${i + 1}类商品标题`,
            list
          })
        }

        // 将请求接口返回的数据传递给 Promise 对象的 then 函数。
        resolve({ left, main });
      }, 1000);
    }).then((res) => {
      console.log('-----------请求接口返回数据示例-------------');

      Taro.hideLoading();
      setLeftArray(res.left)
      setMainArray(res.main)
      Taro.nextTick(() => {
        getElementTop();
      });
    })
  }

  /* 左侧导航点击 */
  const leftTap = (index: number) => {
    console.log(index)
    setLeftIndex((index < 0 ? 0 : index))
    setScrollInto(`item-${index}`)
  }

  /* 主区域滚动监听 */
  const mainScroll = (e) => {
    console.log(e)
    let top = e.detail.scrollTop;
    let index = 0;
    /* 查找当前滚动距离 */
    for (let i = (topArr.length - 1); i >= 0; i--) {
      /* 在部分安卓设备上，因手机逻辑分辨率与rpx单位计算不是整数，滚动距离与有误差，增加2px来完善该问题 */
      if ((top + 2) >= topArr[i]) {
        index = i;
        break;
      }
    }
    console.log('fyq' + index)
    setLeftIndex(index < 0 ? 0 : index)
    setLeftIntoView(`left-${leftIndex > 3 ? (leftIndex - 3) : 0}`)
  }

  /* 获取元素顶部信息 */
  const getElementTop = () => {
    new Promise((resolve) => {
      let view = Taro.createSelectorQuery().selectAll('.main-item');
      view.boundingClientRect(data => {
        resolve(data);
      }).exec();
    }).then((res: any[]) => {
      if (res.length === 0)
        return;
      setTopArr(res.map((item) => {
        return item.top - scrollTopSize;	/* 减去滚动容器距离顶部的距离 */
      }))

      /* 获取最后一项的高度，设置填充高度。判断和填充时做了 +-20 的操作，是为了滚动时更好的定位 */
      let last = res[res.length - 1].height;
      if (last - 20 < scrollHeight) {
        setFillHeight(scrollHeight - last + 20)
      }
    });
  }
  return (
    <View className='container'>

      <View className='top--panel'>
        {/* 顶部面板，可添加所需要放在页面顶部的内容代码。比如banner图 */}
        <View className='top--panel-text'>
          <View>这里顶部内容占位区域，不需要则删除</View>
          <View>可添加需放在页面顶部的内容，比如banner图</View>
        </View>
      </View>

      {/* 滚动区域 */}
      <View className='scroll-panel' id='scroll-panel'>
        <View className='list-box'>
          <View className='left'>
            <ScrollView
              scrollY
              style={`height:${scrollHeight}px;`}
              scrollIntoView={leftIntoView}
            >
              {
                leftArray.map((item, index) => {
                  return (
                    <View
                      className={`item ${index == leftIndex ? 'active' : ''}`}
                      key={index}
                      id={`left-${index}`}
                      onClick={() => leftTap(index)}
                    >
                      {item}
                    </View>
                  )
                })
              }
            </ScrollView>
          </View>

          <View className='main'>
            <ScrollView
              scrollY
              style={`height:${scrollHeight}px;`}
              onScroll={mainScroll}
              scrollWithAnimation
              scrollIntoView={scrollInto}
            >
              {
                mainArray.map((item, index) => {
                  return (
                    <View
                      className='item main-item'
                      key={index}
                      id={`item-${index}`}
                    >
                      <View className='title'>
                        <View>{item.title}</View>
                      </View>
                      {
                        item.list.map((item2, index2) => {
                          return (
                            <View className='goods' key={index2}>
                              <Image className='logo' src={require('../../static/images/Taro.png')} mode='aspectFill'></Image>
                              <View>
                                <View>第{index2 + 1}个商品标题</View>
                                <View className='describe'>第{index2 + 1}个商品的描述内容</View>
                                <View className='money'>第{index2 + 1}个商品的价格</View>
                              </View>
                            </View>
                          )
                        })
                      }
                    </View>
                  )
                })
              }
              <View className='fill-last' style={`height:${fillHeight};`}></View>
            </ScrollView>
          </View>
        </View>
      </View>

      {/* 底部面板 */}
      <View className='bottom-panel'>
        {/* 底部面板，可添加所需要放在页面底部的内容代码。比如购物车栏目 */}
        <View className='bottom-panel-text'>
          <View>这里底部内容占位区域，不需要则删除</View>
          <View>可添加需放在页面底部的内容，比如购物车栏目</View>
        </View>
      </View>
    </View >
  )
}

export default Index;
