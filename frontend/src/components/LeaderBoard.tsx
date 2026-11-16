import { useEffect } from "react";
import { useGameAudio } from "../hooks/useGameAudio";
import { useNavigate } from "react-router-dom";

export default function LeaderBoardPage() {
    const navigate = useNavigate();
    const {
        playSound,
        unlockAudio
    } = useGameAudio();

    useEffect(() => {
        unlockAudio();
    }, []);

    return (
        <div id="screen-leaderboard" className="screen">
            <div className="w-full max-w-4xl bg-white/95 backdrop-blur-md p-6 md:p-8 rounded-[2.5rem] shadow-2xl border-4 border-indigo-100 flex flex-col items-center relative z-10">
                <h1 className="glitch mb-2 text-center text-4xl" data-text="Papan Peringkat">Papan Peringkat</h1>
                <p className="text-indigo-700 text-xs font-bold mb-6 uppercase tracking-wider">🏆 Peringkat Pemain Lokal Teratas</p>

                <div className="w-full overflow-hidden rounded-2xl border-2 border-indigo-100 shadow-inner mb-6">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-indigo-600 text-white text-sm font-extrabold uppercase">
                                <th className="p-3 text-center">Rank</th>
                                <th className="p-3">Nama Pemain</th>
                                <th className="p-3 text-right">High Score</th>
                            </tr>
                        </thead>
                        <tbody id="leaderboard-tbody" className="divide-y divide-indigo-50 font-bold text-indigo-950 text-sm bg-white">
                        </tbody>
                    </table>
                </div>

                <button
                    onClick={() => {
                        playSound("click");
                        navigate("/lobi");
                    }}
                    className="btn-interactive btn-3d bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold py-3 px-8 rounded-full text-lg shadow-[0_4px_0_#312e81]"
                >
                    ⬅️ Kembali ke Menu
                </button>
            </div>
        </div>
    );
}