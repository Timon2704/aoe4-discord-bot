// src/utils/parsePlayerInput.js
function parsePlayerInput(input) {
  // SteamID: nur Zahlen, aoe4world: URL mit /players/{id}
  const steamIdMatch = input.match(/^(\d{17})$/);
  if (steamIdMatch) return { type: 'steam', id: steamIdMatch[1] };

  const aoe4UrlMatch = input.match(/aoe4world\.com\/players\/([a-zA-Z0-9\-_]+)/);
  if (aoe4UrlMatch) return { type: 'aoe4', id: aoe4UrlMatch[1] };

  return null;
}

module.exports = { parsePlayerInput }; 