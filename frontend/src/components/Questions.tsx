import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"
import { Notification } from "./Notification";
import { useGameAudio } from "../hooks/useGameAudio";

interface QuestionRow {
    id: number;
    questionText: string;
    point: number;
    option: string;
    levelName: string;
    levelNo: number;
    answerOptionsId: number;
}

interface Question {
    id: number;
    questionText: string;
    point: number;
    levelName: string;
    levelNo: number;
    options: {
        id: number;
        option: string;
    }[];
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

    const { gameModesId, name, level, session } = location.state;
    const questionType = name.trim().toLowerCase().replace("-", "_");

    function NextQuestion() {
        const nextIndex = currentQuestionIndex + 1;

        if(nextIndex < questionData.length -1) {
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
        point: number
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
                        levelId: level,
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

                Notification(
                    "Jawaban salah!",
                    "warning",
                    false
                );
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
             <div className="screen">
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
        <div id="screen-gameplay" className="screen relative pb-16 justify-start pt-24 z-10">
            <div className="w-full max-w-xl flex justify-between items-center px-6 py-4 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl absolute top-4 left-1/2 transform -translate-x-1/2 border border-indigo-100">
                <h1 id="game-header-title" className="text-lg md:text-xl font-black text-indigo-700 truncate">Level {currentQuestion.levelNo}</h1>
                <div className="flex items-center gap-4">
                    <h2 className="text-xl font-extrabold text-amber-500">⭐ <span id="scoreText">0</span></h2>
                    <button onClick={() => {
                        navigate(-1);
                        playSound("click");
                    }} className="text-xs font-bold text-gray-500 hover:text-red-500 bg-gray-100 px-3 py-1.5 rounded-lg border cursor-pointer">Keluar</button>
                </div>
            </div>
            {!isWin ? (
                <div id="gameArena" className="flex flex-col items-center w-full max-w-lg bg-white/95 backdrop-blur-sm p-6 md:p-8 rounded-[2.5rem] shadow-2xl border-4 border-indigo-50 mt-6 transition-all duration-300">
                    <div className="bg-indigo-50 rounded-full p-4 mb-4 relative border-4 border-indigo-200 shadow-inner group cursor-pointer">
                        <img id="mascot" src="https://api.dicebear.com/7.x/bottts/svg?seed=EduBot&backgroundColor=transparent" alt="Maskot" className="w-24 h-24 bounce-anim transition-all duration-300" />
                        <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">Kilik aku!</span>
                    </div>

                    <div className="bg-indigo-100/80 p-5 rounded-2xl mb-6 relative w-full text-center border-2 border-indigo-300 text-2xl font-extrabold text-indigo-950 shadow-sm">
                        <span id="question-text">{currentQuestion.questionText}</span>
                        <div className="absolute w-4 h-4 bg-indigo-100/80 border-t-2 border-l-2 border-indigo-300 transform rotate-45 -top-2.5 left-1/2 -ml-2"></div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 w-full">
                        {currentQuestion.options.map((item: any, index: number) => (
                            <button
                                key={item.id}
                                onClick={
                                    () => {
                                        CheckAnswer(
                                            currentQuestion.id,
                                            item.option,
                                            item.id,
                                            currentQuestion.point
                                        );
                                        playSound("click");
                                    }
                                }
                                className={`
                                    ${index === 0 ? "bg-[#f87171]" : index === 1 ? "bg-[#4ade80]" : index === 2 ? "bg-[#60a5fa]" : "bg-[#fbbf24]"}
                                    btn-interactive btn-3d text-white font-black py-4 rounded-2xl text-2xl shadow-[0_5px_0_#b91c1c] cursor-pointer
                                `}
                            >
                                {item.option}
                            </button>
                        ))}
                    </div>
                </div>
            ): (
                <div id="winScreen" className="flex-col items-center mt-8 text-center animate-fade-in">
                    <h2 className="text-4xl md:text-5xl font-black text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.4)] mb-2 animate-bounce">
                        🎉 LUAR BIASA! 🎉
                    </h2>
                    <button
                        onClick={() => {
                            NextQuestion;
                            playSound("click");
                        }}
                        className="btn-interactive btn-3d bg-yellow-400 text-yellow-950 font-black py-4 px-10 rounded-full text-2xl shadow-[0_6px_0_#b45309] hover:bg-yellow-300 mt-4"
                    >
                        {currentQuestionIndex < questionData.length - 1
                            ? "Lanjut Soal ➡️"
                            : "Selesaikan permainan 🏆"
                        }
                    </button>
                </div>
            )}
        </div>
    )
}