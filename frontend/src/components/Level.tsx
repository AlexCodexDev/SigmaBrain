import { useLocation, useNavigate } from "react-router-dom"

export default function LevelPage() {
    const navigate = useNavigate();
    const location = useLocation();

    const pathname = location.pathname.split("/")[1].replace("-", " ").toUpperCase();

    return (
        <div className="screen">
            <h1
                className="glitch mb-8 text-center text-4xl capitalize"
                data-text={`Level ${pathname}`}
            >
                Level {pathname}
            </h1>
            
            <div className="flex flex-col md:flex-row gap-8 items-center justify-center w-full max-w-5xl relative z-10">
                <div id="level-grid" className="grid-levels w-full md:w-2/3"></div>

                <div id="nightmare-portal" className="w-full md:w-1/3 flex flex-col items-center justify-center bg-gray-950/95 p-6 rounded-[2.5rem] border-4 border-red-600 shadow-[0_0_40px_#dc2626] transform transition-all duration-300 hover:scale-105">
                    <span className="text-5xl animate-bounce mb-2">☠️</span>
                    <h2 className="text-red-500 font-black text-3xl mb-1 text-center tracking-widest animate-pulse">NIGHTMARE</h2>
                    <p className="text-gray-400 text-xs text-center mb-6 font-bold uppercase tracking-wider">Mode Hardcore Ekstrem</p>
                    <button className="w-full btn-interactive btn-3d bg-red-600 hover:bg-red-500 text-white font-black py-4 rounded-xl text-xl shadow-[0_6px_0_#7f1d1d] tracking-wide">
                        MASUK PORTAL 🔥
                    </button>
                </div>
            </div>

            <button
                onClick={() => navigate(-1)}
                className="mt-8 bg-white/90 text-indigo-800 font-bold py-3 px-8 rounded-full shadow-lg hover:bg-white text-lg transition-all backdrop-blur-sm relative z-10"
            >
                ⬅️ Kembali ke Menu Utama
            </button>
        </div>
    )
}