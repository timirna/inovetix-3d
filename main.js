(function () {
  var reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
  var phone = matchMedia('(max-width: 767px)').matches

  // Video with sound
  var dialog = document.querySelector('.reel')
  var video = dialog.querySelector('video')
  document.querySelector('[data-play]').addEventListener('click', function () {
    dialog.showModal()
    video.volume = 0.6
    video.play().catch(function () {})
  })
  document.querySelector('[data-close]').addEventListener('click', function () { dialog.close() })
  dialog.addEventListener('click', function (e) { if (e.target === dialog) dialog.close() })
  dialog.addEventListener('close', function () { video.pause() })

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
    document.querySelectorAll('[data-speed]').forEach(function (tile) {
      gsap.to(tile, {
        y: Number(tile.dataset.speed), ease: 'none',
        scrollTrigger: { trigger: '.collage', start: 'top bottom', end: 'bottom top', scrub: true }
      })
    })
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
