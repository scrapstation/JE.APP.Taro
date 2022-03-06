import { Text, View } from '@tarojs/components';
import { AtButton } from 'taro-ui';
import './index.scss';

export default () => {
  return (
    <View style={{ backgroundColor: '#FFF', display: 'flex', margin: 20, padding: 10, borderRadius: 8, alignItems: 'center' }}>
      <View style={{ width: 70, color: '#DBA376', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <View>
          <Text style={{ fontSize: 30 }}>10</Text>元
        </View>
        <View style={{ fontSize: 11 }}>满30元可用</View>
      </View>
      <View style={{ flex: 1, margin: '0 10px' }}>
        <View>戴夫通用券</View>
        <View style={{ fontSize: 10, marginTop: 4 }}>有效期至2022.02.16</View>
      </View>
      <View style={{ margin: '0 20px' }}>
        <AtButton type='primary' size='small' customStyle={{ borderRadius: '50rem', padding: '0 1em' }} onClick={() => {}}>
          去使用
        </AtButton>
      </View>
    </View>
  );
};
