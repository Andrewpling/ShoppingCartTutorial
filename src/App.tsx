import { useState } from "react";
import { useQuery } from "react-query";

//Components
import Drawer from "@material-ui/core/Drawer";
import Cart from './Cart/Cart';
import LinearProgress from "@material-ui/core/LinearProgress";
import Grid from "@material-ui/core/Grid";
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import Badge from "@material-ui/core/Badge";
import Item from './Item/Item'

//styles
import { Wrapper, StyledButton } from './App.styles';

//types
export type CartItemType = {
  id: number;
  category: string;
  description: string;
  image: string;
  price: number;
  title: string;
  amount: number;
}

const getProducts = async (): Promise<CartItemType[]> =>
  await (await fetch('https://fakestoreapi.com/products')).json();

  //All fetching is done inside async functions
  //We put the .json at the end because that is what APIs generally send back

  //A promise is what we get back when fetching data
  //In this case, the data we want to get back from the API is the CartItemType type
  //The data we receive back is an array of cart items


const App = () =>{
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([] as CartItemType[])
  const { data, isLoading, error } = useQuery<CartItemType[]>(
    'products', 
    getProducts
  );
  console.log(data); //returns the full array of items from the API

  const getTotalItems = (items: CartItemType[]) => 
    items.reduce((ack: number, item) => ack + item.amount, 0);  
    
    const handleAddToCart = (clickedItem: CartItemType) => {
      setCartItems(prev => {
        // 1. Is the item already in the cart? Compare the two ids.
        const isItemInCart = prev.find(item => item.id === clickedItem.id);

        if(isItemInCart){
          return prev.map(item => 
            item.id === clickedItem.id
              ? { ...item, amount: item.amount + 1}
              : item
          );
        }
        //First time the item is added
        return [...prev, { ...clickedItem, amount: 1}];
      })
    };

    const handleRemoveFromCart = (id: number) => {
      setCartItems(prev => 
        prev.reduce((ack, item) => {
          if(item.id === id) {
            if(item.amount === 1) return ack;
            return [...ack, { ...item, amount: item.amount - 1}];
          } else {
            return [...ack, item];
          }
        }, [] as CartItemType[])
      );
    };

    if(isLoading) return <LinearProgress />;
    //displays the material ui core loading bar at the top while waiting for the data to come in

    if(error) return <div>Something went wrong</div>;

    return (
      <Wrapper>
        <Drawer anchor='right' open={cartOpen} onClose={() => setCartOpen(false)}>
          <Cart 
            cartItems={cartItems} 
            addToCart={handleAddToCart}
            removeFromCart={handleRemoveFromCart}
          />
        </Drawer>
        <StyledButton onClick={() => setCartOpen(true)}>
          <Badge badgeContent={getTotalItems(cartItems)} color='error'>
            <AddShoppingCartIcon />
          </Badge>
        </StyledButton>
        <Grid container spacing={3}>
          {data?.map(item => (
            <Grid item key={item.id} xs={12} sm={4}>
              <Item item={item} handleAddToCart={handleAddToCart} />
            </Grid>
          ))}
        </Grid>
      </Wrapper>
    )


  return <div className="App">Start</div>;
}

export default App;
