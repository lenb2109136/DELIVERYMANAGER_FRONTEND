import { useEffect, useState } from "react";
import {
  DownOutlined,
  SearchOutlined,
  SyncOutlined,
  WarningFilled,
  YoutubeOutlined,
} from "@ant-design/icons";
import {
  Breadcrumb,
  Button,
  Checkbox,
  Dropdown,
  Input,
  Menu,
  Select,
  Tag,
  Tooltip,
} from "antd";
import apiAdmin from "../../Config/APICONFIG/AdminConfig";
import OrderAmindTab from "./OrderTab";
import { Link } from "react-router-dom";
import ModalInfoPhieuChuyenGiao from "./ModalInfoPhieuChuyenGiao";
import BreadcrumbItem from "antd/es/breadcrumb/BreadcrumbItem";
const OrderListAdmin = () => {
  const [phieuChuyenGiaos, setPhieuChuyenGiao] = useState([]);
  const chuyenTiep = (orderId, diemNhanHangId) => {
    apiAdmin
      .post(`order/chuyentiep?orderId=${orderId}&buuCucId=${diemNhanHangId}`)
      .then((v) => {
        alert("Cập nhật chuyển tiếp thành công");
        search();
      })
      .catch((error) => {
        console.log(error.response);
        alert(error.response.data.message);
      });
  };

  const clickPhieuChuyenGiao = () => {
    let a = filter.orders.filter((v) => v.checked).map((v) => v.id);
    if (a.length > 0) {
      apiAdmin
        .post("order/transfom/groupby/get", a)
        .then((v) => {
          setPhieuChuyenGiao(v.data.data);
        })
        .catch((error) => {
          alert("Không có đơn hàng nào cần chuyển tiếp");
        });
    } else {
      alert("Chưa chọn đơn hàng nào để lập phiếu chuyển giao");
    }
  };

  const exportPDF = () => {
    let ids = filter.orders.filter((v) => v.checked).map((v) => v.id);
    try {
      if (ids.length > 0) {
        apiAdmin
          .post("order/export-pdf", ids, { responseType: "blob" })
          .then((response) => {
            const url = window.URL.createObjectURL(
              new Blob([response.data], { type: "application/pdf" })
            );
            const a = document.createElement("a");
            a.href = url;
            a.download = "order.pdf"; // Đặt tên file
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
          })
          .catch((error) => {
            alert("Lỗi khi tải PDF:", error);
          });
      }
    } catch (error) {}
  };

  useEffect(() => {
    apiAdmin
      .get("phancong/allshiper")
      .then((v) => v.data)
      .then((v) => {
        setShiper(
          v.map((vv) => {
            return { label: vv.ten, value: vv.id };
          })
        );
      })
      .catch((error) => {});
  }, []);

  const [shipper, setShiper] = useState([{ id: 1 }]);

  const nextStatus = (orderId) => {
    apiAdmin
      .post("order/nextstatus?orderId=" + orderId)
      .then((v) => {
        alert("Thành công");
      })
      .catch((error) => {
        alert(error.response.data.message);
      });
  };

  const cancelOrder = (orderId) => {
    apiAdmin
      .post("order/cancel?orderId=" + orderId)
      .then((v) => {
        alert("Thành công");
      })
      .catch((error) => {
        alert(error.response.data.message);
      });
  };

  const cancelList = () => {
    const fetching = document.getElementById("cancel");
    fetching.classList.remove("hidden");
    apiAdmin
      .post(
        "order/cancellist",
        filter.orders.filter((v) => v.checked).map((v) => v.id)
      )
      .then((v) => {
        alert("Hủy thành công");
        search();
      })
      .catch((error) => {
        alert(error.response.data.message);
      })
      .finally(() => {
        fetching.classList.add("hidden");
      });
  };

  const fetching = () => {
    const fetching = document.getElementById("fetching");
    fetching.classList.remove("hidden");

    apiAdmin
      .post("order/transfom/groupby", {}, { responseType: "blob" })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const a = document.createElement("a");
        a.href = url;
        a.download = "download.pdf";
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      })
      .catch((error) => {
        alert(
          error.response.status === 400
            ? "Không có đơn hàng nào cần chuyển tiếp"
            : "Có lỗi xảy ra"
        );
      })
      .finally(() => {
        fetching.classList.add("hidden");
      });
  };

  const nhanKho = () => {
    const fetching = document.getElementById("nhapKho");
    fetching.classList.remove("hidden");
    apiAdmin
      .post(
        "order/nextstatuslist",
        filter.orders.filter((v) => v.checked).map((v) => v.id)
      )
      .then((v) => {
        alert("Nhập kho Thành công");
        search();
      })
      .catch((error) => {
        alert(error.response.data.message);
      })
      .finally(() => {
        fetching.classList.add("hidden");
      });
  };

  const search = () => {
    apiAdmin
      .get(
        `order/getorder?trangThaiId=${filter.trangThaiId}${
          filter.id != null ? `&id=${filter.id}` : ``
        }${
          filter.tenNguoiNhan != null
            ? `&tenNguoiNhan=${filter.tenNguoiNhan}`
            : ``
        }${filter.sortBy != null ? `&sortBy=${filter.sortBy}` : ``}`
      )
      .then((v) => {
        return v.data;
      })
      .then((v) => {
        if (filter.trangThaiId === 4) {
          v.orders = v.orders.filter((v) => {
            let b = false;
            v.phanCongs.forEach((vv) => {
              if (
                vv.nhanVien.id == filter.shipperChoose ||
                filter.shipperChoose == -1
              ) {
                b = true;
              }
            });
            return b;
          });
          setFilter((prev) => ({
            ...prev,
            orders: v.orders,
            diemNhanHang: v.diemNhanHang,
          }));
        } else {
          setFilter((prev) => ({
            ...prev,
            orders: v.orders,
            diemNhanHang: v.diemNhanHang,
          }));
        }
      });
  };

  useEffect(search, []);

  const reload = () => {
    search();
    setPhieuChuyenGiao([]);
  };

  const changeString = (key, value) => {
    if (String(value) && new String(value).trim().length > 0) {
      filter[key] = value;
    } else {
      filter[key] = null;
    }
    search();
  };

  const changeNumber = (key, value) => {
    if (Number(value) && value > 0) {
      filter[key] = value;
    } else {
      filter[key] = null;
    }
    search();
  };

  const [filter, setFilter] = useState({
    tenNguoiNhan: null,
    id: null,
    trangThaiId: 1,
    sortBy: null,
    pageSize: 5,
    page: 0,
    totalPage: 0,
    orders: [],
    diemNhanHang: new Map(),
    orderFilter: [],
    shipperChoose: -1,
  });

  const [stateReload, setStateReload] = useState(true);
  const checkOrder = (index) => {
    filter.orders[index].checked = !filter.orders[index].checked;
    setStateReload(!stateReload);
  };

  return (
    <>
      <Breadcrumb>
        <BreadcrumbItem>Admin</BreadcrumbItem>
        <BreadcrumbItem>Order</BreadcrumbItem>
        <BreadcrumbItem>Order list</BreadcrumbItem>
      </Breadcrumb>
      <OrderAmindTab setTab={changeNumber} />
      <div className="w-full">
        <div className="w-full flex gap-1 items-center">
          <Input
            value={filter.id}
            onChange={(e) => {
              changeString("id", e.target.value);
            }}
            placeholder="Enter your id order"
            prefix={<SearchOutlined style={{ color: "#bbb" }} />}
            style={styleInput}
          />
          <Input
            value={filter.tenNguoiNhan}
            onChange={(e) => {
              changeString("tenNguoiNhan", e.target.value);
            }}
            placeholder="Enter your reciver name"
            prefix={<SearchOutlined style={{ color: "#bbb" }} />}
            style={styleInput}
          />
          <Select
            prefix={<SearchOutlined style={{ color: "#bbb" }} />}
            showSearch
            onChange={(e) => {
              changeString("sortBy", e);
            }}
            style={{
              width: 200,
            }}
            placeholder="Search to Select"
            optionFilterProp="label"
            filterSort={(optionA, optionB) =>
              (optionA?.label ?? "")
                .toLowerCase()
                .localeCompare((optionB?.label ?? "").toLowerCase())
            }
            options={[
              {
                value: "fee",
                label: "Phí dịch vụ",
              },
              {
                value: "khoangcach",
                label: "Khoảng cách",
              },
            ]}
          />
          {filter.trangThaiId === 5 && (
            <ModalInfoPhieuChuyenGiao
              reloads={reload}
              phieuChuyenGiaos={phieuChuyenGiaos}
            />
          )}
          {filter.trangThaiId === 4 && (
            <Select
              prefix={<SearchOutlined style={{ color: "#bbb" }} />}
              showSearch
              onChange={(e) => {
                changeString("shipperChoose", e);
                search();
              }}
              style={{
                width: 200,
              }}
              placeholder="Chọn shipper"
              optionFilterProp="label"
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? "")
                  .toLowerCase()
                  .localeCompare((optionB?.label ?? "").toLowerCase())
              }
              options={shipper}
            />
          )}
          {filter.orders.filter((v) => v.checked).length > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Button onClick={exportPDF} primary>
                Export PDFs
                <SyncOutlined className="hidden" id="fetching" spin />
              </Button>
            </div>
          )}

          {filter.orders.filter((v) => v.checked).length > 0 &&
            filter.trangThaiId === 5 && (
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <Button
                  onClick={() => {
                    clickPhieuChuyenGiao();
                  }}
                  primary
                >
                  Chuyển tiếp hàng loạt
                  <SyncOutlined className="hidden" id="fetching" spin />
                </Button>
              </div>
            )}
          {filter.orders.filter((v) => v.checked).length > 0 &&
            filter.trangThaiId < 5 && (
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <Button onClick={cancelList} danger>
                  Hủy đơn
                  <SyncOutlined className="hidden" id="cancel" spin />
                </Button>
              </div>
            )}
          {filter.orders.filter((v) => v.checked).length > 0 &&
            filter.trangThaiId === 4 && (
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <Button onClick={nhanKho} danger>
                  Nhập kho.
                  <SyncOutlined className="hidden" id="nhapKho" spin />
                </Button>
              </div>
            )}
        </div>
      </div>
      <div className="overflow-x-auto mt-3">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 text-left">STT</th>
              <th className="py-2 px-4 text-left">Mã đơn</th>
              <th className="py-2 px-4 text-left">Bên nhận</th>
              <th className="py-2 px-4 text-left">Tổng phí</th>
              <th className="py-2 px-4 text-left">KL tính phí</th>
              <th className="py-2 px-4 text-left">Khoảng cách</th>
              <th className="py-2 px-4 text-left">Hình thức vận chuyển</th>
              <th className="py-2 px-4 text-left">Bưu cục vận chuyển</th>
              <th className="py-2 px-4 text-left">Thao tác chuyển tiếp</th>
              <th className="py-2 px-4 text-left">Danh sách phân công</th>
              <th className="py-2 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filter.orders.map((order, index) => (
              <tr key={order.id} className="border-b hover:bg-gray-50">
                <td className="py-2 px-2">
                  <Checkbox onClick={checkOrder.bind(null, index)} />
                  {order.phanCongs.filter((v) => v.trangThai === 1).length >
                    2 && (
                    <Tooltip
                      className="animate-pulse [animation-duration:500ms]"
                      title={`Đơn hàng hiện đã lấy hàng thất bại nhiều lần`}
                      color="red"
                    >
                      <WarningFilled className="text-red-500 w-6 h-6 cursor-pointer" />
                    </Tooltip>
                  )}
                </td>
                <td className="py-2 px-4 text-blue-600 font-bold">
                  DH{order.id}
                  <p className="t">{order.trangThai.ten}</p>
                </td>
                <td className="py-2 px-4">
                  <div className="font-bold text-gray-600">
                    {order.tenNguoiNhan}
                  </div>
                  <div className="text-gray-500 font-semibold ">
                    {order.sdtnguoiNhan}
                  </div>
                  <div className="text-sm text-gray-400">
                    Ngày tạo: {order.diaChiChiTiet}
                  </div>
                </td>
                <td className="py-2 px-4 text-red-500 font-semibold">
                  {order.fee} đ
                </td>
                <td className="py-2 px-4 text-blue-900 font-bold">
                  {order.trongLuong} KG
                </td>
                <td className="py-2 px-4 text-blue-900 font-bold">
                  {order.khoangCachDuTinh} KM
                </td>
                <td className="py-2 px-4">
                  <div className="text-gray-500 text-sm">
                    {" "}
                    <Tag color="magenta">
                      {order.hinhThucVanChuyen != null
                        ? order.hinhThucVanChuyen.tenHinhThuc
                        : ""}
                    </Tag>
                  </div>
                </td>
                <td className="py-2 px-4">
                  <div className="text-gray-500 text-sm text-center">
                    {order.diemNhanHang.id} - {order.diemNhanHang.sdt}
                  </div>
                  <button className=" font-bold text-gray-600 px-4 py-1 rounded-lg ">
                    {order.diemNhanHang.diachichitiet}
                  </button>
                </td>
                <td>
                  {order.trangThai.id !== 5 ? (
                    <p>Vui lòng lấy hàng để chuyển tiếp</p>
                  ) : order.phieuChuyenGiao != null ? (
                    <p className="text-yellow-900">
                      Đơn hàng đã được chuyển tiếp
                    </p>
                  ) : filter.diemNhanHang[order.id] != null ? (
                    <Dropdown
                      overlay={
                        <Menu>
                          {filter.diemNhanHang[order.id].map((v, index) => {
                            return (
                              <div className="">
                                <div className="flex">
                                  <div>
                                    <div className="flex items-betw">
                                      <p className="font-bold">i: </p>
                                      <p className="font-bold">{index + 1}</p>
                                    </div>
                                    <p className="font-bold">
                                      Địa điểm: {index + 1}
                                    </p>
                                    <p>
                                      Điểm nhận hàng: DNH {v.diemNhanHangId}
                                    </p>
                                    <p>
                                      Khoảng cách ban đầu:{" "}
                                      {v.khoangCachDuTinh.toFixed(2)} Km
                                    </p>
                                    <p>
                                      Khoảng cách nếu chuyển tiếp:{" "}
                                      {v.khoangCachDuTinhNeChuyenTiep.toFixed(
                                        2
                                      )}{" "}
                                      KM
                                    </p>
                                    <p>Địa chỉ chi tiết: {v.diChiChiTiet}</p>
                                  </div>
                                  <Button
                                    onClick={() => {
                                      chuyenTiep(order.id, v.diemNhanHangId);
                                    }}
                                  >
                                    Chuyển tiếp
                                  </Button>
                                </div>
                                <hr />
                              </div>
                            );
                          })}
                        </Menu>
                      }
                      placement="topCenter"
                      arrow
                    >
                      <p className="text-blue-500 font-bold cursor-pointer">
                        Danh sách điểm chuyển tiếp{" "}
                        <DownOutlined style={{ display: "inline-block" }} />
                      </p>
                    </Dropdown>
                  ) : (
                    <p className="text-red-500 font-bold">
                      Không tìm thấy điểm chuyển tiếp phù hợp
                    </p>
                  )}
                </td>
                <td className="py-2 px-4">
                  {order.phanCongs?.length < 0 ? (
                    <p className="text-yellow-900">
                      Chưa có danh sách phân công
                    </p>
                  ) : (
                    <Dropdown
                      overlay={
                        <Menu
                          style={{ maxHeight: "300px", overflowY: "auto" }}
                          className=" scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-200"
                        >
                          {order.phanCongs
                            .slice()
                            .reverse()
                            .map((v, index) => {
                              return (
                                <Menu.Item key={index}>
                                  <div className="flex">
                                    <div>
                                      <p>
                                        Loại phân công :{" "}
                                        <strong>
                                          {v.donGiao === 0
                                            ? "Lấy hàng"
                                            : "Giao hàng"}
                                        </strong>
                                      </p>
                                      <p>
                                        Nhân viên:{" "}
                                        <strong>{v.nhanVien.ten}</strong>
                                      </p>
                                      <p>
                                        Địa chỉ{" "}
                                        {v.donGiao === 0
                                          ? "Lấy hàng"
                                          : "Giao hàng"}{" "}
                                        :{" "}
                                        <strong>
                                          {v.donGiao === 0
                                            ? order.xa.tenXa +
                                              " - " +
                                              order.xa.huyen.tenHuyen
                                            : "Giao hàng"}
                                        </strong>
                                      </p>
                                    </div>

                                    {/* Đẩy Tag sang phải bằng ml-auto */}
                                    <div className="ml-auto">
                                      <Tag color="magenta">
                                        {v.trangThai === 0
                                          ? "Đang thực hiện"
                                          : v.trangThai === 1
                                          ? "Không thành công"
                                          : v.trangThai === 0
                                          ? "Đang thực hiện"
                                          : v.trangThai === 2
                                          ? "Thành công"
                                          : "Ngưng thực hiện"}
                                      </Tag>
                                    </div>
                                  </div>
                                  <hr
                                    style={{ border: "1px solid lightgray" }}
                                  />
                                </Menu.Item>
                              );
                            })}
                        </Menu>
                      }
                      placement="topCenter"
                      arrow
                    >
                      <p className="text-blue-500 font-bold cursor-pointer">
                        {order.phanCongs.length > 0 ? (
                          <>
                            Lịch sử{" "}
                            <DownOutlined style={{ display: "inline-block" }} />
                          </>
                        ) : (
                          <>Trống</>
                        )}
                      </p>
                    </Dropdown>
                  )}
                </td>
                <td className="py-2 px-4">
                  <Action
                    trangThaiId={filter.trangThaiId}
                    handle={
                      filter.trangThaiId < 4
                        ? cancelOrder.bind(null, order.id)
                        : nextStatus.bind(null, order.id)
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};
const styleInput = {
  width: 250,
  borderRadius: "20px",
  padding: "8px 12px",
  backgroundColor: "#e0e0e0 ",
  border: "none",
  boxShadow: "none",
};

const Action = ({ handle, trangThaiId }) => {
  switch (trangThaiId) {
    case 1:
    case 2:
    case 3:
      return (
        <Tag
          className="cursor-pointer"
          onClick={handle}
          icon={<YoutubeOutlined />}
          color="#cd201f"
        >
          Hủy đơn
        </Tag>
      );
    case 4:
      return (
        <Tag
          className="cursor-pointer"
          onClick={handle}
          icon={<YoutubeOutlined />}
          color="#cd201f"
        >
          Tiếp tục xử lý
        </Tag>
      );
    case 5:
      return (
        <Link
          className="cursor-pointer"
          to={"/admin/phancong"}
          icon={<YoutubeOutlined />}
          color="#cd201f"
        >
          Phân công
        </Link>
      );
    default:
      <></>;
  }
};
export default OrderListAdmin;
