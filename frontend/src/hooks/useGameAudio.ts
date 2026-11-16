
import { useRef, useState } from "react";

type SoundType =
    | "click"
    | "correct"
    | "wrong"
    | "win"
    | "nightmare";

// File audio eksternal (opsional)
const AUDIO_MAP: Record<SoundType, string> = {
    click: "",
    correct: "",
    wrong: "",
    win: "",
    nightmare: "",
};

export function useGameAudio() {
    // Audio context
    const audioContextRef = useRef<AudioContext | null>(null);

    // Status audio
    const [audioEnabled, setAudioEnabled] = useState(() => {
        return localStorage.getItem("sigma_audio") !== "false";
    });

    const audioEnabledRef = useRef(audioEnabled);

    // Membuat AudioContext
    function initAudio(): AudioContext | null {
        if (!audioContextRef.current) {
            audioContextRef.current = new AudioContext();
        }

        return audioContextRef.current;
    }

    // Aktifkan audio setelah interaksi pengguna
    function unlockAudio() {
        if (!audioEnabledRef.current) return;

        const context = initAudio();

        if (context?.state === "suspended") {
            void context.resume().catch(console.error);
        }
    }

    // Membuat suara menggunakan oscillator
    function playOscillator(
        context: AudioContext,
        type: SoundType
    ) {
        const now = context.currentTime;

        const osc = context.createOscillator();
        const gain = context.createGain();

        osc.connect(gain);
        gain.connect(context.destination);

        if (type === "click") {
            osc.frequency.setValueAtTime(450, now);
            osc.frequency.exponentialRampToValueAtTime(180, now + 0.05);

            gain.gain.setValueAtTime(0.2, now);
            gain.gain.linearRampToValueAtTime(0.01, now + 0.05);

            osc.start(now);
            osc.stop(now + 0.05);

        } else if (type === "correct") {
            osc.type = "triangle";

            osc.frequency.setValueAtTime(523.25, now);
            osc.frequency.setValueAtTime(659.25, now + 0.09);
            osc.frequency.setValueAtTime(783.99, now + 0.18);

            gain.gain.setValueAtTime(0.25, now);
            gain.gain.linearRampToValueAtTime(0.01, now + 0.35);

            osc.start(now);
            osc.stop(now + 0.35);

        } else if (type === "wrong") {
            osc.type = "sawtooth";

            osc.frequency.setValueAtTime(220, now);
            osc.frequency.setValueAtTime(140, now + 0.15);

            gain.gain.setValueAtTime(0.3, now);
            gain.gain.linearRampToValueAtTime(0.01, now + 0.3);

            osc.start(now);
            osc.stop(now + 0.3);

        } else if (type === "nightmare") {
            osc.type = "sawtooth";

            osc.frequency.setValueAtTime(80, now);
            osc.frequency.exponentialRampToValueAtTime(30, now + 0.8);

            gain.gain.setValueAtTime(0.5, now);
            gain.gain.linearRampToValueAtTime(0.01, now + 0.8);

            osc.start(now);
            osc.stop(now + 0.8);

        } else if (type === "win") {
            osc.disconnect();
            gain.disconnect();

            [440, 554, 659, 880].forEach((freq, idx) => {
                const nOsc = context.createOscillator();
                const nGain = context.createGain();

                const start = now + idx * 0.08;

                nOsc.connect(nGain);
                nGain.connect(context.destination);

                nOsc.frequency.setValueAtTime(freq, start);

                nGain.gain.setValueAtTime(0.2, start);
                nGain.gain.linearRampToValueAtTime(
                    0.01,
                    start + 0.25
                );

                nOsc.start(start);
                nOsc.stop(start + 0.25);
            });
        }
    }

    // Memainkan suara
    function playSound(type: SoundType) {
        if (!audioEnabledRef.current) return;

        const audioPath = AUDIO_MAP[type];

        // Menggunakan file audio eksternal jika tersedia
        if (audioPath.trim() !== "") {
            const audio = new Audio(audioPath);

            audio.volume = 0.8;

            void audio.play().catch(error => {
                console.error("Audio error:", error);
            });

            return;
        }

        const context = initAudio();

        if (!context) return;

        if (context.state === "suspended") {
            void context.resume()
                .then(() => {
                    playOscillator(context, type);
                })
                .catch(console.error);

            return;
        }

        playOscillator(context, type);
    }

    // Toggle audio
    function toggleAudio() {
        const next = !audioEnabledRef.current;

        audioEnabledRef.current = next;
        setAudioEnabled(next);

        localStorage.setItem("sigma_audio", String(next));

        if (next) {
            unlockAudio();
            playSound("click");
        }
    }

    return {
        audioEnabled,
        playSound,
        toggleAudio,
        unlockAudio
    };
}
