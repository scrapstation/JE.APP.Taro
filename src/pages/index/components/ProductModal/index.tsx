import { View, Image, Swiper, SwiperItem, ScrollView, Button } from '@tarojs/components';
import { useEffect, useState } from 'react';
import { ProductOfCategoryInfoVoOfStoreInfoResponse } from '../../../../../src/api/client';
import { AtIcon, AtModal } from 'taro-ui';
import { CardItem } from '../..';
import Action from '../Action';
import styles from './index.module.scss';

export type ProductModalProps = {
  product: ProductOfCategoryInfoVoOfStoreInfoResponse;
  onClose: () => void;
  onAddToCart: (cartItem: CardItem) => void;
};
const ProductModal: React.FC<ProductModalProps> = (props) => {
  const [addBtnStatus, setAddBtnStatus] = useState<'normal' | 'loading' | 'ok'>('normal');
  const [attributeSelectedInfo, setAttributeSelectedInfo] = useState<{ attributeId: string; attributeItemId: string }[]>([]);
  const [cartItem, setCartItem] = useState<CardItem>({
    productId: props.product.id,
    skuId: '',
    productName: props.product.name!,
    skuPrice: 0,
    number: 1,
    image: props.product.imgUrl!,
  });

  const handleAttributeSelectedChange = (attributeId: string, attributeItemId: string) => {
    let attributeSelectedInfoTemp = attributeSelectedInfo.map((x) => Object.assign({}, x));
    const attributeItemIndex = attributeSelectedInfoTemp.findIndex((x) => x.attributeId === attributeId);
    attributeSelectedInfoTemp[attributeItemIndex].attributeItemId = attributeItemId;
    setAttributeSelectedInfo(attributeSelectedInfoTemp);
  };

  useEffect(() => {
    setAttributeSelectedInfo(
      props.product.attributes!.map((x) => {
        return { attributeId: x.id, attributeItemId: x.attributeItems![0].id };
      })
    );
  }, []);

  useEffect(() => {
    if (attributeSelectedInfo.length == 0) {
      return;
    }
    setCartItem({
      ...cartItem,
      mark: getSkuInfo().join(''),
      skuId: props.product.skus!.filter(
        (x) =>
          x.attributeItemIds?.sort().toString() ===
          attributeSelectedInfo
            .map((x) => x.attributeItemId)
            .sort()
            .toString()
      )![0].id,
      skuPrice: props.product.skus!.filter(
        (x) =>
          x.attributeItemIds?.sort().toString() ===
          attributeSelectedInfo
            .map((x) => x.attributeItemId)
            .sort()
            .toString()
      )![0].price,
    });
  }, [attributeSelectedInfo]);

  const handleOnAdd = () => {
    setCartItem({ ...cartItem, number: cartItem.number + 1 });
  };
  const handleOnMinus = () => {
    if (cartItem.number <= 1) {
      return;
    }
    setCartItem({ ...cartItem, number: cartItem.number - 1 });
  };

  const getSkuInfo = () => {
    let allAttributeItems = props.product.attributes!.map((x) => x.attributeItems!).flat();
    let allSelectedAttributeItemIds = attributeSelectedInfo.map((x) => x.attributeItemId);
    return allAttributeItems.filter((x) => allSelectedAttributeItemIds.findIndex((attributeItemId) => attributeItemId == x.id) != -1).map((x) => `${x.name} `);
  };

  const handleAddToCart = () => {
    setAddBtnStatus('loading');
    setTimeout(() => {
      setAddBtnStatus('ok');
      setTimeout(() => {
        setAddBtnStatus('normal');
        props.onAddToCart(cartItem);
      }, 700);
    }, 400);
  };

  return (
    <AtModal isOpened onClose={() => props.onClose()}>
      <View className={styles.header}>
        <Image src={'https://daveshop-taro.oss-cn-beijing.aliyuncs.com/images/index/round_close_btn.png'} onClick={() => props.onClose()}></Image>
      </View>
      <Swiper duration={1000} indicator-dots className={styles.swiper} autoplay interval={3000}>
        <SwiperItem>
          <Image src={props.product.imgUrl!}></Image>
        </SwiperItem>
      </Swiper>
      <ScrollView scroll-y className={styles.content}>
        <View className={styles.wrapper}>
          <View className={styles.title}>{props.product.name}</View>
          <View className={styles.labels}>
            {props.product.attributes?.map((attribute) => {
              return (
                <View className={styles.label} style='{color: label.label_color, background: $util.hexToRgba(label.label_color, 0.2)}'>
                  {attribute.name}
                </View>
              );
            })}
          </View>
          <View>????????????</View>
          <View>{props.product.description}</View>
          {props.product.attributes?.map((attribute) => {
            return (
              <View className={styles.materials}>
                <View className={styles.groupName}>{attribute.name}</View>
                <View className={styles.values}>
                  {attribute.attributeItems!.map((attributeItem) => {
                    return (
                      <View className={attributeSelectedInfo.map((x) => x.attributeItemId).findIndex((id) => id == attributeItem.id) !== -1 ? styles.value + ' ' + styles.selected : styles.value} onClick={() => handleAttributeSelectedChange(attribute.id, attributeItem.id)}>
                        {attributeItem.name}
                      </View>
                    );
                  })}
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
      <View className={styles.bottom} style="{height: !productData.is_single ? '250rpx' : '200rpx'}">
        <View className={styles.cartItemInfo}>
          <View className={styles.priceAndMaterials}>
            <View className={styles.price}>???{cartItem.skuPrice}</View>
            <View className={styles.materials}>{getSkuInfo()}</View>
          </View>
          <Action isMultiSku={false} number={cartItem.number} onAdd={() => handleOnAdd()} onMinus={() => handleOnMinus()} onSelectMaterails={() => {}}></Action>
        </View>
        <Button disabled={addBtnStatus !== 'normal'} type='primary' className={styles.addCartBtn} onClick={() => handleAddToCart()}>
          {addBtnStatus === 'loading' && <AtIcon className={styles.loading} customStyle={{ fontSize: 'unset', marginRight: 5 }} value='loading'></AtIcon>}
          {addBtnStatus === 'ok' && (
            <>
              <AtIcon customStyle={{ fontSize: 'unset', marginRight: 5 }} value='check'></AtIcon>??????????????????
            </>
          )}
          {addBtnStatus == 'normal' && '???????????????'}
        </Button>
      </View>
    </AtModal>
  );
};
export default ProductModal;
