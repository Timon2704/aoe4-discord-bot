# TimBot

TimBot ist ein Discord-Bot für die Age of Empires IV Community "Towncenter". Er verwaltet ein Ranking-System, integriert die aoe4world.com API und ist für Railway-Deployment optimiert.

## Features
- Slash Commands: `/add-player`, `/remove-player`, `/ranking`, `/update-ranking`, `/set-ranking-channel`
- Tägliche automatische Ranking-Updates (19:00 Uhr CET)
- SQLite Datenbank (persistent auf Railway)
- Integration mit aoe4world.com API
- Admin-Kommandos
- Fehlerbehandlung & Logging

## Setup
1. Repository klonen
2. Abhängigkeiten installieren:
   ```bash
   npm install
   ```
3. `.env` Datei anlegen (siehe `.env.example`)
4. Datenbankmigration ausführen:
   ```bash
   npm run migrate
   ```
5. Bot lokal starten:
   ```bash
   npm start
   ```

## Railway Deployment
1. Projekt auf Railway anlegen
2. Repository verbinden
3. Umgebungsvariablen wie in `.env.example` setzen
4. Deployment starten (Railway nutzt automatisch das Procfile)

## Projektstruktur
```
src/
  commands/         # Slash Commands
  services/         # API-Integration
  database/         # SQLite-Operationen
  utils/            # Hilfsfunktionen
  schedules/        # Cronjobs
  bot.js            # Haupteinstiegspunkt
config/
  config.js         # Konfiguration
package.json        # Railway Scripts
.env.example        # Umgebungsvariablen-Vorlage
Procfile            # Railway Prozessdefinition
README.md           # Setup & Deployment
```

## Hinweise
- Der Bot ist für den deutschen Discord-Server "Towncenter" optimiert.
- Code ist in Englisch, Bot-Interaktion auf Deutsch.
- Fehler werden geloggt und im Fehlerfall wird der Bot sauber beendet.
