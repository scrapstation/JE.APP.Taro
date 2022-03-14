import { API } from '@/api';
import { CouponTypeEnumOfCoupon, LoadCouponRequest, LoadCouponResponse } from '@/api/client';
import Empty from '@/components/Empty';
import TabPane from '@/components/Tab/TabPane';
import Tabs from '@/components/Tab/Tabs';
import { Text, View } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { usePullDownRefresh, useReachBottom, useReady } from '@tarojs/taro';
import { useState } from 'react';
import { AtButton, AtTabs, AtTabsPane } from 'taro-ui';
import './index.scss';

const renderCouponItem = (name: string, num: number, unit: string, limitText: string, effectiveTimeRange: string) => {
  return (
    <View className='left' style={{ backgroundColor: '#FFF', display: 'flex', margin: 15, padding: '12px 10px', borderRadius: 8, alignItems: 'center' }}>
      <View style={{ width: 75, marginRight: 0, color: '#daa871', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <View>
          <Text className='neutra-font' style={{ fontSize: num < 100 ? 32 : 28 }}>
            {num}
          </Text>
          <Text style={{ fontSize: 13, fontWeight: 500 }}>{unit}</Text>
        </View>
        <View className='limit-text' style={{ fontSize: limitText.length < 10 ? 11 : 10, color: '#dda25e' }}>
          {limitText}
        </View>
      </View>
      <View style={{ flex: 1, margin: '0 10px' }}>
        <View className='info-name'>{name}</View>
        <View className='info-expire'>{effectiveTimeRange}</View>
      </View>
      <View style={{ margin: '0' }}>
        <AtButton type='primary' size='small' customStyle={{ color: '#fff', borderRadius: 50, fontSize: 13, width: 64, height: 26, lineHeight: '26px' }} onClick={() => {}}>
          去使用
        </AtButton>
      </View>
    </View>
  );
};
export default () => {
  const [availableCouponsTab, setAvailableCouponsTab] = useState<{ list: LoadCouponResponse[]; loadStatus: 'more' | 'loading' | 'noMore' }>({ list: [], loadStatus: 'more' });
  const [usedCouponsTab, setUsedCouponsTab] = useState<{ list: LoadCouponResponse[]; loadStatus: 'more' | 'loading' | 'noMore' }>({ list: [], loadStatus: 'more' });
  const [currentTabIndex, setCurrentTabIndex] = useState<number>(0);
  useReady(() => {
    initAvailableCouponsTab();
  });
  const initAvailableCouponsTab = async () => {
    try {
      setAvailableCouponsTab({ list: [], loadStatus: 'loading' });
      const queriedCoupons = await API.couponClient.loadOrder(new LoadCouponRequest());
      setAvailableCouponsTab({ list: queriedCoupons, loadStatus: queriedCoupons.length < 10 ? 'noMore' : 'more' });
    } catch (error) {
      setAvailableCouponsTab({ ...availableCouponsTab, loadStatus: 'more' });
    }
  };

  // useReachBottom(() => {
  //   if (loadStatus == 'more') {
  //     loadOrder();
  //   }
  // });

  const load = async () => {
    const queriedCoupons = await API.couponClient.loadOrder(new LoadCouponRequest({ referenceId: [...availableCouponsTab.list].pop()?.id }));
    setAvailableCouponsTab({ list: [...availableCouponsTab.list, ...queriedCoupons], loadStatus: queriedCoupons.length < 10 ? 'noMore' : 'more' });
  };

  const renderLoadStatus = () => {
    let loadStatus;
    switch (currentTabIndex) {
      case 0:
        loadStatus = availableCouponsTab.loadStatus;
        break;
      case 1:
        loadStatus = usedCouponsTab.loadStatus;
        break;
      default:
        break;
    }
    switch (loadStatus) {
      case 'noMore':
        return <View style={{ margin: '30px 0', fontSize: 13, color: '#999' }}>没有更多了~</View>;
      default:
        break;
    }
  };

  const renderBody = ({ list, loadStatus }: { list: LoadCouponResponse[]; loadStatus: 'more' | 'loading' | 'noMore' }) => {
    return (
      <>
        {list.map((x) => {
          switch (x.type) {
            case CouponTypeEnumOfCoupon.Discount:
              const discountPercentText = x.discountPercent % 10 === 0 ? x.discountPercent / 10 : x.discountPercent;
              return renderCouponItem(x.name!, discountPercentText, '折', `满${x.discountLimitAmount}元可用`, x.effectiveTimeRange!);
            case CouponTypeEnumOfCoupon.FullReduction:
              return renderCouponItem(x.name!, x.fullReductionDiscountAmount, '元', `满${x.fullReductionLimitAmount}元可用`, x.effectiveTimeRange!);
            default:
              break;
          }
        })}
        {list.length == 0 && loadStatus != 'loading' && <Empty text='您还没有订单哦' />}
        {list.length != 0 && <View style={{ margin: '5px 0px 15px', textAlign: 'center' }}>{renderLoadStatus()}</View>}
      </>
    );
  };
  const handleTabChange = async (index: number) => {
    setCurrentTabIndex(index);
  };
  return (
    <Tabs tabList={['可使用', '已使用', '已失效']} currentIndex={currentTabIndex} onTabChange={(index) => handleTabChange(index)}>
      <TabPane currentIndex={currentTabIndex} index={0} onLoad={() => load()}>
        {renderBody(availableCouponsTab)}
      </TabPane>
      {/* <TabPane currentIndex={currentTabIndex} index={1}>
        {renderBody(usedCouponsTab)}
      </TabPane>
      <TabPane currentIndex={currentTabIndex} index={2}>
        {renderBody(availableCouponsTab)}
      </TabPane> */}
    </Tabs>
  );
};
