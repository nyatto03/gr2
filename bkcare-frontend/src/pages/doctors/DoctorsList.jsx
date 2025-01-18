import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input, List, Card, Spin } from "antd";
import apiClient from "../../services/axiosConfig"; // Đảm bảo apiClient đã được cấu hình đúng
import "./doctorsList.scss"; // Thêm CSS nếu cần

const DoctorsList = () => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filteredDoctors, setFilteredDoctors] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        // Lấy danh sách bác sĩ từ API
        const fetchDoctors = async () => {
            try {
                const response = await apiClient.get("/doctors");
                setDoctors(response.data);
                setFilteredDoctors(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching doctors:", error);
                setLoading(false);
            }
        };

        fetchDoctors();
    }, []);

    const handleSearch = (value) => {
        setSearchQuery(value);
        if (value) {
            const filtered = doctors.filter((doctor) =>
                doctor.name.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredDoctors(filtered);
        } else {
            setFilteredDoctors(doctors);
        }
    };

    const handleDoctorClick = (doctorId) => {
        // Chuyển hướng đến trang chi tiết bác sĩ
        navigate(`/doctors/${doctorId}`);
    };

    if (loading) {
        return (
            <div
                style={{
                    width: "100%",
                    height: "100vh",
                    display: "flex",
                    justifyContent: "center", // Center horizontally
                    alignItems: "center", // Center vertically
                    textAlign: "center",
                }}
            >
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div className="doctor-list">
            <div className="header-doctor-list">
                <h1>Danh sách Bác sĩ</h1>
                <p>
                    Đây là trang chứa danh sách tất cả các bác sĩ và thông tin
                    chi tiết về từng bác sĩ.
                </p>

                {/* Thanh tìm kiếm */}
                <Input.Search
                    placeholder="Nhập tên bác sĩ..."
                    enterButton="Tìm kiếm"
                    size="large"
                    className="search-input"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    style={{ marginBottom: 40, width: "600px" }}
                />
            </div>

            {/* Hiển thị danh sách bác sĩ */}
            <List
                grid={{ gutter: 16, column: 5 }} // Điều chỉnh số cột nếu cần
                dataSource={filteredDoctors}
                renderItem={(doctor) => (
                    <List.Item
                        key={doctor._id}
                        onClick={() => handleDoctorClick(doctor._id)}
                    >
                        <Card
                            hoverable
                            cover={
                                <img
                                    alt={doctor.name}
                                    src={`https://gr2-kaqd.onrender.com${doctor.image}`} // Thay đường dẫn hình ảnh phù hợp
                                    style={{ height: 350, objectFit: "cover" }}
                                />
                            }
                        >
                            <Card.Meta
                                title={doctor.name}
                                description={
                                    <div className="doctor-description">
                                        <p className="doctor-specialty">
                                            <strong>Chuyên ngành:</strong>{" "}
                                            {doctor.specialty}
                                        </p>
                                        <p className="doctor-detail">
                                            {doctor.description}
                                        </p>
                                    </div>
                                }
                            />
                        </Card>
                    </List.Item>
                )}
            />
        </div>
    );
};

export default DoctorsList;
