import { addOrder } from "../../services/orderService";

//make the items visible here as well as make order cancle workflow
const Cart = () => {

    const onOrderClick = () => {
        addOrder();
    } 
    
    return (
        <>
            <div onClick={onOrderClick}>place Order</div>
        </>
    )
}

export default Cart;