import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';

type TabsPropType = {
  tabList: string[];
  currentIndex: number;
  onTabChange: (index: number) => void;
};
export default ((props) => {
  return (
    <View style={{ flex: 1, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <View style={{ display: 'flex', flexDirection: 'column' }}>
        <View style={{ display: 'flex', backgroundColor: '#fff', justifyContent: 'space-around', height: 40 }}>
          {props.tabList.map((x, index) => (
            <View onClick={() => props.onTabChange(index)} style={{ flex: 1 }}>
              <View style={{ width: 'fit-content', margin: '0 auto', height: '100%', textAlign: 'center', display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'space-between' }}>
                <View></View>
                <Text style={{ color: props.currentIndex == index ? '#343434' : '#5d5d5d', fontSize: '30rpx', fontWeight: 'bold' }}>{x}</Text>
                <View style={{ backgroundColor: props.currentIndex == index ? '#343434' : '#fff', height: 1.5, width: '100%' }}></View>
              </View>
            </View>
          ))}
        </View>
        <View style={{ backgroundColor: '#eaeaea', height: '1px', width: '100%' }}></View>
      </View>
      <View style={{ flex: 1, display: 'flex', position: 'relative', overflow: 'hidden', width: '100%' }}>{props.children}</View>
    </View>
  );
}) as React.FC<TabsPropType>;
