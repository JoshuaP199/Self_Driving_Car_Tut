const carCanvas = document.getElementById("carCanvas");
carCanvas.width = 200;

// const networkCanvas = document.getElementById("networkCanvas");
// networkCanvas.width = 300;

const carCtx = carCanvas.getContext("2d");
//const networkCtx = networkCanvas.getContext("2d");

const road = new Road(carCanvas.width/2, carCanvas.width*0.9,4);

const N=700;
const cars = generateCars(N);
let bestCar=cars[0];
if(localStorage.getItem("bestBrain")){
    for(let i=0;i<cars.length;i++){
        cars[i].brain=JSON.parse(localStorage.getItem("bestBrain"));
        if(i!=0){
            NeuralNetwork.mutate(cars[i].brain,0.3);
        }
    }   
}

const traffic = [
    new Car(road.getLaneCenter(1), -100,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(0), -300,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(3), -300,30,100,"DUMMY",2),
    new Car(road.getLaneCenter(1), -500,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(3), -650,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(0), -700,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(1), -800,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(2), -900,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(0), -1000,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(3), -1050,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(2), -1100,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(1), -1200,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(3), -1350,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(0), -1350,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(1), -1500,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(2), -1600,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(0), -1700,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(2), -1800,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(1), -1890,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(0), -2200,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(1), -100-2200,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(0), -300-2200,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(2), -300-2200,30,100,"DUMMY",2),
    new Car(road.getLaneCenter(1), -500-2200,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(3), -650-2200,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(0), -700-2200,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(1), -800-2200,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(2), -900-2200,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(0), -1000-2200,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(2), -1000-2200,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(0), -1100-2200,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(1), -1200-2200,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(2), -1350-2200,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(0), -1350-2200,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(1), -1500-2200,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(2), -1600-2200,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(0), -1700-2200,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(2), -1800-2200,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(1), -1890-2200,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(0), -2200-2200,30,50,"DUMMY",2),

    new Car(road.getLaneCenter(0), -2500-2200,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(1), -2500-2200,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(2), -2500-2200,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(3), -2500-2200,30,50,"DUMMY",2)
];

var prevBest = -1000;
if (prevBest < -600 && localStorage.getItem("bestDistance")){
    prevBest = JSON.parse(localStorage.getItem("bestDistance"));
}
var savedNew = true;

var score = 1;
if (localStorage.getItem("score")){
    score = JSON.parse(localStorage.getItem("score"));
}
localStorage.setItem("score", JSON.stringify(score+1));

console.log("Attempt #:",score,"\n", Math.floor(prevBest));
animate();

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function save(){
    console.log("saving");
    localStorage.setItem("bestDistance", JSON.stringify(bestCar.y));
    localStorage.setItem("bestBrain",JSON.stringify(bestCar.brain));
    console.log("saved");
}

function discard(){
    localStorage.removeItem("bestBrain");
    localStorage.removeItem("bestDistance");
    localStorage.removeItem("score")
}


function generateCars(N){
    const cars=[];
    for(let i=1;i<=N;i++){
        cars.push(new Car(road.getLaneCenter(1),100,30,50,"AI",5));
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

    carCtx.restore();

    if(bestCar.y < prevBest+100 && bestCar.damaged && savedNew){
        savedNew = false;
        save();      
        document.getElementById("restart").click();
    } else if (bestCar.y === prevBest && bestCar.damaged && savedNew){
        console.log("same Crash")
        savedNew = false;
        document.getElementById("restart").click();
    }

    requestAnimationFrame(animate)
}