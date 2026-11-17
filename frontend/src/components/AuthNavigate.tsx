import { useLocation, useNavigate } from "react-router-dom";
import { useGameAudio } from "../hooks/useGameAudio";
import { useEffect } from "react";

export default function AuthNavigate() {
    const navigate = useNavigate();
    const location = useLocation();

    const {
        playSound,
        unlockAudio
    } = useGameAudio();

    const isLogin = location.pathname === "/masuk";
    const isRegister = location.pathname === "/daftar";

    const activeClass = "w-1/2 py-2 rounded-lg font-extrabold text-sm transition-all bg-white text-indigo-900 shadow-sm cursor-pointer";
    const inActiveClass = "w-1/2 py-2 rounded-lg font-extrabold text-sm transition-all text-indigo-600 hover:text-indigo-900 cursor-pointer";

    useEffect(() => {
        unlockAudio();
    }, []);

    return (
        <div className="flex w-full bg-indigo-100 p-1 rounded-xl mb-4 border border-indigo-200">
            <button
                type="button"
                onClick={() => {
                navigate("/masuk");
                    playSound("click");
                }}
                className={isLogin ? activeClass : inActiveClass}
            >
                Masuk
            </button>
            <button
                type="button"
                onClick={() => {
                    navigate("/daftar");
                    playSound("click");
                }}
                className={isRegister ? activeClass: inActiveClass}
            >
                Daftar Akun
            </button>
        </div>
    )
}