// worker for rendering constellation connections to OffscreenCanvas

let canvas: OffscreenCanvas | null = null;
let ctx: OffscreenCanvasRenderingContext2D | null = null;
let stars: any[] = [];
let connections: any[] = [];
let planets: any[] = [];
let mouseX = -1000;
let mouseY = -1000;
let brightness = 1;
let isRunning = false;

self.onmessage = function(e: MessageEvent) {
  const data = e.data;
  if (data.type === 'init') {
    canvas = data.canvas;
    ctx = canvas?.getContext('2d', { alpha: true }) as OffscreenCanvasRenderingContext2D;
    stars = data.stars;
    connections = data.connections;
    planets = stars.filter(function(s) { return s.type === 'planet'; });
    brightness = data.brightness;
    if (!isRunning && ctx) {
      isRunning = true;
      requestAnimationFrame(render);
    }
  } else if (data.type === 'resize') {
    if (canvas) {
      canvas.width = data.width;
      canvas.height = data.height;
    }
  } else if (data.type === 'updateMouse') {
    mouseX = data.mouseX;
    mouseY = data.mouseY;
  } else if (data.type === 'updateData') {
    stars = data.stars;
    connections = data.connections;
    planets = stars.filter(function(s) { return s.type === 'planet'; });
    brightness = data.brightness;
  }
};

function render(t: number) {
  if (!ctx || !canvas) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw ConstellationConnect
  if (mouseX !== -1000) {
    const closeStars = [];
    for (let i = 0; i < stars.length; i++) {
        if (stars[i].type === 'planet') continue;
        const dx = stars[i].x - mouseX;
        const dy = stars[i].y - mouseY;
        if (dx*dx + dy*dy < 25000) { 
            closeStars.push(stars[i]);
        }
    }
    
    if (closeStars.length >= 3) {
      const cx = closeStars.reduce((sum, s) => sum + s.x, 0) / closeStars.length;
      const cy = closeStars.reduce((sum, s) => sum + s.y, 0) / closeStars.length;
      closeStars.sort((a, b) => Math.atan2(a.y - cy, a.x - cx) - Math.atan2(b.y - cy, b.x - cx));
      
      ctx.beginPath();
      ctx.moveTo(closeStars[0].x, closeStars[0].y);
      for (let i = 1; i < closeStars.length; i++) {
        ctx.lineTo(closeStars[i].x, closeStars[i].y);
      }
      ctx.closePath();
      ctx.fillStyle = "rgba(192, 132, 252, 0.15)";
      ctx.fill();
      ctx.strokeStyle = "rgba(232, 121, 249, 0.4)";
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }

  const mX = mouseX;
  const mY = mouseY;

  for (let i = 0; i < connections.length; i++) {
    const conn = connections[i];
    const source = conn.source;
    const target = conn.target;

    const midX = (source.x + target.x) / 2;
    const midY = (source.y + target.y) / 2;

    const dxM = mX !== -1000 ? mX - midX : 10000;
    const dyM = mY !== -1000 ? mY - midY : 10000;
    const minDistance = Math.sqrt(dxM*dxM + dyM*dyM);
    
    let op = 0.05 * brightness;
    if (minDistance < 180) {
      op = (0.6 - (minDistance / 180) * 0.55) * brightness;
    }
    if (op <= 0) continue;

    const lineDx = target.x - source.x;
    const lineDy = target.y - source.y;
    const lineLen2 = lineDx * lineDx + lineDy * lineDy;

    let bendX = 0;
    let bendY = 0;
    
    for (let j = 0; j < planets.length; j++) {
       const p = planets[j];
       const speed = 15 + (p.x % 20);
       const angle = (t / (speed * 1000)) * Math.PI * 2; 
       const radius = p.size * 5;
       
       const px = p.x + Math.cos(angle) * radius;
       const py = p.y + Math.sin(angle) * radius;
       
       const tParam = Math.max(0, Math.min(1, ((px - source.x)*lineDx + (py - source.y)*lineDy) / lineLen2));
       const projX = source.x + tParam * lineDx;
       const projY = source.y + tParam * lineDy;
       
       const dist2 = (px - projX)**2 + (py - projY)**2;
       
       if (dist2 < 12000) { 
          const dist = Math.sqrt(dist2);
          if (dist > 20) {
             const force = (110 - dist) / 110;
             bendX += (px - projX) * force * 1.2;
             bendY += (py - projY) * force * 1.2;
          } else {
             bendX += (Math.random() - 0.5) * 40;
             bendY += (Math.random() - 0.5) * 40;
          }
       }
    }
    
    const cMidX = midX + bendX;
    const cMidY = midY + bendY;

    const grad = ctx.createLinearGradient(source.x, source.y, target.x, target.y);
    grad.addColorStop(0, "rgba(244, 143, 177, " + op + ")");
    grad.addColorStop(1, "rgba(206, 147, 216, " + op + ")");

    ctx.beginPath();
    ctx.moveTo(source.x, source.y);
    ctx.quadraticCurveTo(cMidX, cMidY, target.x, target.y);
    ctx.strokeStyle = grad;
    ctx.lineWidth = 0.8;
    ctx.stroke();
  }

  requestAnimationFrame(render);
}
