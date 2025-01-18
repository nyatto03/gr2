import {
    Form,
    Input,
    Button,
    notification,
    Select,
    DatePicker,
    Typography,
} from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../context/authContext";
import { useContext } from "react";
import moment from "moment";
import { Link } from "react-router-dom";

const { Title, Text } = Typography;
const { Option } = Select;

const Register = () => {
    const [loading, setLoading] = useState(false);
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    // Vô hiệu hóa các ngày trong tương lai và các ngày cũ hơn 150 năm
    const disableDate = (current) => {
        const maxDate = moment().subtract(150, "years"); // 150 năm trước từ hôm nay
        return (
            current && (current > moment().endOf("day") || current < maxDate)
        );
    };

    // Xử lý khi người dùng gửi form đăng ký
    const handleRegister = async (values) => {
        const {
            name,
            phone,
            password,
            confirmPassword,
            address,
            gender,
            birthDate,
        } = values;

        if (password !== confirmPassword) {
            notification.error({
                message: "Mật khẩu không khớp",
                description: "Mật khẩu bạn nhập không khớp.",
            });
            return;
        }

        try {
            setLoading(true);
            await register(name, phone, password, address, gender, birthDate);
            notification.success({
                message: "Đăng ký thành công",
                description: "Bạn có thể đăng nhập bằng tài khoản của mình.",
            });
            navigate("/login");
        } catch (error) {
            console.error(error);
            notification.error({
                message: "Đăng ký thất bại",
                description:
                    "Đã xảy ra lỗi khi đăng ký tài khoản của bạn.",
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
                    Đăng ký
                </Title>

                <Form onFinish={handleRegister} layout="vertical">
                    {/* Nhập tên */}
                    <Form.Item
                        label="Họ và tên"
                        name="name"
                        rules={[{ required: true, message: "Vui lòng nhập họ và tên!" }]}
                    >
                        <Input
                            placeholder="Nhập họ và tên"
                            size="large"
                        />
                    </Form.Item>

                    {/* Nhập số điện thoại */}
                    <Form.Item
                        label="Số điện thoại"
                        name="phone"
                        rules={[{ required: true, message: "Vui lòng nhập số điện thoại!" }]}
                    >
                        <Input placeholder="Nhập số điện thoại" size="large" />
                    </Form.Item>

                    {/* Nhập mật khẩu */}
                    <Form.Item
                        label="Mật khẩu"
                        name="password"
                        rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
                    >
                        <Input.Password
                            placeholder="Nhập mật khẩu"
                            size="large"
                        />
                    </Form.Item>

                    {/* Nhập xác nhận mật khẩu */}
                    <Form.Item
                        label="Xác nhận mật khẩu"
                        name="confirmPassword"
                        dependencies={["password"]}
                        rules={[
                            { required: true, message: "Vui lòng xác nhận mật khẩu!" },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue("password") === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error("Mật khẩu không khớp!"));
                                },
                            }),
                        ]}
                    >
                        <Input.Password
                            placeholder="Xác nhận mật khẩu"
                            size="large"
                        />
                    </Form.Item>

                    {/* Nhập địa chỉ */}
                    <Form.Item
                        label="Địa chỉ"
                        name="address"
                        rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
                    >
                        <Input placeholder="Nhập địa chỉ" size="large" />
                    </Form.Item>

                    {/* Chọn giới tính */}
                    <Form.Item
                        label="Giới tính"
                        name="gender"
                        rules={[{ required: true, message: "Vui lòng chọn giới tính!" }]}
                    >
                        <Select placeholder="Chọn giới tính" size="large">
                            <Option value="male">Nam</Option>
                            <Option value="female">Nữ</Option>
                            <Option value="other">Khác</Option>
                        </Select>
                    </Form.Item>

                    {/* Chọn ngày sinh */}
                    <Form.Item
                        label="Ngày sinh"
                        name="birthDate"
                        rules={[{ required: true, message: "Vui lòng chọn ngày sinh!" }]}
                    >
                        <DatePicker
                            placeholder="Chọn ngày sinh"
                            size="large"
                            style={{ width: "100%" }}
                            disabledDate={disableDate}
                            format="YYYY-MM-DD"
                        />
                    </Form.Item>

                    {/* Nút đăng ký */}
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
                            Đăng ký
                        </Button>
                    </Form.Item>
                </Form>

                {/* Liên kết đăng nhập nếu đã có tài khoản */}
                <div style={{ textAlign: "center", marginTop: "16px" }}>
                    <Text>
                        Đã có tài khoản?{" "}
                        <Link to="/login" style={{ color: "#1890ff" }}>
                            Đăng nhập
                        </Link>
                    </Text>
                </div>
            </div>
        </div>
    );
};

export default Register;
