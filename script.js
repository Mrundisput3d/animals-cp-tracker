document.addEventListener('DOMContentLoaded', () => {
    const data = window.L2_DATA;
    const leaderboard = document.getElementById('leaderboard');
    const jewelsSection = document.getElementById('jewels-section');

    function calculatePoints(player) {
        let total = 0;
        for (let act in player.activities) {
            if (data.config.activities[act]) {
                total += player.activities[act] * data.config.activities[act].points;
            }
        }
        // Αφαίρεση κόστους αγορασμένων jewels (προαιρετικό, αν θέλεις να αφαιρούνται οι πόντοι)
        for (let item in player.bought) {
            if (data.config.activities[item]) {
                total -= player.bought[item] * data.config.activities[item].jewelCost;
            }
        }
        return total.toFixed(1);
    }

    // Leaderboard Logic
    const sortedPlayers = Object.entries(data.players)
        .map(([name, info]) => ({ name, points: parseFloat(calculatePoints(info)), ...info }))
        .sort((a, b) => b.points - a.points);

    leaderboard.innerHTML = sortedPlayers.map((player, index) => {
        const rankColor = index === 0 ? 'text-[#ffcc00]' : index === 1 ? 'text-[#c0c0c0]' : index === 2 ? 'text-[#cd7f32]' : 'text-[#6b6070]';
        const isNew = player.activities.newPlayerBonus > 0;

        return `
            <div class="flex items-center justify-between p-4 border-b border-[#3d3020]/30 hover:bg-[#c9a227]/5 transition-all animate-row-in" style="animation-delay: ${index * 0.1}s">
                <div class="flex items-center gap-4">
                    <span class="font-heading text-lg ${rankColor} w-6">#${index + 1}</span>
                    <div>
                        <span class="font-heading text-md tracking-wide ${index < 3 ? 'text-[#d4c9b0]' : 'text-[#8a8a8a]'}">${player.name}</span>
                        ${isNew ? '<span class="ml-2 text-[10px] bg-[#c9a227]/20 text-[#c9a227] px-1 rounded">NEW</span>' : ''}
                    </div>
                </div>
                <div class="font-display text-[#c9a227]">${player.points} pts</div>
            </div>
        `;
    }).join('');

    // Jewels Logic with Glow
    jewelsSection.innerHTML = Object.entries(data.config.activities)
        .filter(([key, val]) => val.jewelCost)
        .map(([key, item]) => `
            <div class="flex items-center justify-between bg-[#12121a] p-4 border border-[#3d3020] rounded-sm hover:border-[#c9a227]/50 transition-all">
                <div class="flex items-center gap-4">
                    <img src="${item.image}" class="h-10 w-10 animate-glow-pulse" alt="${item.label}">
                    <span class="font-heading text-xs tracking-widest uppercase">${item.label}</span>
                </div>
                <span class="font-body italic text-[#6b6070] text-sm">${item.jewelCost} points</span>
            </div>
        `).join('');
});
