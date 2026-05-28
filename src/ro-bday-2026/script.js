(() => {
  let W = window.innerWidth;
  let H = window.innerHeight;
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  const COUNT = 120;
  const particles = [];

  const colors = [
    '#4d8cff', '#7ab3ff', '#a8d0ff', '#ffffff',
    '#ffd700', '#ffec6e', '#c8e6ff', '#6baeff'
  ];

  function rand(a, b) {
    return Math.random() * (b - a) + a;
  }

  function Particle() {
    this.reset = function() {
      this.x = rand(0, W);
      this.y = rand(-H, 0);
      this.r = rand(5, 14);
      this.d = rand(10, COUNT);
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.tilt = rand(-10, 10);
      this.tiltInc = rand(0.04, 0.1);
      this.tiltAngle = 0;
    };
    this.reset();

    this.draw = function() {
      ctx.beginPath();
      ctx.lineWidth = this.r / 2;
      ctx.strokeStyle = this.color;
      ctx.moveTo(this.x + this.tilt + this.r / 3, this.y);
      ctx.lineTo(this.x + this.tilt, this.y + this.tilt + this.r / 5);
      ctx.stroke();
    };
  }

  function loop() {
    requestAnimationFrame(loop);
    ctx.clearRect(0, 0, W, H);
    for (let i = 0; i < COUNT; i++) {
      const p = particles[i];
      p.draw();
      p.tiltAngle += p.tiltInc;
      p.y += (Math.cos(p.d) + 3 + p.r / 2) / 2;
      p.tilt = Math.sin(p.tiltAngle - i / 3) * 15;
      if (p.y > H || p.x < -30 || p.x > W + 30) {
        p.x = rand(0, W);
        p.y = -20;
        p.tilt = rand(-10, 10);
      }
    }
  }

  window.addEventListener('resize', () => {
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;
  });

  for (let i = 0; i < COUNT; i++) particles.push(new Particle());
  canvas.width = W;
  canvas.height = H;
  loop();
})();
