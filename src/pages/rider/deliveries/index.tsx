import { Text, View } from '@tarojs/components';
import React, { useState } from 'react';
import { AtButton, AtModal } from 'taro-ui';
import moment from 'moment';
import './index.scss';
import { RiderDeliveringTasksItemResponse } from '@/api/client';
import Empty from '@/components/Empty';

export type DeliveriesProps = {
  deliveries: RiderDeliveringTasksItemResponse[];
  onComplateDelivery: (deliveryId: string) => Promise<void>;
};

const Deliveries: React.FC<DeliveriesProps> = (props) => {
  const [complateDeliveryModal, setComplateDeliveryModalVisable] = useState({ visable: false, text: '', deliveryId: '' });
  const complateDelivery = async () => {
    const deliveryId = complateDeliveryModal.deliveryId;
    setComplateDeliveryModalVisable({ visable: false, text: '', deliveryId: '' });
    await props.onComplateDelivery(deliveryId);
  };

  return (
    <View>
      <AtModal isOpened={complateDeliveryModal.visable} title='送达确认' cancelText='取消' confirmText='确认' onClose={() => setComplateDeliveryModalVisable({ visable: false, text: '', deliveryId: '' })} onCancel={() => setComplateDeliveryModalVisable({ visable: false, text: '', deliveryId: '' })} onConfirm={() => complateDelivery()} content={complateDeliveryModal.text} className='modal' />
      {props.deliveries.length == 0 && <Empty text='暂无记录, 快去接单吧' />}
      {props.deliveries.map((x) => {
        return (
          <View style={{ margin: 15, borderRadius: 5, backgroundColor: '#fff', padding: 15, boxShadow: '4px 4px 20px #f3f3f3' }}>
            <View style={{ textAlign: 'right', color: '#626675', lineHeight: 0.5 }}>· · ·</View>
            <View style={{ marginTop: 10, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
              <View>
                已下单<Text style={{ color: 'red' }}> {moment().diff(x.orderCreateTime, 'minutes')} </Text>分钟
              </View>
              {/* <View>#8952</View> */}
            </View>
            <View style={{ fontSize: 18, marginTop: 10, fontWeight: 'bold' }}>
              {x.simpleAddress}
              {x.houseNumber}
            </View>
            <View style={{ color: '#626675', marginTop: 10 }}>
              {x.name}
              {x.mobile}
            </View>
            <AtButton onClick={() => setComplateDeliveryModalVisable({ visable: true, text: `我确认${x.name}的包裹已送达`, deliveryId: x.id })} type='primary' customStyle={{ marginTop: 10 }}>
              我已送达
            </AtButton>
          </View>
        );
      })}
    </View>
  );
};

export default Deliveries;
