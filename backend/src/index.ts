import "dotenv/config";
import cors from "cors";
import express from "express";
import router from "./routes/main.js";

const app = express();
const PORT = process.env.PORT || 3000;
const allowOrigins = process.env.ALLOWORIGINS?.split(",").map(
    (origin) => origin.trim()
);
const allowMethods = process.env.ALLOWMETHODS?.split(",").map(
    (method) => method.trim()
);
const allowHeaders = process.env.ALLOWHEADERS?.split(",").map(
    (header) => header.trim()
);

app.use(cors({
    origin: allowOrigins,
    methods: allowMethods,
    allowedHeaders: allowHeaders
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api", router);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});