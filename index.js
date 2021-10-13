const path = require("path");
const express = require("express");
const app = express()
const PORT = process.env.PORT || 3000
//шаблонизатор
const exphbs = require("express-handlebars");
const hbs = exphbs.create({
    defaultLayout: "main",
    extname: "hbs",
});
//регистрируем движок www
app.engine("hbs", hbs.engine);
//используем движок
app.set("view engine", "hbs");
//место где лежат наши шаблоны 
app.set("views", "views");
app.use(express.json());
//чтобы работал req.body
app.use(
    express.urlencoded({
        extended: true,
    })
);
app.use(
    express.static(path.join(__dirname, "public", "css")),
    express.static(path.join(__dirname, "public", "img")),
    express.static(path.join(__dirname, "public", "js"))
);
app.use(require('./routes/server'))

app.listen(PORT, () => {
    console.log("сервер запущен");
})
