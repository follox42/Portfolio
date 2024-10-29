/** -- Starting page writing text-- */
function setupTypewriter(t) {
    var HTML = t.innerHTML;

    t.innerHTML = "";

    var cursorPosition = 0,
        tag = "",
        writingTag = false,
        tagOpen = false,
        typeSpeed = 10,
        tempTypeSpeed = 0;

    var type = function() {

        if (writingTag === true) {
            tag += HTML[cursorPosition];
        }
        if (HTML[cursorPosition] === "<") {
            tempTypeSpeed = 0;
            if (tagOpen) {
                tagOpen = false;
                writingTag = true;
            } else {
                tag = "";
                tagOpen = true;
                writingTag = true;
                tag += HTML[cursorPosition];
            }
        }
        if (!writingTag && tagOpen) {
            tag.innerHTML += HTML[cursorPosition];
        }
        if (!writingTag && !tagOpen) {
            if (HTML[cursorPosition] === " ") {
                tempTypeSpeed = 0;
            }
            else {
                tempTypeSpeed = (Math.random() * typeSpeed) + 50;
            }
            t.innerHTML += HTML[cursorPosition];
        }
        if (writingTag === true && HTML[cursorPosition] === ">") {
            tempTypeSpeed = (Math.random() * typeSpeed) + 50;
            writingTag = false;
            if (tagOpen) {
                var newSpan = document.createElement("span");
                t.appendChild(newSpan);
                newSpan.innerHTML = tag;
                tag = newSpan.firstChild;
            }
        }

        cursorPosition += 1;
        if (cursorPosition < HTML.length - 1) {
            setTimeout(type, tempTypeSpeed);
        }
    };

    return {
        type: type
    };
}

const getRandomNumber = (min, max) => {
    return Math.random() * (max - min) + min
}

var typer = document.getElementById('typewriter');

typewriter = setupTypewriter(typer);

typewriter.type();



const canvas = document.querySelector('canvas');
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth * window.devicePixelRatio;
canvas.height = 500;

class Particle{
    constructor(x, y, effect){
        this.originX = x;
        this.originY = y;
        this.o = x;
        this.effect = effect;
        this.x = Math.floor(x);
        this.y = Math.floor(y);
        this.ctx = this.effect.ctx;
        this.ctx.fillStyle = 'white';
        this.vx = 0;
        this.vy = 0;
        this.ease = 0.2;
        this.friction = 0.95;
        this.dx = 0;
        this.dy = 0;
        this.distance = 0;
        this.force = 0;
        this.angle = 0;
        this.size = getRandomNumber(2,20);
        this.speed = getRandomNumber(1,5);
        this.g = 9.81;
        this.t = 0;
        this.draw();
    }

    draw(){
        this.ctx.beginPath();
        this.ctx.fillRect(this.x, this.y, this.size, this.size);
    }

    update(){
        this.x = Math.floor(this.effect.width-((1+(this.speed * 1/1000)) * (this.effect.width - this.x)));
        this.originX = this.x
        this.updateMouse();
        if(this.x > this.effect.width || this.x < -10){
            this.effect.particleArray.push(new Particle(getRandomNumber(this.effect.width - 100,this.effect.width),this.originY,this.effect))
            this.effect.particleArray.splice(this.effect.particleArray.indexOf(this),1)
        }
        //this.y = -((1/2) * this.g * this.t * this.t) + this.speed * Math.sin(0.5) + this.originY;
        this.draw();
    }

    updateMouse(){
        this.dx = this.effect.mouse.x - this.x;
        this.dy = this.effect.mouse.y - this.y;
        
        this.distance = this.dx * this.dx + this.dy * this.dy;
        this.force = -this.effect.mouse.radius / this.distance * 8;


        if(this.distance < this.effect.mouse.radius){
            
            this.angle = Math.atan2(this.dy, this.dx)
            this.vx = this.force * Math.cos(this.angle);
            this.vy = this.force * Math.sin(this.angle);
        }
       
        this.x += (this.vx *= this.friction) + (this.originX - this.x) * this.ease;
        this.y += (this.vy *= this.friction) + (this.originY - this.y) * this.ease;
        this.draw();
    }
}

class Effect {
    constructor(width,height,context){
        this.width = width;
        this.height = height;
        this.ctx = context;
        this.gap = 10;
        this.nbLine = 100;
        this.nb = 500;
        this.particleArray = [];
        this.mouse = {
            radius: 5000,
            x:-10000,
            y:-10000
        }

        window.addEventListener('mousemove', e => {
            this.mouse.x = e.clientX * window.devicePixelRatio;
            this.mouse.y = (e.clientY * window.devicePixelRatio - ctx.canvas.getBoundingClientRect().top * window.devicePixelRatio);
        })

        window.addEventListener("resize",() =>{
            canvas.width = window.innerWidth * window.devicePixelRatio;
            canvas.height = canvas.height * window.devicePixelRatio;
            this.width = canvas.width;
            this.height = canvas.height;

            this.particleArray = [];
                this.init();
        })

        this.init();
    }

    init(){
        this.nbLine = window.devicePixelRatio * canvas.parentElement.offsetHeight/this.gap - 2
        var nb = this.nb/this.nbLine
        //canvas.style.transform = `translateY(-${(canvas.height/2 - (this.nbLine*this.gap)/2)}px)`
        for(let n = (canvas.height/2 - (this.nbLine*this.gap)/2);n < (canvas.height/2 - (this.nbLine*this.gap)/2) + (this.nbLine*this.gap);n += this.gap){
            for(let i = 0;i < nb; i++){
                this.particleArray.push(new Particle(getRandomNumber(this.width - 100,this.width),n ,this))
            }
        }
    }
    /*init(){
        for(let x = 0; x < this.width; x+= this.gap){
            for(let y = 0; y < this.height; y += this.gap){
                this.particleArray.push(new Particle(x, y, this))
            }
        }
    }*/

    update(){
        this.ctx.clearRect(0,0, this.width,this.height);
        for(let i = 0;i < this.particleArray.length;i++){
            this.particleArray[i].update();
        }
    }
}

let effect = new Effect(canvas.width,canvas.height, ctx);
function animate(){
    effect.update();
    requestAnimationFrame(animate)
}
animate();






const elements = document.getElementsByClassName("rect");
Min = 60 * elements[0].offsetWidth/100;
var an = [];
let act;
window.onload = function (){
    for (let i = 0; i < elements.length; i++) {
        an[i] = anime({
            targets: elements[i].querySelector(".turn"),
            rotate:[
                { value: 90, duration: 500}
            ],
            width:[
                { value: "230%", duration: 500, delay: 500}
            ],
            easing: 'linear',
            autoplay: false,
            complete: function(anim) {
                if(anim.direction == "normal"){
                    anim.completed = true
                }
                else if(anim.direction == "reverse"){
                    anim.completed = false
                }
                console.log("fin")
                
              }
        })
    }
}

for (let i = 0; i < elements.length; i++) {
    elements[i].addEventListener('mouseover', function(e) {
        for (let r = 0; r < elements.length; r++){
            if(r != i){
                console.log(r)
                if(an[r].currentTime == 0){
                    an[r].reversed = false
                    an[r].direction = "normal"
                    console.log("finish")
                }else{
                    if(!an[r].reversed){
                        an[r].reverse();
                        an[r].play();
                    }
                    console.log("finish")
                }
            }
        }
        if(!an[i].completed){
            if(an[i].reversed){
                an[i].reverse();
            }
            an[i].play();
        }
    }
    )
}

function open(i){
    elements[i].classList.add('active')
    let valIni = 60;
    let valFin = 230;
    let rotIni = 0;
    let rotFin = 90;
    let time;

    rotIni = elements[i].getElementsByClassName("turn")[0];

    values = {
        offset: [0,0.5,1],
        values: [{rotate: 0,width: 60},
        {rotate: 90},
        {width: 230}]}
    valIni = elements[i].getElementsByClassName("turn")[0].offsetWidth;
    valFin = valIni*230/60;
    time = (valFin - valIni)/(valFin - Min);
    console.log(elements[i].getElementsByClassName("turn")[0].animate)
    animation(elements[i].getElementsByClassName("turn")[0],values,2,60)
}

function animation(object,value,time,fps,started){
    let valFPS = 1000/fps;
    time = time * 1000;
    let start = 0;
    let times = [];

    //incrementor
    let increment = ListCreator(value,valFPS,time);
    

    //set timers and all values modifies
    for(let i=0;i < value.offset.length;i++){
        times.push(value.offset[i] * 1000);
    }
    
    //actual values of properties
    let last = increment[0];

    //aniamtion pure
    let vl=0;
    let timer = setInterval(function() {
        console.log(start/valFPS)

        //check beggining
        if(start>=times[0]){

            //all keys takes in times
            for(let i=0;i<times.length;i++){

                //where the time is:
                if(start<times[i] && start>=times[i-1]){

                    //each properties
                    for(let r = 0;r<Object.keys(increment[i-1]).length;r++){
                        console.log(increment,last)

                        //width
                        if(Object.keys(increment[i])[r] == "width"){
                            last[`${Object.keys(increment[i])[r]}`] = Math.floor(Object.values(increment[i])[r]) + last[`${Object.keys(increment[i])[r]}`]
                            object.style[`${Object.keys(increment[i])[r]}`] = `${last[`${Object.keys(increment[i])[r]}`]}%`;
                            vl = vl + Math.floor(Object.values(increment[i])[r])
                        }

                        //rotate
                        if(Object.keys(increment[i])[r] == "rotate"){
                            last[`${Object.keys(increment[i])[r]}`] = Object.values(increment[i])[r] + last[`${Object.keys(increment[i])[r]}`]
                            object.style[`${Object.keys(increment[i])[r]}`] = `${last[`${Object.keys(increment[i])[r]}`]}deg`;
                        }

                        //console
                    }
                }
            }
        }

        if(start > times[times.length-1]){
            clearInterval(timer)
        }

        //set time
        start += valFPS;
    }, valFPS);
}


//create incrementor
function ListCreator(value,valFPS,time){
    let size = 0;
    let name = [];
    let increment = {};
    let times = [];

    for(let i=0;i < value.offset.length;i++){
        if(Object.keys(value.values[i]).length>size){
            size = Object.keys(value.values[i]).length
            name = Object.keys(value.values[i]);
        }
        times.push(value.offset[i] * 1000);
    }

    //each changement time
    for(step = 0;step<value.offset.length;step++){
        let val = {};

        //each style properties
        for(i = 0;i<size;i++){

            //first properties just set them
            if(step == 0){
                console.log(value.values[step][name[i]],value.values[step],"ici")
                if(value.values[step][name[i]] == undefined){
                    if(value.values[step-1] == undefined){
                        val[`${name[i]}`] = 0;
                    }else{
                        val[`${name[i]}`] = (value.values[step-1][name[i]]);
                    }
                }
                else{
                    val[`${name[i]}`] = (value.values[step][name[i]]);
                }
            }

            //set the incrementation
            else{
                //last and current value
                let p;
                let l;
                l = value.values[step][name[i]];
                p = value.values[step-1][name[i]];

                if(p == undefined){
                    for(r=1;r<value.values.length;r++)
                    {
                        if(value.values[step-r][name[i]] !== undefined){
                            p = increment[step-r][name[i]] 
                            console.log(p,'la')
                        }
                    }
                }
                else{
                    p = increment[step-1][name[i]]
                }

                if(l == undefined){
                    l=p;
                }

                //difference
                val[`${name[i]}`] = (l - p)*valFPS/times[step];
            }
        }
        increment[step] = val
    }
    return increment;
}






const footer = document.querySelector("footer");

let botPos = 0;
let AllPos = [];
let started = false;
const c = 12;
const k = 180;
const taille = footer.offsetHeight / 2;

let t = 0;
let w = Math.sqrt(4*k-c**2)/2;
let x = -Math.exp(-c * t /2) * (-taille * Math.cos(w * t) - (c * taille)/Math.sqrt(4*k - c**2)*Math.sin(c*t)) + footer.offsetTop + footer.offsetHeight/2;

for(let i = 0;i < 100;i++){
    t = i*0.01;
    w = Math.sqrt(4*k-c**2)/2;
    x = -Math.exp(-c * t /2) * (-taille * Math.cos(w * t) - (c * taille)/Math.sqrt(4*k - c**2)*Math.sin(c*t)) + footer.offsetTop + footer.offsetHeight/2 + 1;
    AllPos.push(x);
}
console.log(AllPos);



window.addEventListener('wheel', (event) => {
    console.log(event.deltaY)
    if(event.deltaY<=1 && event.deltaY>=-1){
        botPos = window.scrollY + window.innerHeight;
        for(let i=0;i<AllPos.length;i++){
            if(botPos > AllPos[i] && botPos < AllPos[i+1]){
                console.log("ok");
                if(started){
                    clearInterval(repeat);
                    started=false;
                }
                startAnime(i);
            }
        }
    }
})

function startAnime(i){
    started = true;
    var repeat = setInterval(() => {
        if(i >= AllPos.length){
            window.scroll(0,Math.floor(footer.offsetTop + footer.offsetHeight/2 - window.innerHeight));
            console.log(i,Math.floor(footer.offsetTop + footer.offsetHeight/2 - window.innerHeight));
            clearInterval(repeat);
            started = false;
        }
        else{
            console.log(i,Math.floor(AllPos[i] - window.innerHeight));
            i ++;
            window.scroll(0,Math.floor(AllPos[i] - window.innerHeight));
        }
    },10)
}



