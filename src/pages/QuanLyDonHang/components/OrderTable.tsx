import { formatCurrency, getStatusTag } from "@/services/QuanLyDonHang";
import { Order, Customer, Product, OrderStatus } from "@/services/QuanLyDonHang/typings";
import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import { Button, message, Popconfirm, Space, Table, Tag, Tooltip, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { useModel } from "umi";

const { Text } = Typography;

const OrderTable = ({ data }: {
    data: Order[]
}) => {
    const { setOrderItem, setIsEdit, setVisible, setData } = useModel("QuanLyDonHang.Order")
    const [sortedInfo, setSortedInfo] = useState<any>({})

    const handleEdit = (record: Order) => {
        setOrderItem(record)
        setIsEdit(true)
        setVisible(true)
    }

    const handleDelete = (record: Order) => {
        if (record.status !== OrderStatus.awaiting_confirmation) {
            message.error('Không thể hủy đơn hàng này')
            return
        }

        const updatedData = data.map((item) => {
            if (item.order_id === record.order_id) {
                return { ...item, status: OrderStatus.cancel }
            }
            return item
        })

        localStorage.setItem("order", JSON.stringify(updatedData))
        setData(updatedData)
        message.success("Đã hủy đơn hàng thành công")
    }

    const handleTableChange = (sorter: any) => {
        setSortedInfo(sorter)
    }

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
            render: (text: string) => <Text strong>{text}</Text>,
        },
        {
            title: "Sản phẩm",
            dataIndex: "product",
            key: "product",
            render: (customer: Customer) => (
                <Tooltip title={`SĐT: ${customer.phone_number}`}>
                    <Text>{customer.customer_name}</Text>
                </Tooltip>
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