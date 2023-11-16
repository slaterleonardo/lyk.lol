env = module.exports = process.env;

const express = require('express');
const app = express();

require('dotenv').config();
require("./mongo/conn");

const port = env.PORT || 3000;
const vhost = require("vhost");
const appMiddleware = require("./middleware");

const mainRoutes = require("./apps/main/app");
const txtRoutes = require("./apps/txt/app");
const cleanRoutes = require("./apps/clean/app");
const dirRoutes = require("./apps/dir/app");
const ctfRoutes = require("./apps/ctf/app");

const main = express();
const txt = express();
const clean = express();
const dir = express();
const ctf = express();

appMiddleware(main);
appMiddleware(txt);
appMiddleware(clean);
appMiddleware(dir);
appMiddleware(ctf);

main.use(mainRoutes);
txt.use(txtRoutes);
clean.use(cleanRoutes);
dir.use(dirRoutes);
ctf.use(ctfRoutes);

app.use(vhost('localhost', main));
app.use(vhost('txt.localhost', txt));
app.use(vhost('clean.localhost', clean));
app.use(vhost('dir.localhost', dir));
app.use(vhost('ctf.localhost', ctf));

app.listen(port, function() {
    console.log(`Server started on port ${port}`);
});