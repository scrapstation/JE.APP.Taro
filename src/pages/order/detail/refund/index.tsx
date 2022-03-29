import { API } from '@/api';
import { GetRefundPreviousInfoResponse } from '@/api/client';
import { Button, Image, Text, View } from '@tarojs/components';
import { useEffect, useState } from 'react';
import { AtButton, AtDivider } from 'taro-ui';
import './index.scss';

export default (() => {
  const [refundPreviousInfo, setRefundPreviousInfo] = useState<GetRefundPreviousInfoResponse>(new GetRefundPreviousInfoResponse());
  useEffect(() => {
    const fetch = async () => {
      const result = await API.refundClient.getPreviousInfo('e0b44e66-2e90-b741-be14-3a02e87c6efe');
      setRefundPreviousInfo(result);
    };
    fetch();
  }, []);
  return (
    <>
      {/* <View className='header'>
        <AtButton size='small' customStyle={{ color: '#999', borderColor: '#999', padding: '0 10px', margin: 'unset', borderRadius: 50, fontSize: 13, height: 26, lineHeight: '26px' }} onClick={() => {}}>
          整单退款
        </AtButton>
      </View> */}
      <View className='order-items-card'>
        <View style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <View style={{ fontWeight: 'bold' }}>请选择要退款的商品</View>

          <Text style={{ fontSize: 13, color: '#999' }} onClick={() => {}}>
            整单退款
          </Text>
          {/* <AtButton size='small' customStyle={{ color: '#999', borderColor: '#999', padding: '0 10px', margin: 'unset', borderRadius: 50, fontSize: 13, height: 26, lineHeight: '26px' }} onClick={() => {}}>
            整单退款
          </AtButton> */}
        </View>
        <AtDivider height={1} lineColor='#F8F8F8' />
        {/* <View style={{ borderBottom: '1px solid #999' }}></View> */}
        {refundPreviousInfo.orderItems?.map((orderItem) => {
          return (
            <View className='order-item'>
              <View style={{ display: 'flex', alignItems: 'center' }}>
                <Image lazyLoad mode='aspectFill' src={orderItem.imageUrl!} style={{ width: 64, height: 64 }}></Image>
              </View>
              <View style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-around', overflow: 'auto', wordWrap: 'break-word', marginLeft: 10 }}>
                <View style={{ fontSize: 16 }}>{orderItem.snapshotName}</View>
                <View style={{ fontSize: 14, color: '#999' }}>{orderItem.snapshotAttributeItemNames}</View>
                <View style={{ fontSize: 14, color: '#999' }}>x{orderItem.quantity}</View>
              </View>

              <Button type='primary' size='mini' style={{ lineHeight: 2, margin: '0 0 0 5px', backgroundColor: '#fff', color: '#DBA871', borderRadius: 2, border: '1px solid #DBA871' }} onClick={() => {}}>
                退款
              </Button>
              {/* <AtButton type='primary' size='small' customStyle={{ color: '#fff', borderRadius: 50, fontSize: 13, width: 64, height: 26, lineHeight: '26px' }} onClick={() => {}}>
                申请
              </AtButton> */}
            </View>
          );
        })}
      </View>
    </>
  );
}) as React.FC;
