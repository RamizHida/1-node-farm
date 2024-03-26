const fs = require("fs");
const http = require("http");
const url = require("url");

// const textInt = fs.readFileSync("./txt/input.txt", "utf-8");
// console.log(textInt);

// const textOut = `This is what we know about the avacodo: ${textInt}. \nCreated on ${Date.now()}`;
// fs.writeFileSync("./txt/output.txt", textOut);
// console.log("File Written");
// fs.readFile("./txt/start.txt", "utf-8", (err, data1) => {
//   fs.readFile(`./txt/${data1}.txt`, "utf-8", (err, data2) => {
//     console.log(data2);
//     fs.readFile(`./txt/append.txt`, "utf-8", (err, data3) => {
//       console.log(data3);

//       fs.writeFile("./txt/final.txt", `${data2}\n${data3}`, "utf-8", (err) => {
//         console.log("Your file has been written");
//       });
//     });
//   });
// });
// console.log("read file");
const templateOverview = fs.readFileSync(
  `${__dirname}/templates/template_overview.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template_card.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template_product.html`,
  "utf-8"
);
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObject = JSON.parse(data);

const replaceTemplate = (temp, product) => {
  let output = temp.replace(/{%PRODUCT_NAME%}/g, product.productName);
  output = output.replace(/{%PRICE%}/g, product.price);
  output = output.replace(/{%FROM%}/g, product.from);
  output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
  output = output.replace(/{%QUANTITY%}/g, product.quantity);
  output = output.replace(/{%DESCRIPTION%}/g, product.description);
  output = output.replace(/{%ID%}/g, product.id);
  output = output.replace(/{%IMAGE%}/g, product.image);

  if (!product.organic) {
    output = output.replace(/{%NOT_ORGANIC%}/g, "not-organic");
  }
  return output;
};

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  if (pathname === "/" || pathname == "/overview") {
    res.writeHead(200, { "Content-type": "text/html" });

    const cardsHtml = dataObject
      .map((el) => replaceTemplate(tempCard, el))
      .join("");
    const output = templateOverview.replace("{%PRODUCT_CARDS}", cardsHtml);

    res.end(output);
  } else if (pathname === "/product") {
    res.writeHead(200, { "Content-type": "text/html" });
    const product = dataObject[query.id];
    const output = replaceTemplate(tempProduct, product);

    res.end(output);
  } else if (pathname === "/api") {
    res.writeHead(200, { "Content-type": "application/json" });
    res.end(data);
  } else {
    res.writeHead(404, {
      "Content-type": "text/html",
      "My-own-header": "yoooo",
    });
    res.end("<h1>page could not be found</h1>");
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Listening to request on port 8000");
});
