const qrcode = require('qrcode-terminal');
const fs = require("fs");
const fetch = require("node-fetch");
const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');

const counterFile = 'pingCounter.json';
const client = new Client({
    authStrategy: new LocalAuth({
        clientId: "client-one"
    })
});

let pingCount = 0;

require('dotenv').config(); // Load .env variables

console.log("Client ID:", process.env.CLIENT_ID);
console.log("Client Secret:", process.env.CLIENT_SECRET ? "Loaded" : "Not loaded");

// Load saved counter from file
if (fs.existsSync(counterFile)) {
    const data = fs.readFileSync(counterFile, 'utf-8');
    pingCount = JSON.parse(data).pingCount || 0;
}

client.initialize();
client.on("qr", qr => qrcode.generate(qr, { small: true }));
client.on('ready', () => console.log("Bot is ready to receive messages"));

// ✅ Function to get osu! access token
async function getAccessToken() {
    const url = "https://osu.ppy.sh/oauth/token";
    const body = new URLSearchParams({
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        grant_type: "client_credentials",
        scope: "public"
    });

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: body
    });

    const data = await response.json();
    return data.access_token;
}

// ✅ Function to fetch osu! best scores
async function fetchOsuBestScores(username, mode = "osu") {
    const token = await getAccessToken();
    const url = `https://osu.ppy.sh/api/v2/users/${username}/scores/best?mode=${mode}&limit=5`;

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await response.json();
        console.log("osu! Best Scores API response:", JSON.stringify(data, null, 2));

        if (!data || data.error) {
            console.error("Error fetching best scores:", data.error || "No scores found.");
            return null;
        }

        return data;
    } catch (error) {
        console.error("Failed to fetch osu! best scores:", error);
        return null;
    }
}

// ✅ Function to fetch osu! user data by username
async function fetchOsuUser(username, mode = "osu") {
    const token = await getAccessToken();
    const url = `https://osu.ppy.sh/api/v2/users/${username}/${mode}?key=username`;

        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        if(!response.ok) {
            // throw new Error("HTTP error: " + response.status);
            console.error("error")
            return false
        }
        const data = await response.json();
        // Debugging: Log the response
        console.log("osu! API response:", JSON.stringify(data, null, 2));

        if (!data || data.error) {
            console.error("Error fetching osu! user:", data.error,  "User not found.");
            return null;
        }
        return data;
}

// ✅ Function to fetch osu! recent play
async function fetchOsuRecentPlay(username, mode = "osu") {
    const token = await getAccessToken();
    const url = `https://osu.ppy.sh/api/v2/users/${username}/scores/recent?mode=${mode}&limit=1`;

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await response.json();
        console.log("osu! Recent Play API response:", JSON.stringify(data, null, 2));

        if (!data || data.length === 0) {
            console.error("No recent plays found for user.");
            return null;
        }

        return data[0];
    } catch (error) {
        console.error("Failed to fetch osu! recent play:", error);
        return null;
    }
}

// ✅ Function to fetch osu! best play
async function fetchOsuBestPlay(username, mode = "osu") {
    const token = await getAccessToken();
    const url = `https://osu.ppy.sh/api/v2/users/${username}/scores/best?mode=${mode}&limit=1`;

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await response.json();
        console.log("osu! Recent Play API response:", JSON.stringify(data, null, 2));

        if (!data || data.length === 0) {
            console.error("No best plays found for user.");
            return null;
        }

        return data[0];
    } catch (error) {
        console.error("Failed to fetch osu! best play:", error);
        return null;
    }
}

// ✅ Command Handling
client.on('message', async msg => {
    if (msg.body === '!ping') {
        return msg.reply('pong');
    }

    if (!msg.body.startsWith("!")) return; // Ignore non-commands

    let [cmd, ...args] = msg.body.slice(1).split(" ");

    if (cmd === "say") {
        return client.sendMessage(msg.from, args.join(" "));
    }

    if (cmd === "sticker" || cmd === "s") {
        const attachmentData = await msg.downloadMedia();
        return client.sendMessage(msg.from, attachmentData, { sendMediaAsSticker: true, stickerAuthor: 'Wah udah cuk', stickerName: 'Wah udah cuk' });
    }

    if (cmd === "command") {
        return client.sendMessage(
            msg.from, 
            `*🎮 Command list:*
            \n
~ \`!ping\` - Just to test if the bot is working or not.\n
~ \`!say <string>\` - I will repeat what you just said.\n
~ Send an image/GIF with the caption \`!s\` or \`!sticker\` - Converts media into a sticker.\n
~ \`!roll\` - Picks a random number between 1-100.\n
~ \`!osu <username> [mode]\` - Shows osu! profile info.\n
~ \`!top <username> [mode]\` - Shows top 5 osu! scores.\n
~ \`!rs <username> [mode]\` - Shows recent osu! score.\n
~ Wah udah cuk`
        );
    }
    
    if (cmd === "roll") {
        let chat = await msg.getChat();
        let contact = await msg.getContact();
        let senderId = contact.id._serialized;

        await chat.sendStateTyping();
        setTimeout(() => chat.clearState(), 3000);

        setTimeout(() => {
            let randomNumber = Math.floor(Math.random() * 100) + 1;
            client.sendMessage(msg.from, `🎲 @${senderId.replace(/@c.us/, "")} rolled: *${randomNumber}*`, {
                mentions: [contact]
            });
        }, 3000);
    }

    // ✅ osu! API Command: "!osu <nickname> [mode]"
    if (cmd === "osu") {
        if (args.length === 0) return msg.reply("Please provide an osu! username.");

        const validModes = ["osu", "taiko", "fruits", "mania"];
        let mode = "osu"; // Default mode
        let username;

        // ✅ Check if the username is wrapped in quotes
        const quotedUsername = msg.body.match(/"([^"]+)"/);
        if (quotedUsername) {
            username = quotedUsername[1]; // Extract username inside quotes
            args = args.filter(arg => arg !== `"${username}"`); // Remove quotes from args
        } else {
            username = args[0]; // Default to first word
            args.shift(); // Remove first word
        }

        // ✅ If the last argument is a valid mode, set it
        if (args.length > 0 && validModes.includes(args[args.length - 1])) {
            mode = args.pop(); // Remove last argument and use it as mode
        }

        let osuUser = await fetchOsuUser(username, mode);
        if (!osuUser) return msg.reply("User not found or API request failed.");

        // 🌍 Get country flag from ISO country code
        function getFlag(countryCode) {
            return countryCode
                .toUpperCase()
                .replace(/./g, char => String.fromCodePoint(127397 + char.charCodeAt()));
        }

        let countryFlag = getFlag(osuUser.country.code);

        let replyMessage = `https://osu.ppy.sh/users/${osuUser.id}\n\n🎵 osu! Profile (${mode}) 🎵\n👤 Username: ${osuUser.username}\n${countryFlag} Country: ${osuUser.country.name}\n🏆 Rank: #${osuUser.statistics.global_rank || "N/A"}\n💯 PP: ${osuUser.statistics.pp || "N/A"}\n🎯 Accuracy: ${osuUser.statistics.hit_accuracy ? osuUser.statistics.hit_accuracy.toFixed(2) + "%" : "N/A"}`;

        msg.reply(replyMessage);
    }
});

// ✅ OSU API COMMAND TOP SCORE
client.on('message', async msg => {
    let [cmd, ...args] = msg.body.slice(1).split(" ");

    if (cmd === "top") {
        if (args.length === 0) return msg.reply("Please provide an osu! username.");

        const validModes = ["osu", "taiko", "fruits", "mania"];
        let mode = "osu";
        let username = args[0];

               // ✅ Check if the username is wrapped in quotes
               const quotedUsername = msg.body.match(/"([^"]+)"/);
               if (quotedUsername) {
                   username = quotedUsername[1]; // Extract username inside quotes
                   args = args.filter(arg => arg !== `"${username}"`); // Remove quotes from args
               } else {
                   username = args[0]; // Default to first word
                   args.shift(); // Remove first word
               }
       
               // ✅ If the last argument is a valid mode, set it
               if (args.length > 0 && validModes.includes(args[args.length - 1])) {
                   mode = args.pop(); // Remove last argument and use it as mode
               }
       

        if (args.length > 1 && validModes.includes(args[1])) {
            mode = args[1];
        }

        // ✅ Fetch user data to get the user ID
        let osuUser = await fetchOsuUser(username, mode);
        if (!osuUser) return msg.reply("User not found.");

        let userId = osuUser.id; // Extract the user ID

        let bestScores = await fetchOsuBestScores(userId, mode);
        if (!bestScores) return msg.reply("No best scores available for this user.");

        let replyMessage = `🏆 Top 5 Best Scores for ${osuUser.username} (${mode} mode):\n`;
        bestScores.forEach((score, index) => {
            replyMessage += `\n${index + 1}. *(${score.rank})* ${score.beatmapset.title} [${score.beatmap.version}] - ${score.pp}pp (Accuracy: ${(score.accuracy * 100).toFixed(2)}%) - ${score.beatmap.url}`;
        });

        msg.reply(replyMessage);
    }
});

// ✅ OSU API COMMAND RECENT SCORE
client.on('message', async msg => {
    let [cmd, ...args] = msg.body.slice(1).split(" ");

if (cmd === "rs") {
    if (args.length === 0) return msg.reply("Please provide an osu! username.");

    const validModes = ["osu", "taiko", "fruits", "mania"];
    let mode = "osu";
    let username = args[0];

           // ✅ Check if the username is wrapped in quotes
           const quotedUsername = msg.body.match(/"([^"]+)"/);
           if (quotedUsername) {
               username = quotedUsername[1]; // Extract username inside quotes
               args = args.filter(arg => arg !== `"${username}"`); // Remove quotes from args
           } else {
               username = args[0]; // Default to first word
               args.shift(); // Remove first word
           }
   
           // ✅ If the last argument is a valid mode, set it
           if (args.length > 0 && validModes.includes(args[args.length - 1])) {
               mode = args.pop(); // Remove last argument and use it as mode
           }
   

    if (args.length > 1 && validModes.includes(args[1])) {
        mode = args[1];
    }

    // ✅ Fetch user data to get the user ID
    let osuUser = await fetchOsuUser(username, mode);
    if (!osuUser) return msg.reply("User not found.");

let userId = osuUser.id; // Extract the user ID

    let recentPlay = await fetchOsuRecentPlay(userId, mode);
    if (!recentPlay) return msg.reply("User not found or no recent plays available.");

    let replyMessage = `🎮 Recent Play for ${osuUser.username} (${mode}):\n\n`;
    replyMessage += `🎵 Beatmap: ${recentPlay.beatmapset.title} [${recentPlay.beatmap.version}]\n`;
    replyMessage += `🏆 Score: *(${recentPlay.rank})* ${recentPlay.score}\n`;
    replyMessage += `🎯 Accuracy: *${(recentPlay.accuracy * 100).toFixed(2)}%*  (${recentPlay.statistics.count_300}/${recentPlay.statistics.count_100}/${recentPlay.statistics.count_50}/${recentPlay.statistics.count_miss})\n`;
    replyMessage += `💯 PP: ${recentPlay.pp ? recentPlay.pp.toFixed(2) : "N/A"}\n`;
    replyMessage += `🔗 https://osu.ppy.sh/beatmaps/${recentPlay.beatmap.id}`;

    msg.reply(replyMessage);
}
});

// ✅ "Wah udah cuk" counter
client.on('message', message => {
    if (message.body.toLowerCase() === "wah udah cuk") {
        pingCount++;
        message.reply(`Wah udah cuk counter: ${pingCount}`);
        fs.writeFileSync(counterFile, JSON.stringify({ pingCount }));
    }
});
