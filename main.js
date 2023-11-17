// ------------------------------ particles effect --------------------------------- //

const particles = [];
let mouse = { x: -100, y: -100, radius: 100 };
const particles_cont = document.getElementById("header");
const canvas = document.getElementById("particles-canvas");
const ctx = canvas.getContext("2d");
canvas.width = particles_cont.clientWidth;
canvas.height = particles_cont.clientHeight;

particles_cont.onmousemove = (e) => {
  mouse.x = e.clientX - window.scrollX;
  mouse.y = e.clientY + window.scrollY;
};

particles_cont.onmouseleave = () => {
  mouse.x = -100;
  mouse.y = -100;
};

function initParticles() {
  for (let i = 0; i < 600; i++) {
    const p_object = {
      radius: Math.random() * 5 + 2,
      vx: Math.random() * 2 - 1,
      vy: Math.random() * 2 - 1,
    };

    p_object.opacity = (p_object.radius - 4) / 5;

    p_object.x =
      Math.random() * (window.innerWidth - 2 * p_object.radius) +
      p_object.radius;
    p_object.y =
      Math.random() * (window.innerHeight - 2 * p_object.radius) +
      p_object.radius;

    particles.push(p_object);
  }
}

const loop = () => {
  canvas.width = particles_cont.clientWidth;
  canvas.height = particles_cont.clientHeight;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (const particle of particles) {
    if (particle.iteration && particle.iteration > 1) particle.iteration--;

    const factor = repulse(particle);
    keepInBounds(particle);
    draw(particle, factor);
  }

  window.requestAnimationFrame(loop);
};

function draw(particle, factor) {
  if (factor < 150) particle.iteration = 30;
  const shade = 180 + (255 - 180) / particle.iteration;

  ctx.beginPath();
  ctx.lineWidth = 1;
  ctx.arc(particle.x, particle.y, particle.radius, 0, 2 * Math.PI, false);
  if (particle.iteration)
    ctx.fillStyle = `rgba(${shade}, ${shade}, 255,${particle.opacity})`;
  else ctx.fillStyle = `rgba(255,255,255,${particle.opacity})`;
  ctx.strokeStyle = "transparent";
  ctx.fill();
  ctx.stroke();
}

function keepInBounds(particle) {
  if (
    particle.x >= canvas.width - particle.radius ||
    particle.x <= particle.radius
  )
    particle.vx = -particle.vx;

  if (
    particle.y >= canvas.height - particle.radius ||
    particle.y <= particle.radius
  )
    particle.vy = -particle.vy;

  particle.x = particle.x + particle.vx;
  particle.y = particle.y + particle.vy;
}

function repulse(particle) {
  var dx = particle.x - mouse.x,
    dy = particle.y - mouse.y,
    mouse_dist = Math.sqrt(dx ** 2 + dy ** 2);

  var normVec = { x: dx / mouse_dist, y: dy / mouse_dist },
    velocity = 20,
    repulseFactor = clamp(
      (-1 *
        Math.pow(mouse_dist / ((particle.opacity + 0.45) * mouse.radius), 2) +
        1) *
        velocity,
      0,
      50
    );

  particle.x = particle.x + normVec.x * repulseFactor;
  particle.y = particle.y + normVec.y * repulseFactor;

  if (particle.x > canvas.width - particle.radius)
    particle.x = canvas.width - particle.radius;

  if (particle.x < particle.radius) particle.x = particle.radius;

  if (particle.y > canvas.height - particle.radius)
    particle.y = canvas.height - particle.radius;

  if (particle.y < particle.radius) particle.y = particle.radius;

  return mouse_dist;
}

function clamp(number, min, max) {
  return Math.min(Math.max(number, min), max);
}

initParticles();
loop();

// --------------------------------- gsap animations ------------------------------------ //

gsap.registerPlugin(ScrollTrigger);

gsap.to(particles_cont, {
  scrollTrigger: {
    trigger: "#header",
    scrub: 1.2,
    start: "center center",
  },
  duration: 0.2,
  height: window.innerHeight - 150,
});

gsap.from(".greetings-el", {
  scrollTrigger: {
    trigger: "#header",
  },
  duration: 0.5,
  delay: 0.2,
  x: -100,
  stagger: 0.2,
  opacity: 0,
});

// ---------------------- Functions ------------------------------------

let infoParent = document.getElementById("info-parent");
let children = infoParent.children;
function currentProject(type) {
  for (let child of children) {
    child.style.transform = "translateX(20%)";
    child.style.opacity = 0;
  }
  document.getElementById(type).style.transform = "none";
  document.getElementById(type).style.opacity = "1";
}
