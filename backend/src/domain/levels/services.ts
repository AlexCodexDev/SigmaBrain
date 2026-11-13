import * as DAO from "./dao.js";

export async function GetLevelsServices(gameModeId: number) {
    if(!gameModeId) return ({ message: "Game mode tidak diketahui." });

    const data = await DAO.GetLevelsDAO(gameModeId);
    return data;
}