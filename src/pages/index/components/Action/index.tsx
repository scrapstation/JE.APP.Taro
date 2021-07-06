import { View, Image } from "@tarojs/components"
import { AtButton } from "taro-ui"
import "./index.scss"

export type ActionProps = {
    number: number;
    isMultiSku: boolean;
    onAdd: () => void;
    onMinus: () => void;
    onSelectMaterails: () => void;
};
const Action: React.FC<ActionProps> = (props) => {
    return (
        <View className="actions">
            {!props.isMultiSku &&
                <>
                    {
                        props.number > 0 &&
                        <>
                            <Image src={require('../../../../static/images/index/round_minus.png')} className="minus-btn" onClick={() => props.onMinus()}></Image>
                            <View className="number">{props.number}</View>
                        </>
                    }
                    <Image src={require('../../../../static/images/index/round_add_normal.png')} className="add-btn" onClick={() => props.onAdd()}></Image>
                </>
            }
            {props.isMultiSku &&
                <View className="materials-box">
                    <AtButton type="primary" size="small" className="materials-btn" onClick={() => props.onSelectMaterails()}>选规格</AtButton>
                    <View className="number-badge" v-show="number">
                        <View className="number">{props.number}</View>
                    </View>
                </View>
            }
        </View>
    )
}
export default Action;

