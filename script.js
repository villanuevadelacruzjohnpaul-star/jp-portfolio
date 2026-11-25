
const canvas = document.createElement("canvas");

canvas.id = "particles";

document.body.prepend(canvas);

const ctx = canvas.getContext("2d");

let particles = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();

window.addEventListener("resize", resizeCanvas);

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 1 + 0.2;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < 0 || this.x > canvas.width) {
            this.speedX *= -1;
        }

        if (this.y < 0 || this.y > canvas.height) {
            this.speedY *= -1;
        }
    }

    draw() {
        ctx.fillStyle = "rgba(0, 170, 255, 0.7)";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

for (let i = 0; i < 300; i++) {
    particles.push(new Particle());
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });

    requestAnimationFrame(animateParticles);
}

animateParticles();
// Scroll Reveal Animation
const projectCards = document.querySelectorAll(".project-card");

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("show");
        }
    });
}, {
    threshold: 0.2
});

projectCards.forEach(card => {
    revealObserver.observe(card);
});

const hangingID = document.getElementById("hangingID");
const idCard = document.getElementById("idCard");
const idLace = document.querySelector(".id-lace");
const idConnector = document.querySelector(".id-connector");
const idHardware = document.querySelector(".id-hardware");

const laceShadow = document.getElementById("lace-shadow");
const laceBand = document.getElementById("lace-band");
const laceHighlight = document.getElementById("lace-highlight");
const lacePattern = document.getElementById("lace-pattern");

if (hangingID && idCard && idLace && idConnector) {

    let dragging = false;
    let dragged = false;
    let clickedCard = false;

    let x = 0;
    let y = 0;

    let velocityX = 0;
    let velocityY = 0;

    let startX = 0;
    let startY = 0;

    let previousX = 0;
    let previousY = 0;
    let previousTime = 0;

    let animationFrame;

       function updateID() {
        const laceHeight = idLace.clientHeight;

        const endX = 60 + (x * 120 / idLace.clientWidth);
        const endY = 300 * (laceHeight + y) / laceHeight;

        const curve = `M 60 0
            C ${60 + (endX - 60) * 0.12} ${endY * 0.25},
              ${60 + (endX - 60) * 0.85} ${endY * 0.85},
              ${endX} ${endY}`;

        laceShadow.setAttribute("d", curve);
        laceBand.setAttribute("d", curve);
        laceHighlight.setAttribute("d", curve);
        lacePattern.setAttribute("d", curve);

        const tilt = -Math.atan2(x, laceHeight + y) * (180 / Math.PI);

        idHardware.style.transform =
            `translateX(-50%) translate(${x}px, ${y}px) rotate(${tilt}deg)`;
    }

    updateID();
    
    hangingID.addEventListener("pointerdown", (e) => {
        if (e.button !== 0) return;
        if (!e.target.closest("#idCard")) return;
        dragging = true;
        dragged = false;
        clickedCard = e.target.closest("#idCard") !== null;

        startX = e.clientX - x;
        startY = e.clientY - y;

        previousX = e.clientX;
        previousY = e.clientY;
        previousTime = performance.now();

        velocityX = 0;
        velocityY = 0;

        cancelAnimationFrame(animationFrame);

        hangingID.setPointerCapture(e.pointerId);
    });

    hangingID.addEventListener("pointermove", (e) => {
        if (!dragging) return;

        const dx = e.clientX - startX;
        const dy = e.clientY - startY;

        if (Math.abs(dx - x) > 3 || Math.abs(dy - y) > 3) {
            dragged = true;
        }

        x = dx;
        y = dy;

        const now = performance.now();
        const deltaTime = now - previousTime;

        if (deltaTime > 0) {
            velocityX = (e.clientX - previousX) / deltaTime * 16;
            velocityY = (e.clientY - previousY) / deltaTime * 16;
        }

        previousX = e.clientX;
        previousY = e.clientY;
        previousTime = now;

        updateID();
    });

    function releaseID() {
        if (!dragging) return;

        dragging = false;

        function swing() {
            velocityX -= x * 0.079;
            velocityY -= y * 0.079;

            velocityX *= 0.99;
            velocityY *= 0.99;

            x += velocityX;
            y += velocityY;

            updateID();

            if (
                Math.abs(x) > 0.3 ||
                Math.abs(y) > 0.3 ||
                Math.abs(velocityX) > 0.3 ||
                Math.abs(velocityY) > 0.3
            ) {
                animationFrame = requestAnimationFrame(swing);
            } else {
                x = 0;
                y = 0;
                velocityX = 0;
                velocityY = 0;

                updateID();
            }
        }

        animationFrame = requestAnimationFrame(swing);
    }
    hangingID.addEventListener("pointerup", () => {
        if (clickedCard && !dragged) {
            idCard.classList.toggle("flipped");
        }

        clickedCard = false;
        dragged = false;
        releaseID();
    });

    hangingID.addEventListener("pointercancel", () => {
        clickedCard = false;
        dragged = false;
        releaseID();
    });
}

/* SPIDERMAN MOUSE REVEAL */

const profileReveal = document.querySelector(".profile-reveal");
const spidermanImage = document.querySelector(".profile-spiderman");

profileReveal.addEventListener("mousemove", (e) => {
    const rect = profileReveal.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    spidermanImage.style.setProperty("--mouse-x", `${x}px`);
    spidermanImage.style.setProperty("--mouse-y", `${y}px`);
    spidermanImage.style.setProperty("--reveal-size", "90px");
});

profileReveal.addEventListener("mouseleave", () => {
    spidermanImage.style.setProperty("--reveal-size", "0px");
});
