import { View, Image, Navigator } from "@tarojs/components";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ConnectState } from "src/models/connect";
import { UserModelState } from "src/models/user";
import { AtBadge, AtIcon, AtList, AtListItem, AtTag } from "taro-ui";
import bg from '/src/static/images/my/headerbg.png'
import user from '/src/static/images/my/user.png'
import "./index.scss"

export type PersonalProps = {
    user: UserModelState;
};

const renderListItem = (title: string, path: string, desc: string, showArrow: boolean) => {
    return (<Navigator url={path} style={{ padding: '20px 20px' }}>
        <View style={{ display: 'flex', alignItems: 'center' }}>
            <View style={{ fontSize: 16, color: '#343434' }}>{title}</View>
            <View style={{ flex: 1, textAlign: 'right', fontSize: 14, color: '#C1C3C6' }}>{desc}</View>
            <View>
                {showArrow &&
                    <AtIcon value='chevron-right' size={14} color='#C1C3C6' customStyle={{ marginLeft: 10, verticalAlign: 'unset' }}></AtIcon>
                }
            </View>
        </View>
    </Navigator>)
}

const Personal: React.FC = () => {
    const dispatch = useDispatch()
    const { currentUser, isLogin } = useSelector<ConnectState, UserModelState>(x => x.user)
    useEffect(() => {
        console.log(useEffect)
        if (isLogin) {
            dispatch({ type: 'user/getCurrentUserInfo' });
        }
    }, [isLogin])
    return (
        <View className='container'>
            <View className='header-img'>
                <Image style={{ width: '100%' }} src={bg} mode='widthFix'></Image>
            </View>
            <View className='content'>
                <View className='member-card'>
                    <View style={{ display: 'flex' }}>
                        <Image className='avatar' src={currentUser ? currentUser!.avator! : user} ></Image>
                        <View style={{ display: 'flex', marginLeft: 10, flexDirection: 'column', justifyContent: 'space-evenly' }}>
                            {currentUser &&
                                <>
                                    <AtBadge value={'Lv1'}>
                                        <View className='wenyue-font' style={{ fontSize: 20 }}>{`你好, ${currentUser?.nickName}`}</View>
                                    </AtBadge>
                                    <View style={{ fontSize: 14 }}>
                                        热情周五，为你打气
                                    </View>
                                </>
                            }
                            {!currentUser &&
                                <>
                                    <View className='wenyue-font' style={{ fontSize: 18 }} onClick={() => dispatch({ type: "user/login" })}>轻点登录</View>
                                    {/* <AtTag onClick={() => dispatch({ type: "user/login" })} active type='primary' className='login-button'>点击登录</AtTag> */}
                                </>
                            }
                        </View>
                    </View>
                    <View className='row' style={{ marginTop: 20 }}>
                        <View className='grid'>
                            {/* <Image src={require('../../static/images/my/me_icon_points.png')}></Image> */}
                            <View className='value'>{currentUser ? 63 : '***'}</View>
                            <View className='title'>积分商城</View>
                        </View>
                        <View className='grid' hover-className='opacity-6'>
                            {/* <Image src={require('../../static/images/my/me_icon_quan.png')}></Image> */}
                            <View className='value'>{currentUser ? 0 : '***'}</View>
                            <View className='title'>喜茶劵</View>
                        </View>
                        <View className='grid'>
                            {/* <Image src={require('../../static/images/my/me_icon_wallet.png')}></Image> */}
                            <View className='value'>{currentUser ? 0.00 : '***'}</View>
                            <View className='title'>钱包</View>
                        </View>
                    </View>
                </View >
            </View >
            <View style={{ backgroundColor: '#fff', marginBottom: 20 }}>
                {renderListItem('骑手中心', '/pages/rider/index', '', true)}
            </View>
            <View style={{ backgroundColor: '#fff', marginBottom: 20 }}>
                {renderListItem('兑换中心', '/pages/rider/index', '积分换购', true)}
                {renderListItem('联系客服', '', '7*24在线客服', true)}
                {renderListItem('技术支持', '', 'LIMO科技', true)}
                {renderListItem('关于我们', '', '几个青年的创业故事', true)}
                {renderListItem('退出登陆', '', '', false)}
            </View>
        </View >
    )
}

export default Personal;