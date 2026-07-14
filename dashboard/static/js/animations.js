/* ==========================================
   AGENTFLOW AI
   ANIMATION ENGINE
========================================== */

class AnimationEngine {

    constructor() {

        this.init();

    }

    init() {

        this.pageEntrance();

        this.cardHover();

        this.buttonRipple();

    }

    /* ==========================================
       PAGE ENTRANCE
    ========================================== */

    pageEntrance() {

        const animated = document.querySelectorAll(
            ".glass, .agent-card, .stat-card"
        );

        animated.forEach((el, index) => {

            el.animate(
                [
                    {
                        opacity: 0,
                        transform: "translateY(40px)"
                    },
                    {
                        opacity: 1,
                        transform: "translateY(0)"
                    }
                ],
                {
                    duration: 700,
                    delay: index * 80,
                    easing: "ease-out",
                    fill: "forwards"
                }
            );

        });

    }

    /* ==========================================
       CARD HOVER
    ========================================== */

    cardHover() {

        document.querySelectorAll(".glass").forEach(card => {

            card.addEventListener("mousemove", e => {

                const rect = card.getBoundingClientRect();

                const x = e.clientX - rect.left;

                const y = e.clientY - rect.top;

                card.style.setProperty("--mouseX", `${x}px`);

                card.style.setProperty("--mouseY", `${y}px`);

            });

        });

    }

    /* ==========================================
       RIPPLE BUTTON
    ========================================== */

    buttonRipple() {

        document.querySelectorAll("button").forEach(button => {

            button.addEventListener("click", e => {

                const circle = document.createElement("span");

                const size = Math.max(
                    button.clientWidth,
                    button.clientHeight
                );

                const rect = button.getBoundingClientRect();

                circle.style.width = circle.style.height =
                    `${size}px`;

                circle.style.left =
                    `${e.clientX - rect.left - size / 2}px`;

                circle.style.top =
                    `${e.clientY - rect.top - size / 2}px`;

                circle.classList.add("ripple");

                button.appendChild(circle);

                setTimeout(() => {

                    circle.remove();

                }, 600);

            });

        });

    }

}

/* ==========================================
   COUNTER ANIMATION
========================================== */

function animateCounter(id, target, duration = 1500) {

    const element = document.getElementById(id);

    if (!element) return;

    let start = 0;

    const step = target / (duration / 16);

    function update() {

        start += step;

        if (start >= target) {

            element.textContent = target;

            return;

        }

        element.textContent = Math.floor(start);

        requestAnimationFrame(update);

    }

    update();

}

/* ==========================================
   FLOAT EFFECT
========================================== */

function floatElement(element) {

    element.animate(
        [
            {
                transform: "translateY(0px)"
            },
            {
                transform: "translateY(-8px)"
            },
            {
                transform: "translateY(0px)"
            }
        ],
        {
            duration: 3000,
            iterations: Infinity,
            easing: "ease-in-out"
        }
    );

}

/* ==========================================
   AGENT PULSE
========================================== */

function pulseAgent(agentId) {

    const agent = document.getElementById(agentId);

    if (!agent) return;

    agent.animate(
        [
            {
                transform: "scale(1)"
            },
            {
                transform: "scale(1.05)"
            },
            {
                transform: "scale(1)"
            }
        ],
        {
            duration: 900,
            iterations: Infinity
        }
    );

}

/* ==========================================
   STOP PULSE
========================================== */

function stopPulse(agentId) {

    const agent = document.getElementById(agentId);

    if (!agent) return;

    agent.getAnimations().forEach(animation => {

        animation.cancel();

    });

}

/* ==========================================
   TOAST
========================================== */

function showToast(message) {

    const toast = document.createElement("div");

    toast.className = "toast";

    toast.textContent = message;

    document.body.appendChild(toast);

    setTimeout(() => {

        toast.classList.add("show");

    }, 50);

    setTimeout(() => {

        toast.classList.remove("show");

        setTimeout(() => {

            toast.remove();

        }, 400);

    }, 2500);

}

/* ==========================================
   START ENGINE
========================================== */
window.addEventListener("DOMContentLoaded", () => {

    window.animations = new AnimationEngine();

});

