export interface Order {
    order_id: string;
    customer: Customer;
    product: Product[];
    date_ordered: string;
    price: number;
    status: OrderStatus
}   

export interface Customer {
    customer_id: string;
    customer_name: string;
    phone_number: string;
}

export interface Product {
    product_id: string;
    product_name: string;
    product_price: number;
}

export enum OrderStatus {
    awaiting_confirmation = 'Đang chờ xác nhận',
    confirmed = 'Đã xác nhận',
    delivering = 'Đang giao hàng',
    delivered = 'Đã giao hàng',
    cancel = 'Huỷ',
}