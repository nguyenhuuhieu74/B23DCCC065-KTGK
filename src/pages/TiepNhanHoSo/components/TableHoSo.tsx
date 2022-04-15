import TableBase from '@/components/Table';
import RaSoatHoSo from '@/pages/HoSoThiSinh/DangKyXetTuyen/RaSoatHoSo';
import type { HoSoXetTuyen } from '@/services/HoSoXetTuyen/typings';
import { ETrangThaiHoSo } from '@/utils/constants';
import type { IColumn } from '@/utils/interfaces';
import { DollarOutlined, LockOutlined, PrinterOutlined, UnlockOutlined } from '@ant-design/icons';
import { Button, Divider, Modal, Popconfirm, Select, Tooltip } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import ThanhToan from '@/components/ThanhToan';

const TableHoSo = (props: { type: ETrangThaiHoSo }) => {
  const {
    page,
    loading,
    limit,
    condition,
    setVisibleForm,
    adminGetHoSoByIdDotModel,
    adminKhoaHoSoByIdHoSoModel,
    adminMoKhoaHoSoByIdHoSoModel,
    setDanhSach,
    setRecordHoSo,
    setPage,
    setLimit,
    adminExportPhieuDangKyModel,
    recordHoSo: recordHS,
  } = useModel('hosoxettuyen');
  const [visibleThanhToan, setVisibleThanhToan] = useState<boolean>(false);
  const {
    getAllDotTuyenSinhModel,
    record: recordDotTuyenSinh,
    danhSach: danhSachDot,
    setRecord: setRecordDotTuyenSinh,
  } = useModel('dottuyensinh');
  const {
    getAllHinhThucDaoTaoModel,
    record,
    setRecord,
    danhSach: danhSachHinhThuc,
  } = useModel('hinhthucdaotao');
  const {
    getAllNamTuyenSinhModel,
    record: recordNamTuyenSinh,
    danhSach: danhSachNam,
    setRecord: setRecordNamTuyenSinh,
  } = useModel('namtuyensinh');

  const khoaHoSo = (recordHoSo: HoSoXetTuyen.Record) => {
    adminKhoaHoSoByIdHoSoModel(recordHoSo._id, recordDotTuyenSinh?._id ?? '', props.type);
  };

  useEffect(() => {
    if (danhSachHinhThuc.length === 0) getAllHinhThucDaoTaoModel();
    return () => {
      setDanhSach([]);
      setPage(1);
      setLimit(10);
    };
  }, []);

  useEffect(() => {
    if (record?._id && !recordNamTuyenSinh?._id) getAllNamTuyenSinhModel(record?._id);
  }, [record?._id]);

  useEffect(() => {
    if (recordNamTuyenSinh?._id && !recordDotTuyenSinh?._id) {
      getAllDotTuyenSinhModel({ namTuyenSinh: recordNamTuyenSinh?.nam }, true);
    }
  }, [recordNamTuyenSinh?._id]);

  const onCell = (recordHoSo: HoSoXetTuyen.Record) => ({
    onClick: () => {
      setVisibleForm(true);
      setRecordHoSo(recordHoSo);
    },
    style: { cursor: 'pointer' },
  });

  const columns: IColumn<HoSoXetTuyen.Record>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      align: 'center',
      width: 80,
      onCell,
    },
    {
      title: 'Mã hồ sơ',
      dataIndex: 'maHoSo',
      align: 'center',
      width: 150,
      search: 'search',
      onCell,
    },

    {
      title: 'Họ và tên',
      dataIndex: ['thongTinThiSinh', 'ten'],
      align: 'center',
      width: 150,
      search: 'search',
      onCell,
      render: (val, recordHoSo: HoSoXetTuyen.Record) => (
        <div>{`${recordHoSo?.thongTinThiSinh?.hoDem} ${val}`}</div>
      ),
    },

    {
      title: 'Số CMND/CCCD',
      dataIndex: ['thongTinThiSinh', 'cmtCccd'],
      align: 'center',
      width: 140,
      search: 'search',
      onCell,
    },
    {
      title: 'Email',
      dataIndex: ['thongTinThiSinh', 'email'],
      align: 'center',
      width: 150,
      search: 'search',
      onCell,
    },
    {
      title: 'Mã thanh toán',
      dataIndex: 'identityCode',
      align: 'center',
      width: 110,
      onCell,
      hide: props?.type === ETrangThaiHoSo.chuakhoa,
    },
    {
      title: 'Trạng thái thanh toán',
      dataIndex: 'trangThaiThanhToan',
      align: 'center',
      width: 110,
      onCell,
      hide: props?.type === ETrangThaiHoSo.chuakhoa,
    },
    {
      title: 'Giới tính',
      dataIndex: ['thongTinThiSinh', 'gioiTinh'],
      align: 'center',
      width: 120,
      onCell,
    },

    {
      title: 'Ngày sinh',
      dataIndex: ['thongTinThiSinh', 'ngaySinh'],
      align: 'center',
      render: (val) =>
        val ? (
          <span title={moment(val).format('DD/MM/YYYY')}>{moment(val).format('DD/MM/YYYY')}</span>
        ) : (
          <div />
        ),
      width: 120,
      onCell,
    },
    {
      title: 'Địa chỉ liên hệ',
      dataIndex: ['thongTinThiSinh', 'diaChiLienHe'],
      align: 'center',
      render: (val: DonViHanhChinh.Record) => {
        return (
          <div>
            {[val?.diaChi, val?.tenXaPhuong, val?.tenQH, val?.tenTP]
              ?.filter((item) => item !== undefined && item !== '')
              ?.join(', ')}
          </div>
        );
      },
      onCell,
      width: 220,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      align: 'center',
      render: (val) => (
        <span title={moment(val).format('DD/MM/YYYY HH:mm:ss')}>
          {moment(val).format('DD/MM/YYYY')}
        </span>
      ),
      search: 'sort',
      width: 120,
      onCell,
    },
    {
      title: 'Thao tác',
      align: 'center',
      width: 170,
      fixed: 'right',
      render: (recordHoSo: HoSoXetTuyen.Record) => (
        <>
          {[
            ETrangThaiHoSo.chuakhoa,
            ETrangThaiHoSo.datiepnhan,
            ETrangThaiHoSo.khongtiepnhan,
          ].includes(props.type) && (
            <Popconfirm
              title="Bạn có chắc chắc muốn khóa hồ sơ này"
              onConfirm={() => khoaHoSo(recordHoSo)}
            >
              <Tooltip title="Khóa">
                <Button type="primary" icon={<LockOutlined />} shape="circle" />
              </Tooltip>
            </Popconfirm>
          )}

          {[ETrangThaiHoSo.dakhoa].includes(props.type) && (
            <Popconfirm
              title="Bạn có chắc chắc muốn mở khóa hồ sơ này"
              onConfirm={() =>
                adminMoKhoaHoSoByIdHoSoModel(
                  recordHoSo._id,
                  recordDotTuyenSinh?._id ?? '',
                  props.type,
                )
              }
            >
              <Tooltip title="Mở khóa">
                <Button type="primary" icon={<UnlockOutlined />} shape="circle" />
              </Tooltip>
            </Popconfirm>
          )}

          {[ETrangThaiHoSo.dakhoa, ETrangThaiHoSo.datiepnhan]?.includes(props?.type) && (
            <>
              <Divider type="vertical" />
              <Tooltip title="Thanh toán">
                <Button
                  onClick={() => {
                    setRecordHoSo(recordHoSo);
                    setVisibleThanhToan(true);
                  }}
                  type="primary"
                  icon={<DollarOutlined />}
                  shape="circle"
                />
              </Tooltip>
            </>
          )}

          <Divider type="vertical" />
          <Tooltip title="In hồ sơ">
            <Button
              onClick={() => {
                adminExportPhieuDangKyModel(recordHoSo._id, recordHoSo?.maHoSo);
              }}
              icon={<PrinterOutlined />}
              shape="circle"
            />
          </Tooltip>
        </>
      ),
    },
  ];

  return (
    <>
      <TableBase
        getData={() => adminGetHoSoByIdDotModel(recordDotTuyenSinh?._id ?? '', props.type)}
        modelName="hosoxettuyen"
        widthDrawer="1100px"
        title={`Hồ sơ ${props.type}`}
        loading={loading}
        columns={columns}
        Form={RaSoatHoSo}
        maskCloseableForm
        dependencies={[
          page,
          limit,
          condition,
          props.type,
          recordDotTuyenSinh?._id,
          recordNamTuyenSinh?._id,
          record?._id,
        ]}
        otherProps={{ scroll: { x: 1300 } }}
      >
        <Select
          placeholder="Hình thức đào tạo"
          onChange={(val) => {
            setRecordNamTuyenSinh(undefined);
            setRecordDotTuyenSinh(undefined);
            setRecord(danhSachHinhThuc?.find((item) => item._id === val));
          }}
          value={record?._id}
          options={danhSachHinhThuc?.map((item) => ({
            value: item._id,
            label: item.ten,
          }))}
          style={{ width: 120, marginRight: 8 }}
        />
        <Select
          placeholder="Năm tuyển sinh"
          onChange={(val) => {
            setRecordDotTuyenSinh(undefined);
            setRecordNamTuyenSinh(danhSachNam?.find((item) => item.nam === val));
          }}
          value={recordNamTuyenSinh?.nam}
          options={danhSachNam?.map((item) => ({
            value: item.nam,
            label: `Năm tuyển sinh ${item.nam}`,
          }))}
          style={{ width: 180, marginRight: 8 }}
        />
        <Select
          placeholder="Đợt tuyển sinh"
          onChange={(val) => setRecordDotTuyenSinh(danhSachDot?.find((item) => item._id === val))}
          value={recordDotTuyenSinh?._id}
          options={danhSachDot?.map((item) => ({
            value: item?._id,
            label: item?.tenDotTuyenSinh,
          }))}
          style={{ width: 400 }}
        />
      </TableBase>
      <Modal
        destroyOnClose
        footer={
          <Button
            type="primary"
            onClick={() => {
              setVisibleThanhToan(false);
              setRecordHoSo(undefined);
            }}
          >
            OK
          </Button>
        }
        width="1000px"
        onCancel={() => {
          setVisibleThanhToan(false);
          setRecordHoSo(undefined);
        }}
        visible={visibleThanhToan}
      >
        <ThanhToan record={recordHS} />
      </Modal>
    </>
  );
};

export default TableHoSo;
