var c = document.getElementById("drawCanvas");
var pen = c.getContext("2d");
c.width = 400;
c.height = 400;
//not necessary to understand, just setting up canvas ^

var keyDown = [];

onkeydown = (e) => {
    keyDown[e.key] = true;
}
onkeyup = (e) => {
    keyDown[e.key] = false;
}

setInterval(update, 1000/60); 
//calls update 60 times a second

var dinoHeight = 0;
var dinoVelocity = 0;
var dinoTallness = 50;
var ducking = false;
var gravity = 0.5;

var dinoImg = new Image();
dinoImg.src = "wilbur.png";
var birdImg = new Image();
birdImg.src = "death.png";
var obstacleImg = new Image();
obstacleImg.src = "cccactus.png";

var obstacleTimer = 0;

var score = 0;

var birdTimer = Math.random() * 3000 + 1000;

function update(){
    if(dinoHeight != Infinity){
        score += 1;
    }
    birdTimer -= 1000/60;
    obstacleTimer -= 1000/60;
    if(obstacleTimer < 0){
        new obstacle();
        obstacleTimer = Math.random() * 3000 + 1000;
    }
    if(birdTimer < 0){
        new bird();
        birdTimer = Math.random() * 3000 + 1000;
    }
    //clear canvas
    pen.clearRect(0, 0, 400, 400);

    pen.fillStyle = "black";
    //draw ground
    pen.fillRect(0, 300, 400, 100);

    pen.fillText("Score: " + score, 50, 50);

    //draw dino
    pen.strokeRect(50, 250 - dinoHeight + 50 - dinoTallness, 50, dinoTallness);
    pen.drawImage(dinoImg, 50, 250 - dinoHeight + 50 - dinoTallness, 50, dinoTallness);

    if(dinoHeight <= 0){
        if(keyDown[" "]){
            dinoVelocity = 15;
        }
    }

    if(keyDown["s"]){
        ducking = true;
        dinoTallness = 30;
        dinoVelocity = -30;
    } else {
        ducking = false;
        dinoTallness = 50;
    }

    dinoVelocity -= gravity;
    dinoHeight += dinoVelocity;

    if(dinoHeight <= 0){
        dinoHeight = 0;
        dinoVelocity = 0;
    }

    var dinoRect = [[50, 250 - dinoHeight + 50 - dinoTallness], [50, 250 - dinoHeight + 50 - dinoTallness + dinoTallness], [50 + 50, 250 - dinoHeight + 50 - dinoTallness], [50 + 50, 250 - dinoHeight + dinoTallness + 50 - dinoTallness]];

    //same as "i in" from python
    for(i of obstacles){
        i.update();
        i.draw();
        var obstRect = [[i.x, i.y], [i.x, i.y + 25], [i.x + 25, i.y], [i.x + 25, i.y + 25]];
        if(touching(dinoRect, obstRect) || touching(obstRect, dinoRect)){
            console.log("ded");
            dinoHeight = Infinity;
        }
    }

    for(i of birds){
        i.update();
        i.draw();
        var obstRect = [[i.x, i.y], [i.x, i.y + 25], [i.x + 25, i.y], [i.x + 25, i.y + 25]];
        if(touching(dinoRect, obstRect) || touching(obstRect, dinoRect)){
            console.log("ded");
            dinoHeight = Infinity;
        }
    }
}

var obstacles = [];

var birds = [];

function obstacle(){
    obstacles.push(this);
    this.x = 400;
    this.y = 275;
    this.update = function(){
        this.x -= 3;
    }
    this.draw = function(){
        pen.fillStyle = "red";
        pen.strokeRect(this.x, this.y, 25, 25);
        pen.drawImage(obstacleImg, this.x, this.y, 25, 25);
    }
}

function bird(){
    birds.push(this);
    this.x = 400;
    this.y = 230;
    this.update = function(){
        this.x -= 3;
    }
    this.draw = function(){
        pen.fillStyle = "red";
        pen.drawImage(birdImg, this.x, this.y, 25, 25);
        pen.strokeRect(this.x, this.y, 25, 25);
    }
}

function touching(r1, r2){
    //r1 = [[1, 2], [1, 3], [3, 2], [3, 3]];
    //r1 = top left, bottom left, top right, bottom right

    for(i of r1){
        if(i[0] < r2[2][0] && i[0] > r2[0][0] && i[1] > r2[0][1] && i[1] < r2[1][1]){
            return true;
        }
    }
}