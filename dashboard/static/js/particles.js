/* =====================================================
   AGENTFLOW AI
   PARTICLE ENGINE
===================================================== */

class Particle {

    constructor(effect) {

        this.effect = effect;

        this.reset();

    }

    reset() {

        this.x = Math.random() * this.effect.width;
        this.y = Math.random() * this.effect.height;

        this.radius = Math.random() * 2 + 1;

        this.speedX = (Math.random() - 0.5) * 0.4;
        this.speedY = (Math.random() - 0.5) * 0.4;

    }

    update() {

        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < 0 || this.x > this.effect.width)
            this.speedX *= -1;

        if (this.y < 0 || this.y > this.effect.height)
            this.speedY *= -1;

        // Mouse Repulsion

        const dx = this.effect.mouse.x - this.x;
        const dy = this.effect.mouse.y - this.y;

        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 120) {

            const angle = Math.atan2(dy, dx);

            this.x -= Math.cos(angle) * 1.2;
            this.y -= Math.sin(angle) * 1.2;

        }

    }

    draw(ctx) {

        ctx.beginPath();

        ctx.arc(
            this.x,
            this.y,
            this.radius,
            0,
            Math.PI * 2
        );

        ctx.fillStyle = "#38BDF8";

        ctx.shadowBlur = 12;

        ctx.shadowColor = "#38BDF8";

        ctx.fill();

    }

}

class ParticleEffect {

    constructor(canvas) {

        this.canvas = canvas;

        this.ctx = canvas.getContext("2d");

        this.width = window.innerWidth;
        this.height = window.innerHeight;

        this.canvas.width = this.width;
        this.canvas.height = this.height;

        this.particles = [];

        this.numberOfParticles = 120;

/* ==========================================
   AURORA BLOBS
========================================== */

        this.blobs = [
            {
                x: this.width * 0.2,
                y: this.height * 0.2,
                radius: 220,
                color: "rgba(56,189,248,.12)",
                angle: 0
            },
            {
                x: this.width * 0.75,
                y: this.height * 0.3,
                radius: 260,
                color: "rgba(139,92,246,.10)",
                angle: 1
            },
            {
                x: this.width * 0.55,
                y: this.height * 0.75,
                radius: 240,
                color: "rgba(6,182,212,.08)",
                angle: 2
            }
        ];

        this.energyColor = "rgba(56,189,248,0)";
        this.energyStrength = 0;


        this.mouse = {

            x: -9999,
            y: -9999

        };

        this.createParticles();

        this.events();

        this.animate();

    }


    drawEnergyWave() {

    if (this.energyStrength <= 0) return;

    this.ctx.fillStyle = this.energyColor;

    this.ctx.globalAlpha = this.energyStrength;

    this.ctx.fillRect(
        0,
        0,
        this.width,
        this.height
    );

    this.ctx.globalAlpha = 1;

    this.energyStrength -= 0.008;

}


    drawAurora() {

    this.blobs.forEach(blob => {

        blob.angle += 0.002;

        blob.x += Math.cos(blob.angle) * 0.25;
        blob.y += Math.sin(blob.angle) * 0.25;

        const gradient = this.ctx.createRadialGradient(
            blob.x,
            blob.y,
            0,
            blob.x,
            blob.y,
            blob.radius
        );

        gradient.addColorStop(0, blob.color);
        gradient.addColorStop(1, "transparent");

        this.ctx.fillStyle = gradient;

        this.ctx.beginPath();

        this.ctx.arc(
            blob.x,
            blob.y,
            blob.radius,
            0,
            Math.PI * 2
        );

        this.ctx.fill();

    });

}

    createParticles() {

        this.particles = [];

        for (let i = 0; i < this.numberOfParticles; i++) {

            this.particles.push(
                new Particle(this)
            );

        }

    }

    pulse(color) {

    this.energyColor = color;

    this.energyStrength = 0.18;

}

    events() {

        window.addEventListener("resize", () => {

            this.width = window.innerWidth;
            this.height = window.innerHeight;

            this.canvas.width = this.width;
            this.canvas.height = this.height;

            this.createParticles();

        });

        window.addEventListener("mousemove", e => {

            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;

        });

        window.addEventListener("mouseleave", () => {

            this.mouse.x = -9999;
            this.mouse.y = -9999;

        });

    }

    connectParticles() {

        for (let a = 0; a < this.particles.length; a++) {

            for (let b = a + 1; b < this.particles.length; b++) {

                const dx = this.particles[a].x - this.particles[b].x;
                const dy = this.particles[a].y - this.particles[b].y;

                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 110) {

                    this.ctx.beginPath();

                    this.ctx.strokeStyle =
                        `rgba(56,189,248,${
                            1 - distance / 110
                        })`;

                    this.ctx.lineWidth = 0.6;

                    this.ctx.moveTo(
                        this.particles[a].x,
                        this.particles[a].y
                    );

                    this.ctx.lineTo(
                        this.particles[b].x,
                        this.particles[b].y
                    );

                    this.ctx.stroke();

                }

            }

        }

    }

    animate() {
        this.ctx.clearRect(
        0,
        0,
        this.width,
        this.height
);

        this.drawAurora();

        this.drawEnergyWave();

        this.particles.forEach(particle => {

            particle.update();

            particle.draw(this.ctx);

        });

        this.connectParticles();

        requestAnimationFrame(
            () => this.animate()
        );

    }

}

window.addEventListener("DOMContentLoaded", () => {

    const container = document.getElementById("particles");

    const canvas = document.createElement("canvas");

    canvas.id = "particleCanvas";

    container.appendChild(canvas);

    window.particleEngine =
    new ParticleEffect(canvas);

});