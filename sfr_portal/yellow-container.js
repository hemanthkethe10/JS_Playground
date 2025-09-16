function run(input){
    let l = document.getElementById(input.id);
    let inputAttributes = l.attributes;
    console.log("attrs",inputAttributes)
    if(document.querySelector(`[name='${input.id}']`)){
      l.removeChild(l.lastElementChild)
      return true
    }
    let div = document.createElement('div');
    div.setAttribute("name",input.id);
    l.setAttribute("tag-name","update");
    div.style.width = '50px';
    div.style.height = '50px';
    div.style.backgroundImage = 'url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHZpZXdCb3g9IjAgMCAxOCAxOCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTggMEM2LjkwNjk0IDAgNiAwLjkwNjkzNyA2IDJWMTZDNiAxNy4wOTMxIDYuOTA2OTQgMTggOCAxOEgxNkMxNy4wOTMxIDE4IDE4IDE3LjA5MzEgMTggMTZWMkMxOCAwLjkwNjkzNyAxNy4wOTMxIDAgMTYgMEg4Wk01IDFDMy45MDY5NCAxIDMgMS45MDY5NCAzIDNWMTVDMyAxNi4wOTMxIDMuOTA2OTQgMTcgNSAxN1YxNVYzVjFaTTggMkgxNlYxNkg4VjJaTTIgM0MwLjkwNjkzNyAzIDAgMy45MDY5NCAwIDVWMTNDMCAxNC4wOTMxIDAuOTA2OTM3IDE1IDIgMTVWMTNWNVYzWiIgZmlsbD0iI0ZGQzcwMCIvPgo8L3N2Zz4K)';
    div.style.backgroundRepeat = 'no-repeat';
    function evaluateJSONPath(json, path) {
        const segments = path.split('.').filter(segment => segment.length > 0);
        let current = json;
        for (const segment of segments) {
          if (current[segment] === undefined) {
            console.log("Value not found for",input.id)
            return "";
          }
          current = current[segment];
        }  
        return current;
      }
    //title = Value before changed in tool tip
    div.title = evaluateJSONPath(input.pageData.route,input.id);
    l.classList.add('is-updated')
    l.appendChild(div);
    console.log("Created div",div)
    return true
  }