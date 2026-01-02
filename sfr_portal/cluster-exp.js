const cluster=require("cluster");
const express=require("express");
const app=express();
const total_cpus=require("os").cpus().length;

if(cluster.isMaster){
    console.log(`Master process ${process.pid} is running`);
    
    // Fork child processes(workers)
    for(let i=0;i<total_cpus;i++){
       cluster.fork();
    }
    
    cluster.on("exit",(worker,code,signal)=>{
       console.log(`Worker process ${worker.process.pid} died`);
    });
} else {
    console.log(`Worker process ${process.pid} started running`);
    
    const port=2323;
    app.listen(port,(req,res)=>{
      console.log(`server running at port ${port}`);
    });
}

console.log(require("os").cpus().length)