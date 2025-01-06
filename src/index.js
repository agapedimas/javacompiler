const fs = require("fs");
const path = require("path");

// Java Code Template
const javaCode = `
public class Example {
    public static void main(String[] args) {
        System.out.println("Hello, Java from Node.js!");
    }
}`;

// Write to a File
const javaFilePath = path.join(__dirname, "../tmp/Example.java");
fs.writeFileSync(javaFilePath, javaCode, "utf8");

const { exec } = require("child_process");

// Compile Java Code
function compileJava(filePath, callback) {
    const directory = path.dirname(filePath);
    exec("javac \"" + filePath + "\"", { cwd: directory }, (error, stdout, stderr) => {
        if (error) {
            callback({ success: false, error: stderr || error.message });
            return;
        }
        callback({ success: true });
    });
}

// Run Java Code
function runJava(className, callback) {
    exec("cd ./");
    exec("cd tmp");
    exec("dir", (error, stdout, stderr) => {
        callback({ success: true, output: stdout });
    });
    exec("java " + className, (error, stdout, stderr) => {
        exec("cd ../src");

        if (error) {
            callback({ success: false, error: stderr || error.message });
            return;
        }
        callback({ success: true, output: stdout });
    });
}

// Example Usage
compileJava(javaFilePath, (compileResult) => {
    if (!compileResult.success) {
        console.error("Compilation Error:", compileResult.error);
        return;
    }
    console.log("Compilation Successful!");
    runJava("Example", (runResult) => {
        if (!runResult.success) {
            console.error("Runtime Error:", runResult.error);
            return;
        }
        console.log("Program Output:", runResult.output);
    });
});