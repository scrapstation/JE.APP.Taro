import { View, ScrollView, Image, Swiper, SwiperItem, Text } from '@tarojs/components';
import Taro, { useDidHide, useDidShow } from '@tarojs/taro';
import { useEffect, useState } from 'react';
import { API } from '../../../src/api';
import { BaseInfoVoOfStoreInfoResponse, CategoryInfoVoOfStoreInfoResponse, ProductOfCategoryInfoVoOfStoreInfoResponse, StoreInfoResponse } from '../../../src/api/client';
import './index.scss';
import Action from './components/Action';
import CartBar from './components/CartBar';
import ProductModal from './components/ProductModal';
import { AtIcon } from 'taro-ui';
import { useDispatch, useSelector } from 'react-redux';
import { ConnectState } from '@/models/connect';
import { UserModelState } from '@/models/user';
import haversine from 'haversine-distance';

export type CardItem = {
  productId: string;
  skuId: string;
  productName: string;
  skuPrice: number;
  number: number;
  image: string;
  mark?: string;
};
const Index: React.FC = () => {
  const [location, setLocation] = useState<Taro.getLocation.SuccessCallbackResult | undefined>();
  const [store, setStore] = useState<BaseInfoVoOfStoreInfoResponse>(new BaseInfoVoOfStoreInfoResponse());
  const [categories, setCategories] = useState<Array<CategoryInfoVoOfStoreInfoResponse>>([]);

  const [productPosition, setProductPosition] = useState<Array<{ id: string; top: number; bottom: number; name: string }>>([]);
  const [menuCurrentCategoryId, setMenuCurrentCategoryId] = useState<string>('');
  const [productCurrentCategoryId, setProductCurrentCategoryId] = useState<string>('');
  const [scrollMutualFlag, setScrollMutualFlag] = useState<boolean>(false);

  const [cart, setCart] = useState<CardItem[]>([]);
  const [productModal, setProductModal] = useState<{ visible: boolean; product: ProductOfCategoryInfoVoOfStoreInfoResponse | null }>({
    visible: false,
    product: null,
  });
  const dispatch = useDispatch();
  const { isLogin } = useSelector<ConnectState, UserModelState>((x) => x.user);
  useDidShow(() => {
    setCart(Taro.getStorageSync('cart') || []);
  });
  useDidHide(() => {
    Taro.setStorage({ key: 'cart', data: cart });
  });
  useEffect(() => {
    const fetchCategories = async () => {
      const locationResult = await Taro.getLocation({ type: 'wgs84' });
      setLocation(locationResult);
      const data = await API.storeClient.getStoreById('B1FD5A56-93A4-59A4-33E0-3A01161DD34D');
      setCategories(data.categoryInfo!);
      setStore(data.baseInfo!);
      setMenuCurrentCategoryId(data.categoryInfo![0].id);
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      calcSize();
    });
  }, [categories]);

  const getDomHeight = async (id: string) => {
    return new Promise<number>((reslove, reject) => {
      var View = Taro.createSelectorQuery().select(id);
      View.fields(
        {
          size: true,
        },
        (data) => {
          reslove(data.height);
        }
      ).exec();
    });
  };

  const calcSize = async () => {
    var h = 0;
    const positions = await Promise.all(
      categories.map(async (x) => {
        var position = { id: x.id, top: 0, bottom: 0, name: x.name! };
        var domHeght = await getDomHeight(`#category-${x.id}`);
        position.top = h;
        h += Math.floor(domHeght);
        position.bottom = h;
        return position;
      })
    );
    setProductPosition(positions);
  };

  const handleMenuSelected = (id: string) => {
    // menu 点击时 同时设置Product和Menu的id
    setProductCurrentCategoryId(id);
    setMenuCurrentCategoryId(id);

    // ProductCurrentCategoryId更新带来的自动滚动会触发productsScroll，设此参数意义为 1500ms 内不执行滚动带来的事件处理
    setScrollMutualFlag(true);
    setTimeout(() => setScrollMutualFlag(false), 1500);
  };

  const productsScroll = ({ detail }) => {
    // 由menu触发的滚动不做处理
    if (scrollMutualFlag) {
      return;
    }
    const { scrollTop } = detail;
    let tabs = productPosition.filter((item) => item.top <= scrollTop).reverse();
    if (tabs.length > 0) {
      setMenuCurrentCategoryId(tabs[0].id);
    }
  };

  // 优化
  const productCartNum = (id: string) => {
    //计算单个饮品添加到购物车的数量
    const count = cart.reduce((acc, cur: any) => {
      if (cur.productId === id) {
        return (acc += cur.number);
      }
      return acc;
    }, 0);
    return count;
  };

  const handleAddToCart = (cardItem: CardItem) => {
    //添加到购物车
    const cartTemp = JSON.parse(JSON.stringify(cart)) as CardItem[];
    const index = cartTemp.findIndex((x) => x.skuId === cardItem.skuId);
    if (index > -1) {
      cartTemp[index].number += 1;
    } else {
      cartTemp.push(cardItem);
    }
    setCart(cartTemp);
  };

  const handleMinusFromCart = (skuId: string) => {
    //从购物车减商品
    const cartTemp = JSON.parse(JSON.stringify(cart)) as CardItem[];
    const index = cartTemp.findIndex((item) => item.skuId == skuId);
    cartTemp[index].number -= 1;
    if (cartTemp[index].number <= 0) {
      cartTemp.splice(index, 1);
    }
    setCart(cartTemp);
  };

  const toPaymentPage = async () => {
    if (!isLogin) {
      await dispatch({ type: 'user/login' });
    }
    Taro.navigateTo({ url: '/pages/payment/index' });
  };

  return (
    <View className='container'>
      <View style={{ boxShadow: '0 1px 2px 0 rgba(0,0,0,.06)', zIndex: 1 }}>
        <View className='store'>
          <View className='title'>
            <View style={{ fontSize: 17 }}>{store.name}</View>
            <View style={{ marginTop: 5, fontSize: 13, color: '#999' }}> 距离您{location && haversine([location.latitude, location.longitude], [store.latitude, store.longitude]).toFixed(0)}m</View>
          </View>
        </View>
        <Swiper autoplay vertical circular style={{ height: 20, paddingLeft: 15 }}>
          <SwiperItem className='test'>
            <Image style={{ borderRadius: 2, height: 14, marginRight: 5, width: 13 }} src='https://go.cdn.heytea.com/2021/07/21/tmp/3b9b01a954824daca50323fba4881563.jpg' />
            <Text className='test1'>糯糯入茶，清新不腻。用经典定制茶底中和软萌米糯糯的饱满口感，碰撞出清新不腻的糯糯茶。</Text>
          </SwiperItem>
          <SwiperItem className='test'>
            <Image style={{ borderRadius: 2, height: 14, marginRight: 5, width: 13 }} src='https://go.cdn.heytea.com/2021/07/21/tmp/3b9b01a954824daca50323fba4881563.jpg' />
            <Text className='test1'>糯糯入茶，清新不腻。用经典定制茶底中和软萌米糯糯的饱满口感，碰撞出清新不腻的糯糯茶。</Text>
          </SwiperItem>
          <SwiperItem className='test'>
            <Image style={{ borderRadius: 2, height: 14, marginRight: 5, width: 13 }} src='https://go.cdn.heytea.com/2021/07/21/tmp/3b9b01a954824daca50323fba4881563.jpg' />
            <Text className='test1'>糯糯入茶，清新不腻。用经典定制茶底中和软萌米糯糯的饱满口感，碰撞出清新不腻的糯糯茶。</Text>
          </SwiperItem>
        </Swiper>
      </View>
      <View className='main'>
        <ScrollView className='menu-bar' enableFlex scrollY scrollWithAnimation scrollIntoView={`menu-${menuCurrentCategoryId}`}>
          <View className='wrapper'>
            {categories.map((category) => {
              return (
                <View className={`menu-item ${menuCurrentCategoryId == category.id ? 'active' : ''}`} onClick={() => handleMenuSelected(category.id)} id={`menu-${category.id}`} key={category.id}>
                  <View className='title'>{category.name}</View>
                </View>
              );
            })}
          </View>
        </ScrollView>
        <ScrollView className='product-section' scrollY enableFlex scrollIntoView={`category-${productCurrentCategoryId}`} scrollWithAnimation={productCurrentCategoryId ? false : true} onScroll={productsScroll}>
          {categories.map((category) => {
            return (
              <View style={{ padding: '0 10px', paddingBottom: 65 }} className='category' key={category.id} id={`category-${category.id}`}>
                <View className='category.name'>{category.name}</View>
                <View className='products'>
                  {category.products!.map((product) => {
                    return (
                      <View className='product' key={product.id}>
                        {
                          // 只渲染当前分类和相邻分类
                          Math.abs(categories.findIndex((x) => x.id === category.id) - categories.findIndex((x) => x.id === menuCurrentCategoryId)) <= 1 && (
                            <>
                              <Image mode='aspectFill' src={product.imgUrl!} className='image'></Image>
                              <View className='content'>
                                <View className='name'>{product.name}</View>
                                <View className='labels'>
                                  {product.attributes!.map((attribute) => {
                                    return (
                                      <View className='label' key={attribute.id}>
                                        {attribute.name}
                                      </View>
                                    );
                                  })}
                                </View>
                                <View className='description'>{product.description || ''}</View>
                                <View className='price'>
                                  <View>￥{product.price}</View>
                                  <Action isMultiSku={product.isMultiSku} number={productCartNum(product.id)} onAdd={() => handleAddToCart({ productId: product.id, skuId: product.skus![0].id, productName: product.name!, skuPrice: product.skus![0].price, number: 1, image: product.imgUrl! })} onMinus={() => handleMinusFromCart(product.skus![0].id)} onSelectMaterails={() => setProductModal({ visible: true, product })}></Action>
                                </View>
                              </View>
                            </>
                          )
                        }
                      </View>
                    );
                  })}
                </View>
              </View>
            );
          })}
        </ScrollView>
      </View>
      <View>
        {cart.length > 0 && <CartBar cart={cart} onClear={() => {}} onAdd={(item) => handleAddToCart(item)} onMinus={(skuId) => handleMinusFromCart(skuId)} onDetail={() => {}} onPay={() => toPaymentPage()}></CartBar>}
        {productModal.visible && <ProductModal onAddToCart={(cartItem) => handleAddToCart(cartItem)} product={productModal.product!} onClose={() => setProductModal({ ...productModal, visible: false })}></ProductModal>}
      </View>
    </View>
  );
};

export default Index;
