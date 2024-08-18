import { useEffect, useState } from "react";
import { cancleOrder } from "../../services/orderService";
import { getUser } from "../../services/userService";
import { IOrder } from "../../types";
import { useNavigate } from "react-router-dom";

const OrderHistory = () => {
    const [userOrders, setUserOrders] = useState<IOrder[]>([]);
    const navigate = useNavigate();

    const getUserInfo = async () => {
        const user = await getUser();
        setUserOrders(user.orderHistory);
    };

    useEffect(() => {
        getUserInfo();
    }, []);

    const onCancelOrderClick = async (orderId: string) => {
        cancleOrder({ orderId });
        getUserInfo();
    };

    const navigateToHome = () => {
        navigate('/home');
    }

    return (
        <div className="OrderHistory">
            {userOrders && userOrders.map((order) => (
                <div className="order-item" key={order._id}>
                    <div className="order-date">{order.date}</div>
                    <div className="order-status">{order.status}</div>
                    {order.status === "Active" && (
                        <div
                            className="cancel-button"
                            onClick={() => onCancelOrderClick(order._id)}
                        >
                            Cancel
                        </div>
                    )}
                </div>
            ))}
            {
                userOrders.length === 0 &&  <div>NO Order</div>
            }
            <div onClick={navigateToHome}>Go to Home</div>
        </div>
    );
};

export default OrderHistory;