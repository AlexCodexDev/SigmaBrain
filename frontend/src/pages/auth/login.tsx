import { useState } from "react";
import AuthNavigate from "../../components/AuthNavigate";
import { Notification } from "../../components/Notification";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

interface LoginForm {
    email: string;
    password: string;
}

export default function LoginPage() {
    const navigate = useNavigate();
    const { checkAuth } = useAuth();

    // START: ClassName Declaration
    const inputClass = "w-full px-4 py-3 rounded-xl border-2 border-indigo-200 focus:border-indigo-500 focus:outline-none text-indigo-950 font-bold transition-all bg-indigo-50/50";
    const labelClass = "block text-indigo-950 font-extrabold mb-1 text-xs uppercase tracking-wider";
    // END: ClassName Declaration

    // START: Form Declaration
    const [form, setForm] = useState<LoginForm>({
        email: "",
        password: ""
    });
    const [loading, setLoading] = useState(false);
    // END: Form Declaration

    // START: Handle Form
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    }

    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        setLoading(true);

        try {
            const response = await fetch(
                "http://localhost:3000/api/auth/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: "include",
                    body: JSON.stringify(form)
                },
            )

            const result = await response.json();

            if(!response.ok) {
                Notification(
                    result || "Login gagal!",
                    "error",
                    false
                );

                return;
            }

            await checkAuth();

            Notification(
                result.message,
                "success",
                false
            );

            setForm({
                email: "",
                password: ""
            });

            navigate("/lobby", { replace: true });
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
    // END: Handle Form

    return (
        <div id="screen-login" className="screen">
            <div className="w-full max-w-md bg-white/90 backdrop-blur-md p-8 rounded-[2.5rem] shadow-2xl border-4 border-indigo-100 flex flex-col items-center relative z-10">
                <div className="bg-indigo-50 rounded-full p-3 mb-2 border-4 border-indigo-200 shadow-inner">
                    <img src="https://api.dicebear.com/7.x/bottts/svg?seed=LoginBot&backgroundColor=transparent" alt="Avatar" className="w-20 h-20 bounce-anim" />
                </div>

                <h1 className="glitch mb-1 text-center text-3xl" data-text="SigmaBrain">SigmaBrain</h1>
                <p className="text-indigo-800 mb-4 text-center font-bold text-sm">Sistem Pembelajaran & Database Lokal Browser</p>

                <AuthNavigate />

                <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3">
                    <div>
                        <label className={labelClass}>Email Pemain</label>
                        <input
                            type="email"
                            name="email"
                            required
                            placeholder="Contoh: michaelgamers@gmail.com"
                            autoComplete="off"
                            className={inputClass}
                            value={form.email}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label className={labelClass}>Kata Sandi</label>
                        <input
                            type="password"
                            name="password"
                            required
                            placeholder="••••••••"
                            autoComplete="off"
                            className={inputClass}
                            value={form.password}
                            onChange={handleChange}
                        />
                    </div>
                    
                    <button
                        type="submit"
                        className="mt-2 w-full btn-interactive btn-3d bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-xl text-xl shadow-[0_5px_0_#312e81] cursor-pointer"
                        disabled={loading}
                    >
                        {loading ? "Loading..." : "🚀 Masuk & Main"}
                    </button>
                </form>

                <div className="w-full flex items-center my-4">
                    <div className="grow border-t border-indigo-200"></div>
                    <span className="px-3 text-xs text-indigo-400 font-bold uppercase">atau</span>
                    <div className="grow border-t border-indigo-200"></div>
                </div>

                <button
                    type="button"
                    className="w-full btn-interactive btn-3d bg-amber-400 hover:bg-amber-500 text-amber-950 font-extrabold py-3 rounded-xl text-lg shadow-[0_4px_0_#b45309] cursor-pointer"
                >
                    🎮 Main sebagai Tamu (Guest)
                </button>
            </div>
        </div>
    );
}