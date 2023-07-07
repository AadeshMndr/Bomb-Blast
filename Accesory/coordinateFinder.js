function getCoordinates(){
    document.addEventListener("click", (event) =>{
        window.alert(`x = ${event.clientX - 10} and y = ${event.clientY - 10}`);
    });
}

getCoordinates();