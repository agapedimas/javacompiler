const Server = require("./server")();
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

Server.Push.Get("", (req, res) => 
{
    res.sendFile(path.join(__dirname, "index.html"));
});
Server.Push.Post("", (req, res) => 
{    
    let code = req.body.code;
    let input = req.body.input;

    if (code.trim() == "")
    {
        res.send({ output: null, error: "Cannot parse empty file" });
        return;
    }

    let className = code.match(/public class (.*?)\n/) || code.match(/public class (.*?){/) || ["Main"];
    className = className[0];
    className = className.replace("public class", "");
    className = className.replace("{", "");
    className = className.trim() == "" ? "Main" : className.trim();

    const folderPath = path.join(__dirname, "\\tmp\\" + Date.now());
    const filePath = folderPath + "\\" + className + ".java";
    const inputPath = folderPath + "\\input.txt";

    fs.mkdirSync(folderPath);
    fs.writeFileSync(filePath, code, "utf8");
    
    if (input.trim() != "")
        fs.writeFileSync(inputPath, input, "utf8");

    compileJava(filePath, (compileResult) => 
    {
        if (!compileResult.success) 
        {
            res.send({ output: null, error: compileResult.error });
            return;
        }

        runJava(className, filePath, (runResult) => 
        {
            if (!runResult.success) 
            {
                res.send({ output: null, error: runResult.error });
                return;
            }
            res.send({ output: runResult.output, error: null });
        });
    });
});


// Compile Java Code
function compileJava(filePath, callback) 
{
    const directory = path.dirname(filePath);
    exec("javac \"" + filePath + "\"", { cwd: directory }, async (error, stdout, stderr) => 
    {
        if (error)
        {
            let err = stderr || error.message;
            err = err.replaceAll(directory + "\\", "");
            deleteDirectory(directory);
            callback({ success: false, error:  err });
            return;
        }
        callback({ success: true });
    });
}

// Run Java Code
function runJava(className, filePath, callback) 
{
    const directory = path.dirname(filePath);
    const input = fs.existsSync(directory + "\\" + "input.txt") ? "< input.txt" : "";

    exec("java " + className + input, { cwd: directory }, async (error, stdout, stderr) => 
    {
        deleteDirectory(directory);
        if (error) {
            callback({ success: false, error: stderr || error.message });
            return;
        }
        callback({ success: true, output: stdout });
    });
}

async function deleteDirectory(directory)
{
    for (let classe of fs.readdirSync(directory))
        await fs.unlink(directory + "\\" + classe, o => o);
    
    fs.rmSync(directory, {recursive: true}, o => o);
}