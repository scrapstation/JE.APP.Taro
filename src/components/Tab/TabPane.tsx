import { ScrollView, View } from '@tarojs/components';
import Taro from '@tarojs/taro';
type TabPaneProps = {
  index: number;
  currentIndex: number;
  onLoad: () => Promise<any>;
};
export default ((props) => {
  const windowInfo = Taro.getWindowInfo();
  return (
    <ScrollView scrollY onScrollToLower={() => props.onLoad()} style={{ overflow: 'scroll', transform: 'translateX(0px)', transition: 'all .45s', position: 'absolute', width: windowInfo.windowWidth + 'px', height: '100%', left: props.index * windowInfo.windowWidth - windowInfo.windowWidth * props.currentIndex + 'px' }}>
      {props.children}
    </ScrollView>
  );
}) as React.FC<TabPaneProps>;
