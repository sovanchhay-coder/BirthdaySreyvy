// ========== CORE DOM ELEMENTS ==========
const startButton = document.getElementById("startButton");
const welcomeScreen = document.getElementById("welcomeScreen");
const birthdayScene = document.getElementById("birthdayScene");
const typedMessage = document.getElementById("typedMessage");
const wishButton = document.getElementById("wishButton");
const wishMessage = document.getElementById("wishMessage");
const giftBox = document.getElementById("giftBox");
const musicButton = document.getElementById("musicButton");
const backgroundMusic = document.getElementById("backgroundMusic");
const finalMessageSection = document.getElementById("finalMessageSection");
const scrollIndicator = document.querySelector(".scroll-indicator");

// Canvas setup
const particleCanvas = document.getElementById("particleCanvas");
const fireworksCanvas = document.getElementById("fireworksCanvas");
const particleCtx = particleCanvas?.getContext("2d");
const fireworksCtx = fireworksCanvas?.getContext("2d");

// ========== SETTINGS & STATE ==========
const fullMessage = `🎂💖 Happy Birthday, my dear Sorn Sreyvy! 💖🎂

Today is your special day, and I want to wish you the happiest birthday ever. You are such a kind, intelligent, and beautiful person, and your smile has a wonderful way of bringing happiness to everyone around you.

I truly admire your dedication and hard work in the IT field. Your determination to keep learning and improving yourself is inspiring, and I have no doubt that you have a bright and successful future ahead of you.

On your birthday, I wish you good health, endless happiness, great success, and the strength to achieve every dream you have. Keep believing in yourself, stay confident, and never stop pursuing your goals.

I am grateful to have you in my life as a friend. Thank you for your kindness, support, and the positive energy you bring wherever you go. Honestly, whenever I talk to you or spend time with you, I feel very happy than usual. I can't fully explain why, but being around you always makes my day a little brighter.

🎉 Happy Birthday once again! 🎉

May your day be filled with love, joy, laughter, delicious cake, and unforgettable memories with the people who care about you. I wish you a wonderful year ahead filled with new opportunities and beautiful moments. ✨💕

Before I end this message, I want you to remember something from  my heart: no matter what the future holds for us, whether we remain friends or eventually walk different paths, I will always want to see you succeed. I hope you achieve your dreams, become the person you aspire to be, and find true happiness in life. Even if I am no longer part of your journey someday, I will always be cheering for you and feeling proud of everything you accomplish.

Love you, Kon Pov from Team Kapelele or in happy family . ❤️

From your small teacher, your friend, and your supporter,
Sor Sovanchhay ❤️`;

let musicPlaying = false;
let hasOpenedGift = false;
let isAnimatingTyping = false;

// ========== CANVAS SETUP ==========
function resizeCanvases() {
  if (particleCanvas) {
    particleCanvas.width = window.innerWidth;
    particleCanvas.height = window.innerHeight;
  }
  if (fireworksCanvas) {
    fireworksCanvas.width = window.innerWidth;
    fireworksCanvas.height = window.innerHeight;
  }
}

resizeCanvases();
window.addEventListener("resize", resizeCanvases);

// ========== TYPING ANIMATION ==========
function startTypingAnimation() {
  if (isAnimatingTyping) return;
  isAnimatingTyping = true;

  typedMessage.textContent = "";
  let index = 0;

  function typeCharacter() {
    if (index < fullMessage.length) {
      typedMessage.textContent += fullMessage[index];
      index++;

      const speed = Math.random() > 0.95 ? 5 : 30;
      setTimeout(typeCharacter, speed);
    } else {
      isAnimatingTyping = false;
    }
  }

  typeCharacter();
}

// ========== FIREWORKS ANIMATION ==========
class Particle {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.velocity = {
      x: (Math.random() - 0.5) * 8,
      y: (Math.random() - 0.5) * 8 - 2,
    };
    this.alpha = 1;
    this.decay = Math.random() * 0.015 + 0.008;
    this.radius = Math.random() * 3 + 2;
  }

  update() {
    this.velocity.x *= 0.98;
    this.velocity.y += 0.1;
    this.x += this.velocity.x;
    this.y += this.velocity.y;
    this.alpha -= this.decay;
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

let particles = [];

function createFireworks() {
  const colors = ["#ff8ec7", "#d8a5ff", "#ffd99a", "#ffb3d9", "#c170ff"];
  const burstCount = 5;

  for (let i = 0; i < burstCount; i++) {
    const x = Math.random() * window.innerWidth;
    const y =
      Math.random() * (window.innerHeight * 0.4) + window.innerHeight * 0.1;
    const color = colors[Math.floor(Math.random() * colors.length)];

    for (let j = 0; j < 30; j++) {
      particles.push(new Particle(x, y, color));
    }
  }
}

function animateFireworks() {
  if (!fireworksCtx) return;

  fireworksCtx.clearRect(0, 0, fireworksCanvas.width, fireworksCanvas.height);

  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].draw(fireworksCtx);

    if (particles[i].alpha <= 0) {
      particles.splice(i, 1);
    }
  }

  if (particles.length > 0) {
    requestAnimationFrame(animateFireworks);
  }
}

// ========== CONFETTI ANIMATION ==========
function createConfetti() {
  const confettiBurst = document.querySelector(".confetti-burst");
  if (!confettiBurst) return;

  confettiBurst.innerHTML = "";
  const confettiPieces = 50;

  for (let i = 0; i < confettiPieces; i++) {
    const confetti = document.createElement("div");
    const left = Math.random() * 100;
    const delay = Math.random() * 0.3;
    const duration = 2 + Math.random() * 1;

    confetti.style.cssText = `
      position: absolute;
      left: ${left}%;
      top: -10px;
      width: 10px;
      height: 10px;
      background: ${["#ff8ec7", "#d8a5ff", "#ffd99a"][Math.floor(Math.random() * 3)]};
      border-radius: 50%;
      animation: confettiFall ${duration}s linear ${delay}s forwards;
    `;

    confettiBurst.appendChild(confetti);
  }
}

// ========== MOUSE PARTICLES ==========
let lastX = 0;
let lastY = 0;

document.addEventListener("mousemove", (e) => {
  lastX = e.clientX;
  lastY = e.clientY;

  if (!particleCtx) return;

  const particle = new Particle(e.clientX, e.clientY, "#ffb3d9");
  particles.push(particle);
});

// ========== CLICK PARTICLES ==========
document.addEventListener("click", (e) => {
  if (!particleCtx) return;

  const colors = ["#ff8ec7", "#d8a5ff", "#ffd99a"];
  const particleCount = 20;

  for (let i = 0; i < particleCount; i++) {
    const angle = (Math.PI * 2 * i) / particleCount;
    const velocity = {
      x: Math.cos(angle) * (Math.random() * 5 + 2),
      y: Math.sin(angle) * (Math.random() * 5 + 2),
    };

    const p = new Particle(
      e.clientX,
      e.clientY,
      colors[Math.floor(Math.random() * colors.length)],
    );
    p.velocity = velocity;
    particles.push(p);
  }
});

// ========== PAGE TRANSITIONS ==========
function goToMainScene() {
  welcomeScreen.classList.remove("active");
  welcomeScreen.classList.add("hidden");

  setTimeout(() => {
    birthdayScene.classList.remove("hidden");
    startTypingAnimation();
    createFireworks();
    animateFireworks();

    // Trigger scroll indicator fade after a delay
    setTimeout(() => {
      if (scrollIndicator) scrollIndicator.style.opacity = "1";
    }, 1000);
  }, 300);
}

startButton?.addEventListener("click", goToMainScene);

// ========== WISH BUTTON ==========
wishButton?.addEventListener("click", () => {
  wishMessage.classList.remove("hidden");

  if (typeof gsap !== "undefined") {
    gsap.to(wishMessage, {
      duration: 0.5,
      scale: 1.1,
      repeat: 1,
      yoyo: true,
      ease: "elastic.out(1, 0.5)",
    });
  }

  setTimeout(() => {
    createFireworks();
    animateFireworks();
  }, 500);
});

// ========== GIFT BOX INTERACTION ==========
giftBox?.addEventListener("click", () => {
  if (hasOpenedGift) return;
  hasOpenedGift = true;

  // Animate gift box opening
  if (typeof gsap !== "undefined") {
    gsap.to(giftBox, {
      duration: 0.6,
      scale: 0.1,
      opacity: 0,
      y: -100,
      ease: "back.in",
      onComplete: () => {
        giftBox.style.display = "none";
      },
    });
  } else {
    giftBox.style.display = "none";
  }

  // Create confetti
  createConfetti();

  // Show final message
  setTimeout(() => {
    finalMessageSection.classList.remove("hidden");

    if (typeof gsap !== "undefined") {
      gsap.fromTo(
        finalMessageSection,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
      );
    }

    // Create more fireworks
    createFireworks();
    animateFireworks();
  }, 600);
});

// ========== MUSIC CONTROL ==========
musicButton?.addEventListener("click", (e) => {
  e.stopPropagation();

  musicPlaying = !musicPlaying;

  if (musicPlaying) {
    backgroundMusic
      ?.play()
      .catch((err) => console.log("Audio play failed:", err));
    musicButton.style.background = "linear-gradient(135deg, #ff8ec7, #d8a5ff)";
  } else {
    backgroundMusic?.pause();
    musicButton.style.background =
      "linear-gradient(135deg, rgba(255, 142, 199, 0.5), rgba(216, 165, 255, 0.5))";
  }
});

// ========== GSAP SCROLL ANIMATIONS ==========
if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);

  // Animate sections on scroll
  gsap.utils
    .toArray(
      ".countdown-section, .heart-section, .message-section, .gallery-section, .cake-section, .gift-section",
    )
    .forEach((element) => {
      gsap.fromTo(
        element,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: element,
            start: "top 80%",
            once: true,
          },
        },
      );
    });
}

// ========== PARTICLE ANIMATION LOOP ==========
function animateParticles() {
  if (!particleCtx) {
    requestAnimationFrame(animateParticles);
    return;
  }

  particleCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);

  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].draw(particleCtx);

    if (particles[i].alpha <= 0) {
      particles.splice(i, 1);
    }
  }

  requestAnimationFrame(animateParticles);
}

animateParticles();

// ========== PETALS ANIMATION ==========
function createPetals() {
  const petalsContainer = document.querySelector(".petals-container");
  if (!petalsContainer) return;

  for (let i = 0; i < 15; i++) {
    const petal = document.createElement("div");
    const left = Math.random() * 100;
    const delay = Math.random() * 3;
    const duration = 4 + Math.random() * 2;
    const xOffset = Math.random() * 100 - 50;

    petal.innerHTML = "🌸";
    petal.style.cssText = `
      position: absolute;
      left: ${left}%;
      top: -20px;
      font-size: 1.5rem;
      opacity: 0.7;
      animation: fallPetal${i} ${duration}s linear ${delay}s infinite;
      pointer-events: none;
    `;

    petalsContainer.appendChild(petal);
  }
}

createPetals();

// ========== ADD ANIMATION KEYFRAMES ==========
const style = document.createElement("style");
let petalKeyframes = `
  @keyframes confettiFall {
    to {
      transform: translateY(100vh) rotate(360deg);
      opacity: 0;
    }
  }
`;

for (let i = 0; i < 15; i++) {
  const xOffset = Math.random() * 100 - 50;
  petalKeyframes += `
    @keyframes fallPetal${i} {
      to {
        transform: translateY(100vh) translateX(${xOffset}px) rotate(360deg);
        opacity: 0;
      }
    }
  `;
}

style.textContent = petalKeyframes;
document.head.appendChild(style);

// ========== KEYBOARD SHORTCUTS ==========
document.addEventListener("keydown", (e) => {
  if (e.key === " ") {
    e.preventDefault();
    if (welcomeScreen.classList.contains("active")) {
      goToMainScene();
    }
  }
});

// ========== PAGE VISIBILITY ==========
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    if (musicPlaying) backgroundMusic?.pause();
  } else {
    if (musicPlaying)
      backgroundMusic
        ?.play()
        .catch((err) => console.log("Audio play failed:", err));
  }
});

// ========== INITIAL SETUP ==========
window.addEventListener("load", () => {
  // Preload music
  if (backgroundMusic) {
    backgroundMusic.loop = true;
    backgroundMusic.volume = 0.5;
  }

  // Initialize animations
  createFireworks();
  animateFireworks();
});

// ========== ACCESSIBILITY & PERFORMANCE ==========
if (navigator.userAgent.match(/mobile|android|iphone|ipad/i)) {
  // Reduce particle count on mobile
  document.documentElement.style.setProperty("--particle-count", "20");
}

// Prevent right-click context menu on gift box (optional)
giftBox?.addEventListener("contextmenu", (e) => {
  e.preventDefault();
  giftBox.click();
  return false;
});

// ========== TOUCH SUPPORT ==========
document.addEventListener("touchstart", (e) => {
  if (!particleCtx) return;

  const touch = e.touches[0];
  const colors = ["#ff8ec7", "#d8a5ff", "#ffd99a"];
  const particleCount = 15;

  for (let i = 0; i < particleCount; i++) {
    const angle = (Math.PI * 2 * i) / particleCount;
    const velocity = {
      x: Math.cos(angle) * (Math.random() * 4 + 1.5),
      y: Math.sin(angle) * (Math.random() * 4 + 1.5),
    };

    const p = new Particle(
      touch.clientX,
      touch.clientY,
      colors[Math.floor(Math.random() * colors.length)],
    );
    p.velocity = velocity;
    particles.push(p);
  }
});

// ========== CONSOLE MESSAGE ==========
console.log(
  "%c🎂 Happy Birthday Sorn Sreyvy! 💖",
  "color: #ff8ec7; font-size: 20px; font-weight: bold;",
);
console.log(
  "%cWishing you the most wonderful birthday ever!",
  "color: #d8a5ff; font-size: 14px;",
);
