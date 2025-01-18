import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
    Spin,
    Card,
    Button,
    Modal,
    List,
    Timeline,
    Breadcrumb,
    notification,
} from "antd";
import apiClient from "../../services/axiosConfig";
import "./serviceDetail.scss";
import { DatePicker } from "antd";
import moment from "moment";

const ServiceDetail = () => {
    const { id } = useParams();
    const [service, setService] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [userInfo, setUserInfo] = useState(null);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [refetch, setRefetch] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchServiceDetails = async () => {
            try {
                const response = await apiClient.get(`/services/${id}`);
                setService(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching service details:", error);
                setLoading(false);
                notification.error({
                    message: "Error",
                    description:
                        "Failed to fetch service details. Please try again later.",
                });
            }
        };

        const user = JSON.parse(localStorage.getItem("user"));
        setUserInfo(user);

        fetchServiceDetails();
    }, [id, refetch]); // Re-fetch when `refetch` is updated

    const handleSlotSelect = (slot, doctorId, date) => {
        if (!userInfo) {
            // Show notification before redirecting
            notification.warning({
                message: "Thông báo",
                description: "Vui lòng đăng nhập để đặt lịch khám!",
            });

            // Redirect to login after a short delay
            setTimeout(() => {
                navigate("/login");
            }, 2000); // Delay for 2 seconds to show the notification

            return;
        }
        setSelectedSlot({ ...slot, doctorId, date });
        setIsModalVisible(true);
    };

    const handleModalClose = () => {
        setIsModalVisible(false);
        setSelectedSlot(null);
    };

    const handleBookAppointment = async () => {
        if (!selectedSlot) {
            alert("Vui lòng chọn một khoảng thời gian!");
            return;
        }

        if (!userInfo) {
            alert("Vui lòng đăng nhập để đặt lịch!");
            return;
        }

        setBookingLoading(true);

        try {
            const response = await apiClient.post("/appointments", {
                patient_id: userInfo._id,
                doctor_id: selectedSlot.doctorId,
                service_id: id,
                date: selectedSlot.date,
                time_slot: {
                    startTime: selectedSlot.startTime,
                    endTime: selectedSlot.endTime,
                },
            });

            if (response.status === 201) {
                notification.success({
                    message: "Success",
                    description: `Đặt lịch khám thành công vào lúc ${selectedSlot.startTime} - ${selectedSlot.endTime}.`,
                });
                handleModalClose();
                setRefetch(!refetch); // Trigger re-fetch after booking
            } else {
                notification.error({
                    message: "Error",
                    description: "Đặt lịch không thành công. Vui lòng thử lại!",
                });
            }
        } catch (error) {
            console.error("Error booking appointment:", error);
            notification.error({
                message: "Error",
                description: "Đã có lỗi xảy ra khi đặt lịch khám.",
            });
        } finally {
            setBookingLoading(false);
        }
    };

    if (loading) {
        return (
            <div
                style={{
                    width: "100%",
                    height: "100vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center",
                }}
            >
                <Spin size="large" />
            </div>
        );
    }

    if (!service) {
        return <p>Không tìm thấy dịch vụ này!</p>;
    }

    return (
        <div className="service-detail-container">
            <Breadcrumb
                style={{ margin: "16px 0" }}
                items={[
                    { title: <Link to="/">Trang chủ</Link> },
                    { title: <Link to="/services">Dịch vụ</Link> },
                    { title: service.name },
                ]}
            />

            <Card
                hoverable
                cover={
                    <img
                        alt={service.name}
                        src={`http://localhost:5000${service.image}`}
                    />
                }
            >
                <Card.Meta
                    title={service.name}
                    description={service.description}
                />
                <div
                    style={{
                        marginTop: "10px",
                        fontWeight: "bold",
                        color: "#f5222d",
                    }}
                >
                    Đơn giá: {service.price} VND (thanh toán tại cơ sở khám)
                </div>
            </Card>

            <h3>Bác sĩ liên quan:</h3>
            {service.relatedDoctors && service.relatedDoctors.length > 0 ? (
                <ul>
                    {service.relatedDoctors.map((doctor) => (
                        <li key={doctor._id}>
                            <Card>
                                <div className="doctor-info">
                                    <img
                                        alt={doctor.name}
                                        src={`http://localhost:5000${doctor.image}`}
                                        style={{
                                            width: 100,
                                            height: 100,
                                            borderRadius: "50%",
                                        }}
                                    />
                                    <div>
                                        <h4>{doctor.name}</h4>
                                        <p>
                                            <strong>Chuyên ngành:</strong>{" "}
                                            {doctor.specialty}
                                        </p>
                                        <p>
                                            <strong>Mô tả:</strong>{" "}
                                            {doctor.description}
                                        </p>
                                    </div>
                                </div>

                                <h5>Lịch làm việc:</h5>
                                {doctor.workingHours &&
                                doctor.workingHours.length > 0 ? (
                                    <Timeline
                                        items={doctor.workingHours.map(
                                            (workingDay) => ({
                                                key: workingDay._id,
                                                color: "green",
                                                children: (
                                                    <>
                                                        <h5>
                                                            {workingDay.day}
                                                        </h5>
                                                        <List
                                                            dataSource={
                                                                workingDay.slots
                                                            }
                                                            renderItem={(
                                                                slot
                                                            ) => (
                                                                <List.Item
                                                                    key={
                                                                        slot._id
                                                                    }
                                                                >
                                                                    <Button
                                                                        type="primary"
                                                                        onClick={() =>
                                                                            handleSlotSelect(
                                                                                slot,
                                                                                doctor._id,
                                                                                workingDay.day
                                                                            )
                                                                        }
                                                                        disabled={
                                                                            slot.isBooked
                                                                        }
                                                                    >
                                                                        {`${slot.startTime} - ${slot.endTime}`}
                                                                    </Button>
                                                                </List.Item>
                                                            )}
                                                        />
                                                    </>
                                                ),
                                            })
                                        )}
                                    />
                                ) : (
                                    <p>Bác sĩ này không có lịch làm việc.</p>
                                )}
                            </Card>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Không có bác sĩ liên quan.</p>
            )}

            <Modal
                title="Đặt lịch khám"
                open={isModalVisible}
                onCancel={handleModalClose}
                onOk={handleBookAppointment}
                confirmLoading={bookingLoading}
            >
                <h4>Thông tin lịch hẹn</h4>
                <p>
                    <strong>Dịch vụ:</strong> {service.name}
                </p>
                <p>
                    <strong>Đơn giá:</strong> {service.price} VND
                </p>
                <p>
                    <strong>Bác sĩ:</strong> {service.relatedDoctors[0]?.name}
                </p>
                <p>
                    <strong>Thời gian:</strong>{" "}
                    {selectedSlot &&
                        `${selectedSlot.startTime} - ${selectedSlot.endTime}`}
                </p>
                <DatePicker
                    disabledDate={(current) => {
                        // Kiểm tra nếu selectedSlot chưa có giá trị thì không cần vô hiệu hóa
                        if (!selectedSlot || !selectedSlot.date) {
                            return false;
                        }

                        // Chỉ hiển thị ngày thuộc cùng thứ với selectedSlot.date
                        const selectedDayOfWeek = moment()
                            .day(selectedSlot.date)
                            .day(); // Lấy số thứ (0 - Chủ nhật, 6 - Thứ Bảy)

                        // Kiểm tra nếu ngày hiện tại là trong quá khứ
                        if (current && current.isBefore(moment(), "day")) {
                            return true; // Vô hiệu hóa ngày đã qua
                        }

                        // Kiểm tra ngày hiện tại có phải khác ngày thứ của selectedSlot.date không
                        return current && current.day() !== selectedDayOfWeek;
                    }}
                    onChange={(date) => {
                        setSelectedSlot((prevSlot) => ({
                            ...prevSlot,
                            date: date ? date.format("YYYY-MM-DD") : null,
                        }));
                    }}
                    format="YYYY-MM-DD"
                />

                <p>Nếu bạn muốn đặt lịch khám, nhấn Đặt lịch.</p>
            </Modal>
        </div>
    );
};

export default ServiceDetail;
