import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { useGameAudio } from "../../../hooks/useGameAudio";
import { useEffect } from "react";

export default function BahasaMenuPage() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const {
        playSound,
        unlockAudio
    } = useGameAudio();
    
    async function handleLogout() {
        await logout();
        
        navigate("/login", { replace: true });
    }

    useEffect(() => {
        unlockAudio();
    }, []);

    return (
        <>
            <div className="screen">
                <div className="absolute top-4 left-4 z-20 flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full border border-indigo-100 shadow-md">
                        <span className="text-xl">👤</span>
                        <div>
                            <span id="user-display-name" className="font-extrabold text-indigo-900 block leading-tight">{user?.username}</span>
                            <span className="text-[10px] text-amber-600 font-black uppercase tracking-wider">🏆 Highscore: <span id="user-high-score">0</span></span>
                        </div>
                        <button
                            onClick={() => {
                                handleLogout;
                                playSound("click");
                            }}
                            title="Keluar Akun"
                            className="ml-2 text-xs bg-red-100 text-red-600 px-2 py-1 rounded-md hover:bg-red-200 font-extrabold transition-all cursor-pointer"
                        >
                            Logout
                        </button>
                    </div>
                    
                    <button
                        onClick={() => {
                            navigate("/leaderboard");
                            playSound("click");
                        }}
                        className="btn-3d bg-yellow-400 hover:bg-yellow-500 text-yellow-950 font-black p-3 rounded-full shadow-md text-xl border-2 border-white flex items-center justify-center cursor-pointer"
                    >
                        🏆
                    </button>
                </div>

                <h1 className="glitch mb-10 text-center text-4xl" data-text="Pilih Bahasa">Pilih Bahasa</h1>
                
                <div className="flex flex-col gap-5 w-full max-w-sm relative z-10">
                    <button
                        onClick={() => {
                            navigate("/bahasa-indonesia/mode");
                            playSound("click");
                        }}
                        className="btn-interactive btn-3d bg-red-500 hover:bg-red-600 text-white font-bold py-5 rounded-2xl text-2xl shadow-[0_6px_0_#991b1b] flex items-center justify-center gap-2 cursor-pointer"
                    >
                        🇮🇩 Bahasa Indonesia
                    </button>
                    <button
                        onClick={() => {
                            navigate("/bahasa-inggris/mode");
                            playSound("click");
                        }}
                        className="btn-interactive btn-3d bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-5 rounded-2xl text-2xl shadow-[0_6px_0_#312e81] flex items-center justify-center gap-2 cursor-pointer"
                    >
                        🇬🇧 Bahasa Inggris
                    </button>
                    <button
                        onClick={() => {
                            navigate("/lobi");
                            playSound("click")
                        }}
                        className="mt-4 text-indigo-800 bg-white/70 py-3 rounded-full font-bold text-lg hover:bg-white backdrop-blur-sm transition-all shadow cursor-pointer"
                    >
                        ⬅️ Kembali ke Menu
                    </button>
                </div>
            </div>
        </>
    );
}