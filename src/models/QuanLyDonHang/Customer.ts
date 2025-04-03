import { Customer } from '@/services/QuanLyDonHang/typings';
import { useState } from 'react';

export default () => {
    const [data, setData] = useState<Order[]>([]);
    const [customerItem, setCustomerItem] = useState<Customer>();
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [visible, setVisible] = useState<boolean>(false);

    const initOrderData = async () => {
        const existingData = localStorage.getItem('order');
        setData(existingData ? JSON.parse(existingData) : []);
    };

    const getData = async () => {
        initOrderData();
    }

    return {
        data,
        setData,
        initOrderData,
        getData,
        customerItem,
        setCustomerItem,
        isEdit,
        setIsEdit,
        visible,
        setVisible,
    };
};