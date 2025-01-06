console.log("Getting ready: " + new Date().toLocaleString("en-US", {timeZone: "Asia/Jakarta"}));

require("./compile");

const Server = require("./server")();
Server.Start();