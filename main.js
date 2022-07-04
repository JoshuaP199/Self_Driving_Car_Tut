const carCanvas = document.getElementById("carCanvas");
carCanvas.width = 200;

// const networkCanvas = document.getElementById("networkCanvas");
// networkCanvas.width = 300;

const carCtx = carCanvas.getContext("2d");
//const networkCtx = networkCanvas.getContext("2d");

const road = new Road(carCanvas.width/2, carCanvas.width*0.9);

const N=500;
const cars = generateCars(N);
let bestCar=cars[0];
if(localStorage.getItem("bestBrain")){
    for(let i=0;i<cars.length;i++){
        cars[i].brain=JSON.parse(localStorage.getItem("bestBrain"));
        if(i!=0){
            NeuralNetwork.mutate(cars[i].brain,0.1);
        }
    }   
}

const traffic = [
    new Car(road.getLaneCenter(1), -100,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(0), -300,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(2), -300,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(1), -500,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(3), -650,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(0), -700,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(1), -800,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(2), -900,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(0), -1000,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(2), -1000,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(0), -1100,30,50,"DUMMY",2)
];

animate();

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}
// function generateCars(number){
//     for(let i=0;i<=number;i++){
//         new Car(road.getLaneCenter(getRandomIntInclusive(0,2), #,#,#,"DUMMY",2);
//     }
// }

function save(){
    localStorage.setItem("bestBrain",
        JSON.stringify(bestCar.brain));
}

function discard(){
    localStorage.removeItem("bestBrain");
}

function generateCars(N){
    const cars=[];
    for(let i=1;i<=N;i++){
        cars.push(new Car(road.getLaneCenter(1),100,30,50,"AI"));
    }
    return cars;
}

function animate(){
    for(let i =0;i<traffic.length;i++){
        traffic[i].update(road.borders,[]);
    }
    for(let i=0;i<cars.length;i++){
        cars[i].update(road.borders,traffic);
    }
    
    bestCar = cars.find(
        c=>c.y==Math.min(
            ...cars.map(c=>c.y)
        )
    );

    //Makes it so that the car looks like its moving and not just making a line
    carCanvas.height = window.innerHeight; 

    //networkCanvas.height = window.innerHeight; 

    carCtx.save();
    carCtx.translate(0,-bestCar.y+carCanvas.height*0.7);

    road.draw(carCtx);
    for(let i=0;i<traffic.length;i++){
        traffic[i].draw(carCtx,"red");
    }

    carCtx.globalAlpha=0.2;

    for(let i=0;i<cars.length;i++){
        cars[i].draw(carCtx,"blue");
    }

    carCtx.globalAlpha=1;
    bestCar.draw(carCtx,"blue", true);
    //console.log(bestCar.brain);
    
    carCtx.restore();

    requestAnimationFrame(animate)
}