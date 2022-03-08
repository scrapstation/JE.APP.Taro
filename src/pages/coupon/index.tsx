import { Text, View } from '@tarojs/components';
import { AtButton } from 'taro-ui';
import './index.scss';

const renderCouponItem = () => {
  return (
    <View className='left' style={{ backgroundColor: '#FFF', display: 'flex', margin: 20, padding: 15, borderRadius: 8, alignItems: 'center' }}>
      <View style={{ width: 70, marginRight: 10, color: '#daa871', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <View>
          <Text className='neutra-font' style={{ fontSize: 32 }}>
            9
          </Text>
          <Text style={{ fontSize: 13, fontWeight: 500 }}>折</Text>
        </View>
        <View style={{ fontSize: 11, color: '#dda25e' }}>无门槛</View>
      </View>
      <View style={{ flex: 1, margin: '0 10px' }}>
        <View className='info-name'>限定饮品9折券</View>
        <View className='info-expire'>有效期至2022.02.16</View>
      </View>
      <View style={{ margin: '0' }}>
        <AtButton type='primary' size='small' customStyle={{ color: '#fff', borderRadius: 50, fontSize: 13, width: 64, height: 26, lineHeight: '26px' }} onClick={() => {}}>
          去使用
        </AtButton>
      </View>
    </View>
  );
};
export default () => {
  return [1, 2, 3].map((x) => renderCouponItem());
};
