import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/authContext';
import RenderRoutes from './routes';
import { useEffect } from 'react';
import "./app.scss";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const PageTitleAndScroll  = () => {
  const location = useLocation();

  useEffect(() => {
    switch (location.pathname) {
      case '/services':
        document.title = 'BkCare - Dịch vụ';
        break;
      case '/doctors':
        document.title = 'BkCare - Bác sĩ';
        break;
      case '/about':
        document.title = 'BkCare - Về chúng tôi';
        break;
      case '/contact':
        document.title = 'BkCare - Liên hệ';
        break;
      case '/login':
        document.title = 'BkCare - Đăng nhập';
        break;
      case '/register':
        document.title = 'BkCare - Đăng ký';
        break;
      case '/':
        document.title = 'BkCare - Trang chủ';
        break;
      default:
        document.title = 'BkCare'; // Tiêu đề mặc định
        break;
    }
    window.scrollTo(0, 0);
  }, [location]);

  return null;
};

const App = () => {
  

  return (
    <Router>
      <AuthProvider>
        <PageTitleAndScroll  />
        <RenderRoutes />
      </AuthProvider>
    </Router>
  );
};

export default App;
