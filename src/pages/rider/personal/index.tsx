import { Image, Navigator, View } from '@tarojs/components';
import React from 'react';
import { useSelector } from 'react-redux';
import { RiderGetSummaryResponse } from 'src/api/client';
import { ConnectState } from 'src/models/connect';
import { UserModelState } from 'src/models/user';
import './index.scss';
import defaultUserAvator from '/src/static/images/my/user.png';
import lv1Svg from '/src/static/images/my/rider/level-1.svg';
import riderSvg from '/src/static/images/my/rider/rider.svg';
import settlementSvg from '/src/static/images/my/rider/settlement.svg';
import riderBg from '/src/static/images/my/rider/riderBg.png';
import NumberMotion from './components/NumberMotion';
import { AtIcon } from 'taro-ui';

export type PersonalProps = {
  summary: RiderGetSummaryResponse;
};

const renderListItem = (title: string, path: string, desc: string, showArrow: boolean) => {
  return (
    <Navigator url={path} style={{ padding: '20px 20px' }}>
      <View style={{ display: 'flex', alignItems: 'center' }}>
        <View style={{ fontSize: 16, color: '#343434' }}>{title}</View>
        <View style={{ flex: 1, textAlign: 'right', fontSize: 14, color: '#C1C3C6' }}>{desc}</View>
        <View>{showArrow && <AtIcon value='chevron-right' size={14} color='#C1C3C6' customStyle={{ marginLeft: 10, verticalAlign: 'unset' }}></AtIcon>}</View>
      </View>
    </Navigator>
  );
};
const Personal: React.FC<PersonalProps> = (props) => {
  const { currentUser, isLogin } = useSelector<ConnectState, UserModelState>((x) => x.user);
  return (
    <View className='main'>
      <View className='bg'>
        <View className='mask'></View>
        <Image style={{ width: '100%' }} src={riderBg} mode='widthFix'></Image>
      </View>
      <View className='content'>
        <View className='rider-info-card'>
          <Image className='avatar' src={currentUser ? currentUser!.avator! : defaultUserAvator}></Image>
          <View className='base-info'>
            <View className='nickname'>Hi,汤姆可</View>
            <View className='viptips'>今天是你在戴夫小卖部的第67天</View>
          </View>
          <Image className='level' src={lv1Svg}></Image>
        </View>
        <View className='account-info'>
          <View>
            <View>
              ￥<NumberMotion number={98} />
            </View>
            <View> 今日收入 </View>
          </View>
          <View>
            <View>
              ￥<NumberMotion number={8487} />
            </View>
            <View> 钱包 </View>
          </View>
          <View>
            <View>
              <NumberMotion number={0} />
            </View>
            <View> 今日配送 </View>
          </View>
          <View>
            <View>
              <NumberMotion number={987} />
            </View>
            <View> 累计配送 </View>
          </View>
        </View>
        {/* <View className='service-card'>
        <View className='title'>骑士服务</View>
        <View className='services'>
          <View>
            <Image src={settlementSvg}></Image>
            <View> 结算记录 </View>
          </View>
          <View>
            <Image src={riderSvg}></Image>
            <View> 配送历史 </View>
          </View>
        </View>
      </View> */}
        <View style={{ backgroundColor: '#fff', borderRadius: 5 }}>
          {renderListItem('结算记录', '/pages/rider/index', '满30即可结算', true)}
          {renderListItem('配送历史', '', '争议订单(1)', true)}
          {renderListItem('技术支持', '', 'LIMO科技', true)}
          {renderListItem('关于我们', '', ' ', true)}
        </View>
      </View>
    </View>
  );
};

export default Personal;
