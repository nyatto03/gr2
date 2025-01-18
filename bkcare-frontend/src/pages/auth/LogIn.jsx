import { Input, Button, Form, notification, Typography, Select } from "antd";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../../context/authContext";

const { Title, Text } = Typography;
const { Option } = Select;

const LogIn = () => {
    const { login } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);

    const handleLogin = async (values) => {
        const { role, phone, password } = values;

        try {
            setLoading(true);
            await login(role, phone, password); // Gửi role khi đăng nhập
            notification.success({
                message: "Đăng nhập thành công",
                description: "Bạn đã đăng nhập thành công.",
            });
        } catch (error) {
            console.log(error);
            notification.error({
                message: "Đăng nhập thất bại",
                description:
                    "Vui lòng kiểm tra lại số điện thoại, mật khẩu và vai trò của bạn.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "90vh",
                padding: "0 20px",
            }}
        >
            <div
                style={{
                    backgroundColor: "#fff",
                    padding: "40px",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                    borderRadius: "8px",
                    width: "100%",
                    maxWidth: "400px",
                }}
            >
                <Title
                    level={2}
                    style={{
                        textAlign: "center",
                        color: "#1890ff",
                        marginTop: "0px",
                        marginBottom: "24px",
                    }}
                >
                    Đăng nhập
                </Title>

                {/* Form đăng nhập */}
                <Form onFinish={handleLogin} layout="vertical">
                    {/* Chọn vai trò */}
                    <Form.Item
                        label="Vai trò"
                        name="role"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng chọn vai trò của bạn!",
                            },
                        ]}
                    >
                        <Select placeholder="Chọn vai trò của bạn" size="large">
                            <Option value="admin">Quản trị viên</Option>
                            <Option value="doctor">Bác sĩ</Option>
                            <Option value="patient">Bệnh nhân</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="Số điện thoại"
                        name="phone"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập số điện thoại của bạn!",
                            },
                        ]}
                    >
                        <Input
                            placeholder="Nhập số điện thoại"
                            size="large" // Đặt kích thước là large
                        />
                    </Form.Item>

                    <Form.Item
                        label="Mật khẩu"
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập mật khẩu của bạn!",
                            },
                        ]}
                    >
                        <Input.Password
                            placeholder="Nhập mật khẩu của bạn"
                            size="large" // Đặt kích thước là large
                        />
                    </Form.Item>

                    {/* Nút gửi */}
                    <Form.Item style={{ textAlign: "center" }}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            block
                            loading={loading}
                            style={{
                                height: "40px",
                                fontSize: "16px",
                                borderRadius: "8px",
                                backgroundColor: "#1890ff",
                                marginTop: "12px",
                            }}
                        >
                            Đăng nhập
                        </Button>
                    </Form.Item>
                </Form>

                {/* Liên kết đăng ký */}
                <div style={{ textAlign: "center", marginTop: "16px" }}>
                    <Text>
                        Bạn chưa có tài khoản?{" "}
                        <Link
                            to="/register"
                            style={{ color: "#1890ff", textDecoration: "none" }}
                        >
                            Đăng ký
                        </Link>
                    </Text>
                </div>
            </div>
        </div>
    );
};

export default LogIn;
