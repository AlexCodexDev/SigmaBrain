import * as DAO from "./dao.js";

export async function CheckSessionService(userId: number, gameModesId: number) {
    const data = await DAO.CheckSessionsDAO(userId, gameModesId);
    return data;
}

export async function GetLeaderBoardServices() {
    const data = await DAO.GetLeaderBoardDAO();
    return data;
}

export async function GetScoreUserServices(user: number) {
    const data = await DAO.GetScoreUserDAO(user);
    return data;
}