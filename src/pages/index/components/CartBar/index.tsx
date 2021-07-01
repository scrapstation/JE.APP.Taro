import { View, Image } from "@tarojs/components"
import { AtButton } from "taro-ui"

export type CartBarProps = {
    cartNum: number;
    cartPrice: number;
    onPay: () => void;
    onDetail: () => void;
};
const CartBar: React.FC<CartBarProps> = (props) => {
    return (
        <View>
            {/* <uni-transition :mode-class="['slide-bottom']" :show="!!cartNum" :styles="cartBarStyles"> */}
            <View className="left">
                <View className="detail-action" onClick={() => props.onDetail()}>
                    <Image src="/static/images/index/icon_shopping_bag.png" className="shopbag-btn"></Image>
                    <View className="badge">{props.cartNum}</View>
                </View>
                <View className="price">￥{props.cartPrice}</View>
            </View>
            <AtButton type="primary" className="right" onClick={() => props.onPay()}>结算</AtButton>
            {/* </uni-transtion> */}
            {/* <cart-popup :cart="cart" ref="cartPopup" @add="add" @minus="minus" @clear="clear"></cart-popup> */}
        </View>
    )
}
export default CartBar

// <script>
// import uniTransition from '@/components/uni-transition/uni-transition.vue'
// import cartPopup from '../cart-popup/cart-popup.vue'

// export default {
// 	name: 'CartBar',
// 	components: {
// 		uniTransition,
// 		cartPopup
// 	},
// 	props: {
// 		cart: {
// 			type: Array,
// 			default: () => []
// 		}
// 	},
// 	computed: {
// 		cartNum() { //计算购物车总数
// 			return this.cart.reduce((acc, cur) => acc + cur.number, 0)
// 		},
// 		cartPrice() {	//计算购物车总价
// 			return this.cart.reduce((acc, cur) => acc + cur.number * cur.price, 0)
// 		}	
// 	},
// 	data() {
// 		return {
// 			cartBarStyles: {
// 				'position': 'fixed',
// 				'bottom': 0,
// 				// #ifdef H5
// 				'bottom': 'var(--window-bottom)',
// 				// #endif
// 				'width': '100%',
// 				'z-index': '995',
// 				'height': '100rpx',
// 				'background-color': '#f0f0f1',
// 				'border-bottom': '2rpx solid #c8c7cc',
// 				'display': 'flex',
// 				'justify-content': 'space-between',
// 				'align-items': 'stretch',
// 			}
// 		}
// 	},
// 	methods: {
// 		details() {
// 			this.$refs['cartPopup'].open()
// 		},
// 		add(product) {
// 			this.$emit('add', {...product, number: 1})
// 		},
// 		minus(product) {
// 			this.$emit('minus', product)
// 		},
// 		clear() {
// 			this.$emit('clear')
// 		},
// 		pay() {
// 			this.$emit('pay')
// 		}
// 	},
// 	watch: {
// 		cartNum(val) {
// 			if(!val) {
// 				this.$refs['cartPopup'].close()
// 			}
// 		}
// 	}
// };
// </script>