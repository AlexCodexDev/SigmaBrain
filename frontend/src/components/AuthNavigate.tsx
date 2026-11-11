import { useLocation, useNavigate } from "react-router-dom";

export default function AuthNavigate() {
    const navigate = useNavigate();
    const location = useLocation();

    const isLogin = location.pathname === "/login";
    const isRegister = location.pathname === "/register";

    const activeClass = "w-1/2 py-2 rounded-lg font-extrabold text-sm transition-all bg-white text-indigo-900 shadow-sm";
    const inActiveClass = "w-1/2 py-2 rounded-lg font-extrabold text-sm transition-all text-indigo-600 hover:text-indigo-900";

    return (
        <div className="flex w-full bg-indigo-100 p-1 rounded-xl mb-4 border border-indigo-200">
            <button type="button" onClick={() => navigate("/login")} className={isLogin ? activeClass : inActiveClass}>Masuk</button>
            <button type="button" onClick={() => navigate("/register")} className={isRegister ? activeClass: inActiveClass}>Daftar Akun</button>
        </div>
    )
}