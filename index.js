const http = require("http");
const fs = require("fs");

const server = http.createServer((req, res) => {
  const url = req.url;
  const method = req.method;

  res.setHeader("Content-Type", "text/html");

  if (url === "/" && method === "GET") {
    fs.readFile("formValue.txt", (err, value) => {
      if (err) {
        res.statusCode = 404;
        return res.end("<h1>File Not Found</h1>");
      }

      res.end(`
      ${value.toString()}
      <form action="/message" method="POST">
        <label for="name">Name: </label>
        <input type="text" id="name" name="name" />
        <button type="submit">Add</button>
      </form>
      <br/>
    `);
    });
  } else if (url === "/message" && method === "POST") {
    let data = [];

    req.on("data", (chunk) => {
      data.push(chunk);
    });

    req.on("end", () => {
      const parsedData = Buffer.concat(data).toString();
      const nameValue = parsedData.split("=")[1];

      fs.writeFile("formValue.txt", nameValue, (err) => {
        res.statusCode = 302;
        res.setHeader("Location", "/");
        res.end();
      });
    });
  } else if (url === "/read" && method === "GET") {
    fs.readFile("formValue.txt", (err, value) => {
      if (err) {
        res.statusCode = 404;
        return res.end("<h1>File Not Found</h1>");
      }

      res.end(`<h1>Stored Name: ${value.toString()}</h1>`);
    });
  } else {
    res.statusCode = 404;
    res.end("<h1>404 Not Found</h1>");
  }
});

const PORT = 8080;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
