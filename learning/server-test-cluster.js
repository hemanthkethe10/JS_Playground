const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running`);

    // Fork workers (limit to 2 workers per instance to avoid too many processes)
    const workersCount = 2;
    for (let i = 0; i < workersCount; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died. Forking a new worker...`);
        cluster.fork();
    });
} else {
    const requestHandler = (req, res) => {
        res.writeHead(200);
        res.end(`Handled by process ${process.pid}`);
    };

    const server = http.createServer(requestHandler);

    const port = process.env.PORT || 8000;

    console.log("PORT",port)

    server.listen(port, () => {
        console.log(`Worker ${process.pid} started`);
    });
}