(function () {
  const data = window.L2_DATA;
  if (!data) {
    document.getElementById('leaderboard').innerHTML =
      '<p class="text-center py-12 font-heading text-xs tracking-[0.2em] uppercase text-red-800">Error: data.js not loaded.</p>';
    return;
  }

  const { activities } = data.config;
  const activityKeys   = Object.keys(activities);
  const jewelKeys      = activityKeys.filter(k => activities[k].jewelCost != null);

  // ── Compute totals ───────────────────────────────────────────────
  const sorted = Object.entries(data.players).map(([name, player]) => {
    const counts = player.activities || {};
    const bought = player.bought     || {};

    const earned = activityKeys.reduce((sum, k) => sum + (counts[k] || 0) * activities[k].points, 0);
    const spent  = jewelKeys.reduce((sum, k)    => sum + (bought[k]  || 0) * (activities[k].jewelCost || 0), 0);
    const net    = earned - spent;

    return { name, counts, bought, earned, spent, net };
  }).sort((a, b) => b.net - a.net || a.name.localeCompare(b.name));

  // ── Rank badge ───────────────────────────────────────────────────
  function rankBadge(rank) {
    const label = rank === 1 ? 'I' : rank === 2 ? 'II' : rank === 3 ? 'III' : rank;
    const cls   = rank === 1
      ? 'text-[#f0c84a] bg-[#f0c84a]/10 border-[#f0c84a]/50 [box-shadow:0_0_10px_rgba(240,200,74,0.25)]'
      : rank === 2
      ? 'text-[#b0b8c8] bg-[#b0b8c8]/10 border-[#b0b8c8]/40'
      : rank === 3
      ? 'text-[#c08840] bg-[#c08840]/10 border-[#c08840]/40'
      : 'text-[#6b6070] bg-transparent border-[#2a2430]';
    return `<span class="inline-flex items-center justify-center w-8 h-8 rounded-full font-heading text-xs font-bold border ${cls}">${label}</span>`;
  }

  // ── Row background ───────────────────────────────────────────────
  function rowBg(rank, idx) {
    if (rank === 1) return 'bg-gradient-to-r from-[#f0c84a]/[0.06] to-transparent';
    if (rank === 2) return 'bg-gradient-to-r from-[#b0b8c8]/[0.05] to-transparent';
    if (rank === 3) return 'bg-gradient-to-r from-[#c08840]/[0.05] to-transparent';
    return idx % 2 === 0 ? 'bg-[#12121a]' : 'bg-[#0f0f16]';
  }

  // ── Accordion content ────────────────────────────────────────────
  function buildBreakdown(counts, bought, earned, spent) {
    // Activity earned section
    const actCards = activityKeys.map(k => {
      const count = counts[k] || 0;
      const pts   = count * activities[k].points;
      const dim   = count === 0;
      return `
        <div class="flex items-center justify-between px-3 py-2.5 rounded-sm border
                    ${dim ? 'border-[#1a1820] opacity-35' : 'border-[#252030] bg-[#0a0a0d]'}">
          <span class="font-heading text-[0.7rem] tracking-wider ${dim ? 'text-[#6b6070]' : 'text-[#b0a888]'}">${activities[k].label}</span>
          <div class="flex items-center gap-3">
            <span class="font-heading text-[0.65rem] text-[#6b6070]">×${count}</span>
            <span class="font-heading text-xs font-bold ${dim ? 'text-[#3a3540]' : 'text-[#f0c84a]'}">${pts} pts</span>
          </div>
        </div>`;
    }).join('');

    // Purchases section — only jewels actually bought
    const boughtEntries = jewelKeys.filter(k => (bought[k] || 0) > 0);
    const purchasesHtml = boughtEntries.length === 0
      ? `<p class="font-heading text-[0.7rem] tracking-wider text-[#6b6070] opacity-50 py-1">No purchases yet</p>`
      : boughtEntries.map(k => {
          const count = bought[k];
          const cost  = count * activities[k].jewelCost;
          return `
            <div class="flex items-center gap-3 px-3 py-2.5 rounded-sm border border-[#3a1a1a] bg-[#0d0808]">
              <img src="${activities[k].image}" alt="${escapeHtml(activities[k].label)}"
                   class="w-5 h-5 object-contain shrink-0"
                   onerror="this.style.display='none'">
              <span class="font-heading text-[0.7rem] tracking-wider text-[#b0a888] flex-1">${escapeHtml(activities[k].label)}</span>
              <span class="font-heading text-[0.65rem] text-[#6b6070]">×${count}</span>
              <span class="font-heading text-xs font-bold text-[#e05555]">-${cost} pts</span>
            </div>`;
        }).join('');

    // Summary row
    const summaryHtml = `
      <div class="flex items-center justify-between px-3 py-2 border-t border-[#252030] mt-1">
        <span class="font-heading text-[0.65rem] tracking-wider uppercase text-[#6b6070]">Earned</span>
        <span class="font-heading text-xs font-bold text-[#f0c84a]">+${earned} pts</span>
      </div>
      ${spent > 0 ? `
      <div class="flex items-center justify-between px-3 py-2">
        <span class="font-heading text-[0.65rem] tracking-wider uppercase text-[#6b6070]">Spent</span>
        <span class="font-heading text-xs font-bold text-[#e05555]">-${spent} pts</span>
      </div>` : ''}`;

    return `
      <div class="bg-[#0d0b12] border-b border-[#1e1a26]">
        <div class="px-4 pt-4 pb-1">
          <p class="font-heading text-[0.6rem] tracking-[0.2em] uppercase text-[#6b6070] mb-2">Activity Breakdown</p>
          <div class="grid grid-cols-2 gap-1.5">${actCards}</div>
          ${summaryHtml}
        </div>
        <div class="px-4 pb-4 pt-2">
          <p class="font-heading text-[0.6rem] tracking-[0.2em] uppercase text-[#6b6070] mb-2">Purchased Epics</p>
          <div class="flex flex-col gap-1.5">${purchasesHtml}</div>
        </div>
      </div>`;
  }

  // ── Build table ──────────────────────────────────────────────────
  const thBase = 'px-5 py-4 text-left text-[0.7rem] font-semibold tracking-[0.18em] uppercase sticky top-0 z-10 bg-[#141118]';
  const tdBase = 'px-5 py-3.5 whitespace-nowrap';

  const headerCells = `
    <th class="${thBase} text-center w-16 text-[#6b6070]">Rank</th>
    <th class="${thBase} text-[#8a6d1a]">Champion</th>
    <th class="${thBase} text-[#c9a227] text-right">Points</th>`;

  const bodyRows = sorted.map(({ name, counts, bought, earned, spent, net }, idx) => {
    const rank     = idx + 1;
    const detailId = `detail-${idx}`;

    return `
      <tr class="${rowBg(rank, idx)} border-b border-[#1e1a26] transition-colors duration-150 animate-row-in
                 cursor-pointer hover:brightness-110 select-none"
          style="animation-delay:${idx * 55}ms"
          data-target="${detailId}">
        <td class="${tdBase} text-center">${rankBadge(rank)}</td>
        <td class="${tdBase}">
          <span class="font-heading text-[0.95rem] font-semibold text-[#e8dfc0] tracking-wider">${escapeHtml(name)}</span>
        </td>
        <td class="${tdBase} text-right">
          <div class="flex items-center justify-end gap-2">
            <span class="font-heading text-lg font-bold text-[#f0c84a] tracking-wider">${net}</span>
            <span class="chevron font-heading text-[0.6rem] text-[#6b6070] transition-transform duration-200">▼</span>
          </div>
        </td>
      </tr>
      <tr id="${detailId}" class="hidden">
        <td colspan="3" class="p-0">${buildBreakdown(counts, bought, earned, spent)}</td>
      </tr>`;
  }).join('');

  document.getElementById('leaderboard').innerHTML = `
    <div class="flex items-center justify-between px-5 py-4 border-b border-[#3d3020] bg-gradient-to-b from-[#17141f] to-[#13111a]">
      <h2 class="font-heading text-xs font-semibold tracking-[0.22em] uppercase text-[#8a6d1a]">Season Leaderboard</h2>
      <span class="font-heading text-[0.7rem] tracking-wider text-[#6b6070]">${sorted.length} champions</span>
    </div>
    <div class="overflow-x-auto">
      <table class="w-full border-collapse">
        <thead><tr class="border-b border-[#3d3020]">${headerCells}</tr></thead>
        <tbody>${bodyRows}</tbody>
      </table>
    </div>`;

  // ── Accordion toggle ─────────────────────────────────────────────
  document.getElementById('leaderboard').addEventListener('click', e => {
    const row = e.target.closest('tr[data-target]');
    if (!row) return;

    const detailRow = document.getElementById(row.dataset.target);
    const chevron   = row.querySelector('.chevron');
    const isOpen    = !detailRow.classList.contains('hidden');

    document.querySelectorAll('tr[data-target]').forEach(r => {
      document.getElementById(r.dataset.target).classList.add('hidden');
      r.querySelector('.chevron').style.transform = '';
    });

    if (!isOpen) {
      detailRow.classList.remove('hidden');
      chevron.style.transform = 'rotate(180deg)';
    }
  });

  // ── Jewels section ───────────────────────────────────────────────
  const jewelCards = jewelKeys.map(k => {
    const { label, jewelCost, image } = activities[k];
    return `
      <div class="flex flex-col items-center gap-3 p-4 bg-[#0d0b12] border border-[#252030] rounded-sm
                  hover:border-[#3d3020] hover:bg-[#100e15] transition-colors duration-150">
        <div class="w-8 h-8 flex items-center justify-center">
          <img src="${image}" alt="${escapeHtml(label)}" class="w-8 h-8 object-contain"
               onerror="this.replaceWith(Object.assign(document.createElement('div'),{
                 className:'w-8 h-8 rounded-full bg-[#1a1620] border border-[#3d3020] flex items-center justify-center font-heading text-sm text-[#8a6d1a]',
                 textContent:'💎'
               }))">
        </div>
        <span class="font-heading text-xs font-semibold tracking-wider text-[#d4c9b0] text-center">${escapeHtml(label)}</span>
        <div class="flex items-baseline gap-1 mt-auto">
          <span class="font-heading text-lg font-bold text-[#f0c84a]">${jewelCost}</span>
          <span class="font-heading text-[0.6rem] tracking-widest uppercase text-[#8a6d1a]">pts</span>
        </div>
      </div>`;
  }).join('');

  document.getElementById('jewels-section').innerHTML = `
    <div class="flex items-center justify-between px-5 py-4 border-b border-[#3d3020] bg-gradient-to-b from-[#17141f] to-[#13111a]">
      <h2 class="font-heading text-xs font-semibold tracking-[0.22em] uppercase text-[#8a6d1a]">Epic Jewel Costs</h2>
      <span class="font-heading text-[0.7rem] tracking-wider text-[#6b6070]">cost in points</span>
    </div>
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4">
      ${jewelCards}
    </div>`;

  // ── Utility ──────────────────────────────────────────────────────
  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
})();
