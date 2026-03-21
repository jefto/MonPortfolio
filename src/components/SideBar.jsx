import logo from "../assets/logo.png"
import { Link } from "react-router-dom";



export default function SideBar() {

    return (
        <div
            className={`bg-black h-full w-1/6 flex flex-col gap-56 p-10`}
        >
            <img
                src={logo}
                alt="Logo"
                className={``}
            />
            <nav
                className={`flex flex-col gap-4 text-white text-xl`}
            >
                <Link to="/">Home</Link>
                <Link to="/about">About</Link>
                <Link to="/skill">Skills</Link>
                <Link to="/project">Project</Link>
                <Link to="/contact">Contact</Link>
            </nav>
            <p className={`text-white p-2`}>
                Copyright ©2025 Jefto2.0. All right reserved.
            </p>
        </div>
    );
}