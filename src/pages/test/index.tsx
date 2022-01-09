import { ScrollView, View } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useState } from 'react';

const Index: React.FC = () => {
  const [current, setCurrent] = useState('');
  return (
    <View style={{ height: 300 }}>
      <ScrollView
        scrollY
        scrollIntoView={current}
        style={{ height: 300 }}
        onScroll={(e) => {
          console.log(e);
        }}
      >
        <View id='a1' onClick={() => setCurrent('a7')} style={{ height: 100, backgroundColor: 'gold', margin: 5 }}>
          1
        </View>
        <View id='a2' style={{ height: 100, backgroundColor: 'gold', margin: 5 }}>
          1
        </View>
        <View id='a3' style={{ height: 100, backgroundColor: 'gold', margin: 5 }}>
          1
        </View>
        <View id='a4' style={{ height: 100, backgroundColor: 'gold', margin: 5 }}>
          1
        </View>
        <View id='a5' style={{ height: 100, backgroundColor: 'gold', margin: 5 }}>
          1
        </View>
        <View id='a6' style={{ height: 100, backgroundColor: 'gold', margin: 5 }}>
          1
        </View>
        <View id='a7' style={{ height: 100, backgroundColor: 'gold', margin: 5 }}>
          7
        </View>
        <View id='a8' style={{ height: 100, backgroundColor: 'gold', margin: 5 }}>
          1
        </View>
        <View id='a9' style={{ height: 100, backgroundColor: 'gold', margin: 5 }}>
          1
        </View>
        <View id='a10' style={{ height: 100, backgroundColor: 'gold', margin: 5 }}>
          1
        </View>
      </ScrollView>
    </View>
  );
};

export default Index;
