import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, Breadcrumb } from "antd";
import "./doctorDetail.scss";

const DoctorDetail = () => {
    const { id } = useParams();
    const [doctor, setDoctor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Gọi API để lấy thông tin bác sĩ
        const fetchDoctor = async () => {
            try {
                setLoading(true);
                const response = await fetch(
                    `http://localhost:5000/api/doctors/${id}`
                );
                if (!response.ok) {
                    throw new Error("Không thể lấy thông tin bác sĩ.");
                }
                const data = await response.json();
                setDoctor(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDoctor();
    }, [id]);

    if (loading) {
        return <p>Đang tải thông tin bác sĩ...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    if (!doctor) {
        return <p>Không tìm thấy thông tin bác sĩ!</p>;
    }

    return (
        <div className="doctor-detail-container">
            {/* Breadcrumb */}
            <Breadcrumb
                style={{ margin: "16px 0" }}
                items={[
                    { title: <Link to="/">Trang chủ</Link> },
                    { title: <Link to="/doctors">Danh sách bác sĩ</Link> },
                    { title: doctor.name },
                ]}
            />

            {/* Bố cục ảnh và thông tin bác sĩ */}
            <div className="doctor-detail-content">
                {/* Ảnh bác sĩ */}
                <div className="doctor-image">
                    <img
                        alt={doctor.name}
                        src={`http://localhost:5000${doctor.image}`}
                        style={{
                            objectFit: "cover",
                            height: "300px", // Chiều cao ảnh
                            width: "100%",   // Chiều rộng ảnh
                        }}
                    />
                </div>

                {/* Thông tin bác sĩ */}
                <div className="doctor-info">
                    <Card hoverable>
                        <Card.Meta
                            title={doctor.name}
                            description={
                                <>
                                    <p><strong>Email:</strong> {doctor.email}</p>
                                    <p><strong>Điện thoại:</strong> {doctor.phone}</p>
                                    <p><strong>Địa chỉ:</strong> {doctor.address}</p>
                                    <p><strong>Giới tính:</strong> {doctor.gender === "male" ? "Nam" : "Nữ"}</p>
                                    <p><strong>Ngày sinh:</strong> {new Date(doctor.birthDate).toLocaleDateString()}</p>
                                    <p><strong>Chuyên ngành:</strong> {doctor.specialty}</p>
                                    <p><strong>Kinh nghiệm:</strong> {doctor.description}</p>
                                    <p><strong>Trạng thái:</strong> {doctor.status === "active" ? "Đang hoạt động" : "Ngừng hoạt động"}</p>
                                </>
                            }
                        />
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default DoctorDetail;
