import { Layout } from "antd"; // Sử dụng Layout từ Ant Design
import PropTypes from "prop-types"; // Import PropTypes
import AppHeader from "../components/header/Header";
import Footer from "../components/footer/Footer"; // Giữ lại Footer của bạn

const { Content } = Layout; // Ant Design có component Content trong Layout

const MainLayout = ({ children }) => {
    return (
        <Layout style={{ minHeight: "100vh", backgroundColor: "transparent" }}>
            {/* Header có thể là của bạn hoặc của Ant Design */}
            <AppHeader />

            {/* Content: khu vực chính để hiển thị các trang */}
            <Content
                style={{
                    // padding: "20px 50px",
                    minHeight: "90vh",
                    marginTop: "64px",
                }}
            >
                {children}
            </Content>

            {/* Footer của bạn */}
            <Footer />
        </Layout>
    );
};

// Đảm bảo 'children' là một React Node
MainLayout.propTypes = {
    children: PropTypes.node.isRequired, // Đảm bảo children là một React node
};

export default MainLayout;
