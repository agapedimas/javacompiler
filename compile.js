const Server = require("./server")();
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

Server.Push.Get("dimas", (req, res) => 
{
    res.send("hai");
    
    // Java Code Template
    const javaCode = `
    public class Main {
        public static void main(String[] args) {
            System.out.println("Hello, Java from Node.js!");
        }
    }
    `;

    // Write to a File
    const javaFilePath = path.join(__dirname, "/tmp/Main.java");
    fs.writeFileSync(javaFilePath, javaCode, "utf8");

    // Example Usage
    compileJava(javaFilePath, (compileResult) => 
    {
        if (!compileResult.success) 
        {
            console.error("Compilation Error:", compileResult.error);
            return;
        }
        console.log("Compilation Successful!");
        runJava("Main", javaFilePath, (runResult) => 
        {
            if (!runResult.success) 
            {
                console.error("Runtime Error:", runResult.error);
                return;
            }
            console.log("Program Output:", runResult.output);
        });
    });
});


// Compile Java Code
function compileJava(filePath, callback) 
{
    const directory = path.dirname(filePath);
    exec("javac \"" + filePath + "\"", { cwd: directory }, (error, stdout, stderr) => 
    {
        if (error)
        {
            callback({ success: false, error: stderr || error.message });
            return;
        }
        callback({ success: true });
    });
}

// Run Java Code
function runJava(className, filePath, callback) 
{
    const directory = path.dirname(filePath);
    exec("java " + className, { cwd: directory }, (error, stdout, stderr) => 
    {
        if (error) {
            callback({ success: false, error: stderr || error.message });
            return;
        }
        callback({ success: true, output: stdout });
    });
}