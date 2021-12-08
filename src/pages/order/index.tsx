import { Button, Image, View } from '@tarojs/components';
import { useDidShow, useReachBottom } from '@tarojs/taro';
import moment from 'moment';
import { useEffect, useRef, useState } from 'react';
import { API } from '../../../src/api';
import { LoadOrderRequest, OrderResponse, StatusEnumOfOrder } from '../../../src/api/client';
import './index.scss';
import Taro from '@tarojs/taro';
import tryFetch from '../../../src/utils/tryfetch';
import getStatusText from './common';
import { useDispatch, useSelector } from 'react-redux';
import { ConnectState } from '@/models/connect';
import { UserModelState } from '@/models/user';
import { AtLoadMore } from 'taro-ui';
import empty from '/src/static/images/my/rider/empty.svg';

const Order: React.FC = () => {
  const didMountRef = useRef(false);
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const dispatch = useDispatch();
  const { isLogin } = useSelector<ConnectState, UserModelState>((x) => x.user);
  const [loadStatus, setLoadStatus] = useState<'more' | 'loading' | 'noMore'>('more');

  const init = async () => {
    try {
      setLoadStatus('loading');
      const queryedOrders = await API.orderClient.loadOrder(new LoadOrderRequest());
      setLoadStatus(queryedOrders.length < 10 ? 'noMore' : 'more');
      setOrders(queryedOrders);
    } catch (error) {
      setLoadStatus('more');
    }
  };

  const loadOrder = async () => {
    const queryedOrders = await API.orderClient.loadOrder(new LoadOrderRequest({ referenceId: [...orders].pop()?.id }));
    setLoadStatus(queryedOrders.length < 10 ? 'noMore' : 'more');
    setOrders([...orders, ...queryedOrders]);
  };

  useReachBottom(() => {
    if (loadStatus == 'more') {
      loadOrder();
    }
  });

  useEffect(() => {
    if (didMountRef.current) {
      if (isLogin) {
        init();
      }
    } else {
      didMountRef.current = true;
    }
  }, [isLogin]);

  useEffect(() => {
    if (!isLogin) {
      dispatch({ type: 'user/login' });
    }
  }, []);

  useDidShow(() => {
    if (isLogin) {
      init();
    }
  });

  const toOrderDetail = (order: OrderResponse) => {
    Taro.navigateTo({
      url: `/pages/order/detail/index?order=${JSON.stringify(order)}`,
    });
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

  const renderOrderItem = (order: OrderResponse) => {
    return (
      <View style={{ display: 'flex', flexDirection: 'column', marginTop: 10, padding: 10, backgroundColor: '#FFF' }}>
        <View style={{ display: 'flex', justifyContent: 'space-between' }}>
          <View style={{ fontSize: 14 }}>{moment(order.createdOn).format('YYYY-MM-DD HH:mm:ss')}</View>
          <View style={{ fontSize: 14, color: '#999' }} onClick={() => toOrderDetail(order)}>
            {getStatusText(order.status)}
          </View>
        </View>
        <View style={{ display: 'flex', marginTop: 20 }}>
          <View style={{ flex: 1, width: '70%', display: 'flex', overflow: 'auto', marginRight: 20 }}>
            {order.orderItems &&
              order.orderItems!.map((orderItem) => {
                return <Image style='width: 50px; height: 50px; margin-right: 10px; flex-shrink: 0' src={`https://${orderItem.imgUrl!}`}></Image>;
              })}
          </View>
          <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <View>￥{order.actualPayment}</View>
            <View style={{ fontSize: 12, color: '#999' }}>共{order.orderItems?.length || 0}件</View>
          </View>
        </View>
        <View style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}>
          {order.status === StatusEnumOfOrder.PendingPayment && (
            <>
              <Button type='primary' size='mini' style={{ margin: '0 0 0 5px', backgroundColor: '#fff', color: '#999', borderRadius: 2, border: '1px solid #999' }} onClick={() => cancelOrder(order.id)}>
                取消订单
              </Button>
              <Button
                type='primary'
                size='mini'
                style={{ margin: '0 0 0 5px', backgroundColor: '#fff', color: '#DBA871', borderRadius: 2, border: '1px solid #DBA871' }}
                onClick={() => {
                  pay(order.id);
                }}
              >
                去支付
              </Button>
            </>
          )}
          {/* TODO暂不支持 */}
          {/* {order.status !== StatusEnumOfOrder.PendingPayment && (
            <Button type='primary' size='mini' style={{ margin: '0 0 0 5px', backgroundColor: '#fff', color: '#DBA871', borderRadius: 2, border: '1px solid #DBA871' }}>
              再来一单
            </Button>
          )} */}
        </View>
      </View>
    );
  };
  const cancelOrder = async (orderId: string) => {
    const result = await Taro.showModal({ content: '取消订单后,退款及优惠券将原路退回，可能出现退款延迟到账' });
    if (result.confirm) {
      await tryFetch(API.orderClient.cancel(orderId), true);
      init();
    }
  };
  const pay = async (orderId: string) => {
    const payinfo = await tryFetch(API.orderClient.pay(orderId), true);
    await tryFetch(
      Taro.requestPayment({
        timeStamp: payinfo.timeStamp!,
        nonceStr: payinfo.nonceStr!,
        package: payinfo.package!,
        // @ts-ignore
        signType: payinfo.signType!,
        paySign: payinfo.paySign!,
      }),
      true
    );
  };
  return (
    <View>
      {orders.map((order) => {
        return renderOrderItem(order);
      })}
      {orders.length == 0 && loadStatus != 'loading' && (
        <View style={{ marginTop: 100, textAlign: 'center' }}>
          <Image src={empty} style={{ width: 80, height: 80 }} />
          <View style={{ color: '#8a8a8a' }}>空空如也~ 快去接单吧</View>
        </View>
      )}
      {orders.length != 0 && <View style={{ margin: '5px 0px 15px', textAlign: 'center' }}>{renderLoadStatus()}</View>}
    </View>
  );
};

export default Order;
