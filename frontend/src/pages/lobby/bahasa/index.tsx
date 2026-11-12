import { useNavigate } from "react-router-dom";
import LevelPage from "../../../components/Level";

export default function BahasaMenuPage() {
    const navigate = useNavigate();

    return (
        <>
            <div id="screen-bahasa" className="screen">
                <h1 className="glitch mb-10 text-center text-4xl" data-text="Pilih Bahasa">Pilih Bahasa</h1>
                
                <div className="flex flex-col gap-5 w-full max-w-sm relative z-10">
                    <button
                        onClick={() => navigate("/bahasa-indonesia/tingkat")}
                        className="btn-interactive btn-3d bg-red-500 hover:bg-red-600 text-white font-bold py-5 rounded-2xl text-2xl shadow-[0_6px_0_#991b1b] flex items-center justify-center gap-2"
                    >
                        🇮🇩 Bahasa Indonesia
                    </button>
                    <button
                        onClick={() => navigate("/bahasa-inggris/tingkat")}
                        className="btn-interactive btn-3d bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-5 rounded-2xl text-2xl shadow-[0_6px_0_#312e81] flex items-center justify-center gap-2"
                    >
                        🇬🇧 Bahasa Inggris
                    </button>
                    <button
                        onClick={() => navigate("/lobi")}
                        className="mt-4 text-indigo-800 bg-white/70 py-3 rounded-full font-bold text-lg hover:bg-white backdrop-blur-sm transition-all shadow"
                    >
                        ⬅️ Kembali ke Menu
                    </button>
                </div>
            </div>
            <LevelPage />
        </>
    );
}