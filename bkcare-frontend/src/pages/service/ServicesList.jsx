import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input, List, Card, Spin } from "antd";
import apiClient from "../../services/axiosConfig";
import "./servicesList.scss";

const ServicesList = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filteredServices, setFilteredServices] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        // Giả sử bạn lấy danh sách dịch vụ từ API
        const fetchServices = async () => {
            try {
                const response = await apiClient.get("/services");
                setServices(response.data);
                setFilteredServices(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching services:", error);
                setLoading(false);
            }
        };

        fetchServices();
    }, []);

    const handleSearch = (value) => {
        setSearchQuery(value);
        if (value) {
            const filtered = services.filter((service) =>
                service.name.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredServices(filtered);
        } else {
            setFilteredServices(services);
        }
    };

    const handleServiceClick = (serviceId) => {
        // Chuyển hướng đến trang chi tiết dịch vụ
        navigate(`/services/${serviceId}`);
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
        <div className="service-list">
            <div className="header-service-list">
                <h1>Danh sách dịch vụ</h1>
                <p>
                    Đây là trang chứa danh sách tất cả các dịch vụ và thông tin
                    chi tiết về từng dịch vụ.
                </p>

                {/* Thanh tìm kiếm */}

                <Input.Search
                    placeholder="Nhập từ khóa tìm kiếm..."
                    enterButton="Tìm kiếm"
                    size="large"
                    className="search-input"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    style={{ marginBottom: 40, width: "600px" }}
                />
            </div>

            {/* Hiển thị danh sách dịch vụ */}
            <List
                grid={{ gutter: 16, column: 5 }}
                dataSource={filteredServices}
                renderItem={(service) => (
                    <List.Item
                        key={service._id}
                        onClick={() => handleServiceClick(service._id)}
                    >
                        <Card
                            hoverable
                            cover={
                                <img
                                    alt={service.name}
                                    src={`https://gr2-kaqd.onrender.com${service.image}`}
                                    style={{ height: 200, objectFit: "cover" }}
                                />
                            }
                        >
                            <Card.Meta
                                title={service.name}
                                description={service.description}
                            />
                        </Card>
                    </List.Item>
                )}
            />
        </div>
    );
};

export default ServicesList;
