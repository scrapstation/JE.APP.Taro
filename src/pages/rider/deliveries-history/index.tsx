import { API } from '@/api';
import { DeliveryStatusEnumOfDeliveryHistory, LoadRiderDeliveryHistoryRequest, LoadRiderDeliveryHistoryResponse } from '@/api/client';
import { Picker, Text, View } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { usePullDownRefresh, useReachBottom } from '@tarojs/taro';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { AtCalendar, AtIcon, AtLoadMore, AtTag } from 'taro-ui';
import './index.scss';

const DeliveriesHistory: React.FC = () => {
  const [loadStatus, setLoadStatus] = useState<'more' | 'loading' | 'noMore'>('more');
  const [deliveriesHistorys, setDeliveriesHistorys] = useState<LoadRiderDeliveryHistoryResponse[]>([]);
  const [dateRange, setDateRange] = useState();
  const [isDisputed, setIsDisputed] = useState<boolean>(false);
  const [timeRange, setTimeRange] = useState<{ startDate: Date; endDate: Date }>({ startDate: moment().startOf('month').toDate(), endDate: moment().add(1, 'M').startOf('month').toDate() });
  const getSettlementColor = (history: LoadRiderDeliveryHistoryResponse) => {
    if (history.settledTime == null) {
      return '#faad14';
    }
    if (history.settledCommission == 0) {
      return '#f50';
    }
    if (history.settledCommission !== history.commission) {
      return '#108ee9';
    }
    if (history.settledCommission == history.commission) {
      return '#87d068';
    }
    return '#d9d9d9';
  };

  const renderLoadStatus = () => {
    switch (loadStatus) {
      case 'loading':
        return <AtLoadMore customStyle={{ height: 30 }} status={'loading'} />;
      case 'more':
        return <AtLoadMore customStyle={{ height: 'unset' }} noMoreText='加载更多' status={'noMore'} />;
      case 'noMore':
        return <AtLoadMore customStyle={{ height: 'unset' }} noMoreText='我是有底线的~' status={'noMore'} />;
      default:
        break;
    }
  };
  const getDeliveryStatusText = (history: LoadRiderDeliveryHistoryResponse) => {
    switch (history.status) {
      case DeliveryStatusEnumOfDeliveryHistory.InDelivery:
        return '配送中';
      case DeliveryStatusEnumOfDeliveryHistory.Canceled:
        return '已取消';
      case DeliveryStatusEnumOfDeliveryHistory.Complated:
        return '已完成';
      case DeliveryStatusEnumOfDeliveryHistory.Transferred:
        return '已转单';
      default:
        break;
    }
  };

  const onDateSelected = (dates: { start: string | undefined; end: string | undefined }) => {
    console.log(dates.start);
    console.log(dates.end);
  };

  const load = async (referenceId: string | null) => {
    try {
      setLoadStatus('loading');
      const result = await API.riderClient.loadDeliveryHistory(new LoadRiderDeliveryHistoryRequest({ referenceId: referenceId ?? undefined, startTime: timeRange.startDate, endTime: timeRange.endDate, isDisputed: isDisputed }));
      if (result.length == 0) {
        setLoadStatus('noMore');
        return;
      }
      if (referenceId) {
        await new Promise<void>((reslove, _) => {
          setTimeout(() => {
            reslove();
          }, 300);
        });
        setDeliveriesHistorys([...deliveriesHistorys, ...result]);
      } else {
        setDeliveriesHistorys(result);
      }
      setLoadStatus('more');
    } catch {
      setLoadStatus('more');
    }
  };

  useEffect(() => {
    console.log(moment().startOf('month').toDate());
    load(null);
  }, []);

  useEffect(() => {}, []);
  useReachBottom(() => {
    if (loadStatus == 'noMore') {
      return;
    }
    load([...deliveriesHistorys].pop()?.id || null);
  });

  usePullDownRefresh(async () => {
    setTimeout(async () => {
      await load(null);
      Taro.stopPullDownRefresh();
    }, 300);
  });

  const renderHistoryItem = (info: LoadRiderDeliveryHistoryResponse) => {
    return (
      <View style={{ borderBottom: '1px solid #f8f8f8', padding: 15, backgroundColor: '#fff' }}>
        <View style={{ marginBottom: 5, display: 'flex', justifyContent: 'space-between' }}>
          <View style={{ fontSize: 14 }}>
            <Text style={{ fontWeight: 'bold', verticalAlign: 'middle' }}>JD005819925322</Text>
            <AtTag customStyle={{ marginLeft: 5 }} size='small'>
              {getDeliveryStatusText(info)}
            </AtTag>
          </View>
          <View style={{ fontSize: 14, color: '#6D7178' }}>{moment(info.createdOn).format('YYYY-MM-DD HH:mm:ss')}</View>
        </View>
        <View style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <View>
            <View style={{ fontSize: 12, marginBottom: 5 }}>
              收货地址:
              {` ${info.simpleAddress}${info.houseNumber}`}
            </View>
            <View style={{ fontSize: 12 }}>{} </View>
            {/* <View style={{ fontSize: 12 }}>接单时间: 2020-10-10 21:23:42</View> */}
            <View style={{ fontSize: 12 }}>
              结算状态:
              {info.settledTime == null ? ' 待结算' : ' 已结算'}
            </View>
          </View>
          <View style={{ fontWeight: 'bold', fontFamily: 'neutra', color: getSettlementColor(info) }}>
            ￥<Text style={{ fontSize: 22 }}>{info.settledTime == null ? info.commission.toFixed(2) : info.settledCommission!.toFixed(2)}</Text>
          </View>
        </View>
      </View>
    );
  };
  return (
    <View className='main'>
      <View style={{ margin: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}>
        <Picker mode='date' value={'2021-11-22'} fields={'month'} onChange={() => {}}>
          <View>
            <Text style={{ fontSize: 32 }}>11</Text>月
          </View>
        </Picker>
        <AtTag customStyle={{ color: isDisputed ? '' : '#faad14', borderColor: isDisputed ? '' : '#faad14' }} active={isDisputed} onClick={() => setIsDisputed(!isDisputed)} type='primary'>
          仅显示异常订单
        </AtTag>
      </View>
      {/* <AtCalendar isMultiSelect onSelectDate={(dates) => onDateSelected(dates.value)} /> */}
      {deliveriesHistorys.map((x) => renderHistoryItem(x))}
      <View style={{ margin: '5px 0px 15px', textAlign: 'center' }}>{renderLoadStatus()}</View>
    </View>
  );
};

export default DeliveriesHistory;
