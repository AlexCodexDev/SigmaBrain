const difficulties = [
    { gameModesId: 1, name: "easy" },
    { gameModesId: 2, name: "medium" },
    { gameModesId: 3, name: "hard" },
    { gameModesId: 4, name: "master" }
];

export const levelData = Array.from(
    { length: 30 },
    (_, index) => {
        const level = index + 1;

        return difficulties.map(item => ({
            ...item,
            level: index
        }));
    }
).flat();