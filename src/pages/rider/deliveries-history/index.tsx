import { API } from '@/api';
import { LoadRiderDeliveryHistoryResponse } from '@/api/client';
import { View } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { usePullDownRefresh, useReachBottom } from '@tarojs/taro';
import React, { useEffect, useState } from 'react';
import './index.scss';

const DeliveriesHistory: React.FC = () => {
  const [loadStatus, setLoadStatus] = useState<'done' | 'loading' | 'nomore'>('done');
  const [deliveriesHistorys, setDeliveriesHistorys] = useState<LoadRiderDeliveryHistoryResponse[]>([]);
  const load = async (referenceId: string | null) => {
    try {
      setLoadStatus('loading');
      const result = await API.riderClient.loadDeliveryHistory(referenceId);
      if (result.length == 0) {
        setLoadStatus('nomore');
        return;
      }
      if (referenceId) {
        setDeliveriesHistorys([...deliveriesHistorys, ...result]);
      } else {
        setDeliveriesHistorys(result);
      }
      setLoadStatus('done');
    } catch {
      setLoadStatus('done');
    }
  };
  useEffect(() => {
    load(null);
  }, []);
  useReachBottom(() => {
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
      <View style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f8f8f8', padding: 15, backgroundColor: '#fff' }}>
        <View>
          <View style={{ fontWeight: 'bold' }}>
            {`${info.simpleAddress}${info.houseNumber}`}
            {info.settledTime ? '已结算' : '未结算'}
          </View>
          <View style={{ fontSize: 12, color: '#b8b8b8' }}>配送编号: JD005819925322</View>
          <View style={{ fontSize: 12, color: '#b8b8b8' }}>接单时间: 2020-10-10 21:23:42</View>
        </View>
        <View style={{ fontWeight: 'bold', color: '#faad14' }}>￥{info.commission}</View>
      </View>
    );
  };
  return (
    <View className='main'>
      {deliveriesHistorys.map((x) => renderHistoryItem(x))}
      {loadStatus}
    </View>
  );
};

export default DeliveriesHistory;
