import { formatCurrency, getStatusTag } from "@/services/QuanLyDonHang";
import { Order, Customer, Product, OrderStatus } from "@/services/QuanLyDonHang/typings";
import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import { Button, message, Popconfirm, Space, Table, Tag, Form, Tooltip, Typography } from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useModel } from "umi";

const ThemSuaDonHang = () => {
    const {visible, setVisible, orderItem, isEdit, data, setData} = useModel('QuanLyDonHang.Order');

    const [form] = Form.useForm();
    const [selectedProducts, setSelectedProducts] = useState<Orderm[]>([]);
    const [totalAmount, setTotalAmount] = useState<number>(0);

    useEffect(() => {
        if (visible && orderItem && isEdit) {
            form.setFieldsValue({
                order_id: orderItem.order_id,
                customer: orderItem.customer.customer_id,
                date_ordered: moment(orderItem.date_ordered),
                status: orderItem.status,
                product: orderItem.product.map(p => p.product_id)
            });
            setSelectedProducts(orderItem.product);
            calculateTotal(orderItem.product);
        } else if (visible && !isEdit) {
            const newOrderId = generateOrderId();
            form.setFieldsValue({
                order_id: newOrderId,
                date_ordered: moment(),
                status: OrderStatus.awaiting_confirmation
            });
            setSelectedProducts([]);
            setTotalAmount(0);
        }
    }, [visible, orderItem, isEdit]);

    const generateOrderId = () => {
        if (!data || data.length === 0) return "DH001";

        const highestId = data
            .map(item => parseInt(item.order_id.replace("DH", "")))
            .reduce((max, current) => Math.max(max, current), 0);

        return `DH${String(highestId + 1).padStart(3, '0')}`;
    };

    const handleCancel = () => {
        form.resetFields();
        setVisible(false);
    };

    const handleProductChange = (selectedProductIds: string[]) => {
        const products = selectedProductIds.map(id =>
        ).filter(Boolean) as Order[];

        setSelectedProducts(products);
        calculateTotal(products);
    };

    const calculateTotal = (products: Order[]) => {
        const total = products.reduce((sum, product) => sum + product.price, 0);
        setTotalAmount(total);
    };

    const handleSubmit = () => {
        form.validateFields().then(values => {
            const selectedCustomer = KHACH_HANG_MAU.find(
                kh => kh.ma_khach === values.khach_hang
            );

            const selectedProducts = values.san_pham.map((id: string) =>
                SAN_PHAM_MAU.find(sp => sp.ma_san_pham === id)
            ).filter(Boolean);

            if (!selectedCustomer || selectedProducts.length === 0) {
                message.error('Vui lòng chọn khách hàng và ít nhất một sản phẩm');
                return;
            }

            const orderData: IDonHang = {
                ma_don_hang: values.ma_don_hang,
                khach_hang: selectedCustomer,
                san_pham: selectedProducts,
                ngay_dat_hang: values.ngay_dat_hang.format('YYYY-MM-DD'),
                tong_tien: totalAmount,
                trang_thai: values.trang_thai
            };

            let updatedData: IDonHang[];

            if (isEdit) {
                updatedData = data.map(item =>
                    item.ma_don_hang === orderData.ma_don_hang ? orderData : item
                );
                message.success('Cập nhật đơn hàng thành công');
            } else {
                updatedData = [...data, orderData];
                message.success('Thêm đơn hàng mới thành công');
            }

            localStorage.setItem('donHang', JSON.stringify(updatedData));
            setData(updatedData);
            setVisible(false);
            form.resetFields();
        });
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(value);
    };

    return (
        <Modal
            title={
                <div>
                    <ShoppingOutlined /> {isEdit ? 'Chỉnh sửa đơn hàng' : 'Thêm đơn hàng mới'}
                </div>
            }
            visible={visible}
            onCancel={handleCancel}
            width={800}
            footer={[
                <Button key="cancel" onClick={handleCancel}>
                    Hủy
                </Button>,
                <Button key="submit" type="primary" onClick={handleSubmit}>
                    {isEdit ? 'Cập nhật' : 'Thêm mới'}
                </Button>
            ]}
        >
            <Form
                form={form}
                layout="vertical"
                requiredMark={false}
            >
                <Row gutter={16}>
                    <Col xs={24} md={12}>
                        <Form.Item
                            name="ma_don_hang"
                            label="Mã đơn hàng"
                            rules={[{ required: true, message: 'Vui lòng nhập mã đơn hàng' }]}
                        >
                            <Input disabled placeholder="Mã đơn hàng" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        <Form.Item
                            name="ngay_dat_hang"
                            label="Ngày đặt hàng"
                            rules={[{ required: true, message: 'Vui lòng chọn ngày đặt hàng' }]}
                        >
                            <DatePicker
                                style={{ width: '100%' }}
                                format="DD/MM/YYYY"
                                placeholder="Chọn ngày"
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item
                    name="khach_hang"
                    label="Khách hàng"
                    rules={[{ required: true, message: 'Vui lòng chọn khách hàng' }]}
                >
                    <Select
                        placeholder="Chọn khách hàng"
                        showSearch
                        optionFilterProp="children"
                    >
                        {KHACH_HANG_MAU.map(kh => (
                            <Option key={kh.ma_khach} value={kh.ma_khach}>
                                {kh.ten_khach} - {kh.so_dien_thoai}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    name="san_pham"
                    label="Sản phẩm"
                    rules={[{ required: true, message: 'Vui lòng chọn ít nhất một sản phẩm' }]}
                >
                    <Select
                        mode="multiple"
                        placeholder="Chọn sản phẩm"
                        onChange={handleProductChange}
                        optionFilterProp="children"
                    >
                        {SAN_PHAM_MAU.map(sp => (
                            <Option key={sp.ma_san_pham} value={sp.ma_san_pham}>
                                {sp.ten_san_pham} - {formatCurrency(sp.gia_tien)}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                {selectedProducts.length > 0 && (
                    <>
                        <Divider orientation="left">Chi tiết sản phẩm</Divider>
                        <Table
                            dataSource={selectedProducts}
                            columns={[
                                {
                                    title: 'Mã SP',
                                    dataIndex: 'ma_san_pham',
                                    key: 'ma_san_pham',
                                },
                                {
                                    title: 'Tên sản phẩm',
                                    dataIndex: 'ten_san_pham',
                                    key: 'ten_san_pham',
                                },
                                {
                                    title: 'Giá tiền',
                                    dataIndex: 'gia_tien',
                                    key: 'gia_tien',
                                    render: (value) => formatCurrency(value),
                                },
                            ]}
                            pagination={false}
                            size="small"
                            rowKey="ma_san_pham"
                        />
                        <div style={{ textAlign: 'right', marginTop: 16 }}>
                            <Text strong>Tổng tiền: {formatCurrency(totalAmount)}</Text>
                        </div>
                    </>
                )}

                <Form.Item
                    name="trang_thai"
                    label="Trạng thái đơn hàng"
                    rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
                >
                    <Select placeholder="Chọn trạng thái">
                        <Option value={ETrangThaiDonHang.CHO_XAC_NHAN}>Chờ xác nhận</Option>
                        <Option value={ETrangThaiDonHang.DA_XAC_NHAN}>Đã xác nhận</Option>
                        <Option value={ETrangThaiDonHang.DANG_GIAO}>Đang giao</Option>
                        <Option value={ETrangThaiDonHang.HOAN_THANH}>Hoàn thành</Option>
                        <Option value={ETrangThaiDonHang.HUY}>Hủy</Option>
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ThemSuaDonHang;