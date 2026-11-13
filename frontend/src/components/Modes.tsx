import { useEffect, useState } from "react";
import { Notification } from "./Notification";
import { useLocation, useNavigate } from "react-router-dom";

interface GameModesProps {
    id: number;
    name: string;
}

export default function ModesPage() {
    const navigate = useNavigate();
    const location = useLocation();

    const pathname = location.pathname.split("/")[1];

    const [loading, setLoading] = useState(true);
    const [gameModesData, setGameModesData] = useState<GameModesProps[]>([]);

    async function getGameModes() {
        try {
            const response = await fetch(
                "http://localhost:3000/api/game-modes/fetch",
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

    useEffect(() => {
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
            <div className="screen">
                <h1 className="glitch mb-10 text-center text-4xl" data-text="Pilih Kesulitan">Pilih Kesulitan</h1>
                
                <div className="flex flex-col gap-5 w-full max-w-sm relative z-10">
                    {gameModesData.map((item: any, index: number) => (
                        <button
                            key={index}
                            onClick={() => navigate(`/${pathname}/tingkat`, { state: { difficulty: item.name, gameModeId: item.id } })}
                            className={`
                                ${item.name === "easy" ? "bg-green-500 hover:bg-green-600" : ""}
                                ${item.name === "medium" ? "bg-yellow-500 hover:bg-yellow-600" : ""}
                                ${item.name === "hard" ? "bg-orange-500 hover:bg-orange-600" : ""}
                                ${item.name === "master" ? "bg-red-500 hover:bg-red-600" : ""}
                                btn-interactive btn-3d text-white font-bold py-5 rounded-2xl text-2xl shadow-[0_6px_0_#991b1b] flex items-center justify-center gap-2
                            `}
                        >
                            {item.name}
                        </button>
                    ))}
                    <button
                        onClick={() => navigate(-1)}
                        className="mt-4 text-indigo-800 bg-white/70 py-3 rounded-full font-bold text-lg hover:bg-white backdrop-blur-sm transition-all shadow"
                    >
                        ⬅️ Kembali ke Menu
                    </button>
                </div>
            </div>
        </>
    )
}