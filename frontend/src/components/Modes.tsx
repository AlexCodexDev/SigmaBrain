import { useEffect, useState } from "react";
import { Notification } from "./Notification";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useGameAudio } from "../hooks/useGameAudio";

interface GameModesProps {
    id: number;
    name: string;
}

export default function ModesPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();
    const [score, setScore] = useState<number>(0);

    const {
        playSound,
        unlockAudio
    } = useGameAudio();

    const pathname = location.pathname.split("/")[1];

    const [loading, setLoading] = useState(true);
    const [gameModesData, setGameModesData] = useState<GameModesProps[]>([]);

    // START: Fetch
    async function getGameModes() {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/game-modes/fetch`,
            );

            if(!response.ok) {
                Notification(
                    "Gagal mengambil data.",
                    "error",
                    false
                );
            }

            const data: GameModesProps[] = await response.json();

            setGameModesData(data);
        } catch (error: any) {
            Notification(
                error.message,
                "error",
                false
            );
        } finally {
            setLoading(false);
        }
    }
    // END: Fetch

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
        getGameModes();
    }, []);

    if(loading) {
        return (
            <div className="screen">
                <h1
                    className="glitch mb-8 text-center text-4xl capitalize"
                    data-text="Memuat tingkatan..."
                >
                    Memuat tingkatan...
                </h1>
            </div>
        );
    };

    return (
        <>
            <div className="screen gap-5">
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
                <h1 className="glitch text-center text-4xl mt-auto md:mt-0" data-text="Pilih Kesulitan">Pilih Kesulitan</h1>

                <div className="flex flex-col justify-center items-center gap-7 w-full md:flex-row">
                    <div className="flex flex-col gap-5 w-full max-w-sm relative z-10">
                        {gameModesData.map((item: any, index: number) => (
                            <button
                                key={index}
                                onClick={() => {
                                    navigate(`/${pathname}/tingkat`, { state: { difficulty: item.name, gameModesId: item.id, name: pathname } });
                                    playSound("click");
                                }}
                                className={`
                                    ${item.name === "easy" ? "bg-green-500 hover:bg-green-600" : ""}
                                    ${item.name === "medium" ? "bg-yellow-500 hover:bg-yellow-600" : ""}
                                    ${item.name === "hard" ? "bg-orange-500 hover:bg-orange-600" : ""}
                                    btn-interactive btn-3d text-white font-bold py-5 rounded-2xl text-2xl shadow-[0_6px_0_#991b1b] flex items-center justify-center gap-2 cursor-pointer
                                `}
                            >
                                {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
                            </button>
                        ))}
                    </div>

                    <div className="w-full md:w-sm flex flex-col items-center justify-center bg-gray-950/95 p-6 rounded-[2.5rem] border-4 border-red-600 shadow-[0_0_40px_#dc2626] transform transition-all duration-300 hover:scale-105">
                        <span className="text-5xl animate-bounce mb-2">☠️</span>
                        <h2 className="text-red-500 font-black text-3xl mb-1 text-center tracking-widest animate-pulse">NIGHTMARE</h2>
                        <p className="text-gray-400 text-xs text-center mb-6 font-bold uppercase tracking-wider">Mode Hardcore Ekstrem</p>
                        <button
                            onClick={() => {
                                navigate(`/${pathname}/tingkat`, { state: { difficulty: "nightmare", gameModesId: 5, name: pathname } });
                                playSound("click");
                            }}
                            className="w-full btn-interactive btn-3d bg-red-600 hover:bg-red-500 text-white font-black py-4 rounded-xl text-xl shadow-[0_6px_0_#7f1d1d] tracking-wide cursor-pointer"
                        >
                            MASUK PORTAL 🔥
                        </button>
                    </div>
                </div>

                <button
                    onClick={() => {
                        navigate(-1);
                        playSound("click");
                    }}
                    className="w-sm mt-4 text-indigo-800 bg-white/70 py-3 rounded-full font-bold text-lg hover:bg-white backdrop-blur-sm transition-all shadow cursor-pointer"
                >
                    ⬅️ Kembali ke Menu
                </button>
            </div>
        </>
    )
}