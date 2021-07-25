import { View, ScrollView, Image } from '@tarojs/components';
import Taro, { useDidHide, useDidShow } from '@tarojs/taro';
import { useEffect, useState } from 'react';
import { API } from '../../api/index';
import { CategoryReponse, ProductReponse } from 'src/api/client';
import './index.scss';
import Action from './components/Action';
import CartBar from './components/CartBar';
import ProductModal from './components/ProductModal';
import { AtIcon } from 'taro-ui';

export type CardItem =
  {
    productId: string,
    skuId: string,
    productName: string,
    skuPrice: number,
    number: number,
    image: string,
    mark?: string
  }
const Index: React.FC = () => {
  const [categories, setCategories] = useState<Array<CategoryReponse>>([]);
  const [productPosition, setProductPosition] = useState<Array<{ id: string; top: number; bottom: number }>>([]);
  const [currentCategoryId, setCurrentCategoryId] = useState<string>('');
  const [productsScrollTop, setProductsScrollTop] = useState<number>(0);
  const [cart, setCart] = useState<CardItem[]>([]);
  const [productModal, setProductModal] = useState<{ visible: boolean, product: ProductReponse | null }>({
    visible: false,
    product: null
  });
  useDidShow(() => {
    setCart(Taro.getStorageSync('cart') || [])
  })
  useDidHide(() => {
    Taro.setStorage({ key: 'cart', data: cart })
  })
  useEffect(() => {
    const fetchCategories = async () => {
      const data = await API.categoryClient.getAllCategory();
      setCategories(data);
      setCurrentCategoryId(data[0].id);
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    console.log("calcSize");
    Taro.nextTick(() => calcSize());
  }, [categories]);

  const calcSize = () => {
    let h = 0;
    const positions = categories.map((x) => {
      let position = { id: x.id, top: 0, bottom: 0 };
      let View = Taro.createSelectorQuery().select(`#category-${x.id}`);
      View.fields(
        {
          size: true,
        },
        (data) => {
          position.top = h;
          h += Math.floor(data.height);
          position.bottom = h;
        }
      ).exec();
      return position;
    });
    setProductPosition(positions);
  };

  const handleMenuSelected = (id: string) => {
    setProductsScrollTop(productPosition.find((item) => item.id == id)!.top);
    Taro.nextTick(() => setCurrentCategoryId(id));
  };

  const productsScroll = ({ detail }) => {
    const { scrollTop } = detail
    let tabs = productPosition.filter(item => item.top <= scrollTop).reverse()
    if (tabs.length > 0) {
      setCurrentCategoryId(tabs[0].id)
    }
  }

  // 优化
  const productCartNum = (id: string) => {	//计算单个饮品添加到购物车的数量
    const count = cart.reduce((acc, cur: any) => {
      if (cur.productId === id) {
        return acc += cur.number
      }
      return acc
    }, 0)
    return count;
  }

  const handleAddToCart = (cardItem: CardItem) => {	//添加到购物车
    const cartTemp = JSON.parse(JSON.stringify(cart)) as CardItem[];
    const index = cartTemp.findIndex(x => x.skuId === cardItem.skuId)
    if (index > -1) {
      cartTemp[index].number += 1
    } else {
      cartTemp.push(cardItem)
    }
    setCart(cartTemp)
  }

  const handleMinusFromCart = (skuId: string) => { //从购物车减商品
    const cartTemp = JSON.parse(JSON.stringify(cart)) as CardItem[];
    const index = cartTemp.findIndex(item => item.skuId == skuId)
    cartTemp[index].number -= 1
    if (cartTemp[index].number <= 0) {
      cartTemp.splice(index, 1)
    }
    setCart(cartTemp)
  }

  const toPaymentPage = () => {
    Taro.navigateTo({ url: '/pages/payment/index' })
  }

  return (
    <View className='container'>
      <View className="store">
        <View className="title">
          <View className="address">
            齐鲁工业大学店
            {
              [1, 2, 3].map(_ => <AtIcon value='star-2' size="16" color="#DBA871"></AtIcon>)
            }
          </View>
        </View>
      </View>
      <View className='main'>
        <ScrollView className='menu-bar' enableFlex scrollY scrollWithAnimation>
          <View className='wrapper'>
            {categories.map((category) => {
              return (
                <View className={`menu-item ${currentCategoryId == category.id ? 'active' : ''}`} onClick={() => handleMenuSelected(category.id)} key={category.id}>
                  {/* <image :src="category.category_image_url" className="image" mode="widthFix"></image> */}
                  <View className='title'>{category.name}</View>
                </View>
              );
            })}
          </View>
        </ScrollView>
        <ScrollView className='product-section' scrollY scrollWithAnimation scrollTop={productsScrollTop} onScroll={productsScroll}>
          <View className='wrapper'>
            {categories.map((category) => {
              return (
                <View className='category' key={category.id} id={`category-${category.id}`}>
                  <View className='category.name'>{category.name}</View>
                  <View className='products'>
                    {category.products!.map((product) => {
                      return (
                        <View className='product' key={product.id}>
                          <Image lazyLoad mode='aspectFill' src={product.imgUrl!} className='image'></Image>
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
                        </View>
                      );
                    })}
                  </View>
                </View>
              );
            })}
          </View>
        </ScrollView>
      </View>
      <View>
        {
          cart.length > 0 &&
          <CartBar cart={cart} onClear={() => { }} onAdd={(item) => handleAddToCart(item)} onMinus={(skuId) => handleMinusFromCart(skuId)} onDetail={() => { }} onPay={() => toPaymentPage()}></CartBar>
        }
        {
          productModal.visible &&
          <ProductModal onAddToCart={(cartItem) => handleAddToCart(cartItem)} product={productModal.product!} onClose={() => setProductModal({ ...productModal, visible: false })}></ProductModal>
        }
      </View>
    </View>
  );
};

export default Index;
