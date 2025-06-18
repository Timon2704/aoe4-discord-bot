// src/utils/formatRanking.js
function formatRanking(rankings, players) {
  if (!rankings.length) return 'Noch keine Spieler im Ranking.';
  let out = '**🏆 Towncenter Ranking**\n';
  rankings.forEach((r, i) => {
    const player = players.find(p => p.id === r.player_id);
    out += `\n**${i + 1}. ${player ? player.name : 'Unbekannt'}**\n`;
    out += `ELO: ${r.elo} | Rang: ${r.rank}\n`;
    if (r.recent_matches) {
      try {
        const matches = JSON.parse(r.recent_matches);
        out += 'Letzte Spiele: ' + matches.map(m => `${m.result === 'win' ? '✅' : '❌'} ${m.opponent || ''}`).join(', ') + '\n';
      } catch {}
    }
  });
  return out;
}

module.exports = { formatRanking }; 