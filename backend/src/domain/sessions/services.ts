import * as DAO from "./dao.js";

export async function CheckSessionService(userId: number, gameModesId: number, levelId: number) {
    const data = await DAO.CheckSessionsDAO(userId, gameModesId, levelId);
    return data;
}