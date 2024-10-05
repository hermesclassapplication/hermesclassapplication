let particles = [];
let numParticles = 50;
let symmetry = 8;
let angle = 360 / symmetry;
let isMouseHovering = false;
let colors = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  for (let i = 0; i < numParticles; i++) {
    particles.push(new Particle());
  }
  colors = [
    color(66, 135, 245), 
    color(32, 120, 220),
    color(16, 75, 170), 
    color(255, 195, 160), 
    color(240, 180, 130)
  ];
  background(0);
}

function draw() {
  background(0, 30); 
  translate(width / 2, height / 2);
  if (isMouseHovering) {
    for (let i = 0; i < symmetry; i++) {
      rotate(angle);
      drawKaleidoscope(mouseX - width / 2, mouseY - height / 2);
      push();
      scale(1, -1);
      drawKaleidoscope(mouseX - width / 2, mouseY - height / 2);
      pop();
    }
  } else {
    for (let particle of particles) {
      particle.update();
      particle.show();
    }
  }
}

function drawKaleidoscope(x, y) {
  let colIndex = floor(map(mouseX, 0, width, 0, colors.length));
  let nextColIndex = (colIndex + 1) % colors.length;
  let lerpVal = map(mouseX % (width / colors.length), 0, width / colors.length, 0, 1);
  let kaleidoscopeColor = lerpColor(colors[colIndex], colors[nextColIndex], lerpVal);
  stroke(kaleidoscopeColor);
  strokeWeight(2);
  line(x, y, pmouseX - width / 2, pmouseY - height / 2);
}

class Particle {
  constructor() {
    this.pos = createVector(random(width), random(height));
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.maxSpeed = 1.8;
    this.prevPos = this.pos.copy();
  }

  update() {
    let mouse = createVector(mouseX - width / 2, mouseY - height / 2);
    let angle = noise(this.pos.x * 0.01, this.pos.y * 0.01) * TWO_PI * 4.8;
    let dir = p5.Vector.fromAngle(angle);
    dir.mult(0.05);
    this.acc.add(dir);
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);
    this.acc.mult(0);
    this.edges();
  }

  show() {
    let distanceToMouse = dist(this.pos.x, this.pos.y, mouseX - width / 2, mouseY - height / 2);
    let maxDist = dist(0, 0, width / 2, height / 2);
    let lerpValue = map(distanceToMouse, 0, maxDist, 0, 1);
    let colIndex = floor(map(mouseX, 0, width, 0, colors.length));
    let nextColIndex = (colIndex + 1) % colors.length;
    let particleColor = lerpColor(colors[colIndex], colors[nextColIndex], lerpValue);
    stroke(particleColor);
    strokeWeight(2);
    line(this.pos.x, this.pos.y, this.prevPos.x, this.prevPos.y);
    this.updatePrev();
  }

  updatePrev() {
    this.prevPos.x = this.pos.x;
    this.prevPos.y = this.pos.y;
  }

  edges() {
    if (this.pos.x > width / 2) this.pos.x = -width / 2;
    if (this.pos.x < -width / 2) this.pos.x = width / 2;
    if (this.pos.y > height / 2) this.pos.y = -height / 2;
    if (this.pos.y < -height / 2) this.pos.y = height / 2;
    this.updatePrev();
  }
}

function mouseMoved() {
  isMouseHovering = true;
}

function mouseExited() {
  isMouseHovering = false;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
