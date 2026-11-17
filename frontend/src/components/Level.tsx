import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"
import { Notification } from "./Notification";
import { useAuth } from "../context/AuthContext";
import { useGameAudio } from "../hooks/useGameAudio";

interface LevelsProps {
    id: number;
    level: number;

    hasUserAnswer: boolean;
    isCompleted: boolean;
    isLocked: boolean;
     
    totalQuestions: number;
    correctQuestions: number;
}

export default function LevelPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();
    const [score, setScore] = useState<number>(0);

    const {
        playSound,
        unlockAudio
    } = useGameAudio();
    
    async function handleLogout() {
        await logout();
        
        navigate("/login", { replace: true });
    }
    
    const [loading, setLoading] = useState(true);
    const [levelsData, setLevelsData] = useState<LevelsProps[]>([]);
    const [sessionId, setSessionId] = useState<number>(0);

    const { difficulty, gameModesId, name } = location.state;
    const questionType = name.trim().replace("-", "_");

    // START: Check game sessions
    async function CheckGameSessions(): Promise<number | null> {
        try {
            setLoading(true);

            const params = new URLSearchParams({
                userId: String(user?.id),
                gameModesId: gameModesId,
            });

            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/sessions/check?${params}`
            );

            if(!response.ok) {
                Notification(
                    "Gagal menggecek sesi",
                    "error",
                    false
                );

                return null;
            }

            const data = await response.json();

            if (!data.length || !data[0].id) {
                return null;
            }

            return Number(data[0].id);
        } catch (error: any) {
            Notification(
                error.message,
                "error",
                false
            );

            return null;
        } finally {
            setLoading(false);
        }
    }
    // END: Check game sessions

    // START: Fetch data
    async function getLevels(currentSessionId: number): Promise<LevelsProps[] | null> {
        try {
            const params = new URLSearchParams({
                gameModesId: String(gameModesId),
                gameSessionId: String(currentSessionId),
                questionType,
                difficulty: difficulty.toLowerCase()
            });
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/levels/fetch?${params}`
            );

            if(!response.ok) {
                Notification(
                    "Gagal mengambil data level.",
                    "error",
                    false
                );

                return null;
            }

            return await response.json();
        } catch (error: any) {
            Notification(
                error.message,
                "error",
                false
            );

            return null
        } finally {
            setLoading(false);
        }
    }

    async function Initialize() {
        try {
            setLoading(true);

            const currentSessionId = await CheckGameSessions();

            // Hentikan proses jika session gagal ditemukan
            if (currentSessionId === null) return;

            setSessionId(currentSessionId);

            const data = await getLevels(currentSessionId);

            if(data === null) return;

            setLevelsData(data);

        } catch (error: unknown) {
            Notification(
                error instanceof Error
                    ? error.message
                    : "Terjadi kesalahan.",
                "error",
                false
            );
        } finally {
            setLoading(false);
        }
    }
    // END: Fetch data

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
        Initialize();
    }, []);

    if(loading) {
        return (
            <div className="screen">
                <h1
                    className="glitch mb-8 text-center text-4xl capitalize"
                    data-text="Memuat level..."
                >
                    Memuat level...
                </h1>
            </div>
        );
    };

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

            <h1
                className="glitch mb-8 text-center text-4xl capitalize"
                data-text={`Level ${difficulty}`}
            >
                Level {difficulty}
            </h1>
            
            <div className="flex flex-col md:flex-row gap-8 items-center justify-center w-full max-w-5xl relative z-10">
                <div className="grid grid-cols-5 gap-3 w-full md:w-2/3">
                    {levelsData.map((item: any) => (
                        <button
                            key={item.id}
                            disabled={item.locked}
                            onClick={
                                () => {
                                    navigate("/bahasa-indonesia/main", {
                                        state: {
                                            gameModesId,
                                            name,
                                            level: item.id,
                                            session: sessionId
                                        }
                                    });
                                    playSound("click");
                                }}
                            className={`
                                ${
                                    item.isLocked
                                        ? "bg-gray-400 text-gray-600 opacity-60 cursor-not-allowed"
                                        : item.isCompleted
                                            ? "bg-green-500 text-white hover:bg-green-600"
                                            : "bg-white text-indigo-800 hover:bg-indigo-50 border border-indigo-100"
                                }
                                btn-interactive btn-3d font-extrabold text-xl py-4 rounded-2xl
                                shadow-[0_4px_0_#cbd5e1]
                            `}
                        >
                            {item.isLocked
                                ? <div className="flex flex-col">
                                    <span>🔒</span>
                                    <span>Level {item.level}</span>
                                </div>
                                : item.isCompleted
                                    ? <div className="flex flex-col">
                                            <span>✓</span>
                                            <span>Level {item.level}</span>
                                        </div>
                                    : item.level
                            }
                        </button>
                    ))}
                </div>

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
                onClick={() => {
                    navigate(-1);
                    playSound('click');
                }}
                className="mt-8 bg-white/90 text-indigo-800 font-bold py-3 px-8 rounded-full shadow-lg hover:bg-white text-lg transition-all backdrop-blur-sm relative z-10 cursor-pointer"
            >
                ⬅️ Kembali ke Menu Utama
            </button>
        </div>
    )
}