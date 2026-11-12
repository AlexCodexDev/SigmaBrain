import { run } from "../db/seed/gameModes.seed.js";

run().then(() => {
    console.log("Seeding selesai!");
    process.exit(0);
}).catch((error: any) => {
    console.log(error);
    process.exit(1);
})