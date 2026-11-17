import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useGameAudio } from "../../hooks/useGameAudio";
import { useEffect, useState } from "react";
import { Notification } from "../../components/Notification";

export default function LobbyPage() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const {
        playSound,
        unlockAudio
    } = useGameAudio();
    const [score, setScore] = useState<number>(0);

    // START: Logout
    async function handleLogout() {
        await logout();
        
        navigate("/login", { replace: true });
    }
    // END: Logout

    // START: Fetch score
    async function FetchScoreUser() {
        try {
            const params = new URLSearchParams({
                user: String(user?.id)
            });

            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/sessions/score?${params}`
            );

            if(!response.ok) {
                Notification(
                    "Gagal mengambil score.",
                    "error",
                    false
                );
            }

            const data = await response.json();

            setScore(Number(data[0].score));
        } catch (error: any) {
            Notification(
                error.message,
                "error",
                false
            );
        }
    }
    // END: Fetch score

    useEffect(() => {
        FetchScoreUser();
        unlockAudio();
    }, []);

    return (
        <div className="screen">
            <div className="absolute top-4 left-4 z-20 flex items-center gap-3">
                <div className="w-sm flex justify-between items-center gap-2 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full border border-indigo-100 shadow-md">
                    <div className="flex items-center gap-3">
                        <span className="text-xl">👤</span>
                        <div>
                            <span id="user-display-name" className="font-extrabold text-indigo-900 text-lg block leading-tight">{user?.username}</span>
                            <span className="text-[12px] text-amber-600 font-black uppercase tracking-wider">🏆 Highscore: <span id="user-high-score">{score}</span></span>
                        </div>
                    </div>
                    <button
                        onClick={() => {
                            handleLogout();
                            playSound("click");
                        }}
                        title="Keluar Akun"
                        className=" ml-2 text-md bg-red-100 text-red-600 px-2 py-1 rounded-md hover:bg-red-200 font-extrabold transition-all cursor-pointer"
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

            <h1 className="glitch mb-2 text-center" data-text="SigmaBrain">SigmaBrain</h1>
            <p className="text-xl text-indigo-700 mb-8 font-bold text-center bg-white/75 px-6 py-2 rounded-full backdrop-blur-md shadow-sm border border-indigo-100">
                🧠 Pilih tantangan belajarmu hari ini!
            </p>
            
            <div className="flex flex-col gap-5 w-full max-w-sm relative z-10">
                <button
                    onClick={() => {
                        navigate("/matematika/mode");
                        playSound("click");
                    }}
                    className="btn-interactive btn-3d bg-blue-500 hover:bg-blue-600 text-white font-extrabold py-5 rounded-2xl text-2xl shadow-[0_6px_0_#1e3a8a] flex items-center justify-center gap-3 cursor-pointer"
                >
                    <span>🧮</span> Menghitung
                </button>
                <button
                    onClick={() => {
                        navigate("pilih-bahasa");
                        playSound("click");
                    }}
                    className="btn-interactive btn-3d bg-pink-500 hover:bg-pink-600 text-white font-extrabold py-5 rounded-2xl text-2xl shadow-[0_6px_0_#9d174d] flex items-center justify-center gap-3 cursor-pointer"
                >
                    <span>📚</span> Bahasa
                </button>
            </div>
        </div>
    );
}