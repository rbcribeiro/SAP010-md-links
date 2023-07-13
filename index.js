
// module.exports = () => {
//   // ...
// };
const fs = require("fs");
const path = require("path");
const inquirer = require("inquirer");

let pathInput = process.argv[2];

function getFilesInDirectory(pathInput) {
  fs.readdir(pathInput, (error, fileList) => {
    if (error) {
      console.error("Erro", error);
    } else {
      const filterList = fileList.filter((file) => {
        return path.extname(file) === ".md";
      });

      if (filterList.length === 0) {
        console.log("Não foram encontrados arquivos .md no diretório.");
      } else {
        inquirer
          .prompt([
            {
              type: "list",
              name: "selectedFile",
              message: "Selecione um arquivo para exibição:",
              choices: filterList,
            },
          ])
          .then((answers) => {
            const selectedFile = answers.selectedFile;
            const filePath = path.join(pathInput, selectedFile);
            readFile(filePath); //chamada da função para ler e exibir o arquivo
          });
      }
    }
  });
}

function readFile(filePath) {
  fs.readFile(filePath, (error, file) => {
    if (error) {
      console.error("Erro", error);
    } else {
      console.log(file.toString());
    }
  });
}

getFilesInDirectory(pathInput);
