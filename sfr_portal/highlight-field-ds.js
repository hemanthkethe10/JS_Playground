






function run(input){
    $(document).ready(function()
    {
    try{
    input.pageData.route.orgRouteDetails.changedKeys.map((key)=> {
        console.log("creating container for==>"+key)
        let l = document.getElementById(key.id);
        let imageContainer = document.querySelector(`[name='${key.id}']`);
        let nameAttribute = imageContainer?.type === 'radio' ? key.id+'-radio': key.id; 
        let div = document.createElement('div');
        div.setAttribute("name",nameAttribute);
        l?.setAttribute("tag-name","update");
        div.style.margin = '2px 0 0 0';
        div.style.width = '50px';
        div.style.height = '50px';
        div.style.backgroundImage = 'url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHZpZXdCb3g9IjAgMCAxOCAxOCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTggMEM2LjkwNjk0IDAgNiAwLjkwNjkzNyA2IDJWMTZDNiAxNy4wOTMxIDYuOTA2OTQgMTggOCAxOEgxNkMxNy4wOTMxIDE4IDE4IDE3LjA5MzEgMTggMTZWMkMxOCAwLjkwNjkzNyAxNy4wOTMxIDAgMTYgMEg4Wk01IDFDMy45MDY5NCAxIDMgMS45MDY5NCAzIDNWMTVDMyAxNi4wOTMxIDMuOTA2OTQgMTcgNSAxN1YxNVYzVjFaTTggMkgxNlYxNkg4VjJaTTIgM0MwLjkwNjkzNyAzIDAgMy45MDY5NCAwIDVWMTNDMCAxNC4wOTMxIDAuOTA2OTM3IDE1IDIgMTVWMTNWNVYzWiIgZmlsbD0iI0ZGQzcwMCIvPgo8L3N2Zz4K)';
        div.style.backgroundRepeat = 'no-repeat';
       //title = Value before changed in tool tip
       div.title = key.previousValue;
       l?.classList.add('is-updated')
       l?.appendChild(div);
    })}
    catch(e){
     console.log("error"+e)
    }
})
}