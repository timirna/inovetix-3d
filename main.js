(function () {
  var reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
  var phone = matchMedia('(max-width: 767px)').matches

  // The showreel plays in the page: silently once it is in view or under the cursor
  var reel = document.querySelector('.reel-video')
  var sound = document.querySelector('[data-sound]')
  var label = sound.querySelector('span')
  var held = false
  function run() { if (!held) reel.play().catch(function () {}) }
  new IntersectionObserver(function (e) {
    if (e[e.length - 1].isIntersecting) run(); else reel.pause()
  }, { threshold: 0.25 }).observe(reel)
  reel.addEventListener('mouseenter', run)
  // The sound button glides along with the cursor, as long as a real mouse is in use
  if (matchMedia('(hover:hover) and (pointer:fine)').matches) {
    var area = reel.parentNode
    var glide = function (y) { gsap.to(sound, { '--y': y + 'px', duration: 0.6, ease: 'power3.out', overwrite: true }) }
    area.addEventListener('mousemove', function (e) {
      var box = area.getBoundingClientRect()
      var room = box.height / 2 - 40
      glide(Math.max(-room, Math.min(room, e.clientY - box.top - box.height / 2)))
    })
    area.addEventListener('mouseleave', function () { glide(0) })
  }
  reel.addEventListener('click', function () {
    held = !reel.paused
    if (held) reel.pause(); else run()
  })
  sound.addEventListener('click', function () {
    var on = reel.muted
    reel.muted = !on
    held = false
    if (on) { reel.currentTime = 0; reel.volume = 0.8 }
    sound.classList.toggle('on', on)
    label.textContent = on ? 'Mute' : 'Play with sound'
    run()
  })

  // Bottom box opens an email with what the visitor typed
  document.querySelector('[data-ask]').addEventListener('submit', function (e) {
    e.preventDefault()
    var text = document.getElementById('ask').value.trim()
    location.href = 'mailto:hello@inovetix.com?subject=' + encodeURIComponent('New project') + '&body=' + encodeURIComponent(text)
  })

  // Split text into words so each can light up
  document.querySelectorAll('[data-words]').forEach(function (el) {
    el.innerHTML = el.textContent.trim().split(/\s+/).map(function (w) { return '<span class="w">' + w + '</span>' }).join(' ')
  })

  if (!window.gsap) {
    document.querySelectorAll('.w').forEach(function (w) { w.style.color = 'inherit' })
    return
  }
  gsap.registerPlugin(ScrollTrigger)

  if (!reduced && window.Lenis) {
    var lenis = new Lenis({ duration: 1.1 })
    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add(function (t) { lenis.raf(t * 1000) })
    gsap.ticker.lagSmoothing(0)
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var target = document.querySelector(a.getAttribute('href'))
        if (target) { e.preventDefault(); lenis.scrollTo(target, { offset: -84 }) }
      })
    })
  }

  // Scroll-linked motion follows the visitor's own scrolling
  document.querySelectorAll('[data-words]').forEach(function (el) {
    var on = el.classList.contains('soft') ? '#6C6E7A' : '#0A0B14'
    gsap.to(el.querySelectorAll('.w'), {
      color: on, stagger: 0.1, ease: 'none',
      scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 50%', scrub: true }
    })
  })

  gsap.to('.rail i', {
    scaleX: 1, ease: 'none',
    scrollTrigger: { trigger: '.track', start: 'top 85%', end: 'bottom 55%', scrub: true }
  })

  if (!phone) {
    gsap.utils.toArray('.case').slice(0, -1).forEach(function (card, i, all) {
      gsap.to(card, {
        scale: 0.95, ease: 'none',
        scrollTrigger: { trigger: all[i + 1] || card.nextElementSibling, start: 'top bottom', end: 'top 84px', scrub: true }
      })
    })
  }

  if (reduced) return

  gsap.from('.hero .line>span', { yPercent: 110, duration: 1, ease: 'power3.out', stagger: 0.09, delay: 0.1 })
  gsap.from('.hero-side', { opacity: 0, y: 16, duration: 0.8, delay: 0.5, ease: 'power2.out' })
  gsap.from('.nav>*', { opacity: 0, y: -10, duration: 0.6, stagger: 0.06, ease: 'power2.out' })

  document.querySelectorAll('.rv').forEach(function (el) {
    gsap.from(el, {
      opacity: 0, y: 26, duration: 0.8, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 90%', once: true }
    })
  })

  document.querySelectorAll('[data-count]').forEach(function (el) {
    var end = Number(el.dataset.count), pre = el.dataset.prefix || '', post = el.dataset.suffix || '', n = { v: 0 }
    gsap.to(n, {
      v: end, duration: 1.4, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
      onUpdate: function () { el.textContent = pre + Math.round(n.v) + post }
    })
  })

  addEventListener('load', function () { ScrollTrigger.refresh() })
})()
