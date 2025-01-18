import { useEffect, useState } from "react";
import { Table, Tag, Button, Modal, Input, Select, notification } from "antd"; // Thêm Modal, Input và Select từ Ant Design
import apiClient from "../../services/axiosConfig";
import "./doctor.scss";

const { Option } = Select;

const DoctorDashboard = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false); // Modal visibility
    const [selectedAppointment, setSelectedAppointment] = useState(null); // Lưu cuộc hẹn chọn
    const [status, setStatus] = useState(""); // Lưu trạng thái
    const [result, setResult] = useState(""); // Lưu kết quả
    const [isDetailModalVisible, setIsDetailModalVisible] = useState(false); // Modal chi tiết cuộc hẹn
    const [searchTerm, setSearchTerm] = useState(""); // Lưu từ khóa tìm kiếm

    const user = JSON.parse(localStorage.getItem("user"));
    const doctorId = user ? user._id : null;

    useEffect(() => {
        if (doctorId) {
            const fetchAppointments = async () => {
                try {
                    const response = await apiClient.get(
                        `/appointments/doctor/${doctorId}`
                    );
                    setAppointments(response.data);
                } catch (error) {
                    console.error(error);
                } finally {
                    setLoading(false);
                }
            };

            fetchAppointments();
        }
    }, [doctorId]);

    const handleViewDetails = (appointmentId) => {
        const appointment = appointments.find(
            (app) => app._id === appointmentId
        );
        setSelectedAppointment(appointment);
        setIsDetailModalVisible(true); // Mở modal chi tiết
    };

    const handleOpenUpdateModal = (appointment) => {
        setSelectedAppointment(appointment); // Lưu thông tin cuộc hẹn đã chọn
        setStatus(appointment.status); // Cập nhật trạng thái hiện tại
        setResult(appointment.result || ""); // Cập nhật kết quả hiện tại (nếu có)
        setIsModalVisible(true); // Mở modal cập nhật
    };

    const handleCloseModal = () => {
        setIsModalVisible(false);
        setIsDetailModalVisible(false); // Đóng modal chi tiết
    };

    const handleUpdateStatus = async () => {
        if (!status) {
            return alert("Vui lòng chọn trạng thái!");
        }

        // Gửi yêu cầu cập nhật trạng thái và kết quả (nếu có)
        try {
            const response = await apiClient.put(
                `/appointments/${selectedAppointment._id}`,
                { status, result }
            );
            notification.success({
                message: "Cập nhật thành công",
                description: response.data.message,
            });
            // Cập nhật lại danh sách cuộc hẹn sau khi cập nhật
            setAppointments((prevAppointments) =>
                prevAppointments.map((appointment) =>
                    appointment._id === selectedAppointment._id
                        ? { ...appointment, status, result }
                        : appointment
                )
            );
            handleCloseModal();
        } catch (error) {
            console.error(error);
            notification.error({
                message: "Cập nhật thất bại",
                description: "Cập nhật không thành công!",
            });
        }
    };

    const getDisabledStatus = (statusOption) => {
        if (status === "pending") {
            return statusOption !== "confirmed" && statusOption !== "canceled";
        }
        if (status === "confirmed") {
            return statusOption !== "completed" && statusOption !== "canceled";
        }
        return false; // Disable tất cả nếu trạng thái là "completed" hoặc "canceled"
    };

    // Tìm kiếm cuộc hẹn theo tên bệnh nhân, số điện thoại, hoặc dịch vụ
    const filteredAppointments = appointments.filter((appointment) => {
        return (
            appointment.patient_id?.name
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            appointment.patient_id?.phone
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            appointment.service_id?.name
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
        );
    });

    const columns = [
        {
            title: "STT",
            dataIndex: "index",
            key: "index",
            render: (text, record, index) => index + 1,
        },
        {
            title: "Bệnh nhân",
            dataIndex: "patient_id",
            key: "patient_id",
            render: (patient) => (patient ? patient.name : "Chưa có thông tin"),
        },
        {
            title: "Số điện thoại",
            dataIndex: "patient_id",
            key: "patient_id.phone",
            render: (patient) =>
                patient ? patient.phone : "Chưa có thông tin",
        },
        {
            title: "Dịch vụ",
            dataIndex: "service_id",
            key: "service_id.name",
            render: (service) => (service ? service.name : "Chưa có thông tin"),
        },
        {
            title: "Ngày",
            dataIndex: "date",
            key: "date",
            render: (date) => new Date(date).toLocaleDateString(),
        },
        {
            title: "Giờ",
            dataIndex: "time_slot",
            key: "time",
            render: (timeSlot) =>
                timeSlot
                    ? `${timeSlot.startTime} - ${timeSlot.endTime}`
                    : "Chưa xác định",
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            render: (status) => {
                const color =
                    status === "pending"
                        ? "orange"
                        : status === "confirmed"
                        ? "green"
                        : status === "canceled"
                        ? "red"
                        : "blue";
                return (
                    <Tag color={color}>
                        {status ? status.toUpperCase() : "Chưa xác định"}
                    </Tag>
                );
            },
        },
        {
            title: "Hành động",
            key: "action",
            render: (text, record) => (
                <>
                    <Button
                        type="default"
                        onClick={() => handleViewDetails(record._id)}
                        style={{ marginRight: "12px" }}
                    >
                        Xem chi tiết
                    </Button>
                    <Button
                        type="default"
                        onClick={() => handleOpenUpdateModal(record)}
                        disabled={
                            record.status === "canceled" ||
                            record.status === "completed"
                        }
                    >
                        Cập nhật
                    </Button>
                </>
            ),
        },
    ];

    return (
        <div>
            <h1>Dashboard Bác sĩ</h1>

            {/* Phần tìm kiếm */}
            <Input.Search
                placeholder="Tìm kiếm theo tên bệnh nhân, số điện thoại hoặc dịch vụ"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ marginBottom: "40px", width: "500px", height: "50px" }}
                enterButton="Tìm kiếm"
                size="large"
            />

            <Table
                dataSource={filteredAppointments}
                columns={columns}
                rowKey="_id"
                loading={loading}
                bordered
            />

            {/* Modal cập nhật trạng thái và kết quả */}
            <Modal
                title="Cập nhật trạng thái cuộc hẹn"
                visible={isModalVisible}
                onCancel={handleCloseModal}
                onOk={handleUpdateStatus}
            >
                <div>
                    <label>Trạng thái: </label>
                    <Select
                        value={status}
                        onChange={(value) => setStatus(value)}
                        style={{ width: "100%" }}
                    >
                        <Option
                            value="pending"
                            disabled={getDisabledStatus("pending")}
                        >
                            Pending
                        </Option>
                        <Option
                            value="confirmed"
                            disabled={getDisabledStatus("confirmed")}
                        >
                            Confirmed
                        </Option>
                        <Option
                            value="completed"
                            disabled={getDisabledStatus("completed")}
                        >
                            Completed
                        </Option>
                        <Option
                            value="canceled"
                            disabled={getDisabledStatus("canceled")}
                        >
                            Canceled
                        </Option>
                    </Select>
                </div>
                {status === "completed" && (
                    <div>
                        <label>Kết quả: </label>
                        <Input.TextArea
                            value={result}
                            onChange={(e) => setResult(e.target.value)}
                            rows={4}
                        />
                    </div>
                )}
            </Modal>

            {/* Modal chi tiết cuộc hẹn */}
            <Modal
                title="Chi tiết cuộc hẹn"
                visible={isDetailModalVisible}
                onCancel={handleCloseModal}
                footer={null}
                className="appointment-modal"
                width={800} // Bạn có thể điều chỉnh độ rộng của modal ở đây
            >
                {selectedAppointment && (
                    <div>
                        <p>
                            {selectedAppointment.patient_id?.image ? (
                                <img
                                    src={`https://gr2-kaqd.onrender.com${selectedAppointment.patient_id.image}`}
                                    alt="Ảnh bệnh nhân"
                                    style={{
                                        width: "100px",
                                        height: "100px",
                                        objectFit: "cover",
                                    }}
                                />
                            ) : (
                                ""
                            )}
                        </p>
                        <p>
                            <strong>Bệnh nhân:</strong>{" "}
                            {selectedAppointment.patient_id?.name ||
                                "Chưa có thông tin"}
                        </p>
                        <p>
                            <strong>Số điện thoại:</strong>{" "}
                            {selectedAppointment.patient_id?.phone ||
                                "Chưa có thông tin"}
                        </p>
                        <p>
                            <strong>Địa chỉ:</strong>{" "}
                            {selectedAppointment.patient_id?.address ||
                                "Chưa có thông tin"}
                        </p>
                        <p>
                            <strong>Giới tính:</strong>{" "}
                            {selectedAppointment.patient_id?.gender === "female"
                                ? "Nữ"
                                : selectedAppointment.patient_id?.gender ===
                                  "male"
                                ? "Nam"
                                : "Chưa có thông tin"}
                        </p>

                        <p>
                            <strong>Ngày sinh:</strong>{" "}
                            {selectedAppointment.patient_id?.birthDate
                                ? new Date(
                                      selectedAppointment.patient_id.birthDate
                                  ).toLocaleDateString()
                                : "Chưa có thông tin"}
                        </p>
                        <p>
                            <strong>Dịch vụ:</strong>{" "}
                            {selectedAppointment.service_id?.name ||
                                "Chưa có thông tin"}
                        </p>
                        <p>
                            <strong>Ngày:</strong>{" "}
                            {new Date(
                                selectedAppointment.date
                            ).toLocaleDateString()}
                        </p>
                        <p>
                            <strong>Giờ:</strong>{" "}
                            {selectedAppointment.time_slot
                                ? `${selectedAppointment.time_slot.startTime} - ${selectedAppointment.time_slot.endTime}`
                                : "Chưa xác định"}
                        </p>
                        <p>
                            <strong>Trạng thái:</strong>{" "}
                            <Tag
                                color={
                                    selectedAppointment.status === "pending"
                                        ? "orange"
                                        : selectedAppointment.status ===
                                          "confirmed"
                                        ? "green"
                                        : selectedAppointment.status ===
                                          "canceled"
                                        ? "red"
                                        : "blue"
                                }
                            >
                                {selectedAppointment.status?.toUpperCase() ||
                                    "Chưa xác định"}
                            </Tag>
                        </p>
                        <p>
                            <strong>Kết quả:</strong>{" "}
                            {selectedAppointment.result || "Chưa có kết quả"}
                        </p>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default DoctorDashboard;
