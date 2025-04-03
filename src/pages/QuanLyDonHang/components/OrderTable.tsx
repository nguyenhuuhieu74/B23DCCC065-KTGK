import { formatCurrency, getStatusTag } from "@/services/QuanLyDonHang";
import { Order, Customer, Product, OrderStatus } from "@/services/QuanLyDonHang/typings";
import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import { Button, message, Popconfirm, Space, Table, Tag, Tooltip, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { useModel } from "umi";

const { Text } = Typography;

const OrderTable = ({ data }: { data: Order[] }) => {
    const { setOrderItem, setIsEdit, setVisible } = useModel("orderModel");
    const [orders, setOrders] = useState<Order[]>([]);
    const [sortedInfo, setSortedInfo] = useState<any>({});

    useEffect(() => {
        setOrders(data);
    }, [data]);

    const handleEdit = (record: Order) => {
        setOrderItem(record);
        setIsEdit(true);
        setVisible(true);
    };

    const handleDelete = (record: Order) => {
        if (record.status !== OrderStatus.awaiting_confirmation) {
            message.error('Chỉ có thể hủy đơn hàng ở trạng thái "Chờ xác nhận"');
            return;
        }
        // TODO: Thêm logic xóa đơn hàng tại đây
        message.success("Đơn hàng đã được hủy thành công!");
    };

    const handleTableChange = (pagination: any, filters: any, sorter: any) => {
        setSortedInfo(sorter);
    };

    const renderCustomer = (customer: Customer) => (
        <Tooltip title={`SĐT: ${customer.phone_number}`}>
            <Text>{customer.customer_name}</Text>
        </Tooltip>
    );

    const renderProducts = (products: Product[]) => (
        <Tooltip title={products.map((p) => `${p.ten_san_pham} (${formatCurrency(p.gia_tien)})`).join("\n")}>
            <Text>{products.length} Sản phẩm</Text>
        </Tooltip>
    );

    const columns = [
        {
            title: "Mã đơn hàng",
            dataIndex: "order_id",
            key: "order_id",
            render: (text: string) => <Text>{text}</Text>,
        },
        {
            title: "Khách hàng",
            dataIndex: "customer",
            key: "customer",
            render: renderCustomer,
        },
        {
            title: "Sản phẩm",
            dataIndex: "product",
            key: "product",
            render: renderProducts,
        },
        {
            title: "Ngày đặt hàng",
            dataIndex: "date_ordered",
            key: "date_ordered",
            sorter: (a: Order, b: Order) =>
                new Date(a.date_ordered).getTime() - new Date(b.date_ordered).getTime(),
            sortDirections: ["ascend", "descend"],
        },
        {
            title: "Giá tiền",
            dataIndex: "price",
            key: "price",
            render: (text: number) => formatCurrency(text),
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            render: (text: OrderStatus) => getStatusTag(text),
        },
        {
            title: "Thao tác",
            key: "action",
            render: (_: any, record: Order) => (
                <Space size="small">
                    <Tooltip title="Xem chi tiết">
                        <Button type="text" icon={<EyeOutlined />} onClick={() => handleEdit(record)} size="small" />
                    </Tooltip>
                    <Tooltip title="Sửa đơn hàng">
                        <Button
                            type="text"
                            icon={<EditOutlined />}
                            onClick={() => handleEdit(record)}
                            size="small"
                            disabled={
                                record.status === OrderStatus.delivered || record.status === OrderStatus.cancel
                            }
                        />
                    </Tooltip>
                    <Tooltip title="Hủy đơn hàng">
                        <Popconfirm
                            title="Bạn có chắc chắn muốn hủy đơn hàng này?"
                            onConfirm={() => handleDelete(record)}
                            okText="Đồng ý"
                            cancelText="Hủy"
                            disabled={record.status !== OrderStatus.awaiting_confirmation}
                        >
                            <Button
                                type="text"
                                danger
                                icon={<DeleteOutlined />}
                                size="small"
                                disabled={record.status !== OrderStatus.awaiting_confirmation}
                            />
                        </Popconfirm>
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <Table
            dataSource={orders}
            columns={columns}
            rowKey="order_id"
            onChange={handleTableChange}
            pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showTotal: (total) => `Tổng ${total} đơn hàng`,
            }}
            scroll={{ x: "max-content" }}
        />
    );
};

export default OrderTable;