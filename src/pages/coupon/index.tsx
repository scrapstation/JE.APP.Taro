import { API } from '@/api';
import { CouponTypeEnumOfCoupon, LoadCouponRequest, LoadCouponResponse, StatusEnumOfCoupon } from '@/api/client';
import Empty from '@/components/Empty';
import TabPane from '@/components/Tab/TabPane';
import Tabs from '@/components/Tab/Tabs';
import { ScrollView, Text, View } from '@tarojs/components';
import { useReady } from '@tarojs/taro';
import classNames from 'classnames';
import { useState } from 'react';
import { AtButton } from 'taro-ui';
import './index.scss';

const renderCouponItem = (name: string, status: StatusEnumOfCoupon, num: number, unit: string, limitText: string, effectiveTimeRange: string) => {
  return (
    <View className={classNames('coupon-item', status !== StatusEnumOfCoupon.Usable && status !== StatusEnumOfCoupon.NotStart ? 'coupon-item-inactive' : '')}>
      <View className='left'>
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
        <AtButton disabled={status != StatusEnumOfCoupon.NotStart && status != StatusEnumOfCoupon.Usable} type='primary' size='small' customStyle={{ color: '#fff', borderRadius: 50, fontSize: 13, width: 64, height: 26, lineHeight: '26px' }} onClick={() => {}}>
          {status == StatusEnumOfCoupon.NotStart && '去使用'}
          {status == StatusEnumOfCoupon.Usable && '去使用'}
          {status == StatusEnumOfCoupon.Used && '已使用'}
          {status == StatusEnumOfCoupon.Expired && '已过期'}
        </AtButton>
      </View>
    </View>
  );
};
export default () => {
  const [usableCouponsTab, setUsableCouponsTab] = useState<{ list: LoadCouponResponse[]; loadStatus: 'more' | 'loading' | 'noMore' }>({ list: [], loadStatus: 'more' });
  const [usedCouponsTab, setUsedCouponsTab] = useState<{ list: LoadCouponResponse[]; loadStatus: 'more' | 'loading' | 'noMore' }>({ list: [], loadStatus: 'more' });
  const [expiredCouponsTab, setExpiredCouponsTab] = useState<{ list: LoadCouponResponse[]; loadStatus: 'more' | 'loading' | 'noMore' }>({ list: [], loadStatus: 'more' });
  const [currentTabIndex, setCurrentTabIndex] = useState<number>(0);
  useReady(() => {
    load('availableCoupons');
  });

  const load = async (type: 'availableCoupons' | 'usedCoupons' | 'expiredCoupons') => {
    let queriedCoupons;
    switch (type) {
      case 'availableCoupons':
        queriedCoupons = await API.couponClient.loadCoupon(new LoadCouponRequest({ referenceId: [...usableCouponsTab.list].pop()?.id, statusList: [StatusEnumOfCoupon.NotStart, StatusEnumOfCoupon.Usable] }));
        setUsableCouponsTab({ list: [...usableCouponsTab.list, ...queriedCoupons], loadStatus: queriedCoupons.length < 10 ? 'noMore' : 'more' });
        break;
      case 'usedCoupons':
        queriedCoupons = await API.couponClient.loadCoupon(new LoadCouponRequest({ referenceId: [...usedCouponsTab.list].pop()?.id, statusList: [StatusEnumOfCoupon.Used] }));
        setUsedCouponsTab({ list: [...usedCouponsTab.list, ...queriedCoupons], loadStatus: queriedCoupons.length < 10 ? 'noMore' : 'more' });
        break;
      case 'expiredCoupons':
        queriedCoupons = await API.couponClient.loadCoupon(new LoadCouponRequest({ referenceId: [...expiredCouponsTab.list].pop()?.id, statusList: [StatusEnumOfCoupon.Expired] }));
        setExpiredCouponsTab({ list: [...expiredCouponsTab.list, ...queriedCoupons], loadStatus: queriedCoupons.length < 10 ? 'noMore' : 'more' });
        break;
      default:
        break;
    }
  };

  const renderLoadStatus = () => {
    const loadStatusList = [usableCouponsTab.loadStatus, usedCouponsTab.loadStatus, expiredCouponsTab.loadStatus];
    return loadStatusList[currentTabIndex] == 'noMore' ? <View style={{ margin: '30px 0', fontSize: 13, color: '#999' }}>没有更多了~</View> : <></>;
  };

  const renderBody = ({ list, loadStatus }: { list: LoadCouponResponse[]; loadStatus: 'more' | 'loading' | 'noMore' }) => {
    return (
      <>
        {list.map((x) => {
          switch (x.type) {
            case CouponTypeEnumOfCoupon.Discount:
              const discountPercentText = x.discountPercent % 10 === 0 ? x.discountPercent / 10 : x.discountPercent;
              return renderCouponItem(x.name!, x.status, discountPercentText, '折', `满${x.discountLimitAmount}元可用`, x.effectiveTimeRange!);
            case CouponTypeEnumOfCoupon.FullReduction:
              return renderCouponItem(x.name!, x.status, x.fullReductionDiscountAmount, '元', `满${x.orderLimitAmount}元可用`, x.effectiveTimeRange!);
            default:
              break;
          }
        })}
        {list.length == 0 && loadStatus == 'noMore' && <Empty text='这里什么都没有' />}
        {list.length != 0 && <View style={{ margin: '5px 0px 15px', textAlign: 'center' }}>{renderLoadStatus()}</View>}
      </>
    );
  };
  const handleTabChange = async (index: number) => {
    const tabNames: Array<'availableCoupons' | 'usedCoupons' | 'expiredCoupons'> = ['availableCoupons', 'usedCoupons', 'expiredCoupons'];
    load(tabNames[index]);
    setCurrentTabIndex(index);
  };
  return (
    <Tabs tabList={['可使用', '已使用', '已失效']} currentIndex={currentTabIndex} onTabChange={(index) => handleTabChange(index)}>
      <TabPane currentIndex={currentTabIndex} index={0}>
        <ScrollView style={{ height: '100%' }} scrollY onScrollToLower={() => load('availableCoupons')}>
          {renderBody(usableCouponsTab)}
        </ScrollView>
      </TabPane>
      <TabPane currentIndex={currentTabIndex} index={1}>
        <ScrollView style={{ height: '100%' }} scrollY onScrollToLower={() => load('usedCoupons')}>
          {renderBody(usedCouponsTab)}
        </ScrollView>
      </TabPane>
      <TabPane currentIndex={currentTabIndex} index={2}>
        <ScrollView style={{ height: '100%' }} scrollY onScrollToLower={() => load('expiredCoupons')}>
          {renderBody(expiredCouponsTab)}
        </ScrollView>
      </TabPane>
    </Tabs>
  );
};
