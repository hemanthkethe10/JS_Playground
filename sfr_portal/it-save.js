function e(input) {
    try{
    if(input.pageData.submit?.description){
        input.pageData.submit.description="";
    }
    let routes = input.pageData.route.currentRoutes.map((route,rIndex)=>{
        route.destinations.map((destination,dIndex)=>{
          console.log("indexes",rIndex,dIndex)
          document.getElementById(`save-${rIndex}-${dIndex}`).click()
        })
    })
    console.log("pageData submit",input.pageData);
    return true;
    }
    catch(error){
        console.log("ERROR: ",error);
      }
    }