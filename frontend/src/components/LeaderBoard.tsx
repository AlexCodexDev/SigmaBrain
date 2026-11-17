import { useEffect, useState } from "react";
import { useGameAudio } from "../hooks/useGameAudio";
import { useNavigate } from "react-router-dom";
import { Notification } from "./Notification";

interface RankingProps {
    username: string;
    score: number;
}

export default function LeaderBoardPage() {
    const navigate = useNavigate();
    const {
        playSound,
        unlockAudio
    } = useGameAudio();

    const [ranking, setRanking] = useState<RankingProps[]>([]);

    // START: Fetch
    async function fetchLeaderBoard() {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/sessions/leaderboard`
            );

            if(!response.ok) {
                Notification(
                    "Gagal mengambil data.",
                    "error",
                    false
                );
            }

            const data: RankingProps[] = await response.json();

            setRanking(data);
        } catch (error: any) {
            Notification(
                error.message,
                "error",
                false
            );
        }
    }
    // END: Fetch

    useEffect(() => {
        unlockAudio();
        fetchLeaderBoard();
    }, []);

    return (
        <div className="screen">
            <div className="w-full max-w-2xl h-screen bg-white/95 backdrop-blur-md p-6 md:p-8 rounded-[2.5rem] shadow-2xl border-4 border-indigo-100 flex flex-col items-center relative z-10">
                <h1 className="glitch mb-2 text-center text-4xl" data-text="Papan Peringkat">Papan Peringkat</h1>
                <p className="text-indigo-700 text-md font-bold mb-6 uppercase tracking-wider">🏆 Peringkat Pemain Teratas</p>

                <div className="w-full max-h-full overflow-y-auto rounded-2xl border-2 border-indigo-100 shadow-inner mb-6">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-indigo-600 text-white text-sm font-extrabold uppercase">
                                <th className="p-3 text-center">Rank</th>
                                <th className="p-3">Nama Pemain</th>
                                <th className="p-3 text-right">High Score</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-indigo-50 font-bold text-indigo-950 text-md bg-white">
                            {ranking?.map((item: any, index: number) => (
                                <tr key={index} className="h-10">
                                    <td className="text-center">{index + 1}</td>
                                    <td className="px-3">{item.username}</td>
                                    <td className="text-end px-3">{item.score}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <button
                    onClick={() => {
                        playSound("click");
                        navigate("/beranda");
                    }}
                    className="btn-interactive btn-3d bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold py-3 px-8 rounded-full text-lg shadow-[0_4px_0_#312e81]"
                >
                    ⬅️ Kembali ke Menu
                </button>
            </div>
        </div>
    );
}