import { API } from '@/api';
import { GetRefundPreviousInfoResponse } from '@/api/client';
import { Image, View } from '@tarojs/components';
import { useEffect, useState } from 'react';
import { AtButton } from 'taro-ui';
import './index.scss';

export default (() => {
  const [refundPreviousInfo, setRefundPreviousInfo] = useState<GetRefundPreviousInfoResponse>(new GetRefundPreviousInfoResponse());
  useEffect(() => {
    const fetch = async () => {
      const result = await API.refundClient.getPreviousInfo('4CFC5A2B-765D-81E5-923E-3A02E331C526');
      setRefundPreviousInfo(result);
    };
    fetch();
  }, []);
  return (
    <>
      <View className='order-items-card'>
        {refundPreviousInfo.orderItems?.map((orderItem) => {
          return (
            <View className='order-item'>
              <View style={{ display: 'flex', alignItems: 'center' }}>
                <Image lazyLoad mode='aspectFill' src={orderItem.imageUrl!} style={{ width: 64, height: 64 }}></Image>
              </View>
              <View style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-around', overflow: 'auto', wordWrap: 'break-word', marginLeft: 10 }}>
                <View style={{ fontSize: 16 }}>{orderItem.snapshotName}</View>
                <View style={{ fontSize: 14, color: '#999' }}>x{orderItem.quantity}</View>
              </View>
              <AtButton type='primary' size='small' customStyle={{ color: '#fff', borderRadius: 50, fontSize: 13, width: 64, height: 26, lineHeight: '26px' }} onClick={() => {}}>
                申请
              </AtButton>
            </View>
          );
        })}
      </View>
    </>
  );
}) as React.FC;
