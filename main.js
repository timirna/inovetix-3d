// The showreel plays silently while it is in view, and sound is one click away
(function () {
  var reel = document.querySelector('.frame video')
  var sound = document.querySelector('.sound')
  var label = sound.querySelector('span')
  var held = false

  function run() { if (!held) reel.play().catch(function () {}) }

  new IntersectionObserver(function (entries) {
    if (entries[entries.length - 1].isIntersecting) run(); else reel.pause()
  }, { threshold: 0.25 }).observe(reel)

  reel.addEventListener('click', function () {
    held = !reel.paused
    if (held) reel.pause(); else run()
  })

  sound.addEventListener('click', function () {
    var on = reel.muted
    reel.muted = !on
    held = false
    if (on) { reel.currentTime = 0; reel.volume = 0.8 }
    label.textContent = on ? 'Turn sound off' : 'Play with sound'
    run()
  })
})()

// The logo symbol: its strands gather on load, then drift, follow the cursor and part on scroll
;(function () {
  var svg = document.querySelector('.strands')
  var strands = [].slice.call(svg.querySelectorAll('.strand'))
  var shine = document.getElementById('shine')
  var calm = matchMedia('(prefers-reduced-motion: reduce)').matches
  var drift = calm ? 0.45 : 1.1
  var start = null, frame = null
  var aim = 0, lean = 0

  addEventListener('mousemove', function (e) { aim = (e.clientX / innerWidth - 0.5) * (calm ? 0 : 2) })

  function draw(now) {
    if (start === null) start = now
    var t = (now - start) / 1000
    var e = calm ? 1 : 1 - Math.pow(1 - Math.min(1, t / 1.6), 4)
    var part = Math.max(0, Math.min(1.2, -svg.getBoundingClientRect().top / innerHeight))
    lean += (aim - lean) * 0.06
    strands.forEach(function (s, i) {
      var along = Math.sin(t * 0.55 + i * 1.1) * drift
        + (i - 1.5) * part * 5
        + lean * (0.6 + i * 0.35)
        + (1 - e) * (i % 2 ? 26 : -26)
      var d = along * 0.7071
      s.setAttribute('transform', 'translate(' + d.toFixed(3) + ' ' + (-d).toFixed(3) + ')')
      s.style.opacity = e
    })
    var run = ((t * 7) % 70) - 20
    shine.setAttribute('gradientTransform', 'translate(' + run.toFixed(2) + ' ' + (-run).toFixed(2) + ')')
    frame = requestAnimationFrame(draw)
  }

  new IntersectionObserver(function (entries) {
    var on = entries[entries.length - 1].isIntersecting
    if (on && frame === null) frame = requestAnimationFrame(draw)
    if (!on && frame !== null) { cancelAnimationFrame(frame); frame = null }
  }, { threshold: 0.2 }).observe(svg)
})()

// Collage tiles drift at different speeds as the visitor scrolls
;(function () {
  var box = document.querySelector('.collage')
  var tiles = [].slice.call(box.querySelectorAll('[data-speed]'))
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !matchMedia('(min-width:901px)').matches) return
  var queued = false
  function move() {
    queued = false
    var r = box.getBoundingClientRect()
    var p = Math.max(0, Math.min(1, (innerHeight - r.top) / (innerHeight + r.height)))
    tiles.forEach(function (t) { t.style.translate = '0 ' + (Number(t.dataset.speed) * p).toFixed(1) + 'px' })
  }
  addEventListener('scroll', function () {
    if (!queued) { queued = true; requestAnimationFrame(move) }
  }, { passive: true })
  move()
})()

