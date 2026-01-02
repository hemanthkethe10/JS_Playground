const http = require('http');

const requestHandler = (req, res) => {
    res.writeHead(200);
    res.end(`Handled by process ${process.pid}`);
};

const server = http.createServer(requestHandler);

const port = process.env.PORT || 8000;

server.listen(port, () => {
    console.log(`Server started on port 8000 by process ${process.pid}`);
});