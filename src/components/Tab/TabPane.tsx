import { ScrollView, View } from '@tarojs/components';
import Taro from '@tarojs/taro';
type TabPaneProps = {
  index: number;
  currentIndex: number;
};
export default ((props) => {
  const windowInfo = Taro.getWindowInfo();
  return <View style={{ transform: 'translateX(0px)', transition: 'all .45s', position: 'absolute', width: windowInfo.windowWidth + 'px', height: '100%', left: props.index * windowInfo.windowWidth - windowInfo.windowWidth * props.currentIndex + 'px' }}>{props.children}</View>;
}) as React.FC<TabPaneProps>;
