function changeScreen(targetId) {
    playSound('click');
    document.querySelectorAll('.screen').forEach(screen => screen.classList.remove('active'));
    document.getElementById(targetId).classList.add('active');
    
    if (targetId !== 'screen-gameplay') resetArena();
    if (targetId === 'screen-home' || targetId === 'screen-bahasa' || targetId === 'screen-login') {
        deactivateNightmare();
        streak = 0;
        updateStreakUI();
        updateUserUI();
    }
}