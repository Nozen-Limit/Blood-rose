/* ==========================================================================
   HOME FX  (index.html only)
   Two purely decorative touches for the redesigned landing page: drifting
   ember particles behind the hero, and rose petals falling the length of
   the page. Both are inert if the visitor has reduced motion turned on.
   ========================================================================== */

(function (BR) {
  "use strict";

  if (BR.prefersReducedMotion) return;

  /* ---- Ember particles, drawn on the fixed #embers canvas ---- */
  (function emberField() {
    var canvas = document.getElementById("embers");
    if (!canvas) return;
    var ctx = canvas.getContext("2d");
    var w, h, particles, raf;
    var DPR = Math.min(window.devicePixelRatio || 1, 2);

    function size() {
      w = canvas.width = innerWidth * DPR;
      h = canvas.height = innerHeight * DPR;
      canvas.style.width = innerWidth + "px";
      canvas.style.height = innerHeight + "px";
    }

    function makeParticle() {
      return {
        x: Math.random() * w,
        y: h + Math.random() * h * 0.3,
        r: (Math.random() * 1.8 + 0.5) * DPR,
        vy: -(Math.random() * 0.5 + 0.15) * DPR,
        vx: (Math.random() - 0.5) * 0.25 * DPR,
        a: Math.random() * 0.5 + 0.1,
        tw: Math.random() * Math.PI
      };
    }

    function init() {
      var n = Math.min(70, Math.floor(innerWidth / 22));
      particles = Array.from({ length: n }, makeParticle);
    }

    function loop() {
      ctx.clearRect(0, 0, w, h);
      particles.forEach(function (p) {
        p.y += p.vy;
        p.x += p.vx;
        p.tw += 0.02;
        var flicker = (Math.sin(p.tw) + 1) / 2;
        if (p.y < -10) Object.assign(p, makeParticle(), { y: h + 10 });
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(224,49,59," + p.a * flicker * 0.9 + ")";
        ctx.shadowBlur = 8 * DPR;
        ctx.shadowColor = "rgba(224,49,59,.6)";
        ctx.fill();
      });
      raf = requestAnimationFrame(loop);
    }

    size();
    init();
    loop();
    addEventListener("resize", function () {
      cancelAnimationFrame(raf);
      size();
      init();
      loop();
    });
  })();

  /* ---- Falling petals across the whole page ---- */
  (function petalField() {
    var field = document.createElement("div");
    field.className = "petal-field";
    field.setAttribute("aria-hidden", "true");

    var n = Math.min(16, Math.max(7, Math.round(window.innerWidth / 95)));
    for (var i = 0; i < n; i++) {
      var petal = document.createElement("div");
      petal.className = "pf-petal";
      var size = 6 + Math.random() * 12;
      petal.style.left = Math.random() * 100 + "vw";
      petal.style.width = size + "px";
      petal.style.height = size * 1.45 + "px";
      petal.style.opacity = (0.07 + Math.random() * 0.15).toFixed(2);
      petal.style.animationDuration = 10 + Math.random() * 11 + "s";
      petal.style.animationDelay = -Math.random() * 20 + "s";

      var inner = document.createElement("div");
      inner.className = "pf-in";
      inner.style.animationDuration = 3 + Math.random() * 4 + "s";

      petal.appendChild(inner);
      field.appendChild(petal);
    }
    document.body.appendChild(field);
  })();
})(window.BR);
