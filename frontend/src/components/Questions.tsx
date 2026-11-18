import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"
import { Notification } from "./Notification";
import { useGameAudio } from "../hooks/useGameAudio";
import nightmareBackground from "../assets/FireFrame.mp4";

interface QuestionRow {
    id: number;
    questionText: string;
    point: number;
    option: string;
    levelId: number;
    levelName: string;
    levelNo: number;
    answerOptionsId: number;
}

interface Question {
    id: number;
    questionText: string;
    point: number;
    levelId: number;
    levelName: string;
    levelNo: number;
    options: {
        id: number;
        option: string;
    }[];
}

interface EmberParticle {
    x: number;
    y: number;
    size: number;
    speedY: number;
    speedX: number;
    opacity: number;
    color: string;
    wobble: number;
}

export default function QuestionPage() {
    const navigate = useNavigate();
    const location = useLocation();

    const {
        playSound,
        unlockAudio
    } = useGameAudio();

    const [loading, setLoading] = useState(true);
    const [questionData, setQuestionData] = useState<Question[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [isWin, setIsWin] = useState(false);
    const [isFinished, setIsFinished] = useState(false);
    const currentQuestion = questionData[currentQuestionIndex];

    const emberCanvasRef = useRef<HTMLCanvasElement>(null);
    const lightningFlashRef = useRef<HTMLDivElement>(null);

    const { gameModesId, name, level, session, difficulty } = location.state;
    const isNightmare = String(difficulty).toLowerCase() === "nightmare";
    const questionType = name.trim().toLowerCase().replace("-", "_");

    function NextQuestion() {
        const nextIndex = currentQuestionIndex + 1;

        if(nextIndex < questionData.length) {
            setCurrentQuestionIndex(nextIndex);
            setIsWin(false);
        } else {
            playSound("win");
            setIsFinished(true);
        }
    }

    // START: Fetch data
    async function getQuestions() {
        try {
            const params = new URLSearchParams({
                gameModesId: String(gameModesId),
                questionType,
                startLevelId: String(level),
                endLevel: "30"
            });

            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/questions/fetch?${params}`
            );

            if(!response.ok) {
                Notification(
                    "Gagal mengambil data.",
                    "error",
                    false
                );
            }

            const data: QuestionRow[] = await response.json();

            const groupedQuestions = new Map<number, Question>();

            data.forEach((item) => {
                if(!groupedQuestions.has(item.id)) {
                    groupedQuestions.set(item.id, {
                        id: item.id,
                        questionText: item.questionText,
                        point: item.point,
                        levelId: item.levelId,
                        levelName: item.levelName,
                        levelNo: item.levelNo,
                        options: []
                    });
                }

                groupedQuestions.get(item.id)!.options.push({
                    id: item.answerOptionsId,
                    option: item.option
                });
            });

            const groupedData = Array.from(groupedQuestions.values());

            setQuestionData(groupedData);
            setCurrentQuestionIndex(0);
        } catch (error: any) {
            Notification(
                error.message,
                "error",
                false
            )
        } finally {
            setLoading(false);
        }
    }
    // END: Fetch data
    
    // START: Submit answer
    async function CheckAnswer(
        id: number,
        answer: string,
        answerOptionId: number,
        point: number,
        levelId: number
    ) {
        try {
            unlockAudio();

            setLoading(true);

            const params = new URLSearchParams({
                answer: answer
            });

            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/answer/check/${id}?${params}`
            );

            if(!response.ok) {
                Notification(
                    "Gagal menggecek jawaban.",
                    "error",
                    false
                );
            }

            const data = await response.json();
            const isCorrect = data[0]?.isCorrect;

            if (typeof isCorrect !== "boolean") {
                throw new Error("Data jawaban tidak ditemukan.");
            }

            const submitResponse = await fetch(
                `${import.meta.env.VITE_API_URL}/answer/submit`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        gameSessionId: session,
                        questionId: id,
                        answerOptionId: answerOptionId,
                        levelId: levelId,
                        isCorrect: isCorrect ? true : false,
                        point: point
                    })
                }
            );

            if(!submitResponse.ok) {
                Notification(
                    "Gagal menyimpan jawaban.",
                    "error",
                    false
                );
            }

            if(!isCorrect) {
                playSound("wrong");
            } else {
                playSound("correct");
                setIsWin(true);
            }
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
    // END: Submit answer

    useEffect(() => {
        getQuestions();
    }, []);

    useEffect(() => {
        if (!isNightmare) return;

        playSound("nightmare");

        const canvas = emberCanvasRef.current;
        const ctx = canvas?.getContext("2d");

        if (!canvas || !ctx) return;

        let animationId = 0;
        let lightningTimeout: number | undefined;
        let flashTimeout: number | undefined;

        let canvasWidth = window.innerWidth;
        let canvasHeight = window.innerHeight;

        const colors = [
            "#ff2a00",
            "#ff7700",
            "#ffdd00",
            "#ff0055"
        ];

        let particles: EmberParticle[] = [];

        // Mengatur ukuran canvas
        function resizeCanvas() {
            const pixelRatio = Math.min(
                window.devicePixelRatio || 1,
                2
            );

            canvasWidth = window.innerWidth;
            canvasHeight = window.innerHeight;

            canvas!.width = canvasWidth * pixelRatio;
            canvas!.height = canvasHeight * pixelRatio;

            canvas!.style.width = `${canvasWidth}px`;
            canvas!.style.height = `${canvasHeight}px`;

            ctx!.setTransform(
                pixelRatio,
                0,
                0,
                pixelRatio,
                0,
                0
            );
        }

        // Membuat partikel bara api
        function createParticles() {
            particles = Array.from({ length: 120 }, () => ({
                x: Math.random() * canvasWidth,
                y: Math.random() * canvasHeight,
                size: Math.random() * 4 + 1.5,
                speedY: Math.random() * 3 + 2,
                speedX: (Math.random() - 0.5) * 2,
                opacity: Math.random() * 0.8 + 0.2,
                color: colors[
                    Math.floor(Math.random() * colors.length)
                ],
                wobble: Math.random() * Math.PI * 2
            }));
        }

        // Animasi partikel
        function renderEmberStorm() {
            ctx!.clearRect(
                0,
                0,
                canvasWidth,
                canvasHeight
            );

            particles.forEach((particle) => {
                particle.y -= particle.speedY;

                particle.wobble += 0.04;

                particle.x +=
                    Math.sin(particle.wobble) * 1.5 +
                    particle.speedX;

                if (particle.y < -10) {
                    particle.y = canvasHeight + 10;
                    particle.x = Math.random() * canvasWidth;
                }

                ctx!.beginPath();

                ctx!.arc(
                    particle.x,
                    particle.y,
                    particle.size,
                    0,
                    Math.PI * 2
                );

                ctx!.fillStyle = particle.color;
                ctx!.globalAlpha = particle.opacity;

                ctx!.shadowBlur = 12;
                ctx!.shadowColor = particle.color;

                ctx!.fill();
            });

            ctx!.globalAlpha = 1;
            ctx!.shadowBlur = 0;

            animationId = requestAnimationFrame(
                renderEmberStorm
            );
        }

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

        // Inisialisasi
        resizeCanvas();
        createParticles();

        window.addEventListener("resize", resizeCanvas);

        renderEmberStorm();
        scheduleLightning();

        // Cleanup ketika keluar Nightmare
        return () => {
            window.removeEventListener("resize", resizeCanvas);

            cancelAnimationFrame(animationId);

            if (lightningTimeout !== undefined) {
                clearTimeout(lightningTimeout);
            }

            if (flashTimeout !== undefined) {
                clearTimeout(flashTimeout);
            }

            ctx.clearRect(
                0,
                0,
                canvasWidth,
                canvasHeight
            );

            ctx.globalAlpha = 1;
            ctx.shadowBlur = 0;

            lightningFlashRef.current?.classList.remove(
                "flash-active"
            );
        };

    }, [isNightmare]);

    if(loading) {
        return (
            <div className="screen">
                <h1
                    className="glitch mb-8 text-center text-4xl capitalize"
                    data-text="Memuat level..."
                >
                    Memuat pertanyaan...
                </h1>
            </div>
        );
    };

    if(isFinished) {
        return (
             <div className="screen justify-center">
                <div className="text-center animate-fade-in">
                    <h1 className="text-4xl font-black text-white">
                        🏆 PERMAINAN SELESAI!
                    </h1>

                    <p className="text-white mt-3">
                        Selamat! Kamu telah menyelesaikan semua soal.
                    </p>

                    <button
                        onClick={() => {
                            navigate(-1);
                            playSound("click");
                        }}
                        className="btn-interactive bg-yellow-400 text-yellow-950 font-black py-4 px-10 rounded-full mt-6"
                    >
                        Kembali
                    </button>
                </div>
            </div>
        );
    }

    if (!currentQuestion) {
        return (
            <div className="screen">
                <h1
                    className="glitch mb-8 text-center text-4xl capitalize"
                    data-text="Tidak ada pertanyaan tersedia."
                >
                    Tidak ada pertanyaan tersedia.
                </h1>
                <button
                    onClick={() => {
                        navigate(-1);
                        playSound("click");
                    }}
                    className="mt-8 bg-white/90 text-indigo-800 font-bold py-3 px-8 rounded-full shadow-lg hover:bg-white text-lg transition-all backdrop-blur-sm relative z-10 cursor-pointer"
                >
                ⬅️ Kembali
            </button>
            </div>
        );
    }

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
                        className="absolute inset-0 z-30"
                    />

                    {/* Blood vignette */}
                    <div className="blood-vignette absolute inset-0 z-40" />
                </div>
            )}

            <div
                className={`screen relative z-10 w-full min-h-dvh overflow-y-auto overflow-x-hidden justify-start items-center px-4 pt-24 pb-10 md:justify-center ${isNightmare ? "text-white nightmare-enter" : ""}`}
                style={isNightmare ? { background: "transparent" } : undefined}
            >
                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-xl">
                    <div className="w-full max-w-xl flex justify-between items-center px-6 py-4 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl absolute top-4 left-1/2 transform -translate-x-1/2 border border-indigo-100">
                        <h1 id="game-header-title" className="text-xl font-black text-indigo-700 truncate">Level {currentQuestion.levelNo}</h1>
                        <div className="flex items-center gap-4">
                            <h2 className="text-xl font-extrabold text-amber-500">⭐ <span id="scoreText">{currentQuestion.point}</span></h2>
                            <button onClick={() => {
                                navigate(-1);
                                playSound("click");
                            }} className="text-sm font-bold text-gray-500 hover:text-red-500 bg-gray-100 px-3 py-1.5 rounded-lg border cursor-pointer md:text-xs">Keluar</button>
                        </div>
                    </div>
                </div>
                {!isWin ? (
                    <div
                        id="gameArena"
                        className={`
                            flex flex-col items-center w-full max-w-4xl backdrop-blur-sm p-6 md:p-8 rounded-[2.5rem] mt-6 transition-all duration-300 border-4
                            ${
                                isNightmare
                                    ? "bg-gray-950/90 border-red-900 shadow-[0_0_35px_rgba(220,38,38,0.25)]"
                                    : "bg-white/95 border-indigo-50 shadow-2xl"
                            }
                        `}
                    >
                        <div
                            className={
                                `rounded-full p-4 mb-4 relative border-4 shadow-inner
                                ${
                                    isNightmare
                                        ? "bg-red-950 border-red-800 shadow-[0_0_20px_rgba(220,38,38,0.4)]"
                                        : "bg-indigo-50 border-indigo-200"
                                }
                            `}
                        >
                            <img id="mascot" src="https://api.dicebear.com/7.x/bottts/svg?seed=EduBot&backgroundColor=transparent" alt="Maskot" className="w-24 h-24 bounce-anim transition-all duration-300" />
                        </div>

                        <div
                            className={`
                                p-5 rounded-2xl mb-6 relative w-full text-center border-2 text-2xl font-extrabold shadow-sm
                                ${
                                    isNightmare
                                        ? "bg-red-950/80 border-red-800 text-red-100 shadow-[0_0_20px_rgba(220,38,38,0.15)]"
                                        : "bg-indigo-100/80 border-indigo-300 text-indigo-950"
                                }
                            `}
                        >
                            <span id="question-text">{currentQuestion.questionText}</span>
                            <div
                                className={`
                                    absolute w-4 h-4 border-t-2 border-l-2 transform rotate-45 -top-2.5 left-1/2 -ml-2
                                    ${
                                        isNightmare
                                            ? "bg-red-950 border-red-800"
                                            : "bg-indigo-100 border-indigo-300"
                                    }
                                `}
                            ></div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 w-full md:grid-cols-2">
                            {currentQuestion.options.map((item: any, index: number) => (
                                <button
                                    key={item.id}
                                    onClick={
                                        () => {
                                            CheckAnswer(
                                                currentQuestion.id,
                                                item.option,
                                                item.id,
                                                currentQuestion.point,
                                                currentQuestion.levelId
                                            );
                                            playSound("click");
                                        }
                                    }
                                    className={`
                                        ${
                                            isNightmare
                                                ? index === 0
                                                    ? "bg-red-900 hover:bg-red-800 shadow-[0_5px_0_#450a0a]"
                                                    : index === 1
                                                        ? "bg-orange-900 hover:bg-orange-800 shadow-[0_5px_0_#431407]"
                                                        : index === 2
                                                            ? "bg-purple-900 hover:bg-purple-800 shadow-[0_5px_0_#3b0764]"
                                                            : "bg-gray-800 hover:bg-gray-700 shadow-[0_5px_0_#111827]"
                                                : index === 0
                                                    ? "bg-[#f87171] shadow-[0_5px_0_#b91c1c]"
                                                    : index === 1
                                                        ? "bg-[#4ade80] shadow-[0_5px_0_#15803d]"
                                                        : index === 2
                                                            ? "bg-[#60a5fa] shadow-[0_6px_0_#1d4ed8]"
                                                            : "bg-[#fbbf24] shadow-[0_5px_0_#b45309]"
                                        }
                                        btn-interactive btn-3d text-white font-black py-4
                                        rounded-2xl text-2xl cursor-pointer
                                    `}
                                >
                                    {item.option}
                                </button>
                            ))}
                        </div>
                    </div>
                ): (
                    <div
                        id="winScreen"
                        className="flex flex-col items-center mt-8 text-center animate-fade-in"
                    >
                        <h2 className={`
                            text-4xl md:text-5xl font-black mb-2 animate-bounce
                            ${
                                isNightmare
                                    ? "text-red-500 drop-shadow-[0_0_15px_rgba(220,38,38,0.8)]"
                                    : "text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.4)]"
                            }
                        `}>
                            {isNightmare ? "☠️ LUAR BIASA! ☠️" : "🎉 LUAR BIASA! 🎉"}
                        </h2>

                        <button
                            type="button"
                            onClick={() => {
                                playSound("click");
                                NextQuestion();
                            }}
                            className={`
                                btn-interactive btn-3d font-black py-4 px-10
                                rounded-full text-2xl mt-4
                                ${
                                    isNightmare
                                        ? "bg-red-700 text-white shadow-[0_6px_0_#450a0a] hover:bg-red-600"
                                        : "bg-yellow-400 text-yellow-950 shadow-[0_6px_0_#b45309] hover:bg-yellow-300"
                                }
                            `}
                        >
                            {currentQuestionIndex < questionData.length - 1
                                ? "Lanjut Soal ➡️"
                                : "Selesaikan permainan 🏆"
                            }
                        </button>
                    </div>
                )}
            </div>
        </>
    )
}