import { Button, Image, Text, View } from '@tarojs/components';
import { useDidShow, usePullDownRefresh, useReachBottom, useReady } from '@tarojs/taro';
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
import { AtIcon, AtLoadMore } from 'taro-ui';
import Empty from '@/components/Empty';

const Order: React.FC = () => {
  const didMountRef = useRef(false);
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const dispatch = useDispatch();
  const { isLogin } = useSelector<ConnectState, UserModelState>((x) => x.user);
  const [loadStatus, setLoadStatus] = useState<'more' | 'loading' | 'noMore'>('more');

  useReady(() => {
    init();
    Taro.eventCenter.on('refreshOrderList', () => {
      if (isLogin) {
        init();
      }
    });
  });

  usePullDownRefresh(async () => {
    await init();
    setTimeout(() => {
      Taro.stopPullDownRefresh();
    }, 200);
  });
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
    // 兼容首次Effect不执行init（与useDidShow重复）
    if (didMountRef.current) {
      if (isLogin) {
        init();
      }
    } else {
      didMountRef.current = true;
    }
  }, [isLogin]);

  const toOrderDetail = (order: OrderResponse) => {
    Taro.navigateTo({
      url: `/pages/order/detail/index?order=${JSON.stringify(order)}`,
    });
  };

  const renderLoadStatus = () => {
    switch (loadStatus) {
      case 'noMore':
        return <View style={{ margin: '30px 0', fontSize: 13, color: '#999' }}>没有更多了~</View>;
      default:
        break;
    }
  };

  const renderOrderItem = (order: OrderResponse) => {
    return (
      <View onClick={() => toOrderDetail(order)} style={{ display: 'flex', flexDirection: 'column', margin: '8px 8px 0', borderRadius: 8, padding: '16px 16px 24px', backgroundColor: '#FFF' }}>
        <View style={{ display: 'flex', justifyContent: 'space-between' }}>
          <View>
            <View style={{ fontSize: 14, color: '#343434' }}>亮马河大厦店</View>
            <View style={{ fontSize: 11, color: '#999' }}>{moment(order.createdOn).format('YYYY-MM-DD HH:mm:ss')}</View>
          </View>
          <View style={{ fontSize: 12, color: '#5d5d5d' }}>
            <Text style={{ verticalAlign: 'middle' }}>{getStatusText(order.status)}</Text>
            <AtIcon value='chevron-right' size={16}></AtIcon>
          </View>
        </View>
        <View style={{ display: 'flex', marginTop: 20, alignItems: 'center' }}>
          <View style={{ flex: 1, width: '70%', display: 'flex', overflow: 'auto', marginRight: 20 }}>
            {order.orderItems &&
              order.orderItems!.map((orderItem) => {
                return <Image style='width: 50px; height: 50px; margin-right: 10px; flex-shrink: 0' src={`https://${orderItem.imgUrl!}`}></Image>;
              })}
          </View>
          <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <View className='neutra-font' style={{ color: '#343434', fontSize: 16, fontWeight: 500 }}>
              ￥{order.amount}
            </View>
            <View style={{ fontSize: 12, color: '#999' }}>共{order.orderItems?.length || 0}件</View>
          </View>
        </View>
        <View style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}>
          {order.status === StatusEnumOfOrder.PendingPayment && (
            <>
              <Button
                type='primary'
                size='mini'
                style={{ margin: '0 0 0 5px', backgroundColor: '#fff', color: '#999', borderRadius: 2, border: '1px solid #999' }}
                onClick={(e) => {
                  e.stopPropagation();
                  cancelOrder(order.id);
                }}
              >
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
    <View style={{ height: '100%' }}>
      {!isLogin && (
        <View style={{ height: '100%', alignItems: 'center', boxSizing: 'border-box', paddingBottom: 200, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
          <Text style={{ color: '#8a8a8a', marginBottom: 10 }}>您还没有登录，登陆后可查看您的订单</Text>
          <Button type='primary' style={{ padding: '0 40px', fontSize: 16, borderRadius: 3, backgroundColor: '#dba871' }} onClick={() => dispatch({ type: 'user/login' })}>
            现在登录
          </Button>
        </View>
      )}
      {isLogin && (
        <>
          {orders.map((order) => {
            return renderOrderItem(order);
          })}
          {orders.length == 0 && loadStatus != 'loading' && <Empty text='您还没有订单哦' />}
          {orders.length != 0 && <View style={{ margin: '5px 0px 15px', textAlign: 'center' }}>{renderLoadStatus()}</View>}
        </>
      )}
    </View>
  );
};

export default Order;
