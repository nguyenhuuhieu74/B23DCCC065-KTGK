import { OrderStatus, Order } from "@/services/QuanLyDonHang/typings";
import {CheckCircleOutlined, ClockCircleOutlined, DollarOutlined, DropboxOutlined, PlusOutlined, ReloadOutlined, SearchOutlined, ShoppingCartOutlined, StopOutlined} from "@ant-design/icons";
import {Badge, Button, Card, Col, DatePicker, Input, Row, Select, Space, Statistic, Tooltip, Typography} from "antd";
import { useEffect, useState } from "react";
import { useModel } from "umi";
import OrderTable from "./components/OrderTable";
import AddEditTable from "./components/AddEditOrder";
import { getStatusCounts, getTotalRevenue } from "@/services/QuanLyDonHang";

const { Title } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

const QuanLyDonHang = () => {
    const {data, getOrderData, setVisible, setIsEdit, setOrderItem} = useModel('QuanLyDonHang.Order');

    const [searchText, setSearchText] = useState("");
    const [statusFilter, setStatusFilter] = useState<string | null>(null);
    const [dateRange, setDateRange] = useState<[string, string] | null>(null);
    const [filteredData, setFilteredData] = useState<Order[]>([]);

    useEffect(() => {
        getOrderData();
    }, []);

    useEffect(() => {
        if (data) {
            let filtered = [...data];

            if (searchText) {
                filtered = filtered.filter(
                    item =>
                        item.order_id.toLowerCase().includes(searchText.toLowerCase()) ||
                        item.customer.customer_name.toLowerCase().includes(searchText.toLowerCase())
                );
            }

            if (statusFilter) {
                filtered = filtered.filter(item => item.status === statusFilter);
            }

            if (dateRange && dateRange[0] && dateRange[1]) {
                filtered = filtered.filter(item => {
                    const orderDate = new Date(item.date_ordered);
                    const startDate = new Date(dateRange[0]);
                    const endDate = new Date(dateRange[1]);
                    return orderDate >= startDate && orderDate <= endDate;
                });
            }

            setFilteredData(filtered);
        }
    }, [data, searchText, statusFilter, dateRange]);

    const handleAddNew = () => {
        setIsEdit(false);
        setOrderItem(undefined);
        setVisible(true);
    };


    const statusCounts = getStatusCounts(data);
    const totalRevenue = getTotalRevenue(data);

    return (
        <div className="order-management">
            <Row gutter={[16, 16]}>
                <Col span={24}>
                    <Card>
                        <Row align="middle" justify="space-between">
                            <Col>
                                <Title level={2} style={{ margin: 0 }}>
                                    <DropboxOutlined /> Quản lí đơn hàng
                                </Title>
                            </Col>
                            <Col>
                                <Space>
                                    <Tooltip title="Làm mới dữ liệu">
                                        <Button
                                            icon={<ReloadOutlined />}
                                            onClick={() => getOrderData()}
                                        >
                                            Làm mới
                                        </Button>
                                    </Tooltip>
                                    <Button
                                        type="primary"
                                        icon={<PlusOutlined />}
                                        onClick={handleAddNew}
                                    >
                                        Thêm đơn hàng
                                    </Button>
                                </Space>
                            </Col>
                        </Row>
                    </Card>
                </Col>

                <Col xs={24} sm={12} md={8} lg={4}>
                    <Card>
                        <Statistic
                            title="Chờ xác nhận"
                            value={statusCounts.pending}
                            prefix={<Badge status="warning" />}
                            valueStyle={{ color: '#faad14' }}
                        />
                        <ClockCircleOutlined style={{ fontSize: 24, color: '#faad14' }} />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={8} lg={4}>
                    <Card>
                        <Statistic
                            title="Đã xác nhận"
                            value={statusCounts.confirmed}
                            prefix={<Badge status="processing" />}
                            valueStyle={{ color: '#1890ff' }}
                        />
                        <CheckCircleOutlined style={{ fontSize: 24, color: '#1890ff' }} />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={8} lg={4}>
                    <Card>
                        <Statistic
                            title="Đang giao"
                            value={statusCounts.delivering}
                            prefix={<Badge status="processing" />}
                            valueStyle={{ color: '#52c41a' }}
                        />
                        <ShoppingCartOutlined style={{ fontSize: 24, color: '#52c41a' }} />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={8} lg={4}>
                    <Card>
                        <Statistic
                            title="Hoàn thành"
                            value={statusCounts.delivered}
                            prefix={<Badge status="success" />}
                            valueStyle={{ color: '#52c41a' }}
                        />
                        <CheckCircleOutlined style={{ fontSize: 24, color: '#52c41a' }} />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={8} lg={4}>
                    <Card>
                        <Statistic
                            title="Đã hủy"
                            value={statusCounts.cancelled}
                            prefix={<Badge status="error" />}
                            valueStyle={{ color: '#ff4d4f' }}
                        />
                        <StopOutlined style={{ fontSize: 24, color: '#ff4d4f' }} />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={8} lg={4}>
                    <Card>
                        <Statistic
                            title="Doanh thu"
                            value={totalRevenue}
                            prefix={<DollarOutlined />}
                            valueStyle={{ color: '#52c41a' }}
                            suffix="đ"
                        />
                    </Card>
                </Col>

                <Col span={24}>
                    <Card>
                        <Row gutter={[16, 16]}>
                            <Col xs={24} md={8}>
                                <Input
                                    placeholder="Tìm theo mã đơn hàng hoặc khách hàng"
                                    prefix={<SearchOutlined />}
                                    value={searchText}
                                    onChange={e => setSearchText(e.target.value)}
                                    allowClear
                                />
                            </Col>
                            <Col xs={24} md={8}>
                                <Select
                                    placeholder="Lọc theo trạng thái"
                                    style={{ width: '100%' }}
                                    allowClear
                                    onChange={value => setStatusFilter(value)}
                                    value={statusFilter}
                                >
                                    <Option value={OrderStatus.awaiting_confirmation}>Chờ xác nhận</Option>
                                    <Option value={OrderStatus.confirmed}>Đã xác nhận</Option>
                                    <Option value={OrderStatus.delivering}>Đang giao</Option>
                                    <Option value={OrderStatus.delivered}>Hoàn thành</Option>
                                    <Option value={OrderStatus.cancel}>Hủy</Option>
                                </Select>
                            </Col>
                            <Col xs={24} md={8}>
                                <RangePicker
                                    style={{ width: '100%' }}
                                    placeholder={['Từ ngày', 'Đến ngày']}
                                    onChange={(_dates, dateStrings) => {
                                        setDateRange(dateStrings as [string, string]);
                                    }}
                                />
                            </Col>
                        </Row>
                    </Card>
                </Col>

                <Col span={24}>
                    <Card>
                        <OrderTable data={filteredData} />
                    </Card>
                </Col>
            </Row>

            <AddEditTable />
        </div>
    );
};

export default QuanLyDonHang;