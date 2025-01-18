import MainLayout from "../layouts/MainLayout";
import AdminDashboard from "../pages/admin/AdminDashboard";
import DoctorDashboard from "../pages/doctor/DoctorDashboard";
import ManageClinics from "../pages/admin/ManageClinics";
import ManageDoctors from "../pages/admin/ManageDoctors";
import ManageAppointments from "../pages/admin/ManageAppointments";
import ManagePatients from "../pages/admin/ManagePatients"; // Quản lý bệnh nhân
import DoctorAppointments from "../pages/doctor/DoctorAppointments";
import DoctorMessages from "../pages/doctor/DoctorMessages";
import PatientsAppointments from "../pages/patients/PatientsAppointments"; // Quản lý lịch khám bệnh nhân
import PatientsMessages from "../pages/patients/PatientsMessages"; // Tin nhắn của bệnh nhân
import RouteGuard from "./routeGuard";

// Hàm bọc route riêng tư với RouteGuard và MainLayout
const privateRoute = (element) => (
    <RouteGuard>
        <MainLayout>{element}</MainLayout>
    </RouteGuard>
);

// Danh sách các route riêng tư
const privateRoutes = [
    // Admin routes
    {
        path: "/admin",
        element: privateRoute(<AdminDashboard />),
        children: [
            { path: "manage-clinics", element: <ManageClinics /> },
            { path: "manage-doctors", element: <ManageDoctors /> },
            { path: "manage-appointments", element: <ManageAppointments /> },
            { path: "manage-patients", element: <ManagePatients /> }, // Quản lý bệnh nhân
        ],
    },
    // Doctor routes
    {
        path: "/doctor",
        element: privateRoute(<DoctorDashboard />),
        children: [
            { path: "appointments", element: <DoctorAppointments /> },
            { path: "messages", element: <DoctorMessages /> },
        ],
    },
    // Patients routes
    {
        path: "/appointments",
        element: privateRoute(<PatientsAppointments />), // Trang Dashboard dành cho bệnh nhân
    },
    { path: "messages", element: <PatientsMessages /> },
];

export default privateRoutes;
