gsap.registerPlugin(ScrollToPlugin);
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
var typer = document.getElementById('typewriter');

typewriter = setupTypewriter(typer);

typewriter.type()



/** -- Canvas animation particules -- */

function getRandomNumber(min, max){
    return Math.random() * (max - min) + min
}

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




/** -- footer animation spring -- */

const footer = document.querySelector("footer");
let isAnimating = false;
let hasReachedTarget = false;
let lastScrollPosition = 0;

const getTargetScroll = () => {
    return footer.offsetTop + (footer.offsetHeight / 2) - window.innerHeight;
};

const animateScroll = () => {
    if (isAnimating) return;
    
    isAnimating = true;
    
    const targetY = getTargetScroll();
    
    gsap.to(window, {
        duration: 1.5,
        scrollTo: targetY,
        ease: "elastic.out(0.7, 0.2)",  // Moins d'amortissement = plus ample
        onComplete: () => {
            isAnimating = false;
            hasReachedTarget = false; // Reset ici pour permettre une nouvelle animation
        }
    });
};

// Gestionnaire de scroll
window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    const targetScroll = getTargetScroll();
    const isScrollingDown = currentScroll > lastScrollPosition;

    if (!isAnimating && 
        currentScroll >= targetScroll - 50 && 
        isScrollingDown) {  // Vérifie si on scrolle vers le bas
        animateScroll();
    }

    // Reset si on remonte suffisamment
    if (currentScroll < targetScroll - 150) {
        hasReachedTarget = false;
    }

    lastScrollPosition = currentScroll;
});

// Permettre de remonter
window.addEventListener('wheel', (e) => {
    if (e.deltaY < 0 && isAnimating) {
        gsap.killTweensOf(window);
        isAnimating = false;
        hasReachedTarget = false;
    }
}, { passive: true });

// Support tactile
let touchStartY = 0;
window.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
    if (isAnimating) {
        gsap.killTweensOf(window);
        isAnimating = false;
        hasReachedTarget = false;
    }
}, { passive: true });

window.addEventListener('touchmove', (e) => {
    const touchY = e.touches[0].clientY;
    if (touchY > touchStartY) {
        const targetScroll = getTargetScroll();
        if (window.scrollY < targetScroll - 100) {
            hasReachedTarget = false;
        }
    }
}, { passive: true });

// Gestion du redimensionnement
window.addEventListener('resize', () => {
    if (isAnimating) {
        gsap.killTweensOf(window);
        isAnimating = false;
    }
    const targetScroll = getTargetScroll();
    if (window.scrollY >= targetScroll) {
        window.scrollTo(0, targetScroll);
    }
});




/** -- page2 animations -- */

gsap.registerPlugin(ScrollTrigger);

// Animation des tech stack
document.querySelectorAll('.tech-stack span').forEach(tech => {
    tech.addEventListener('mouseenter', () => {
        gsap.to(tech, {
            y: -3,
            scale: 1.1,
            duration: 0.3,
            ease: "power2.out"
        });
    });

    tech.addEventListener('mouseleave', () => {
        gsap.to(tech, {
            y: 0,
            scale: 1,
            duration: 0.3,
            ease: "power2.out"
        });
    });
});

// Animation des icônes
document.querySelectorAll('.icon-container').forEach(container => {
    const icon = container.querySelector('.icon');
    
    container.addEventListener('mouseenter', () => {
        gsap.to(icon, {
            scale: 1.2,
            rotation: 10,
            duration: 0.3,
            ease: "back.out(5)"
        });
    });

    container.addEventListener('mouseleave', () => {
        gsap.to(icon, {
            scale: 1,
            rotation: 0,
            duration: 0.3,
            ease: "power2.out"
        });
    });
});

// Animation des projets
document.querySelectorAll('.project-item').forEach(project => {
    const projectType = project.querySelector('.project-type');
    const title = project.querySelector('h3');
    
    project.addEventListener('mouseenter', () => {
        gsap.timeline()
            .to(project, {
                x: 10,
                duration: 0.3,
                ease: "power2.out"
            })
            .to(projectType, {
                y: -5,
                opacity: 1,
                duration: 0.2,
                color: '#fff5e6'
            }, 0)
            .to(title, {
                y: -2,
                duration: 0.2,
                ease: "power2.out"
            }, 0);
    });

    project.addEventListener('mouseleave', () => {
        gsap.timeline()
            .to(project, {
                x: 0,
                duration: 0.3,
                ease: "power2.out"
            })
            .to(projectType, {
                y: 0,
                opacity: 0.7,
                duration: 0.2,
                color: 'rgba(255, 245, 230, 0.7)'
            }, 0)
            .to(title, {
                y: 0,
                duration: 0.2,
                ease: "power2.out"
            }, 0);
    });
});

// Animation des skills
document.querySelectorAll('.skill-item').forEach(skill => {
    const bar = skill.querySelector('.skill-bar');
    const name = skill.querySelector('.skill-name');
    
    skill.addEventListener('mouseenter', () => {
        gsap.timeline()
            .to(name, {
                x: 10,
                color: '#fff5e6',
                duration: 0.3,
                ease: "power2.out"
            })
            .to(bar, {
                scaleX: 1.02,
                duration: 0.3,
                ease: "power2.out"
            }, 0);
    });

    skill.addEventListener('mouseleave', () => {
        gsap.timeline()
            .to(name, {
                x: 0,
                color: 'rgba(255, 245, 230, 0.9)',
                duration: 0.3,
                ease: "power2.out"
            })
            .to(bar, {
                scaleX: 1,
                duration: 0.3,
                ease: "power2.out"
            }, 0);
    });
});

function InitMail() {
    // https://dashboard.emailjs.com/admin/account
    emailjs.init({
      publicKey: "oMtLvb-9tnUL1PCQK",
    });
};

function sendMail(){
    InitMail();
    let parms = {
        name : document.getElementById("name").value,
        email : document.getElementById("email").value,
        message : document.getElementById("message").value,
    }
    console.log(parms)
    emailjs.send("service_r59i42m", "template_owijnbp", parms).then(alert("Email sent!!")).catch(err => console.log(err))
}
const submit = document.querySelector(".contact")

submit.addEventListener("submit", (e) => {
  e.preventDefault();
})