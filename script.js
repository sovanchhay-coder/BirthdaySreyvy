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
Today, the world feels a little brighter because it’s your special day. You are such a rare and precious gem — incredibly cute, endlessly kind, and wonderfully smart in every way. Your smile has this magical power to light up any room, and your gentle heart makes everyone around you feel cared for and valued.

I truly admire how passionately you chase your goals in the IT world. Watching you work so hard, stay curious, and keep growing every single day fills me with so much pride and inspiration. You’re not just talented — you’re dedicated, resilient, and always ready to learn something new. That beautiful combination makes you truly unstoppable.

This new year of your life, I wish you an abundance of success that makes your heart soar, happiness that overflows in the simplest and sweetest moments, and unforgettable beautiful memories that you’ll cherish forever. May every dream you hold in your heart bloom into reality, one lovely step at a time. And whenever the path feels challenging, may you always find the inner strength, courage, and support you need to keep moving forward with confidence.

Keep shining your beautiful light, keep smiling that radiant smile, and never stop being the warm, amazing, one-of-a-kind person you are. The world is so much better with you in it.

I’m incredibly grateful and happy to have you as my friend — someone I can laugh with, admire, and treasure. Thank you for being you. 🎉

Wishing you the most magical birthday filled with love, joy, cake, and all the happiness in the world! May this year be your sweetest chapter yet. ✨💕\n\nFrom me Sor Sovanchhay`,
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
