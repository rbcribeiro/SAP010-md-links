
// module.exports = () => {
//   // ...
// };
const fs = require("fs");
const path = require("path");
const inquirer = require("inquirer");
const readline = require("readline");

function getFileType(path) {
  return new Promise((resolve, reject) => {
    fs.stat(path, (err, stats) => {
      if (err) {
        reject(err);
      } else {
        if (stats.isFile()) {
          resolve("file");
        } else if (stats.isDirectory()) {
          resolve("directory");
        } else {
          reject("O caminho fornecido não é um arquivo nem um diretório válido.");
        }
      }
    });
  });
}

function getFilesInDirectory(directoryPath) {
  return new Promise((resolve, reject) => {
    fs.readdir(directoryPath, (error, fileList) => {
      if (error) {
        reject(error);
      } else {
        const filterList = fileList.filter((file) => {
          return path.extname(file) === ".md";
        });

        resolve(filterList);
      }
    });
  });
}

function readFile(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (error, file) => {
      if (error) {
        reject(error);
      } else {
        resolve(file.toString());
      }
    });
  });
}

function mdLinks() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question("Digite o caminho do arquivo ou diretório: ", (inputPath) => {
    rl.close();

    getFileType(inputPath)
      .then((type) => {
        if (type === "file") {
          return readFile(inputPath);
        } else if (type === "directory") {
          return getFilesInDirectory(inputPath)
            .then((fileList) => {
              if (fileList.length === 0) {
                console.log("Não foram encontrados arquivos .md no diretório.");
                return null;
              } else {
                const fileChoices = fileList.map((file) => {
                  return {
                    name: file,
                    value: path.join(inputPath, file),
                  };
                });

                return inquirer
                  .prompt([
                    {
                      type: "list",
                      name: "selectedFile",
                      message: "Selecione um arquivo para exibição:",
                      choices: fileChoices,
                    },
                  ])
                  .then((answers) => {
                    const selectedFile = answers.selectedFile;
                    return readFile(selectedFile);
                  });
              }
            });
        } else {
          console.log("Caminho fornecido inválido.");
          return null;
        }
      })
      .then((fileContent) => {
        if (fileContent) {
          console.log(fileContent);
        }
      })
      .catch((error) => {
        console.error("Erro", error);
      });
  });
}

mdLinks();

