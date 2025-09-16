function r(input){
    let l = document.getElementById(input.id);
    let nameAttribute = input.id;
    let routeDetails = input.type && input.type === 'update' ? input.pageData.updatedRoute: input.pageData.route ;
    function evaluateJSONPath(json, path) {
        const segments = path.split('.').filter(segment => segment.length > 0);
        let current = json;
        for (const segment of segments) {
          if (current[segment] === undefined) {
            return "";
          }
          current = current[segment];
        }  
        return current;
      }
    let currenValueinPageData = evaluateJSONPath(routeDetails,input.id)
    let currentPageFormValue = evaluateJSONPath(input.pageForm,input.id)
     if (currenValueinPageData != currentPageFormValue){
        let imageContainer = document.querySelector(`[name='${input.id}']`);
        if(imageContainer && imageContainer.type !== 'radio'){
            return true
          }
          if(imageContainer && imageContainer.type === 'radio'){
            nameAttribute = nameAttribute+'-radio';
          }

     let changedData = {"id":input.id,"previousValue":currenValueinPageData}
     input.pageData.changedKeys.push(changedData);
     let div = document.createElement('div');
     div.setAttribute("name",nameAttribute);
     l.setAttribute("tag-name","update");
     div.style.margin = '2px 0 0 0';
     div.style.width = '50px';
     div.style.height = '50px';
     div.style.backgroundImage = 'url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHZpZXdCb3g9IjAgMCAxOCAxOCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTggMEM2LjkwNjk0IDAgNiAwLjkwNjkzNyA2IDJWMTZDNiAxNy4wOTMxIDYuOTA2OTQgMTggOCAxOEgxNkMxNy4wOTMxIDE4IDE4IDE3LjA5MzEgMTggMTZWMkMxOCAwLjkwNjkzNyAxNy4wOTMxIDAgMTYgMEg4Wk01IDFDMy45MDY5NCAxIDMgMS45MDY5NCAzIDNWMTVDMyAxNi4wOTMxIDMuOTA2OTQgMTcgNSAxN1YxNVYzVjFaTTggMkgxNlYxNkg4VjJaTTIgM0MwLjkwNjkzNyAzIDAgMy45MDY5NCAwIDVWMTNDMCAxNC4wOTMxIDAuOTA2OTM3IDE1IDIgMTVWMTNWNVYzWiIgZmlsbD0iI0ZGQzcwMCIvPgo8L3N2Zz4K)';
     div.style.backgroundRepeat = 'no-repeat';
    //title = Value before changed in tool tip
    div.title = evaluateJSONPath(routeDetails,input.id);
    l.classList.add('is-updated')
    l.appendChild(div);
    }
    else{
        console.log("Delete the image container")
        let containerToRemove = document.querySelector(`[name='${input.id}']`);
        if(containerToRemove?.type === 'radio'){
            nameAttribute = nameAttribute+'-radio';
            console.log("removing radio button")
            document.querySelector(`[name='${nameAttribute}']`).remove();
        }
        else{
            console.log("container deleted")
            containerToRemove.remove()
        }
        l.classList.remove('is-updated');
        let filteredChangedKeys = input.pageData.changedKeys.filter((k)=>k.id != input.id);
        input.pageData.changedKeys = filteredChangedKeys;
    }
    console.log("changedKeys==>",input.pageData.changedKeys);
    return true;
  }