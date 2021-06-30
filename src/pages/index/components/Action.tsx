import { View, Image } from "@tarojs/components"
import { AtButton } from "taro-ui"
import "./Action.scss"

export type ActionProps = {
    number: number;
    materialsBtn: boolean;
    onAdd: () => void;
    onMinus: () => void;
    onSelectMaterails: () => void;
};
const Action: React.FC<ActionProps> = (props) => {
    return (
        <View className="actions">
            {!props.materialsBtn &&
                <>
                    <Image src={require('../../../static/images/index/round_minus.png')} className="minus-btn" onClick={() => props.onMinus()}></Image>
                    <View className="number">{props.number}</View>
                    <Image src={require('../../../static/images/index/round_add_normal.png')} className="add-btn" onClick={() => props.onAdd()}></Image>
                </>
            }
            {props.materialsBtn &&
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

