# WhatsApp Bot for osu!

This is a WhatsApp bot that integrates with the osu! API to fetch and display player statistics, recent plays, and best play comparisons.

## Features
- Fetch osu! user profile statistics (`!osu` command)
- Retrieve recent plays (`!recent` or `!rs` command)
- Supports multiple osu! game modes (`osu`, `taiko`, `fruits`, `mania`)

## Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/your-repo.git
cd your-repo
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

## Commands

### 1. `!osu <username>`
Fetches osu! user profile stats.
#### Example:
```bash
!osu Cookiezi
```
#### Response:
```
🎮 Player: Cookiezi (osu)
🏆 Rank: #1
🔢 PP: 15,000pp
🎯 Accuracy: 99.87%
```

### 2. `!recent <username>` or `!rs <username>`
Fetches the most recent play of a user.
#### Example:
```bash
!recent Cookiezi
```
#### Response:
```
🎮 Recent Play for Cookiezi (osu):
🎵 Beatmap: Blue Zenith [FOUR DIMENSIONS]
🏆 Score: 9,654,321
🎯 Accuracy: 98.52%
💯 PP: 730.21
🔗 https://osu.ppy.sh/beatmaps/123456
```

## Contributing
Feel free to fork and submit pull requests!

## License
This project is open-source under the MIT License.


