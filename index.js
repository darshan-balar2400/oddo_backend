require("dotenv").config({path:"./Config/dev.env"});
const {UnCaughtException,UnHandledException} = require("nodejs-corekit");
const server = require("./app");

UnCaughtException();

server.listen(process.env.PORT,(err) => {
    if(err) return err;

    console.log("listening on port " + process.env.PORT);
});

UnHandledException();