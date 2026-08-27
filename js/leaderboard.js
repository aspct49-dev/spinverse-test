/* SpinVerse — leaderboard rendering.
 *
 * The dataset below is DUMMY DATA standing in for a real feed. To go live,
 * replace `LEADERBOARD.players` with an API response of the same shape
 * (`user`, `wagered`, `reward`) sorted by `wagered` descending — nothing
 * else here needs to change.
 *
 * Unlike the Figma file, the podium and the table are rendered from one
 * array, so the top three always agree with rows 1-3, and the rewards add
 * up to the $5,000 pool advertised in the heading.
 */

var LEADERBOARD = {
  currency: 'USD',
  players: [
    { user: '*******Vers',  wagered: 309293.47, reward: 2000 },
    { user: '*********Go3', wagered: 134827.10, reward: 1000 },
    { user: '******Kx9',    wagered:  75412.88, reward:  650 },
    { user: '*****Lunar',   wagered:  44832.05, reward:  450 },
    { user: '********M4',   wagered:  28190.63, reward:  300 },
    { user: '******Zedd',   wagered:  19455.20, reward:  200 },
    { user: '*********Q2',  wagered:  12475.90, reward:  150 },
    { user: '*****Nyx',     wagered:   9999.14, reward:  110 },
    { user: '*******B47',   wagered:   7803.55, reward:   80 },
    { user: '****Rok',      wagered:   5042.77, reward:   60 }
  ]
};

(function () {
  'use strict';

  var podium = document.querySelector('[data-podium]');
  var table = document.querySelector('[data-ranks]');
  if (!podium || !table) { return; }

  var players = LEADERBOARD.players;

  function amount(n, dp) {
    return n.toLocaleString('en-US', {
      minimumFractionDigits: dp,
      maximumFractionDigits: dp
    });
  }

  function ordinal(n) {
    if (n % 100 >= 11 && n % 100 <= 13) { return n + 'th'; }
    return n + ({ 1: 'st', 2: 'nd', 3: 'rd' }[n % 10] || 'th');
  }

  /* ------------------------------- podium -------------------------------- */

  var PLACE = { 1: 'first', 2: 'second', 3: 'third' };

  function podiumCard(player, place) {
    var slug = ordinal(place);              // 1st / 2nd / 3rd — matches asset names
    var col = document.createElement('article');
    col.className = 'podium__col podium__col--' + PLACE[place];
    col.innerHTML =
      '<div class="podium__badge">' +
        '<span class="podium__trophy" aria-hidden="true"></span>' + slug + ' Place' +
      '</div>' +
      '<div class="podium__card">' +
        '<img class="podium__glow" src="assets/img/glow-' + slug + '.png" alt="">' +
        '<div class="podium__avatar">' +
          '<img src="assets/img/avatar-' + slug + '.png" alt="">' +
          '<img class="podium__ring" src="assets/svg/ring-' + slug + '.svg" alt="">' +
        '</div>' +
        '<p class="podium__name"></p>' +
        '<p class="podium__wagered-label">WAGERED</p>' +
        '<p class="podium__wagered"><span class="sym">$</span></p>' +
      '</div>' +
      '<div class="podium__prize">$' + amount(player.reward, 0) + '</div>';

    // usernames are data, so set them as text rather than through innerHTML
    col.querySelector('.podium__name').textContent = player.user;
    col.querySelector('.podium__wagered').appendChild(
      document.createTextNode(amount(player.wagered, 2))
    );
    return col;
  }

  podium.textContent = '';
  // left-to-right the design runs 2nd, 1st, 3rd — the middle card is elevated
  [2, 1, 3].forEach(function (place) {
    var player = players[place - 1];
    if (player) { podium.appendChild(podiumCard(player, place)); }
  });

  /* ------------------------------- table --------------------------------- */

  function rankCell(i) {
    var span = document.createElement('span');
    span.className = 'lb-table__rank' + (i <= 3 ? ' lb-table__rank--' + i : '');
    span.setAttribute('role', 'cell');
    span.textContent = ordinal(i);
    return span;
  }

  function cell(cls, text) {
    var span = document.createElement('span');
    span.className = cls;
    span.setAttribute('role', 'cell');
    span.textContent = text;
    return span;
  }

  function rewardCell(value) {
    var span = document.createElement('span');
    span.className = 'lb-table__reward';
    span.setAttribute('role', 'cell');
    var sym = document.createElement('span');
    sym.className = 'sym';
    sym.textContent = '$';
    span.appendChild(sym);
    span.appendChild(document.createTextNode(amount(value, 0)));
    return span;
  }

  var head = table.querySelector('.lb-table__head');
  table.textContent = '';
  if (head) { table.appendChild(head); }

  players.forEach(function (player, idx) {
    var i = idx + 1;
    var row = document.createElement('div');
    row.className = 'lb-table__row lb-table__row--' + (i % 2 ? 'odd' : 'even');
    row.setAttribute('role', 'row');
    row.appendChild(rankCell(i));
    row.appendChild(cell('lb-table__user', player.user));
    row.appendChild(cell('lb-table__wagered', '$' + amount(player.wagered, 0)));
    row.appendChild(rewardCell(player.reward));
    table.appendChild(row);
  });

  /* ------------------- keep the headline pool honest --------------------- */

  var pool = document.querySelector('[data-prize-pool]');
  if (pool) {
    var total = players.reduce(function (sum, p) { return sum + p.reward; }, 0);
    // the design sets the thousands separator as a space, not a comma
    pool.textContent = '$' + amount(total, 0).replace(/,/g, ' ');
  }
})();
