import { Button, View } from "@tarojs/components";
import { useState } from "react";
import { AtTag, AtTextarea } from "taro-ui";
import Taro, { navigateBack, useDidShow, useReady, useResize, useRouter } from '@tarojs/taro';

const Remark: React.FC = () => {
    const router = useRouter()
    const [content, setContent] = useState<string>('');
    const tags = ['缺货退差价', '缺货联系我']
    useReady(() => {
        setContent(router.params.remark || "")
    })
    const addContent = (value) => {
        if (content == '' || content.endsWith('，')) {
            setContent(x => x + value)
        } else {
            setContent(x => x + ',' + value)
        }
    }
    const handleSubmit = () => {
        Taro.eventCenter.trigger('submitRemark', content)
        navigateBack()
    }
    return (
        <>
            <View style={{ margin: 10 }}>
                <AtTextarea
                    customStyle={{ backgroundColor: '#FAFAFA', border: 0 }}
                    value={content}
                    onChange={(value) => setContent(value)}
                    maxLength={200}
                    placeholder='口味、包装等要求'
                />
                <View style={{ marginTop: 20 }}>
                    <View style={{ fontSize: 14, color: '#999' }}>快捷输入</View>
                    {tags.map(tag => {
                        return <AtTag type='primary' customStyle={{ margin: '5px 5px 5px 0px' }} onClick={() => addContent(tag)}>{tag}</AtTag>
                    })}
                </View>
            </View>
            <View style={{ zIndex: 999, position: 'fixed', left: 0, right: 0, bottom: 30 }}>
                <Button type='primary' style={{ backgroundColor: '#DBA871', color: "#fff", margin: '0 20px' }} onClick={() => handleSubmit()}>添加</Button>
            </View>
        </>
    )
}

export default Remark