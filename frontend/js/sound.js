let audioEnabled = localStorage.getItem('sigma_audio') !== 'false';
let audioContext = null;

function initAudio() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
}

function playSound(type) {
    if (!audioEnabled) return;
    initAudio();

    if (AUDIO_MAP[type] && AUDIO_MAP[type].trim() !== "") {
        const audio = new Audio(AUDIO_MAP[type]);
        audio.play().catch(e => console.log("Audio error:", e));
        return;
    }

    if (!audioContext) return;
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    osc.connect(gain);
    gain.connect(audioContext.destination);

    const now = audioContext.currentTime;

    if (type === 'click') {
        osc.frequency.setValueAtTime(450, now);
        osc.frequency.exponentialRampToValueAtTime(180, now + 0.05);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
    } else if (type === 'correct') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.setValueAtTime(659.25, now + 0.09);
        osc.frequency.setValueAtTime(783.99, now + 0.18);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
    } else if (type === 'wrong') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.setValueAtTime(140, now + 0.15);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
    } else if (type === 'win') {
        [440, 554, 659, 880].forEach((freq, idx) => {
            const nOsc = audioContext.createOscillator();
            const nGain = audioContext.createGain();
            nOsc.connect(nGain);
            nGain.connect(audioContext.destination);
            nOsc.frequency.setValueAtTime(freq, now + (idx * 0.08));
            nGain.gain.setValueAtTime(0.2, now + (idx * 0.08));
            nGain.gain.linearRampToValueAtTime(0.01, now + (idx * 0.08) + 0.25);
            nOsc.start(now + (idx * 0.08));
            nOsc.stop(now + (idx * 0.08) + 0.25);
        });
    } else if (type === 'nightmare') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(80, now);
        osc.frequency.exponentialRampToValueAtTime(30, now + 0.8);
        gain.gain.setValueAtTime(0.5, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.8);
        osc.start(now);
        osc.stop(now + 0.8);
    }
}

const AUDIO_MAP = {
    click: "",
    correct: "",     
    wrong: "",       
    win: "",         
    nightmare: "",   
};

function toggleAudio() {
    audioEnabled = !audioEnabled;
    localStorage.setItem('sigma_audio', audioEnabled);
    document.getElementById('btn-sound-toggle').innerText = audioEnabled ? "🔊" : "🔇";
    playSound('click');
}

window.addEventListener('DOMContentLoaded', () => {
    const soundBtn = document.getElementById('btn-sound-toggle');
    if (soundBtn) soundBtn.innerText = audioEnabled ? "🔊" : "🔇";
    checkSavedSession();
});