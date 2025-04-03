import { Tag } from "antd";
import { Order, OrderStatus } from "./typings";

export const getTotalPrice = (data: Order[]) => {
    if (!data || data.length === 0) return 0;
    return data
        .filter(item => item.status !== OrderStatus.cancel)
        .reduce((total, item) => total + item.price, 0);
};

export const getStatusCounts = (data: Order[]) => {
    if (!data || data.length === 0) 
        return { pending: 0, confirmed: 0, delivering: 0, delivered: 0, cancelled: 0 };

    return data.reduce(
        (acc, item) => {
            switch (item.status) {
                case OrderStatus.awaiting_confirmation:
                    acc.pending++;
                    break;
                case OrderStatus.confirmed:
                    acc.confirmed++;
                    break;
                case OrderStatus.delivering:
                    acc.delivering++;
                    break;
                case OrderStatus.delivered:
                    acc.delivered++;
                    break;
                case OrderStatus.cancel:
                    acc.cancelled++;
                    break;
            }
            return acc;
        },
        { pending: 0, confirmed: 0, delivering: 0, delivered: 0, cancelled: 0 }
    );
};

export const formatCurrency = (value: number) => {
    if (typeof value !== "number") return value;
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    }).format(value);
}

export const getStatusTag = (status: OrderStatus): JSX.Element => {
    switch (status) {
        case OrderStatus.awaiting_confirmation:
            return <Tag color="orange">Chờ xác nhận</Tag>;
            return <Tag color="orange"> Chờ xác nhận </Tag>;
        case OrderStatus.confirmed:
            return <Tag color="green"> Đã xác nhận </Tag>;
        case OrderStatus.delivering:
            return <Tag color="blue"> Đang giao hàng </Tag>;
        case OrderStatus.delivered:
            return <Tag color="purple"> Đã giao hàng </Tag>;
        case OrderStatus.cancel:
            return <Tag color="red"> Hủy </Tag>;
        default:
            return <Tag>{status}</Tag>;
    }
}