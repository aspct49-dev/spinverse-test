/* SpinVerse — interaction layer.
   The Figma file is static, so the behaviour here is the minimum needed to
   make the drawn controls actually work: the mobile nav, the copy-code chips
   and the countdown (which Figma shows frozen at 18d 12h 53m 31s). */

(function () {
  'use strict';

  /* ------------------------------ mobile nav ----------------------------- */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('primary-nav');

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
    });

    // close the drawer after following an in-page link
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---------------------------- copy code chips -------------------------- */
  document.querySelectorAll('.code-chip[data-code]').forEach(function (chip) {
    chip.addEventListener('click', function () {
      var code = chip.getAttribute('data-code');

      var done = function () {
        chip.classList.add('is-copied');
        setTimeout(function () { chip.classList.remove('is-copied'); }, 1600);
      };

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(code).then(done, fallback);
      } else {
        fallback();
      }

      // execCommand path for non-secure contexts (e.g. opened via file://)
      function fallback() {
        var ta = document.createElement('textarea');
        ta.value = code;
        ta.setAttribute('readonly', '');
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); done(); } catch (err) { /* no-op */ }
        document.body.removeChild(ta);
      }
    });
  });

  /* ------------------------------ countdown ------------------------------ */
  var timer = document.querySelector('[data-countdown]');

  if (timer) {
    var fields = {
      days:    timer.querySelector('[data-unit="days"]'),
      hours:   timer.querySelector('[data-unit="hours"]'),
      minutes: timer.querySelector('[data-unit="minutes"]'),
      seconds: timer.querySelector('[data-unit="seconds"]')
    };

    // it is a monthly leaderboard, so it ends at 00:00 UTC on the 1st
    function endOfMonthUTC() {
      var now = new Date();
      return Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1, 0, 0, 0, 0);
    }

    function pad(n) { return n < 10 ? '0' + n : String(n); }

    function tick() {
      var remaining = endOfMonthUTC() - Date.now();
      if (remaining < 0) { remaining = 0; }

      var totalSeconds = Math.floor(remaining / 1000);
      var days    = Math.floor(totalSeconds / 86400);
      var hours   = Math.floor((totalSeconds % 86400) / 3600);
      var minutes = Math.floor((totalSeconds % 3600) / 60);
      var seconds = totalSeconds % 60;

      fields.days.textContent    = pad(days);
      fields.hours.textContent   = pad(hours);
      fields.minutes.textContent = pad(minutes);
      fields.seconds.textContent = pad(seconds);
    }

    tick();
    setInterval(tick, 1000);
  }
})();
