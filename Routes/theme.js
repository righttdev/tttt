const { Router } = require("express");
const path = require('path');


const route = Router();

route.get("/", async (req, res, next) => {
    let theme = req.cookies["theme"]
    if (!theme) return res.sendFile(path.resolve(__dirname + "/../Dynamic/theme/light.css"))
    else if (theme === "dark") return res.sendFile(path.resolve(__dirname + "/../Dynamic/theme/dark.css"));
    else return res.sendFile(path.resolve(__dirname + "/../Dynamic/theme/light.css"))
});

module.exports = route;
