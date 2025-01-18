import { Layout, Menu, Badge } from "antd";
import { Link, useLocation } from "react-router-dom";
import {
    BellOutlined,
    MessageOutlined,
    HistoryOutlined,
    LogoutOutlined,
} from "@ant-design/icons";
import useAuth from "../../context/useAuth"; // Giả sử bạn sử dụng hook useAuth

const { Header } = Layout;

const AppHeader = () => {
    const location = useLocation(); // Lấy đường dẫn hiện tại
    const currentPath = location.pathname; // Lấy đường dẫn hiện tại
    const { user, logout } = useAuth(); // Lấy thông tin người dùng từ hook useAuth

    // Kiểm tra vai trò của người dùng
    const isDoctor = user?.role === "doctor";

    // Cập nhật menuItems để ẩn Login và Register khi đã đăng nhập và ẩn các menu không cần thiết cho bác sĩ
    const menuItems = [
        ...(isDoctor
            ? []
            : [
                  { label: <Link to="/">Trang chủ</Link>, key: "1" },
                  { label: <Link to="/services">Dịch vụ</Link>, key: "2" },
                  // Ẩn menu "Bác sĩ" và các menu khác không cần thiết cho bác sĩ
                  { label: <Link to="/doctors">Bác sĩ</Link>, key: "3" },

                  { label: <Link to="/about">Về chúng tôi</Link>, key: "4" },
                  { label: <Link to="/contact">Liên hệ</Link>, key: "5" },
              ]),
        // Nếu người dùng chưa đăng nhập, hiển thị Login và Register
        ...(user
            ? [] // Nếu người dùng đã đăng nhập, không hiển thị Login và Register
            : [
                  { label: <Link to="/login">Đăng nhập</Link>, key: "6" },
                  { label: <Link to="/register">Đăng ký</Link>, key: "7" },
              ]),
    ];

    return (
        <Header
            style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: "#fff",
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                zIndex: 1000, // Đảm bảo header luôn ở trên cùng
                padding: "0 20px",
                height: "64px",
            }}
        >
            {/* Logo */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    borderBottom: "1px solid rgba(5, 5, 5, 0.06)",
                    height: "100%",
                }}
            >
                <img
                    src="/logo.png" // Đường dẫn tới logo
                    alt="BkCare Logo"
                    style={{
                        width: "32px",
                        height: "32px",
                        marginRight: "10px",
                    }} // Kích thước logo
                />
                <div
                    style={{
                        color: "#ffc10e",
                        fontSize: "20px",
                        fontWeight: "bold",
                    }}
                >
                    BkCare
                </div>
            </div>

            {/* Menu */}
            <Menu
                theme="light"
                mode="horizontal"
                items={menuItems}
                selectedKeys={[
                    menuItems.find((item) => {
                        const to = item.label.props.to;
                        return (
                            currentPath === to ||
                            (currentPath !== "/" &&
                                currentPath.startsWith(to + "/"))
                        );
                    })?.key,
                ]}
                style={{
                    flexGrow: 1,
                    justifyContent: "center",
                    fontSize: "16px",
                    height: "100%",
                }}
            />

            {/* Các icon thông báo, tin nhắn, lịch sử cuộc hẹn, và đăng xuất */}
            {user && (
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        borderBottom: "1px solid rgba(5, 5, 5, 0.06)",
                        height: "100%",
                    }}
                >
                    {/* Icon thông báo */}
                    <Badge count={5}>
                        <BellOutlined
                            style={{ fontSize: "22px", margin: "0 15px" }}
                        />
                    </Badge>

                    {/* Icon tin nhắn */}
                    <Badge count={3}>
                        <MessageOutlined
                            style={{ fontSize: "20px", margin: "0 15px" }}
                        />
                    </Badge>

                    {/* Icon lịch sử cuộc hẹn */}
                    {!isDoctor && (
                        <Link to="/appointments" style={{ marginTop: "8px" }}>
                            <HistoryOutlined
                                style={{ fontSize: "20px", margin: "0 15px" }}
                            />
                        </Link>
                    )}

                    {/* Icon đăng xuất */}
                    <LogoutOutlined
                        style={{
                            fontSize: "20px",
                            margin: "0 15px",
                            cursor: "pointer",
                            marginTop: "3px",
                        }}
                        onClick={logout}
                    />
                </div>
            )}
        </Header>
    );
};

export default AppHeader;
