import * as DAO from "./dao.js";

export async function GetLevelsServices(
    gameModesId: number,
    gameSessionId: number
) {
    if(!gameModesId) return ({ message: "Game mode tidak diketahui." });

    const data = await DAO.GetLevelsDAO(gameModesId, gameSessionId);
    return data;
}