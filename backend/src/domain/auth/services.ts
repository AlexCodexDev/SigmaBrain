import * as DAO from "./dao.js";

export async function RegisterServices(username: string, email: string, password: string) {
    const validate = { username, email, password };

    console.log(validate);

    await DAO.RegisterDAO(username, email, password);
}