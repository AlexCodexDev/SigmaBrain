import bcrypt from "bcryptjs";
import * as DAO from "./dao.js";
import jwt from "jsonwebtoken";

export async function RegisterServices(data: any) {
    const {
        username,
        email,
        password,
        confirmPassword
    } = data;

    if(!username) {
        throw new Error("Username tidak boleh kosong.");
    }

    if(!email) {
        throw new Error("Email tidak boleh kosong.");
    }

    if(!password) {
        throw new Error("Password tidak boleh kosong.");
    }

    if(password !== confirmPassword) {
        throw new Error("Konfirmasi password tidak sama.");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const validateData = {
        username,
        email,
        password: hashedPassword
    }

    await DAO.RegisterDAO(validateData);

    return ({ message: "Register berhasil!" });
}

export async function LoginServices(data: any) {
    const {
        email,
        password
    } = data;

    if(!email || !password) {
        throw new Error("Email dan password tidak boleh kosong.");
    }

    const user = await DAO.LoginDAO(email);

    if(!user) {
        throw new Error("Email atau password salah.");
    }

    const passwordValid = await bcrypt.compare(
        password, user.password
    );

    if(!passwordValid) {
        throw new Error("Email atau password salah.");
    }

    const secret = process.env.JWT_SECRET;

    if(!secret) {
        throw new Error("JWT Token belum di konfigurasi.");
    }

    const token = jwt.sign(
        {
            id: user.id,
            email: user.email
        },
        secret,
        {
            expiresIn: "2h"
        }
    );

    return ({ message: `Login berhasil! Selamat datang, ${user.username}`, token: token });
}