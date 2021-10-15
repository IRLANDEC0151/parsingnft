import path,{ join,dirname  } from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import express, { json, urlencoded  } from "express";
const app = express()
const PORT = process.env.PORT || 3000
//шаблонизатор
import { create } from "express-handlebars";

import routeServer from "./routes/server.js"
const hbs = create({
    defaultLayout: "main",
    extname: "hbs",
});
//регистрируем движок www
app.engine("hbs", hbs.engine); 
//используем движок
app.set("view engine", "hbs");
//место где лежат наши шаблоны 
app.set("views", "views");
app.use(json());
//чтобы работал req.body
app.use(
    urlencoded({
        extended: true,
    })
);
app.use(
    express.static(join(__dirname, "public", "css")),
    express.static(join(__dirname, "public", "img")),
    express.static(join(__dirname, "public", "js"))
);
app.use(routeServer)

app.listen(PORT, () => {
    console.log("сервер запущен"); 
})
