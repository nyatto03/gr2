import { Navigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';

const RouteGuard = ({ children }) => {
    // Lấy thông tin người dùng từ localStorage (giả sử lưu thông tin người dùng dưới dạng JSON)
    const user = JSON.parse(localStorage.getItem('user')); 
    const location = useLocation();

    console.log(user); // Kiểm tra thông tin người dùng trong console

    // Kiểm tra nếu người dùng đã đăng nhập và đang truy cập vào '/login' hoặc '/register'
    if (user && (location.pathname === '/login' || location.pathname === '/register')) {
        return <Navigate to="/" replace />;
    }

    // Kiểm tra nếu người dùng chưa đăng nhập và đang truy cập vào bất kỳ trang nào khác ngoài '/login' hoặc '/register'
    if (!user && location.pathname !== '/login' && location.pathname !== '/register') {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
};

RouteGuard.propTypes = {
    children: PropTypes.node.isRequired,
};

export default RouteGuard;
