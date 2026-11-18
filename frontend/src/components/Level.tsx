import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"
import { Notification } from "./Notification";
import { useAuth } from "../context/AuthContext";
import { useGameAudio } from "../hooks/useGameAudio";
import nightmareBackground from "../assets/FireFrame.mp4";

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
        
        navigate("/masuk", { replace: true });
    }
    
    const [loading, setLoading] = useState(true);
    const [levelsData, setLevelsData] = useState<LevelsProps[]>([]);
    const [sessionId, setSessionId] = useState<number>(0);

    const emberCanvasRef = useRef<HTMLCanvasElement>(null);
    const lightningFlashRef = useRef<HTMLDivElement>(null);

    const { difficulty, gameModesId, name } = location.state;
    const isNightmare = String(difficulty).toLowerCase() === "nightmare";
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
            }

            const data = await response.json();

            if (!data.length || !data[0].id) {
                window.location.reload();
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
        }
    }

    async function Initialize() {
        try {
            setLoading(true);

            const currentSessionId = await CheckGameSessions();

            if(currentSessionId === null) return;

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
        if (!user?.id) return;

        FetchScoreUser();
    }, [user?.id]);

    useEffect(() => {
        if(!user?.id) return;

        unlockAudio();
        Initialize();
    }, [user?.id, gameModesId, questionType, difficulty]);

    useEffect(() => {
        if (!isNightmare) return;

        playSound("nightmare");
        let lightningTimeout: number | undefined;
        let flashTimeout: number | undefined;

        // Efek kilatan petir
        function scheduleLightning() {
            const delay = Math.random() * 4000 + 2000;

            lightningTimeout = window.setTimeout(() => {
                const flash = lightningFlashRef.current;

                if (flash) {
                    flash.classList.remove("flash-active");

                    // Memicu ulang animasi CSS
                    void flash.offsetWidth;

                    flash.classList.add("flash-active");

                    flashTimeout = window.setTimeout(() => {
                        flash.classList.remove("flash-active");
                    }, 450);
                }

                // Jadwalkan petir berikutnya
                scheduleLightning();

            }, delay);
        }

        scheduleLightning();

        // Cleanup ketika keluar Nightmare
        return () => {
            if (lightningTimeout !== undefined) {
                clearTimeout(lightningTimeout);
            }

            if (flashTimeout !== undefined) {
                clearTimeout(flashTimeout);
            }

            lightningFlashRef.current?.classList.remove(
                "flash-active"
            );
        };

    }, [isNightmare]);

    if(loading) {
        return (
            <div className="screen justify-center">
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
        <>
            {isNightmare && (
                <div
                    className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-red-950"
                    aria-hidden="true"
                >
                    {/* Background video api */}
                    <div
                        id="fire-overlay"
                        className="absolute inset-0 z-0"
                    >
                        <video
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="w-full h-full object-cover mix-blend-screen opacity-70"
                        >
                            <source
                                src={nightmareBackground}
                                type="video/mp4"
                            />
                        </video>
                    </div>

                    {/* Partikel bara api */}
                    <canvas
                        ref={emberCanvasRef}
                        className="absolute inset-0 z-10 w-full h-full"
                    />

                    {/* CRT scanlines */}
                    <div className="crt-scanlines absolute inset-0 z-20" />

                    {/* Lightning */}
                    <div
                        ref={lightningFlashRef}
                        id="lightning-flash"
                        className="absolute inset-0 z-30 flash-active"
                    />

                    {/* Blood vignette */}
                    <div className="blood-vignette absolute inset-0 z-40" />
                </div>
            )}

            <div className="absolute top-4 left-4 z-50 flex items-center gap-3">
                <div className="w-3xs flex justify-between items-center gap-2 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full border border-indigo-100 shadow-md md:w-sm">
                    <div className="flex items-center gap-3">
                        <span className="text-xl">👤</span>
                        <div>
                            <span id="user-display-name" className="font-extrabold text-indigo-900 text-lg block leading-tight">{user?.username}</span>
                            <span className="text-[12px] text-amber-600 font-black uppercase tracking-wider">🏆 Score: <span id="user-high-score">{score}</span></span>
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
                        Keluar
                    </button>
                </div>
                
                <button
                    onClick={() => {
                        navigate("/papan-peringkat");
                        playSound("click");
                    }}
                    className="btn-3d bg-yellow-400 hover:bg-yellow-500 text-yellow-950 font-black p-3 rounded-full shadow-md text-xl border-2 border-white flex items-center justify-center cursor-pointer"
                >
                    🏆
                </button>
            </div>

            <div
                className={`screen justify-start md:justify-center ${isNightmare ? "text-white nightmare-enter nightmare-mode" : ""}`}
                style={isNightmare ? { background: "transparent" } : undefined}
            >
                <h1
                    className={`glitch mb-8 text-center text-4xl capitalize ${isNightmare ? "text-red-500" : ""}`}
                    data-text={`Level ${difficulty}`}
                >
                    Level {difficulty}
                </h1>
                
                <div className="flex flex-col gap-8 items-center justify-center w-full max-w-5xl relative z-10 md:flex-row">
                    <div className="grid grid-cols-2 gap-3 w-full md:w-2/3 md:grid-cols-5">
                        {levelsData.map((item: any) => (
                            <button
                                key={item.id}
                                disabled={item.isLocked}
                                onClick={
                                    () => {
                                        navigate(`/${name}/main`, {
                                            state: {
                                                gameModesId,
                                                name,
                                                level: item.id,
                                                session: sessionId,
                                                difficulty
                                            }
                                        });
                                        playSound("click");
                                    }}
                                className={`
                                    ${
                                        item.isLocked
                                            ? "bg-gray-500 text-gray-300 opacity-60 cursor-not-allowed"
                                            : item.isCompleted
                                                ? isNightmare
                                                    ? "bg-red-700 text-white hover:bg-red-600"
                                                    : "bg-green-500 text-white hover:bg-green-600"
                                                : isNightmare
                                                    ? "bg-gray-950 text-red-400 border border-red-800 hover:bg-red-950"
                                                    : "bg-white text-indigo-800 hover:bg-indigo-50 border border-indigo-100"
                                    }
                                    btn-interactive btn-3d font-extrabold text-xl py-4 rounded-2xl ${isNightmare
                                        ? "shadow-[0_4px_0_#7f1d1d]"
                                        : "shadow-[0_4px_0_#cbd5e1]"
                                    } h-20
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
                </div>

                <button
                    onClick={() => {
                        navigate(-1);
                        playSound('click');
                    }}
                    className="w-full mt-8 bg-white/90 text-indigo-800 font-bold py-3 px-8 rounded-full shadow-lg hover:bg-white text-lg transition-all backdrop-blur-sm relative z-10 cursor-pointer md:w-sm"
                >
                    ⬅️ Kembali
                </button>
            </div>
        </>
    )
}