import { useState } from "react"
import { AtButton, AtCheckbox, AtDivider, AtForm, AtInput } from "taro-ui"
import styles from "./index.module.scss"

const AddConsignee: React.FC = () => {
    const [isDefault, setIsDefault] = useState<boolean>(false);
    return (
        <>
            <AtInput
                name='value'
                title='联系人'
                type='text'
                placeholder='请输入收货人的姓名'
                border={false}
                onChange={() => { }}
            />
            <AtDivider height={0.5} customStyle={{ margin: '0 15px', width: 'unset' }} lineColor='#fafafa'></AtDivider>
            <AtInput
                name='value'
                title='手机号'
                type='text'
                placeholder='请输入收货手机号码'
                border={false}
                onChange={() => { }}
            />
            <AtDivider height={0.5} customStyle={{ margin: '0 15px', width: 'unset' }} lineColor='#fafafa'></AtDivider>
            <AtCheckbox
                className={styles.redio}
                customStyle={{ border: '0' }}
                options={[{ value: true, label: '设为默认地址' }]}
                selectedList={isDefault ? [true] : []}
                onChange={() => setIsDefault(!isDefault)}
            />
            <AtDivider height={0.5} customStyle={{ margin: '0 15px', width: 'unset' }} lineColor='#fafafa'></AtDivider>
            {/* <AtInput
                name='value'
                title='文本'
                type='text'
                placeholder='单行文本'
                onChange={() => { }}
            /><AtInput
                name='value'
                title='文本'
                type='text'
                placeholder='单行文本'
                onChange={() => { }}
            /><AtInput
                name='value'
                title='文本'
                type='text'
                placeholder='单行文本'
                onChange={() => { }}
            />
            <AtButton type="primary" formType='submit' customStyle={{ margin: '10px 15px' }}>提交</AtButton> */}
        </>
    )
}

export default AddConsignee