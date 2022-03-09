import { Text, View } from '@tarojs/components';
import { AtButton } from 'taro-ui';
import './index.scss';

const renderCouponItem = (num: number, unit: string, limitText: string) => {
  return (
    <View className='left' style={{ backgroundColor: '#FFF', display: 'flex', margin: 15, padding: '12px 15px', borderRadius: 8, alignItems: 'center' }}>
      <View style={{ width: 70, marginRight: 10, color: '#daa871', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <View>
          <Text className='neutra-font' style={{ fontSize: num < 100 ? 32 : 28 }}>
            {num}
          </Text>
          <Text style={{ fontSize: 13, fontWeight: 500 }}>{unit}</Text>
        </View>
        <View style={{ fontSize: 11, color: '#dda25e' }}>{limitText}</View>
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
  return [
    { num: 1, unit: '元', limitText: '无门槛' },
    { num: 200, unit: '元', limitText: '满199可用' },
    { num: 9, unit: '折', limitText: '最多折扣30元' },
  ].map((x) => renderCouponItem(x.num, x.unit, x.limitText));
};
