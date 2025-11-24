import { MdOutlineLocalPhone } from "react-icons/md";
import { MdOutlineFileDownload } from "react-icons/md";
import { TfiEmail } from "react-icons/tfi";
import background from "../assets/Rectangle.jpg";
export default function Home() {
    return (
        <div
            className={`flex flex-col gap-4 text-white text-xl justify-center text-center pt-20`}
        >
            <h1
                className={`font-bold text-6xl leading-tight text-center text-center`}
            >
                HELLO! I'M <em
                    className={`font-bold text-6xl not-italic bg-gradient-to-r from-[#E5214D] to-[#FE9200] bg-clip-text text-transparent text-stroke`}
                >
                    TCHAMIE JEPHTE
                </em>
            </h1>
            <p
                className={`text-3xl leading-tight text-center`}
            >
                JE SUIS <em
                            className={`not-italic text-[#E5214D]`}
                        >
                            DEVELOPEUR
                        </em> WEB
            </p>
            <p
                className={`text-3xl leading-tight text-center`}
            > ET <em
                    className={`not-italic text-[#E5214D]`}
                 >UI | UX </em> DESIGNER</p>
            <div
                className={`flex flex-row justify-center pt-20 gap-40`}
            >
                <div
                    className={`flex flex-row text-center justify-center gap-4 p-2`}
                >
                    <MdOutlineLocalPhone
                        className={`h-10 w-10 bg-black rounded-full backdrop-blur-md p-2`}
                    />
                    <p
                        className={`fond-bold text-black`}
                    >
                        +228 91020171
                    </p>
                </div>
                <button
                    className={`flex flex-row bg-black rounded-full p-2`}
                >
                    <MdOutlineFileDownload
                        className={`h-10 w-10 bg-black rounded backdrop-blur-md `}
                    />
                    <p
                        className={`p-2`}
                    >
                        Download CV
                    </p>
                </button>
                <div
                    className={`flex flex-row text-center justify-center gap-4 p-2`}
                >
                    <TfiEmail
                        className={`h-10 w-10 bg-black rounded backdrop-blur-md p-2`}
                    />
                    <p
                        className={`fond-bold text-black`}
                    >
                        jefftchamie@gmail.com
                    </p>
                </div>
            </div>
        </div>
    );
}