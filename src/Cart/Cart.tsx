import CartItem from "../CartItem/CartItem";

//Styles
import { Wrapper } from "./Cart.styles";

//Types
import { CartItemType } from "../App";

type Props = {
  cartItems: CartItemType[];
  addToCart: (clickedItem: CartItemType) => void;
  removeFromCart: (id: number) => void;
};

const Cart: React.FC<Props> = ({ cartItems, addToCart, removeFromCart}) => {
  return(
    <Wrapper>
      <h2>Your shopping cart</h2>
      {cartItems.length == 0 ? <p>No items in cart</p> : null }
      {cartItems.map(item => (
        <CartItem />
      ))}
    </Wrapper>
  );
};

export default Cart;