import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function LobbyPage() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    async function handleLogout() {
        await logout();
        
        navigate("/login", { replace: true });
    }

    return (
        <div id="screen-home" className="screen">
            <h1></h1>
            <div className="absolute top-4 left-4 z-20 flex items-center gap-3">
                <div className="flex items-center gap-2 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full border border-indigo-100 shadow-md">
                    <span className="text-xl">👤</span>
                    <div>
                        <span id="user-display-name" className="font-extrabold text-indigo-900 block leading-tight">{user?.username}</span>
                        <span className="text-[10px] text-amber-600 font-black uppercase tracking-wider">🏆 Highscore: <span id="user-high-score">0</span></span>
                    </div>
                    <button
                        onClick={handleLogout}
                        title="Keluar Akun"
                        className="ml-2 text-xs bg-red-100 text-red-600 px-2 py-1 rounded-md hover:bg-red-200 font-extrabold transition-all"
                    >
                        Logout
                    </button>
                </div>
                
                <button className="btn-3d bg-yellow-400 hover:bg-yellow-500 text-yellow-950 font-black p-3 rounded-full shadow-md text-xl border-2 border-white flex items-center justify-center">
                    🏆
                </button>
            </div>

            <h1 className="glitch mb-2 text-center" data-text="SigmaBrain">SigmaBrain</h1>
            <p className="text-xl text-indigo-700 mb-8 font-bold text-center bg-white/75 px-6 py-2 rounded-full backdrop-blur-md shadow-sm border border-indigo-100">
                🧠 Pilih tantangan belajarmu hari ini!
            </p>
            
            <div className="flex flex-col gap-5 w-full max-w-sm relative z-10">
                <button
                    onClick={() => navigate("/matematika/tingkat")}
                    className="btn-interactive btn-3d bg-blue-500 hover:bg-blue-600 text-white font-extrabold py-5 rounded-2xl text-2xl shadow-[0_6px_0_#1e3a8a] flex items-center justify-center gap-3"
                >
                    <span>🧮</span> Menghitung
                </button>
                <button
                    onClick={() => navigate("pilih-bahasa")}
                    className="btn-interactive btn-3d bg-pink-500 hover:bg-pink-600 text-white font-extrabold py-5 rounded-2xl text-2xl shadow-[0_6px_0_#9d174d] flex items-center justify-center gap-3"
                >
                    <span>📚</span> Bahasa
                </button>
            </div>
        </div>
    );
}