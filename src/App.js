import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/sections/About";
import Contact from "./pages/sections/Contact";
import Study from "./pages/sections/Study";
import DevPart from "./pages/DevPart";
import DesignPart from "./pages/DesignPart";
import DetailDesignProject from "./pages/DetailDesignProject";
import DetailDevProject from "./pages/DetailDevProject";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminLogin from "./pages/admin/AdminLogin";
import PrivateRoute from "./components/PrivateRoute";

export default function App() {
    return (
        <BrowserRouter>
            <div className="min-h-screen w-full overflow-auto bg-white">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/skill" element={<Study />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/dev" element={<DevPart />} />
                    <Route path="/dev/project/:id" element={<DetailDevProject />} />
                    <Route path="/design" element={<DesignPart />} />
                    <Route path="/design/project/:id" element={<DetailDesignProject />} />
                    <Route path="/admin/login" element={<AdminLogin />} />
                    <Route path="/admin" element={
                        <PrivateRoute>
                            <AdminDashboard />
                        </PrivateRoute>
                    } />
                </Routes>
            </div>
        </BrowserRouter>
    );
}