import { MdOutlineLocalPhone } from "react-icons/md";
import { MdOutlineFileDownload } from "react-icons/md";
import { TfiEmail } from "react-icons/tfi";
import profilePhoto from "../../assets/tof.jpg";

// Couleurs du thème
const theme = {
    primary: "#3B82F6",
    white: "#FFFFFF",
};

// Composant pour l'effet de masque multi-rectangles
function MaskedPhoto({ src }) {
    const borderColor = theme.white;

    return (
        <div className="relative w-96 full">
            {/* Effet de lumière bleue en arrière-plan - forme circulaire irrégulière */}
            <div
                className="absolute -z-10 w-[140%] h-[130%] -top-[10%] -left-[15%] blur-[50px]"
                style={{
                    background: `
                        radial-gradient(ellipse 80% 70% at 30% 40%, rgba(59, 130, 246, 1) 0%, rgba(59, 130, 246, 0.5) 40%, transparent 70%),
                        radial-gradient(ellipse 60% 80% at 70% 60%, rgba(96, 165, 250, 0.95) 0%, rgba(96, 165, 250, 0.4) 35%, transparent 65%),
                        radial-gradient(ellipse 90% 60% at 50% 30%, rgba(37, 99, 235, 0.9) 0%, rgba(37, 99, 235, 0.3) 30%, transparent 70%)
                    `,
                    borderRadius: '60% 40% 50% 70% / 50% 60% 40% 50%'
                }}
            />

            <svg
                className="w-full h-full drop-shadow-2xl"
                viewBox="0 0 320 384"
                preserveAspectRatio="xMidYMid slice"
            >
                <defs>
                    <pattern
                        id="photoPattern"
                        patternUnits="userSpaceOnUse"
                        width="320"
                        height="384"
                    >
                        <image
                            href={src}
                            x="0"
                            y="0"
                            width="320"
                            height="384"
                            preserveAspectRatio="xMidYMin slice"
                        />
                    </pattern>
                    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#3B82F6" floodOpacity="0.3"/>
                    </filter>
                    {/* Filtre pour l'effet hover - ombre bleue intense */}
                    <filter id="shadowHover" x="-30%" y="-30%" width="160%" height="160%">
                        <feDropShadow dx="0" dy="6" stdDeviation="15" floodColor="#3B82F6" floodOpacity="0.8"/>
                    </filter>
                </defs>

                <style>
                    {`
                        .photo-rect {
                            transition: all 0.3s ease;
                            cursor: pointer;
                        }
                        .photo-rect:hover {
                            filter: url(#shadowHover);
                            transform: scale(1.05);
                            transform-origin: center;
                        }
                    `}
                </style>

                {/* Forme principale en L (style pistolet) */}
                <path
                    className="photo-rect"
                    d="M 18 10
                       L 217 10
                       Q 225 10 225 18
                       L 225 117
                       Q 225 125 217 125
                       L 103 125
                       Q 95 125 95 133
                       L 95 162
                       Q 95 170 87 170
                       L 18 170
                       Q 10 170 10 162
                       L 10 18
                       Q 10 10 18 10
                       Z"
                    fill="url(#photoPattern)"
                    stroke={borderColor}
                    strokeWidth="3"
                    filter="url(#shadow)"
                />

                <rect className="photo-rect" x="15" y="185" width="80" height="90" rx="8"
                      fill="url(#photoPattern)" stroke={borderColor} strokeWidth="3" filter="url(#shadow)" />
                <rect className="photo-rect" x="115" y="140" width="110" height="90" rx="8"
                      fill="url(#photoPattern)" stroke={borderColor} strokeWidth="3" filter="url(#shadow)" />
                <rect className="photo-rect" x="115" y="245" width="180" height="85" rx="8"
                      fill="url(#photoPattern)" stroke={borderColor} strokeWidth="3" filter="url(#shadow)" />
                <rect className="photo-rect" x="240" y="10" width="55" height="70" rx="8"
                      fill="url(#photoPattern)" stroke={borderColor} strokeWidth="3" filter="url(#shadow)" />
                <rect className="photo-rect" x="240" y="95" width="55" height="135" rx="8"
                      fill="url(#photoPattern)" stroke={borderColor} strokeWidth="3" filter="url(#shadow)" />
                <rect className="photo-rect" x="15" y="290" width="80" height="40" rx="8"
                      fill="url(#photoPattern)" stroke={borderColor} strokeWidth="3" filter="url(#shadow)" />
            </svg>
        </div>
    );
}

export default function HeroSection() {
    return (
        <section className="flex flex-row lg:flex-row gap-8 text-xl justify-center items-center min-h-screen px-8 md:px-16 py-12 max-w-7xl mx-auto">
            {/* Section Texte */}
            <div className="flex flex-col gap-4 text-center lg:text-left lg:flex-1 w-64">
                <h1 className="text-5xl  leading-tight text-gray-800 font-poppins">
                    HELLO! I'M{' '}
                    <em className="font-bold not-italic text-blue-500 block mt-2 font-abril">
                        TCHAMIE JEPHTE
                    </em>
                </h1>

                <p className="text-2xl md:text-3xl leading-tight text-gray-700 font-poppins">
                    JE SUIS{' '}
                    <em className="not-italic text-blue-600 font-semibold">DÉVELOPPEUR WEB</em>
                </p>
                <em className={`text-2xl md:text-3xl leading-tight text-gray-700 font-poppins`}>&</em>
                <p className="text-2xl md:text-3xl leading-tight text-gray-700 font-allan">
                     <em className="not-italic text-blue-500 font-semibold">UI | UX</em> {' '}DESIGNER
                </p>

                {/* Boutons d'action */}
                <div className="flex flex-col md:flex-row justify-center lg:justify-start pt-8 gap-4 md:gap-5 font-poppins">
                    <div className="flex flex-row items-center justify-center gap-3 ">
                        <MdOutlineLocalPhone className="h-10 w-10 bg-blue-100 rounded-full p-2 text-blue-600" />
                        <p className="font-bold w-20 text-gray-700 text-sm">91020171</p>
                    </div>

                    <button className="flex flex-row w-44 h-12 items-center justify-center bg-blue-500 hover:bg-blue-600 rounded-full py-2 transition-colors text-white shadow-lg shadow-blue-500/30">
                        <MdOutlineFileDownload className="h-8 w-8" />
                        <p className="p-2 font-semibold text-sm">Download CV</p>
                    </button>

                    <div className="flex flex-row items-center justify-center gap-3 ">
                        <TfiEmail className="h-10 w-10 bg-blue-100 rounded-full p-2 text-blue-600" />
                        <p className="font-bold w-20 text-gray-700 text-sm ">jefftchamie@gmail.com</p>
                    </div>
                </div>
            </div>

            {/* Section Photo */}
            <div className="w-1/3 lg:flex-1 flex justify-center items-center">
                <MaskedPhoto src={profilePhoto} />
            </div>
        </section>
    );
}