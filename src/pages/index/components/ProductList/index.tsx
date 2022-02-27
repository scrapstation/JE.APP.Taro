import { CategoryInfoVoOfStoreInfoResponse, ProductOfCategoryInfoVoOfStoreInfoResponse } from '@/api/client';
import { ConnectState } from '@/models/connect';
import { UserModelState } from '@/models/user';
import { View, Image, Swiper, SwiperItem, ScrollView, Button } from '@tarojs/components';
import Taro, { useDidHide, useDidShow } from '@tarojs/taro';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CardItem } from '../..';
import Action from '../Action';
import CartBar from '../CartBar';
import ProductModal from '../ProductModal';

export type ProductListProps = {
  categories: CategoryInfoVoOfStoreInfoResponse[];
};
const ProductList: React.FC<ProductListProps> = (props) => {
  const categories = props.categories;

  const dispatch = useDispatch();
  const { isLogin } = useSelector<ConnectState, UserModelState>((x) => x.user);
  const [cart, setCart] = useState<CardItem[]>([]);
  const [productPosition, setProductPosition] = useState<Array<{ id: string; top: number; bottom: number; name: string }>>([]);
  const [menuCurrentCategoryId, setMenuCurrentCategoryId] = useState<string>('');
  const [productCurrentCategoryId, setProductCurrentCategoryId] = useState<string>('');
  const [scrollMutualFlag, setScrollMutualFlag] = useState<boolean>(false);

  const [productModal, setProductModal] = useState<{ visible: boolean; product: ProductOfCategoryInfoVoOfStoreInfoResponse | null }>({
    visible: false,
    product: null,
  });
  useDidShow(() => {
    setCart(Taro.getStorageSync('cart') || []);
  });
  useDidHide(() => {
    Taro.setStorage({ key: 'cart', data: cart });
  });
  useEffect(() => {
    if (categories.length > 0) {
      console.log(categories);
      setMenuCurrentCategoryId(categories![0].id);
    }
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
      Taro.navigateTo({ url: '/pages/login/index' });
    }
    Taro.navigateTo({ url: '/pages/payment/index' });
  };
  return (
    <>
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
        <CartBar cart={cart} onClear={() => {}} onAdd={(item) => handleAddToCart(item)} onMinus={(skuId) => handleMinusFromCart(skuId)} onDetail={() => {}} onPay={() => toPaymentPage()}></CartBar>
        {productModal.visible && <ProductModal onAddToCart={(cartItem) => handleAddToCart(cartItem)} product={productModal.product!} onClose={() => setProductModal({ ...productModal, visible: false })}></ProductModal>}
      </View>
    </>
  );
};
export default ProductList;
