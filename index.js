const http = require("http");
const fs = require("fs");
const route = require("./routes");

const server = http.createServer(route);

const PORT = 8080;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
