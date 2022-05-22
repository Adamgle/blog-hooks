const fs = require("fs");
let str = "";
let calculateDopisz = [];
const generateString = async () => {
  fs.readFile("./przyklad.txt", "utf8", (err, data) => {
    let parseDataMap = data.split("\n").map((e) => e.split(" "));
    parseDataMap = parseDataMap.map((item, i) => [
      item[0],
      item[1].replace("\r", ""),
    ]);
    parseDataMap.forEach((item) => {
      if (item[0] === "DOPISZ") {
        calculateDopisz.push(item[0]);
        str += item[1];
      } else if (item[0] === "PRZESUN") {
        const index = str.indexOf(item[1]);
        let arr = [...str];
        if (str.charCodeAt(index) >= 65 && str.charCodeAt(index) <= 90) {
          let nextCharCode =
            str.charCodeAt(index) + 1 > 90 ? 65 : str.charCodeAt(index) + 1;
          arr[index] = String.fromCharCode(nextCharCode);
          str = arr.join("");
        }
      } else if (item[0] === "ZMIEN") {
        if (str.length) {
          let len = str.length;
          let arr = [...str];
          arr[len - 1] = item[1];
          str = arr.join("");
        }
      } else if (item[0] === "USUN") {
        let arr = [...str];
        arr.pop();
        str = arr.join("");
      }
    });
    console.log(str.length);
  });
};

generateString();

