import * as DAO from "./dao.js";

export async function GetDataServices() {
    const data = await DAO.GetDataDAO();
    return data;
}