import SideBar from "./components/SideBar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Skills from "./pages/Skills";
import Project from "./pages/Project";
import background2 from "./assets/Rectangle.jpg";
import background from "./assets/Gradient.jpg";

export default function App() {
    return (
        <BrowserRouter>
            <div className="flex h-screen">
                <SideBar />
                <main
                    className="flex-1 overflow-auto p-4 bg-no-repeat bg-cover bg-center"
                    style={{ backgroundImage: `url(${background})` }}
                >
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/skill" element={<Skills />} />
                        <Route path="/project" element={<Project />} />
                        <Route path="/contact" element={<Contact />} />
                    </Routes>
                </main>
            </div>
        </BrowserRouter>
    )
}