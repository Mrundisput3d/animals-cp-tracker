document.addEventListener('DOMContentLoaded', () => {
  const data = window.L2_DATA;
  if (!data) {
    console.error("Data not found!");
    return;
  }

  const leaderboard = document.getElementById('leaderboard');
  const jewelsSection = document.getElementById('jewels-section');

  function calculatePoints(player) {
    let total = 0;
    for (let act in player.activities) {
      if (data.config.activities[act]) {
        total += player.activities[act] * data.config.activities[act].points;
      }
    }
    for (let item in player.bought) {
      if (data.config.activities[item]) {
        total -= player.bought[item] * data.config.activities[item].jewelCost;
      }
    }
    return total.toFixed(1);
  }

  const sortedPlayers = Object.entries(data.players)
    .map(([name, info]) => ({ name, points: parseFloat(calculatePoints(info)), ...info }))
    .sort((a, b) => b.points - a.points);

  // Leaderboard render
  leaderboard.innerHTML = sortedPlayers.map((player, index) => {
    const isNew = player.activities.newPlayerBonus > 0;
    const bonusIcon = data.config.activities.newPlayerBonus.image;
    
    return `
      <div class="flex items-center justify-between p-4 border-b border-[#3d3020]/30 hover:bg-[#c9a227]/5 animate-row-in" style="animation-delay: ${index * 0.05}s">
        <div class="flex items-center gap-4">
          <span class="font-heading text-[#6b6070] w-6 text-sm">#${index + 1}</span>
          <div class="flex items-center gap-2">
            <span class="font-heading text-lg">${player.name}</span>
            ${isNew ? `<img src="${bonusIcon}" class="h-5 w-5" title="New Player Bonus">` : ''}
          </div>
        </div>
        <div class="font-display text-[#c9a227] text-xl">${player.points} pts</div>
      </div>
    `;
  }).join('');

  // Jewels render
  jewelsSection.innerHTML = Object.entries(data.config.activities)
    .filter(([key, val]) => val.jewelCost)
    .map(([key, item]) => `
      <div class="flex items-center justify-between p-4 border-b border-[#3d3020]/30 hover:bg-[#c9a227]/5">
        <div class="flex items-center gap-4">
          <img src="${item.image}" class="h-10 w-10 object-contain" alt="${item.label}">
          <span class="font-heading text-xs tracking-widest uppercase">${item.label}</span>
        </div>
        <div class="font-body text-[#c9a227]">${item.jewelCost} pts</div>
      </div>
    `).join('');
});
