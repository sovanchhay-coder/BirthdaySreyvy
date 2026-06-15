// DOM nodes for the page interactions
const openButton = document.getElementById("openButton");
const wishButton = document.getElementById("wishButton");
const welcomeScreen = document.getElementById("welcomeScreen");
const birthdayScene = document.getElementById("birthdayScene");
const typedMessage = document.getElementById("typedMessage");
const birthdayAudio = document.getElementById("birthdayAudio");
const wishText = document.getElementById("wishText");

// Full birthday message text in one block for the typing effect
const typingLines = [
  `🎂💖 Happy Birthday, my dear Sorn Sreyvy! 💖🎂

Today is your special day, and I hope you have a very happy birthday. You are a kind, smart, and beautiful person. Your smile always makes people feel happy, and your caring heart makes everyone around you feel comfortable and appreciated.

I really admire how hard you work in the IT field. You are always willing to learn new things and improve yourself. Your dedication, effort, and positive attitude inspire me a lot. I believe these qualities will help you achieve great success in the future.

On your birthday, I wish you good health, happiness, and success in everything you do. May all your dreams come true, and may you always have the strength and confidence to overcome any challenges in life.

Keep smiling, keep believing in yourself, and keep working toward your goals. You are an amazing person, and I hope this new year of your life brings you many wonderful opportunities and beautiful memories.

I am very grateful to have you as my friend. Thank you for always being kind and supportive. I truly appreciate our friendship.

🎉 Happy Birthday once again! 🎉

May your day be filled with love, joy, laughter, delicious cake, and wonderful moments with your family and friends. Wishing you a fantastic year ahead! ✨💕

From: Sor Sovanchhay ❤️`,
];

let currentCharacter = 0;
let typingTimeout = null;

const fireworkCanvas = document.getElementById("fireworkCanvas");
const fireworkCtx = fireworkCanvas?.getContext("2d");
const fireworks = [];
const particles = [];
const fireworkColors = ["#ffb4e6", "#d5a0ff", "#f9dc9a", "#a5e0ff"];
let fireworkAnimationId = null;

function resizeFireworkCanvas() {
  if (!fireworkCanvas) return;
  fireworkCanvas.width = window.innerWidth;
  fireworkCanvas.height = window.innerHeight;
}

window.addEventListener("resize", resizeFireworkCanvas);
resizeFireworkCanvas();

function randomBetween(min, max) {
  return min + Math.random() * (max - min);
}

function createFireworkRocket() {
  return {
    x: randomBetween(window.innerWidth * 0.18, window.innerWidth * 0.82),
    y: window.innerHeight + 12,
    targetY: randomBetween(
      window.innerHeight * 0.22,
      window.innerHeight * 0.45,
    ),
    vx: randomBetween(-1.25, 1.25),
    vy: randomBetween(-8.2, -7.0),
    color: fireworkColors[Math.floor(Math.random() * fireworkColors.length)],
    trail: [],
  };
}

function createFireworkParticles(x, y, color) {
  const count = 18 + Math.floor(Math.random() * 10);
  for (let i = 0; i < count; i += 1) {
    const angle = Math.random() * Math.PI * 2;
    const speed = randomBetween(1.8, 4.6);
    particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      radius: randomBetween(2, 4.4),
      alpha: 1,
      decay: randomBetween(0.016, 0.028),
      color,
      glow: randomBetween(10, 18),
    });
  }
}

function launchFirework() {
  fireworks.push(createFireworkRocket());
  if (!fireworkAnimationId) {
    fireworkAnimationId = requestAnimationFrame(updateFireworks);
  }
}

function triggerFireworks() {
  const launches = 2 + Math.floor(Math.random() * 3);
  for (let i = 0; i < launches; i += 1) {
    setTimeout(launchFirework, i * 140);
  }
}

function updateFireworks() {
  if (!fireworkCtx) return;
  fireworkCtx.clearRect(0, 0, fireworkCanvas.width, fireworkCanvas.height);
  fireworkCtx.globalCompositeOperation = "lighter";

  for (let i = fireworks.length - 1; i >= 0; i -= 1) {
    const rocket = fireworks[i];
    rocket.trail.unshift({ x: rocket.x, y: rocket.y });
    if (rocket.trail.length > 6) rocket.trail.pop();

    rocket.vy += 0.26;
    rocket.x += rocket.vx;
    rocket.y += rocket.vy;

    fireworkCtx.globalAlpha = 0.35;
    fireworkCtx.fillStyle = rocket.color;
    rocket.trail.forEach((point, index) => {
      const trailAlpha = 0.12 + (index / rocket.trail.length) * 0.26;
      fireworkCtx.globalAlpha = trailAlpha;
      fireworkCtx.beginPath();
      fireworkCtx.arc(point.x, point.y, 2, 0, Math.PI * 2);
      fireworkCtx.fill();
    });

    fireworkCtx.globalAlpha = 1;
    fireworkCtx.shadowBlur = 12;
    fireworkCtx.shadowColor = rocket.color;
    fireworkCtx.fillStyle = rocket.color;
    fireworkCtx.beginPath();
    fireworkCtx.arc(rocket.x, rocket.y, 4.2, 0, Math.PI * 2);
    fireworkCtx.fill();

    if (rocket.y <= rocket.targetY || rocket.vy >= 0) {
      createFireworkParticles(rocket.x, rocket.y, rocket.color);
      fireworks.splice(i, 1);
    }
  }

  for (let i = particles.length - 1; i >= 0; i -= 1) {
    const particle = particles[i];
    particle.vx *= 0.98;
    particle.vy += 0.08;
    particle.x += particle.vx;
    particle.y += particle.vy;
    particle.alpha -= particle.decay;

    if (particle.alpha <= 0) {
      particles.splice(i, 1);
      continue;
    }

    fireworkCtx.globalAlpha = particle.alpha;
    fireworkCtx.fillStyle = particle.color;
    fireworkCtx.shadowBlur = particle.glow;
    fireworkCtx.shadowColor = particle.color;
    fireworkCtx.beginPath();
    fireworkCtx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
    fireworkCtx.fill();
  }

  if (fireworks.length > 0 || particles.length > 0) {
    fireworkAnimationId = requestAnimationFrame(updateFireworks);
  } else {
    fireworkAnimationId = null;
    fireworkCtx.clearRect(0, 0, fireworkCanvas.width, fireworkCanvas.height);
  }
}

// Activate the birthday scene and start typing the message
function openSurprise() {
  welcomeScreen.classList.add("hide-animation");

  clearTimeout(typingTimeout);
  currentCharacter = 0;
  typedMessage.textContent = "";

  setTimeout(() => {
    welcomeScreen.classList.add("hidden");
    birthdayScene.classList.remove("hidden");
    birthdayScene.classList.add("showing");
    resizeFireworkCanvas();
    startTyping();
  }, 480);
}

// Play background music after user interaction
function playBackgroundMusic() {
  const audioUrl =
    "https://cdn.pixabay.com/download/audio/2021/09/30/audio_68b5ba276b.mp3?filename=romantic-12790.mp3";
  birthdayAudio.src = audioUrl;
  birthdayAudio.volume = 0.55;
  birthdayAudio.loop = true;
  birthdayAudio.play().catch(() => {
    console.warn(
      "Background music requires additional user interaction to play in some browsers.",
    );
  });
}

// Typing animation for the birthday message block
function startTyping() {
  const text = typingLines[0];

  if (currentCharacter < text.length) {
    typedMessage.textContent += text[currentCharacter];
    currentCharacter += 1;
    typingTimeout = setTimeout(startTyping, 30);
  }
}

// Make wish animation with hearts and fireworks
function makeWish() {
  wishText.classList.remove("hidden");
  wishText.classList.add("visible");
  triggerFireworks();
  createFloatingHearts();

  setTimeout(() => {
    wishText.classList.remove("visible");
    wishText.classList.add("hidden");
  }, 3800);
}

// Floating hearts animation for the wish effect
function createFloatingHearts() {
  for (let count = 0; count < 16; count += 1) {
    const heart = document.createElement("div");
    heart.className = "wish-heart";
    heart.style.left = `${20 + Math.random() * 60}%`;
    heart.style.bottom = "16%";
    heart.style.animationDuration = `${1.6 + Math.random() * 0.8}s`;
    heart.style.animationDelay = `${Math.random() * 0.2}s`;
    document.body.appendChild(heart);
    heart.addEventListener("animationend", () => heart.remove());
  }
}

openButton.addEventListener("click", () => {
  openSurprise();
  playBackgroundMusic();
});
wishButton.addEventListener("click", makeWish);

// Dynamic heart CSS for wish animation
const dynamicStyle = document.createElement("style");
dynamicStyle.textContent = `
.wish-heart {
  position: fixed;
  width: 18px;
  height: 18px;
  background: linear-gradient(135deg, #ff95d1, #ffd9f0);
  transform: rotate(45deg);
  border-radius: 22px 22px 0 22px;
  pointer-events: none;
  z-index: 999;
}
.wish-heart::before,
.wish-heart::after {
  content: '';
  position: absolute;
  width: 18px;
  height: 18px;
  background: inherit;
  border-radius: 50%;
}
.wish-heart::before {
  top: -9px;
  left: 0;
}
.wish-heart::after {
  left: 9px;
  top: 0;
}
@keyframes heartRise {
  0% { transform: translateY(0) rotate(45deg) scale(0.85); opacity: 0.95; }
  60% { opacity: 0.95; }
  100% { transform: translateY(-250px) rotate(45deg) scale(0.4); opacity: 0; }
}
.wish-heart {
  animation-name: heartRise;
  animation-timing-function: ease-out;
  animation-fill-mode: forwards;
}
`;

document.head.appendChild(dynamicStyle);
