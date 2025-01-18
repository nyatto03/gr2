import MainLayout from "../layouts/MainLayout";
import Home from "../pages/home/Home";
import DoctorsList from "../pages/doctors/DoctorsList"; // Danh sách bác sĩ
import DoctorDetail from "../pages/doctors/DoctorDetail"; // Chi tiết bác sĩ
import LogIn from "../pages/auth/LogIn";
import Register from "../pages/auth/Register";
import ServicesList from "../pages/service/ServicesList";
import ServiceDetail from "../pages/service/ServiceDetail";
import NotFound from "../pages/404Error/NotFound";
import RouteGuard from "./routeGuard";
import About from "../pages/about/About";
import Contact from "../pages/contact/Contact";

// Hàm bọc các route công khai với layout chính
const publicRoute = (element) => <MainLayout>{element}</MainLayout>;

// Danh sách các route công khai
const publicRoutes = [
    { path: "/", element: publicRoute(<Home />) },
    { path: "/home", element: publicRoute(<Home />) },
    { path: "/doctors", element: publicRoute(<DoctorsList />) }, // Danh sách bác sĩ
    { path: "/doctors/:id", element: publicRoute(<DoctorDetail />) }, // Chi tiết bác sĩ
    { path: "/services", element: publicRoute(<ServicesList />) },
    { path: "/services/:id", element: publicRoute(<ServiceDetail />) }, // Chi tiết bác sĩ
    { path: "/about", element: publicRoute(<About />) },
    { path: "/contact", element: publicRoute(<Contact />) },
    { path: "*", element: publicRoute(<NotFound />) },

    {
        path: "/login",
        element: <RouteGuard>{publicRoute(<LogIn />)}</RouteGuard>,
    },
    {
        path: "/register",
        element: <RouteGuard>{publicRoute(<Register />)}</RouteGuard>,
    },
];

export default publicRoutes;
