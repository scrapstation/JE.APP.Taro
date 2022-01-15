import { Button, ScrollView, View } from '@tarojs/components';
import { useState } from 'react';
import { API } from '../../api/index';
import { ConsigneeItemResponse } from '../../../src/api/client';
import { AtDivider, AtIcon, AtSwipeAction } from 'taro-ui';
import './index.scss';
import Taro, { navigateBack, useDidShow } from '@tarojs/taro';
import Empty from '@/components/Empty';

const toAddPage = () => {
  Taro.navigateTo({
    url: '/pages/consignee/add/index',
  });
};

const toEditPage = (consigneeItem: ConsigneeItemResponse) => {
  Taro.navigateTo({
    url: `/pages/consignee/add/index?consignee=${JSON.stringify(consigneeItem)}`,
  });
};

const back = (consigneeId: string) => {
  Taro.eventCenter.trigger('selectConsignee', consigneeId);
  navigateBack();
};

const Consignee: React.FC = () => {
  const [consignees, setConsignees] = useState<ConsigneeItemResponse[]>([]);

  const fetchConsignee = async () => {
    const data = await API.consigneeClient.getAll();
    setConsignees(data);
  };

  useDidShow(() => {
    fetchConsignee();
  });

  const renderConsigneeItem = (consigneeItem: ConsigneeItemResponse) => {
    return (
      <AtSwipeAction
        onClick={() => deleteById(consigneeItem.id)}
        options={[
          {
            text: '删除',
            style: {
              backgroundColor: '#FF4949',
            },
          },
        ]}
        maxDistance={120}
        areaWidth={Taro.getSystemInfoSync().screenWidth}
      >
        <View onClick={() => back(consigneeItem.id)} style='width:100%;background-color:#FFF;padding:15px;display:flex;align-items:center;'>
          <View style={{ flex: 1 }}>
            <View style={{ fontSize: 15 }}>{`${consigneeItem.simpleAddress} ${consigneeItem.houseNumber}`}</View>
            <View style={{ fontSize: 14, color: '#999999', marginTop: 10 }}>{`${consigneeItem.name} ${consigneeItem.mobile}`}</View>
          </View>
          <View
            onClick={(e) => {
              e.stopPropagation();
              toEditPage(consigneeItem);
            }}
          >
            <AtIcon value='edit' size='16'></AtIcon>
          </View>
        </View>
      </AtSwipeAction>
    );
  };

  const deleteById = async (id: string) => {
    await API.consigneeClient.delete(id);
    await fetchConsignee();
  };

  return (
    <>
      <ScrollView scrollY scrollWithAnimation scrollTop={0} style={{ height: '100%', marginTop: '10px' }}>
        {consignees.length == 0 && <Empty text='点击下方添加地址' />}
        <View style={{ backgroundColor: '#FFF' }}>
          {consignees.map((consignee) => {
            return (
              <>
                {renderConsigneeItem(consignee)}
                <AtDivider height={0.5} customStyle={{ margin: '0 15px', width: 'unset' }} lineColor='#fafafa'></AtDivider>
              </>
            );
          })}
        </View>
        <View style={{ height: 100 }}></View>
      </ScrollView>
      <View style={{ zIndex: 999, position: 'fixed', left: 0, right: 0, bottom: 30 }}>
        <Button type='primary' style={{ backgroundColor: '#DBA871', color: '#fff', margin: '0 20px' }} onClick={() => toAddPage()}>
          添加
        </Button>
      </View>
    </>
  );
};

export default Consignee;
