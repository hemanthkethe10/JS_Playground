function run (input) {
    try{
    let containerToCollapse = input.type === "route" ? `container-route-${input.rIndex}` : `container-destination-${input.rIndex}-${input.dIndex}`;
    let imageElement = input.type === "route" ? `image-type-${input.index}` : `image-type-d-${input.index}-${input.dIndex}`;
    const container = document.getElementById(containerToCollapse);
    let imageVal = `image-type-${input.index}`
    const image = document.getElementById(imageElement);
    if (container.style.display === "")
    {
    container.style.display = "none"; // Hide the container
    if (image.classList.contains("expand"))
    {image.classList.remove("expand")}
    image.classList.toggle("collapse")
    
    }
    else if(container.style.display === "none"){
    container.style.display = "block"; // Show the container
    if (image.classList.contains("collapse"))
    {image.classList.remove("collapse")}
    image.classList.toggle("expand")
    }
    else
    {
    container.style.display = "none"; // Hide the container
    if (image.classList.contains("expand"))
    {image.classList.remove("expand")}
    image.classList.toggle("collapse")
    }}
    catch(e){
        console.log("Error in collapse",e)
    }
    }