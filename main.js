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
