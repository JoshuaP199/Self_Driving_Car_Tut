const canvas = document.getElementById("myCanvas");
canvas.width = 200;

const ctx = canvas.getContext("2d");
const car = new Car(100,100,30,50);

animate();

function animate(){
    car.update();

    //Makes it so that the car looks like its moving and not just making a line
    canvas.height = window.innerHeight; 
    car.draw(ctx);
    requestAnimationFrame(animate)
}