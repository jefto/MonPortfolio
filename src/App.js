import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/sections/About";
import Contact from "./pages/sections/Contact";
import Study from "./pages/sections/Study";
import DevPart from "./pages/DevPart";
import DesignPart from "./pages/DesignPart";
import DetailDesignProject from "./pages/DetailDesignProject";

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
                    <Route path="/design" element={<DesignPart />} />
                    <Route path="/design/project/:id" element={<DetailDesignProject />} />
                </Routes>
            </div>
        </BrowserRouter>
    )
}