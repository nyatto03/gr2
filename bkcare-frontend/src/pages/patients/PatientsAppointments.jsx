import { useEffect, useState } from "react";
import { Table, Button, message, Tag, Modal, notification } from "antd"; // Import notification
import apiClient from "../../services/axiosConfig";

const PatientsAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [refetch, setRefetch] = useState(false); // Refetch flag

    // Lấy danh sách lịch khám từ API
    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const response = await apiClient.get("/appointments/patient");
                setAppointments(response.data);
            } catch (error) {
                console.error(error);
                message.error(
                    "Không thể tải danh sách lịch khám. Vui lòng thử lại sau."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchAppointments();
    }, [refetch]); // Depend on refetch to trigger data reload

    // Hiển thị modal chi tiết
    const showDetails = (appointment) => {
        setSelectedAppointment(appointment);
        setIsModalVisible(true);
    };

    // Đóng modal chi tiết
    const handleCloseModal = () => {
        setIsModalVisible(false);
        setSelectedAppointment(null);
    };

    // Hủy lịch khám
    const cancelAppointment = async (appointmentId, selectedSlot) => {
        try {
            const response = await apiClient.put(
                `/appointments/${appointmentId}`,
                {
                    status: "canceled",
                }
            );
            if (response.status === 200) {
                // Hiển thị thông báo thành công
                notification.success({
                    message: "Hủy lịch khám thành công",
                    description: `Đặt lịch khám thành công vào lúc ${selectedSlot.startTime} - ${selectedSlot.endTime}.`,
                });
                handleCloseModal();
                setRefetch(!refetch); // Trigger refetch to reload appointments
            }
        } catch (error) {
            console.error(error);
            message.error("Không thể hủy lịch khám. Vui lòng thử lại sau.");
        }
    };

    const columns = [
        {
            title: "STT",
            dataIndex: "index",
            key: "index",
            render: (text, record, index) => index + 1,
        },
        {
            title: "Bác sĩ",
            dataIndex: ["doctor_id", "name"],
            key: "doctor",
        },
        {
            title: "Ngày",
            dataIndex: "date",
            key: "date",
        },
        {
            title: "Giờ",
            dataIndex: "time_slot",
            key: "time",
            render: (timeSlot) => `${timeSlot.startTime} - ${timeSlot.endTime}`,
        },
        {
            title: "Dịch vụ",
            dataIndex: "service_id",
            key: "service",
            render: (service) => service?.name || "Chưa có dịch vụ",
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
                        : "red";
                return <Tag color={color}>{status.toUpperCase()}</Tag>;
            },
        },
        {
            title: "Kết quả",
            dataIndex: "result",
            key: "result",
            render: (result) => result || "Chưa có kết quả",
        },
        {
            title: "Hành động",
            key: "action",
            render: (text, record) => (
                <>
                    <Button
                        style={{ marginLeft: 8 }}
                        onClick={() => showDetails(record)}
                    >
                        Xem chi tiết
                    </Button>
                    {record.status === "pending" && (
                        <Button
                            style={{ marginLeft: 8 }}
                            danger
                            onClick={() => cancelAppointment(record._id, record.time_slot)}
                        >
                            Hủy
                        </Button>
                    )}
                </>
            ),
        },
    ];

    return (
        <div>
            <h1>Quản lý Lịch khám bệnh</h1>
            <p>
                Trang này cho phép bệnh nhân xem và quản lý các lịch khám của
                mình.
            </p>
            <Table
                dataSource={appointments}
                columns={columns}
                rowKey="_id"
                loading={loading}
                bordered
            />

            {/* Modal chi tiết */}
            <Modal
                title="Chi tiết Lịch khám"
                visible={isModalVisible}
                onCancel={handleCloseModal}
                footer={null}
            >
                {selectedAppointment && (
                    <div>
                        <p>
                            <strong>Bác sĩ:</strong>{" "}
                            {selectedAppointment.doctor_id.name}
                        </p>
                        <p>
                            <strong>Số điện thoại liên lạc:</strong>
                            {"  "}
                            {selectedAppointment.doctor_id.phone}
                        </p>
                        <p>
                            <strong>Ngày khám bệnh:</strong>{" "}
                            {selectedAppointment.date}
                        </p>
                        <p>
                            <strong>Thời gian:</strong>{" "}
                            {selectedAppointment.time_slot.startTime} -{" "}
                            {selectedAppointment.time_slot.endTime}
                        </p>
                        <p>
                            <strong>Trạng thái:</strong>{" "}
                            {selectedAppointment.status}
                        </p>
                        <p>
                            <strong>Kết quả:</strong>{" "}
                            {selectedAppointment.result || "Chưa có kết quả"}
                        </p>
                        <p>
                            <strong>Dịch vụ:</strong>{" "}
                            {selectedAppointment.service_id.name ||
                                "Chưa có dịch vụ"}
                        </p>
                        <p>
                            <strong>Mô tả dịch vụ:</strong>{" "}
                            {selectedAppointment.service_id.description ||
                                "Không có mô tả"}
                        </p>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default PatientsAppointments;
