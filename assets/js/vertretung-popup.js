(function () {
  // Popup wird ab dem 22.08.2026 nicht mehr angezeigt.
  var HIDE_FROM = new Date(2026, 7, 22, 0, 0, 0);
  if (new Date() >= HIDE_FROM) return;

  var isEnglish = /^\/en(\/|$)/.test(location.pathname) ||
                  (document.documentElement.lang || '').toLowerCase().indexOf('en') === 0;
  var lang = isEnglish ? 'en' : 'de';
  var storageKey = 'urlaub-2026-popup-' + lang;

  var texts = {
    de: {
      badge: 'Wichtiger Hinweis',
      title: 'Urlaub vom 03.08. – 21.08.2026',
      intro: 'Unsere Praxis bleibt in diesem Zeitraum geschlossen. Die Vertretung übernehmen für Sie:',
      p1: '03.08. – 07.08.2026',
      p2: '10.08. – 21.08.2026',
      phone: 'Telefon',
      close: 'Verstanden',
      launcher: 'Vertretung',
      launcherLabel: 'Informationen zur Urlaubsvertretung anzeigen'
    },
    en: {
      badge: 'Important notice',
      title: 'Holiday from 3 Aug – 21 Aug 2026',
      intro: 'Our practice will be closed during this period. The following practices will stand in for us:',
      p1: '3 Aug – 7 Aug 2026',
      p2: '10 Aug – 21 Aug 2026',
      phone: 'Phone',
      close: 'Got it',
      launcher: 'Cover',
      launcherLabel: 'Show holiday cover information'
    }
  }[lang];

  var periods = [
    {
      range: texts.p1,
      doctors: [
        { name: 'Dr. med. Mariya Petkova', address: 'Neue Grottkauer Str. 3, 12619 Berlin', phone: '030 74004411', tel: '+493074004411' },
        { name: 'Dr. med. Sylvia Christina Fehrendt', address: 'Hönower Str. 188, 12623 Berlin', phone: '030 9939127', tel: '+49309939127' }
      ]
    },
    {
      range: texts.p2,
      doctors: [
        { name: 'Praxis Kathrin Oldenburg', address: 'Alte Hellersdorfer Str. 121, 12629 Berlin', phone: '030 9951028', tel: '+49309951028' },
        { name: 'Familienpraxis Breunung (Dipl.-Med. Iris Breunung)', address: 'Branitzer Karree 5, 12627 Berlin', phone: '030 9918006', tel: '+49309918006' }
      ]
    }
  ];

  var css = '' +
    '.vp-overlay{position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;' +
      'padding:20px;background:rgba(12,12,12,.55);backdrop-filter:blur(3px);opacity:0;transition:opacity .25s ease;}' +
    '.vp-overlay.vp-visible{opacity:1;}' +
    '.vp-card{position:relative;width:100%;max-width:560px;max-height:86vh;overflow-y:auto;background:#fff;' +
      'border-radius:14px;box-shadow:0 18px 50px rgba(0,0,0,.3);padding:34px 32px 28px;' +
      'font-family:\'Inter\',sans-serif;color:#0c0c0c;transform:translateY(14px) scale(.98);transition:transform .25s ease;}' +
    '.vp-overlay.vp-visible .vp-card{transform:none;}' +
    '.vp-close{position:absolute;top:12px;right:14px;border:0;background:none;font-size:26px;line-height:1;' +
      'color:#777;cursor:pointer;padding:4px 8px;border-radius:6px;transition:color .2s ease,background .2s ease;}' +
    '.vp-close:hover{color:#572800;background:#f3ece7;}' +
    '.vp-badge{display:inline-block;background:#6e370e;color:#fff;font-size:12px;letter-spacing:.08em;' +
      'text-transform:uppercase;padding:5px 12px;border-radius:999px;font-weight:500;}' +
    '.vp-title{font-family:\'Poppins\',sans-serif;font-weight:700;font-size:1.5rem;color:#6e370e;margin:14px 0 8px;}' +
    '.vp-intro{font-size:.95rem;line-height:1.55;color:#333;margin:0 0 22px;}' +
    '.vp-period+.vp-period{margin-top:22px;}' +
    '.vp-range{font-family:\'Poppins\',sans-serif;font-weight:500;font-size:1rem;color:#572800;' +
      'border-bottom:1px solid #e6e6e6;padding-bottom:6px;margin:0 0 12px;}' +
    '.vp-doc{border-left:3px solid #d5ad8f;padding-left:14px;margin-bottom:14px;}' +
    '.vp-doc-name{font-weight:600;font-size:.98rem;margin:0 0 4px;}' +
    '.vp-doc p{margin:0;font-size:.9rem;line-height:1.5;color:#333;}' +
    '.vp-doc a{color:#6e370e;text-decoration:none;font-weight:500;}' +
    '.vp-doc a:hover{text-decoration:underline;}' +
    '.vp-btn{display:block;width:100%;margin-top:26px;padding:13px;border:0;border-radius:8px;background:#6e370e;' +
      'color:#fff;font-family:\'Poppins\',sans-serif;font-size:1rem;font-weight:500;cursor:pointer;transition:background .2s ease;}' +
    '.vp-btn:hover{background:#572800;}' +
    '@media (max-width:600px){.vp-card{padding:30px 20px 22px;}.vp-title{font-size:1.25rem;}}' +
    // Auslöser unten rechts, um das Popup jederzeit erneut zu öffnen.
    '.vp-launcher{position:fixed;bottom:26px;right:26px;z-index:1500;display:flex;align-items:center;gap:10px;' +
      'padding:14px 24px;border:2px solid rgba(213,173,143,.75);border-radius:999px;background:#6e370e;' +
      'color:#fff;cursor:pointer;font-family:\'Poppins\',sans-serif;font-size:1.02rem;font-weight:500;' +
      'letter-spacing:.02em;box-shadow:0 10px 30px rgba(12,12,12,.38);opacity:0;transform:translateY(10px);' +
      'transition:opacity .3s ease,transform .3s ease,background .2s ease;}' +
    '.vp-launcher.vp-launcher-in{opacity:1;transform:none;}' +
    '.vp-launcher:hover{background:#572800;transform:translateY(-2px);}' +
    '.vp-launcher:focus{outline:none;}' +
    '.vp-launcher:focus-visible{outline:2px solid #fff;outline-offset:2px;}' +
    '.vp-launcher-dot{width:10px;height:10px;border-radius:50%;background:#d5ad8f;flex:0 0 auto;}' +
    '@media (max-width:600px){.vp-launcher{bottom:18px;right:18px;padding:16px 26px;font-size:1.1rem;gap:10px;}' +
      '.vp-launcher-dot{width:10px;height:10px;}}' +
    '@media (prefers-reduced-motion:reduce){.vp-overlay,.vp-card,.vp-launcher{transition:none;}}';

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  function openPopup() {
    if (document.querySelector('.vp-overlay')) return;

    var html = '<div class="vp-card" role="dialog" aria-modal="true" aria-labelledby="vp-title">' +
      '<button class="vp-close" type="button" aria-label="' + esc(texts.close) + '">&times;</button>' +
      '<span class="vp-badge">' + esc(texts.badge) + '</span>' +
      '<h2 class="vp-title" id="vp-title">' + esc(texts.title) + '</h2>' +
      '<p class="vp-intro">' + esc(texts.intro) + '</p>';

    periods.forEach(function (p) {
      html += '<div class="vp-period"><h3 class="vp-range">' + esc(p.range) + '</h3>';
      p.doctors.forEach(function (d) {
        html += '<div class="vp-doc">' +
          '<p class="vp-doc-name">' + esc(d.name) + '</p>' +
          '<p>' + esc(d.address) + '</p>' +
          '<p>' + esc(texts.phone) + ': <a href="tel:' + esc(d.tel) + '">' + esc(d.phone) + '</a></p>' +
          '</div>';
      });
      html += '</div>';
    });

    html += '<button class="vp-btn" type="button">' + esc(texts.close) + '</button></div>';

    var overlay = document.createElement('div');
    overlay.className = 'vp-overlay';
    overlay.innerHTML = html;
    document.body.appendChild(overlay);

    var prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    function close() {
      overlay.classList.remove('vp-visible');
      document.body.style.overflow = prevOverflow;
      document.removeEventListener('keydown', onKey);
      setTimeout(function () { overlay.remove(); }, 250);
      if (launcher) launcher.focus();
    }
    function onKey(e) { if (e.key === 'Escape') close(); }

    overlay.querySelector('.vp-close').addEventListener('click', close);
    overlay.querySelector('.vp-btn').addEventListener('click', close);
    overlay.addEventListener('click', function (e) { if (e.target === overlay) close(); });
    document.addEventListener('keydown', onKey);

    requestAnimationFrame(function () {
      overlay.classList.add('vp-visible');
      overlay.querySelector('.vp-btn').focus();
    });

    try { sessionStorage.setItem(storageKey, '1'); } catch (e) {}
  }

  var launcher = null;

  // Auf der Startseite läuft ein Splash-Screen (z-index 2000), der am Ende body.style.overflow
  // zurücksetzt. Erst danach aufbauen, sonst liegt das Popup darüber und der Scroll-Lock bricht.
  function afterSplash(cb) {
    var splash = document.getElementById('splash-screen');
    function gone() {
      return !splash || splash.style.display === 'none' ||
             getComputedStyle(splash).display === 'none';
    }
    if (gone()) return cb();

    var done = false;
    function finish() {
      if (done) return;
      done = true;
      clearInterval(poll);
      cb();
    }
    var poll = setInterval(function () { if (gone()) finish(); }, 120);
    setTimeout(finish, 6000); // Notausstieg, falls der Splash hängen bleibt
  }

  function build() {
    var style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    launcher = document.createElement('button');
    launcher.type = 'button';
    launcher.className = 'vp-launcher';
    launcher.setAttribute('aria-label', texts.launcherLabel);
    launcher.innerHTML = '<span class="vp-launcher-dot" aria-hidden="true"></span>' + esc(texts.launcher);
    launcher.addEventListener('click', openPopup);
    document.body.appendChild(launcher);
    requestAnimationFrame(function () { launcher.classList.add('vp-launcher-in'); });

    var seen = false;
    try { seen = !!sessionStorage.getItem(storageKey); } catch (e) {}
    if (!seen) openPopup();
  }

  function start() { afterSplash(build); }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
