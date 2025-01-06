const Path = require("path");
const Express = require("express");
const BodyParser = require("body-parser");
const Server = Express();
Server.use(BodyParser.urlencoded({ extended: true })); 

function Get(url, method)
{
    if (url.startsWith("/") == true)
        url = url.replace("/", "");

    Server.get("/" + url, function(req, res)
    {
        method(req, res);
    })
}

function Post(url, method)
{
    if (url.startsWith("/") == true)
        url = url.replace("/", "");

    Server.post("/" + url, function(req, res)
    {
        method(req, res);
    })
}

module.exports = function()
{
    let object = 
    {
        Push:
        {
            Get:    (url, method) =>
                    {
                        Get(url, method);
                    },

            Post:   (url, method) =>
                    {
                        Post(url, method);
                    }
        },
        Path: function(path)
        {
            if (path.startsWith("./") == true)
            {
                return Path.resolve(path.replace("./", "./" + parent + "/"));
            }
            else if (path.startsWith("/") == true)
            {
                return Path.resolve(path.replace("/", "./" + parent + "/"));
            }
            else
            {
                return Path.resolve(parent + "/" + path);
            }
        },
        Start: function()
        {  
            Server.get("*", function(req, res)
            {
                res.status(404).send();
            });

            Server.listen(8312, () => 
            {
                console.log("Server is ready");
            });
        }
    };

    return object;
}