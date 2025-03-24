# WhatsApp Bot for osu!

This is a WhatsApp bot that integrates with the osu! API to fetch and display player statistics, recent plays, and top play.

## Features
- Fetch osu! user profile statistics (`!osu` command)
- Retrieve recent plays (`!rs` command)
- Retrieve top 5 plays (`!top` command)
- Supports multiple osu! game modes (`osu`, `taiko`, `fruits`, `mania`)
- Any other commands like (`!command`, `!ping`, `!roll`, `!sticker/!s`, `!say`)

## Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/Xenooid/Xeno-Bot.git
cd Xeno-Bot
```

### 2. Install Dependencies
```bash
npm install 
```

### 3. Configure osu! API Credentials
Create a `.env` file and add your osu! API credentials:
```env
OSU_CLIENT_ID=your_client_id
OSU_CLIENT_SECRET=your_client_secret
```

### 4. Run the Bot
```bash
node main.js
```

## Command Example

### 1. `!osu <username> [mode]`
Fetches osu! user profile stats.
#### Example:
```bash
!osu Xenoid
```
#### Response:
```
🔗 https://osu.ppy.sh/users/26993756

🎵 osu! Profile (osu) 🎵
👤 Username: Xenoid
🇮🇩 Country: Indonesia
🏆 Rank: #27116
💯 PP: 7127.45
🎯 Accuracy: 98.60%
```

### 2. `!rs <username> [mode]`
Fetches the most recent play of a user.
#### Example:
```bash
!rs Khnox
```
#### Response:
```
🎮 Recent Play for Khnox (osu):

🎵 Beatmap: ANTIDOTE [Nymphe's EXTRA]
🏆 Score: (A) 2759296
🎯 Accuracy: 96.24%  (446/19/0/5)
💯 PP: 128.25
🔗 https://osu.ppy.sh/beatmaps/4704234
```

### 3. `!top <username> [mode]`
Fetches the top 5 plays of a user.
#### Example:
```bash
!top Redmooon mania
```
#### Response:
```
🏆 Top 5 Best Scores for Redmooon (mania mode):

1. (A) MIIRO [[4K] Poi] - 75.2pp (Accuracy: 93.20%) - https://osu.ppy.sh/beatmaps/652299
2. (A) Cirno Break [[4K] Frim's ADVANCED] - 57.8pp (Accuracy: 94.71%) - https://osu.ppy.sh/beatmaps/646828
3. (A) Mada, Aoi [[4K] Ysg's Hard] - 54.2pp (Accuracy: 94.31%) - https://osu.ppy.sh/beatmaps/3748543
4. (S) anemone [4K Hyper] - 50.0pp (Accuracy: 98.20%) - https://osu.ppy.sh/beatmaps/644701
5. (A) anemone [7K Hyper] - 39.5pp (Accuracy: 92.62%) - https://osu.ppy.sh/beatmaps/644303
```

## Contributing
Feel free to fork and submit pull requests!

## License
This project is open-source under the MIT License.


