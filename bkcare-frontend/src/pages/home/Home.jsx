import { useState, useEffect, useRef } from "react";
import { Input, Card, Spin, Alert, List, Button } from "antd";
import Slider from "react-slick";
import { useNavigate } from "react-router-dom";
import apiClient from "../../services/axiosConfig";
import "./Home.scss";

const Home = () => {
    const [services, setServices] = useState([]);
    const [filteredServices, setFilteredServices] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [loadingServices, setLoadingServices] = useState(true);
    const [loadingDoctors, setLoadingDoctors] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [noResults, setNoResults] = useState(false);
    const navigate = useNavigate();

    // API Endpoints
    const SERVICES_API = "/services";
    const DOCTORS_API = "/doctors";

    // Use separate refs for service and doctor sliders
    const serviceSliderRef = useRef(null);
    const doctorSliderRef = useRef(null);

    useEffect(() => {
        // Fetch the list of services
        apiClient
            .get(SERVICES_API)
            .then((response) => {
                setServices(response.data);
                setFilteredServices(response.data);
                setLoadingServices(false);
            })
            .catch((error) => {
                console.error("Error fetching services:", error);
                setLoadingServices(false);
            });

        // Fetch the list of doctors
        apiClient
            .get(DOCTORS_API)
            .then((response) => {
                setDoctors(response.data);
                setLoadingDoctors(false);
            })
            .catch((error) => {
                console.error("Error fetching doctors:", error);
                setLoadingDoctors(false);
            });
    }, []);

    useEffect(() => {
        // Filter services based on search query
        if (searchQuery.trim() !== "") {
            const filtered = services.filter((service) =>
                service.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredServices(filtered);
            setNoResults(filtered.length === 0);
        } else {
            setFilteredServices(services);
            setNoResults(false);
        }
    }, [searchQuery, services]);

    const serviceSliderSettings = {
        dots: true,
        infinite: true,
        speed: 350,
        slidesToShow: 5,
        slidesToScroll: 1,
        row: 2,
        arrows: false,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                },
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                },
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
        ],
    };

    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 350,
        slidesToShow: 5,
        slidesToScroll: 1,
        arrows: false,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                },
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                },
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                },
            },
        ],
    };

    const goToNext = (sliderRef) => {
        if (sliderRef.current) {
            sliderRef.current.slickNext();
        }
    };

    const goToPrev = (sliderRef) => {
        if (sliderRef.current) {
            sliderRef.current.slickPrev();
        }
    };

    const handleServiceClick = (serviceId) => {
        // Navigate to service detail page
        navigate(`/services/${serviceId}`);
    };

    const handleViewAllServices = () => {
        navigate("/services"); // Navigate to the "view all services" page
    };

    const handleViewAllDoctors = () => {
        navigate("/doctors"); // Navigate to the "view all doctors" page
    };

    return (
        <div className="home-container">
            {/* Search section */}
            <div className="home-banner" id="home">
                <div className="banner-content">
                    <h1 className="banner-title">Tìm kiếm dịch vụ y tế</h1>
                    <Input.Search
                        placeholder="Nhập từ khóa tìm kiếm..." // Tìm kiếm các dịch vụ
                        enterButton="Tìm kiếm"
                        size="large"
                        className="search-input"
                        style={{ marginBottom: 20, width: "600px" }}
                        onSearch={(value) => setSearchQuery(value)}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Display search results */}
            <div className="search-results">
                {searchQuery.trim() === "" ? (
                    <></>
                ) : noResults ? (
                    <Alert
                        message="Không tìm thấy dịch vụ nào"
                        type="error"
                        showIcon
                        style={{ marginBottom: 20 }}
                    />
                ) : (
                    <>
                        <Alert
                            message="Kết quả tìm kiếm: "
                            type="success"
                            showIcon
                            style={{ marginBottom: 20 }}
                        />
                        <List
                            grid={{ gutter: 16, column: 5 }}
                            dataSource={filteredServices}
                            renderItem={(service) => (
                                <List.Item
                                    key={service._id}
                                    onClick={() =>
                                        handleServiceClick(service._id)
                                    }
                                >
                                    <Card
                                        hoverable
                                        cover={
                                            <img
                                                alt={service.name}
                                                src={`http://localhost:5000${service.image}`}
                                                style={{
                                                    height: 200,
                                                    objectFit: "cover",
                                                }}
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
                    </>
                )}
            </div>

            {/* Services section */}
            <section className="home-services" id="services">
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <h2 className="section-title">Dịch vụ nổi bật</h2>
                    <Button
                        type="primary"
                        onClick={handleViewAllServices}
                        className="view-all-button"
                        size="large"
                    >
                        Xem tất cả dịch vụ
                    </Button>
                </div>
                {loadingServices ? (
                    <Spin size="large" />
                ) : (
                    <Slider
                        {...serviceSliderSettings}
                        ref={serviceSliderRef} // Ref riêng cho slider dịch vụ
                        className="service-slider"
                    >
                        {services.map((service) => (
                            <div
                                key={service._id}
                                className="slider-item"
                                onClick={() => handleServiceClick(service._id)}
                            >
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
                                        className="service-description"
                                        title={service.name}
                                        description={service.description}
                                    />
                                </Card>
                            </div>
                        ))}
                    </Slider>
                )}
                <div className="slider-nav-buttons">
                    <button
                        onClick={() => goToPrev(serviceSliderRef)}
                        className="slider-nav-button"
                        style={{padding:"0 22px"}}
                    >
                        Sau
                    </button>
                    <button
                        onClick={() => goToNext(serviceSliderRef)}
                        className="slider-nav-button"
                    >
                        Trước
                    </button>
                </div>
            </section>

            {/* Doctors section */}
            <section className="home-doctors" id="doctors">
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <h2 className="section-title">Bác sĩ của chúng tôi</h2>
                    <Button
                        type="primary"
                        onClick={handleViewAllDoctors}
                        className="view-all-button"
                        size="large"
                    >
                        Xem tất cả bác sĩ
                    </Button>
                </div>

                {loadingDoctors ? (
                    <Spin size="large" />
                ) : (
                    <Slider
                        {...sliderSettings}
                        ref={doctorSliderRef} // Ref riêng cho slider bác sĩ
                        className="doctor-slider"
                    >
                        {doctors.slice(0, 5).map((doctor) => (
                            <div key={doctor._id}>
                                <Card
                                    hoverable
                                    cover={
                                        <img
                                            alt={doctor.name}
                                            src={`http://localhost:5000${doctor.image}`}
                                            className="doctor-image"
                                        />
                                    }
                                >
                                    <Card.Meta
                                        title={doctor.name}
                                        description={
                                            <>
                                                <p>{doctor.specialization}</p>
                                                <p>
                                                    <strong>
                                                        Chuyên ngành:
                                                    </strong>{" "}
                                                    {doctor.specialty}
                                                </p>
                                            </>
                                        }
                                    />
                                </Card>
                            </div>
                        ))}
                    </Slider>
                )}
                <div className="slider-nav-buttons">
                    <button
                        onClick={() => goToPrev(doctorSliderRef)}
                        className="slider-nav-button"
                        style={{padding:"0 22px"}}

                    >
                        Sau
                    </button>
                    <button
                        onClick={() => goToNext(doctorSliderRef)}
                        className="slider-nav-button"
                    >
                        Trước
                    </button>
                </div>
            </section>

            {/* About Us section */}
            <section className="home-about" id="about">
                <h2 className="section-title">Giới Thiệu Về Chúng Tôi</h2>
                <p>
                    Chào mừng bạn đến với nền tảng chăm sóc sức khỏe của chúng
                    tôi! Chúng tôi cung cấp dịch vụ y tế chất lượng và kết nối
                    bệnh nhân với các bác sĩ hàng đầu. Sứ mệnh của chúng tôi là
                    làm cho dịch vụ chăm sóc sức khỏe trở nên dễ dàng tiếp cận
                    và phù hợp với mọi người.
                </p>
                <p>
                    Nền tảng của chúng tôi tập hợp các bác sĩ có kinh nghiệm,
                    chuyên gia y tế, và dịch vụ chăm sóc sức khỏe để giúp bạn
                    đưa ra những quyết định đúng đắn cho sức khỏe của mình.
                </p>
            </section>

            {/* Contact Us section */}
            <section className="home-contact" id="contact">
                <h2 className="section-title">Liên Hệ Với Chúng Tôi</h2>
                <p>
                    Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng
                    tôi qua thông tin bên dưới hoặc truy cập vào trang web của
                    chúng tôi để biết thêm chi tiết.
                </p>
            </section>
        </div>
    );
};

export default Home;
