import { Button, Image, Text, View } from '@tarojs/components';
import { useRouter } from '@tarojs/taro';
import { useReady } from '@tarojs/taro';
import moment from 'moment';
import { useState } from 'react';
import tryFetch from '../../../../src/utils/tryfetch';
import { AtCountdown, AtDivider } from 'taro-ui';
import { API } from '../../../../src/api';
import { OrderResponse, StatusEnumOfOrder } from '../../../../src/api/client';
import getStatusText from '../common';
import './index.scss';
import Taro from '@tarojs/taro';

const OrderDetail: React.FC = () => {
  const router = useRouter();
  const [isReady, setIsReady] = useState<boolean>(false);
  const [order, setOrder] = useState<OrderResponse>(new OrderResponse());
  useReady(async () => {
    setOrder(OrderResponse.fromJS(JSON.parse(router.params.order!)));
    setIsReady(true);
  });
  const getOrder = async (orderId: string) => {
    setOrder(await API.orderClient.getById(orderId));
  };
  const pay = async (orderId: string) => {
    const payinfo = await tryFetch(API.orderClient.pay(orderId), true);
    await Taro.requestPayment({
      timeStamp: payinfo.timeStamp!,
      nonceStr: payinfo.nonceStr!,
      package: payinfo.package!,
      // @ts-ignore
      signType: payinfo.signType!,
      paySign: payinfo.paySign!,
    });
  };
  const renderStatusArea = (order: OrderResponse) => {
    return (
      <>
        <View className=''>
          <Text style={{ fontSize: 20 }}>
            {getStatusText(order.status)}
            {order.status === StatusEnumOfOrder.PendingPayment && ` ￥${order.amount}`}
          </Text>
        </View>
        <View style={{ marginTop: 5 }}>
          {order.status == StatusEnumOfOrder.PendingPayment && (
            <View>
              <AtCountdown
                className='at-countdown'
                format={{ hours: ':', minutes: ':', seconds: '' }}
                seconds={moment(order.expireTime).diff(moment.now(), 'seconds')}
                isShowHour={false}
                onTimeUp={() => {
                  getOrder(order.id);
                }}
              />
              <Text style={{ color: '#999', fontSize: 12 }}>后订单将会自动取消</Text>
            </View>
          )}
          {order.status !== StatusEnumOfOrder.PendingPayment && <Text style={{ color: '#999', fontSize: 14 }}>感谢您的支持，欢迎再次光临</Text>}
        </View>
        <View style={{ marginTop: 10 }}>
          {order.status == StatusEnumOfOrder.PendingPayment && (
            <>
              <Button type='primary' size='mini' style={{ margin: '0 0 0 5px', backgroundColor: '#fff', color: '#999', borderRadius: 2, border: '1px solid #999' }} onClick={() => {}}>
                取消订单
              </Button>
              <Button type='primary' size='mini' style={{ margin: '0 0 0 5px', backgroundColor: '#fff', color: '#DBA871', borderRadius: 2, border: '1px solid #DBA871' }} onClick={() => pay(order.id)}>
                去支付
              </Button>
            </>
          )}
        </View>
      </>
    );
  };

  const renderOrderItems = (order: OrderResponse) => {
    return order.orderItems!.map((item) => {
      return (
        <View style={{ display: 'flex', flexWrap: 'wrap', marginTop: 5, marginBottom: 5 }}>
          <View style={{ display: 'flex', alignItems: 'center' }}>
            <Image lazyLoad mode='aspectFill' src={item.imgUrl!} style={{ width: 64, height: 64, borderRadius: 8 }}></Image>
          </View>
          <View style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-around', overflow: 'auto', wordWrap: 'break-word', marginLeft: 10 }}>
            <View style={{ fontSize: 14 }}>{item.snapshotName}</View>
            <View style={{ fontSize: 12, color: '#999' }}>{item.snapshotAttributeItemNames}</View>
          </View>
          <View style={{ minWidth: 40, textAlign: 'right' }}>
            <View style={{ fontSize: 16 }}>￥{item.price}</View>
            <View style={{ fontSize: 14, color: '#999' }}>x{item.quantity}</View>
          </View>
        </View>
      );
    });
  };
  return (
    <>
      {isReady && (
        <View className='main'>
          <View style={{ textAlign: 'center' }}>{renderStatusArea(order)}</View>
          <View style={{ display: 'flex', flexDirection: 'column' }}>
            {renderOrderItems(order)}
            <View style={{ overflow: 'auto', marginTop: 20 }}>
              <Text style={{ fontSize: 16, float: 'right' }}>
                共 {order.orderItems!.reduce((arr, x) => arr + x.quantity, 0)} 件商品，合计 ￥{order.amount}
              </Text>
            </View>
          </View>
          <View className='info'>
            <View style={{ display: 'inline-block' }}>订单信息</View>
            <AtDivider height={0.5} customStyle={{ margin: '10px 0', width: 'unset' }} lineColor='#fafafa'></AtDivider>
            <View className='item'>
              {[
                { title: '下单时间', value: moment(order.createdOn).format('YYYY/MM/DD HH:mm:ss') },
                { title: '订单编号', value: order.externalId },
                { title: '备注信息', value: order.remark },
              ].map((item) => (
                <View>
                  <View className='title'>{item.title}: </View>
                  <View className='value'>{item.value}</View>
                </View>
              ))}
            </View>
          </View>
          <View style={{ backgroundColor: '#ffffff00', textAlign: 'center', color: '#999', fontSize: 13 }}>
            如有问题，请<Text style={{ textDecoration: 'underline' }}>申请售后</Text>
          </View>
        </View>
      )}
    </>
  );
};
export default OrderDetail;
