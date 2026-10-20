const express = require('express');
const https = require('https');
const crypto = require('crypto');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==========================================
// 1. Version & Proxy Configuration
// ==========================================
const BASE_APP_VERSION = "2.133.0";     
const TARGET_PATCH_VERSION = "2.133.1"; 
const RENDER_URL = process.env.RENDER_URL || "https://your-app-name.onrender.com";
const SERVER_NAME = "FF Max Proxy Private Server";
const DEVELOPER_NAME = "MR.TAKIBUL";

// ==========================================
// 2. Protection Bots (Permanent Security)
// ==========================================
const botProfiles = {
    "11111111": { username: "bot1", uid: "11111111", nickname: "Main Game Bot", level: 100, diamonds: 999999, gold: 999999, bio: "Security Bot 1", is_bot: true },
    "22222222": { username: "bot2", uid: "22222222", nickname: "Main Game Bot", level: 100, diamonds: 999999, gold: 999999, bio: "Security Bot 2", is_bot: true }
};

// ==========================================
// 3. Dynamic Database & Credential Storage
// ==========================================
let userProfiles = {
    "10000001": {
        username: "takibul",
        password: "123",
        uid: "10000001",
        nickname: "MR.TAKIBUL",
        level: 100,
        diamonds: 999999,
        gold: 9999999,
        ff_tokens: 99999,       
        magic_cube: 99,         
        guild_tokens: 99999,
        universal_ring_token: 99999,
        bunny_mp40_token: 99999,
        hyper_book_tokens: 99999,
        evo_gun_tokens: 99999,
        bio: "Owner of FF Max Proxy Private Server",
        badges: { v_badge: true, moderator_badge: true, post_badge: true },
        last_login: Date.now()
    }
};

// ==========================================
// 4. Auto-Cycling Event List (Loop System)
// ==========================================
const patchEvents = [
    { event_id: 1, title: "Booyah Pass Season Start (v2.133.1)", description: "Free Fire Max Latest Patch First Booyah Pass Event!", reward: "Exclusive Bundle & Emote" },
    { event_id: 2, title: "Mystery Shop & Diamond Royale", description: "Mystery Shop and Diamond Royale discount event is live.", reward: "90% Off Special Rewards" },
    { event_id: 3, title: "Ranked BR & CS Season Peak", description: "Ranked BR and CS mode exclusive reward event.", reward: "Heroic Avatar & Token" },
    { event_id: 4, title: "Callback & Top-Up Event Finale", description: "Latest patch final event! Will reset to first event after completion.", reward: "Legendary Gloo Wall Skin" }
];

let currentEventIndex = 0;
let eventStartTime = Date.now();
const EVENT_DURATION_MS = 24 * 60 * 60 * 1000; 

function getActiveEventData() {
    const elapsed = Date.now() - eventStartTime;
    if (elapsed > EVENT_DURATION_MS) {
        currentEventIndex = (currentEventIndex + 1) % patchEvents.length;
        eventStartTime = Date.now();
    }
    return patchEvents[currentEventIndex];
}

// ==========================================
// 5. In-Game Permanent Mail Memory
// ==========================================
let userMails = {
    "10000001": [
        {
            mail_id: 101,
            title: "FF Max v2.133.1 ID Edit",
            content: "Click the link below to customize your UID, diamonds, and gold.",
            link: `${RENDER_URL}/customize?uid=10000001`,
            is_deletable: false,
            is_read: false
        }
    ]
};

// ==========================================
// 6. Anti-Sleep Ping & Cleaning Watchdog
// ==========================================
setInterval(() => {
    if (RENDER_URL && RENDER_URL.startsWith("https")) {
        https.get(RENDER_URL, (res) => {
            console.log(`[KeepAlive Ping] Status: ${res.statusCode}`);
        }).on('error', (err) => console.log(`[Ping Error]: ${err.message}`));
    }
}, 10 * 60 * 1000);

// ==========================================
// 7. Version Bypass & Security Middleware
// ==========================================
app.use('/api/v1/', (req, res, next) => {
    req.headers['app-version'] = BASE_APP_VERSION;
    next();
});

// ==========================================
// 8. Patch & Notice API (Includes 5s Green Greeting Popup & Auth UI Intercept)
// ==========================================
app.get('/api/v1/notice', (req, res) => {
    const activeEvent = getActiveEventData();
    res.json({
        status: "success",
        patch_update: {
            required: false,
            patch_version: TARGET_PATCH_VERSION,
            patch_size_mb: 5.5,
            patch_message: `Active Event: ${activeEvent.title}`,
            current_event: activeEvent
        },
        banner_info: {
            title: SERVER_NAME,
            developer_tag: `Developer By ${DEVELOPER_NAME}`,
            event_poster: `WELCOME TO FREE FIRE MAX PROXY SERVER`
        },
        // সবুজ কালারের ৫ সেকেন্ডের গ্রিটিংস পপআপ
        greeting_popup: {
            show_popup: true,
            duration: 5,
            text_color: "#22c55e",
            message: "Dear Free Fire's Lovers, Welcome to FF MAX Proxy Private Server. Dear Developer Boy Mr. Takibul (MR.TAKIBUL)."
        },
        // গেস্ট বা লগইন চাপ দিলে সরাসরি কাস্টম ইন-গেম অথেন্টিকেশন প্যানেল ট্রিগার করবে
        guest_auth_bypass: {
            force_custom_login: true,
            ui_title: "MR.TAKIBUL PROXY LOGIN & REGISTER",
            fields: ["username", "password"],
            register_prompt: "New user? Register instantly and enter lobby."
        }
    });
});

// ==========================================
// 9. Direct Guest-to-Auth & Registration Login API
// ==========================================
app.all(['/api/v1/auth/guest', '/api/v1/auth/login', '/api/v1/auth/register', '/api/login'], (req, res) => {
    const { username, password, action } = req.body || {};

    let currentUsername = username;
    let currentPassword = password;

    // যদি গেস্ট বাটন থেকে রিকোয়েস্ট আসে বা ইউজারনেম না থাকে, তবে সেটিকে র্যান্ডম ইউজার হিসেবে রেজিস্টার করে সরাসরি লবিতে ঢুকিয়ে দেবে
    if (!currentUsername) {
        const randomHex = crypto.randomBytes(3).toString('hex');
        currentUsername = `Takibul_Player_${randomHex}`;
        currentPassword = `pass_${randomHex}`;
    }

    let foundUser = null;
    for (let uKey in userProfiles) {
        if (userProfiles[uKey].username === currentUsername) {
            foundUser = userProfiles[uKey];
            break;
        }
    }

    if (action === 'register' || (!foundUser && action !== 'login')) {
        if (foundUser) {
            return res.json({ success: false, status: 2, message: "Username already exists! Please choose another." });
        }
        
        // নতুন অ্যাকাউন্ট তৈরি এবং র্যান্ডম প্রফাইল নেম ও ৯৯+ ডায়মন্ড সেটআপ
        const newUid = "99" + Math.floor(10000000 + Math.random() * 90000000);
        const baseNicknames = ["Shadow", "Viper", "Killer", "Alpha", "Storm", "Hunter", "Rogue", "Ghost", "Takibul_Pro", "Legend"];
        const randomNick = baseNicknames[Math.floor(Math.random() * baseNicknames.length)] + "_" + Math.floor(100 + Math.random() * 900);

        userProfiles[newUid] = {
            username: currentUsername,
            password: currentPassword || "123",
            uid: newUid,
            nickname: randomNick,
            level: 100,
            diamonds: 999999,
            gold: 9999999,
            ff_tokens: 99999,
            magic_cube: 99,
            guild_tokens: 99999,
            universal_ring_token: 99999,
            bunny_mp40_token: 99999,
            hyper_book_tokens: 99999,
            evo_gun_tokens: 99999,
            bio: `Private Server User - ${DEVELOPER_NAME}`,
            badges: { v_badge: true, moderator_badge: true, post_badge: true },
            last_login: Date.now()
        };
        foundUser = userProfiles[newUid];
    } else {
        if (!foundUser || foundUser.password !== currentPassword) {
            // গেস্ট বা লগইন রিকোয়েস্টে পাসওয়ার্ড না মিললে বা নতুন হলে স্বয়ংক্রিয়ভাবে অ্যাকাউন্ট রেজিস্টার করে এন্ট্রি দিয়ে দেবে
            const newUid = "99" + Math.floor(10000000 + Math.random() * 90000000);
            userProfiles[newUid] = {
                username: currentUsername,
                password: currentPassword || "123",
                uid: newUid,
                nickname: currentUsername,
                level: 100,
                diamonds: 999999,
                gold: 9999999,
                ff_tokens: 99999,
                magic_cube: 99,
                guild_tokens: 99999,
                universal_ring_token: 99999,
                bunny_mp40_token: 99999,
                hyper_book_tokens: 99999,
                evo_gun_tokens: 99999,
                bio: `Private Server User - ${DEVELOPER_NAME}`,
                badges: { v_badge: true, moderator_badge: true, post_badge: true },
                last_login: Date.now()
            };
            foundUser = userProfiles[newUid];
        } else {
            foundUser.last_login = Date.now();
        }
    }

    res.json({
        status: "success",
        success: true,
        uid: foundUser.uid,
        account_id: foundUser.uid,
        token: "private_proxy_auth_token_ok",
        region: "BD",
        player_info: foundUser,
        account_info: foundUser,
        server: SERVER_NAME
    });
});

// ==========================================
// 10. BR, CS & Custom Room NPC Matchmaking
// ==========================================
app.post('/api/v1/matchmaking/start', (req, res) => {
    const { uid, mode } = req.body;
    const gameMode = mode || "classic_br_cs";

    if (userProfiles[uid]) userProfiles[uid].last_login = Date.now();

    let realPlayers = [uid];
    let npcBots = [];
    const baseTitles = ["Hunter", "Marksman", "Sniper", "Ghost", "Killer", "Shadow", "Rogue", "Alpha", "Storm", "Viper"];

    function generateRandomBotName() {
        let title = baseTitles[Math.floor(Math.random() * baseTitles.length)];
        let randomNum = Math.floor(1000 + Math.random() * 9000);
        return `${title}_${randomNum}`;
    }

    for (let i = 1; i <= 3; i++) {
        npcBots.push({
            bot_id: `MAX_NPC_${Math.floor(1000 + Math.random() * 9000)}`,
            nickname: generateRandomBotName(),
            damage_attribute: `v2.133.1_standard`,
            health: 200,
            ai_difficulty: "hard_patch"
        });
    }

    let enemyTeam = [];
    for (let i = 1; i <= 4; i++) {
        enemyTeam.push({
            nickname: generateRandomBotName(),
            ai_difficulty: "hard_patch"
        });
    }

    res.json({
        status: "success",
        match_id: `MATCH_${Date.now()}`,
        mode: gameMode,
        server_latency: "10ms (Proxy Auth Mode)",
        team: { real_players: realPlayers, npc_teammates: npcBots },
        opponents: enemyTeam
    });
});

// ==========================================
// 11. In-Game Permanent Mail Box
// ==========================================
app.get('/api/v1/mail/list', (req, res) => {
    const player_uid = req.query.uid || "10000001";
    
    if (!userMails[player_uid]) {
        userMails[player_uid] = [
            {
                mail_id: 101,
                title: "FF Max Auth Proxy ID Edit",
                content: `Click the link below to customize UID (${player_uid}) and diamonds.`,
                link: `${RENDER_URL}/customize?uid=${player_uid}`,
                is_deletable: false,
                is_read: false
            }
        ];
    }

    res.json({ status: "success", mails: userMails[player_uid] });
});

// ==========================================
// 12. Website Customization & Edit Panel
// ==========================================
app.get('/customize', (req, res) => {
    const uid = req.query.uid || "10000001";
    const user = userProfiles[uid] || { nickname: "Max Player", level: 100, diamonds: 999999, gold: 9999999, ff_tokens: 99999, magic_cube: 99, guild_tokens: 99999, bio: "FF Max Proxy User", badges: {} };
    const activeEvent = getActiveEventData();

    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>FF Max Proxy ID Edit Panel</title>
            <style>
                body { background: #0d1117; color: #c9d1d9; font-family: 'Segoe UI', Arial, sans-serif; padding: 15px; text-align: center; }
                .container { display: flex; flex-wrap: wrap; justify-content: center; gap: 20px; }
                .box { background: #161b22; padding: 20px; border-radius: 12px; width: 340px; border: 1px solid #30363d; box-shadow: 0 4px 20px rgba(0,0,0,0.5); text-align: left; }
                .uid-header { background: #ff4757; color: white; padding: 8px; border-radius: 6px; font-weight: bold; margin-bottom: 12px; text-align: center; }
                .ver-tag { font-size: 11px; background: #238636; color: white; padding: 3px 6px; border-radius: 4px; display: inline-block; margin-bottom: 10px; }
                label { display: block; margin: 8px 0 4px; font-size: 13px; color: #8b949e; }
                input, select, textarea { width: 100%; padding: 10px; margin-bottom: 10px; background: #0d1117; color: #fff; border: 1px solid #30363d; border-radius: 6px; box-sizing: border-box; }
                button { background: #238636; color: white; border: none; padding: 12px; cursor: pointer; width: 100%; border-radius: 6px; font-weight: bold; font-size: 14px; margin-top: 5px; }
                button.gift-btn { background: #8957e5; }
                .section-title { border-bottom: 1px solid #30363d; padding-bottom: 5px; margin-bottom: 10px; color: #58a6ff; font-weight: bold; }
                .social-footer { margin-top: 15px; font-size: 12px; color: #8b949e; text-align: center; }
            </style>
        </head>
        <body>
            <div class="ver-tag">Event Loop: ${activeEvent.title} | FF Max v${TARGET_PATCH_VERSION}</div>
            <div class="container">
                
                <div class="box">
                    <div class="uid-header">EDITING UID: ${uid}</div>
                    <form action="/api/v1/profile/update" method="POST">
                        <input type="hidden" name="old_uid" value="${uid}">
                        
                        <div class="section-title">👤 UID & Profile Setup</div>
                        <label>New UID:</label>
                        <input type="number" name="new_uid" value="${uid}" required>

                        <label>In-Game Name:</label>
                        <input type="text" name="nickname" value="${user.nickname}">
                        
                        <label>Level (1 - 100):</label>
                        <input type="number" name="level" min="1" max="100" value="${user.level}">

                        <label>Bio:</label>
                        <input type="text" name="bio" value="${user.bio}">

                        <div class="section-title" style="margin-top:15px;">💎 Currency & Tokens</div>
                        <label>Diamonds:</label>
                        <input type="number" name="diamonds" value="${user.diamonds}">

                        <label>Gold:</label>
                        <input type="number" name="gold" value="${user.gold}">

                        <label>FF Tokens:</label>
                        <input type="number" name="ff_tokens" value="${user.ff_tokens}">

                        <label>Magic Cube:</label>
                        <input type="number" name="magic_cube" value="${user.magic_cube}">

                        <button type="submit">Save and Sync</button>
                    </form>
                </div>

                <div class="box">
                    <div class="section-title">🎁 Mail Gift Center</div>
                    <form action="/api/v1/mail/send-gift" method="POST">
                        <label>Recipient UID:</label>
                        <input type="number" name="target_uid" value="${uid}" required>

                        <label>Mail Title:</label>
                        <input type="text" name="mail_title" value="FF Max Proxy Gift" required>

                        <label>Gift Category:</label>
                        <select name="gift_type">
                            <option value="diamonds">Diamond Package</option>
                            <option value="gold">Gold Package</option>
                            <option value="ff_tokens">FF Tokens</option>
                            <option value="magic_cube">Magic Cube</option>
                        </select>

                        <label>Amount:</label>
                        <input type="number" name="amount" value="5000">

                        <label>Mail Message:</label>
                        <textarea name="message" rows="3">Special gift from ${DEVELOPER_NAME}!</textarea>

                        <button type="submit" class="gift-btn">🚀 Send to In-Game Mail</button>
                    </form>
                    
                    <div class="social-footer">
                        Developed By: <b>${DEVELOPER_NAME}</b><br>
                        Server URL: <a href="${RENDER_URL}" style="color:#58a6ff;">${RENDER_URL}</a>
                    </div>
                </div>

            </div>
        </body>
        </html>
    `);
});

// ==========================================
// 13. Profile Update Handler
// ==========================================
app.post('/api/v1/profile/update', (req, res) => {
    const { old_uid, new_uid, nickname, level, bio, diamonds, gold, ff_tokens, magic_cube } = req.body;

    if (!new_uid || new_uid.length < 8) {
        return res.send(`<h2 style="color:red; text-align:center;">❌ UID must be at least 8 digits!</h2>`);
    }

    if (new_uid !== old_uid && (userProfiles[new_uid] || botProfiles[new_uid])) {
        return res.send(`<h2 style="color:red; text-align:center;">❌ This UID is already in use!</h2>`);
    }

    if (new_uid !== old_uid && userProfiles[old_uid]) {
        userProfiles[new_uid] = userProfiles[old_uid];
        delete userProfiles[old_uid];
        userProfiles[new_uid].uid = new_uid;
        if (userMails[old_uid]) {
            userMails[new_uid] = userMails[old_uid];
            delete userMails[old_uid];
        }
    }

    const targetUser = userProfiles[new_uid] || userProfiles[old_uid];
    if (targetUser) {
        targetUser.nickname = nickname;
        targetUser.level = parseInt(level) || 100;
        targetUser.bio = bio;
        targetUser.diamonds = parseInt(diamonds) || 999999;
        targetUser.gold = parseInt(gold) || 9999999;
        targetUser.ff_tokens = parseInt(ff_tokens) || 99999;
        targetUser.magic_cube = parseInt(magic_cube) || 99;
    }

    res.send(`
        <body style="background:#0d1117; color:#2ea043; text-align:center; padding-top:50px; font-family:Arial;">
            <h2>✅ Successfully Customized and Synced!</h2>
            <p style="color:#c9d1d9;">New UID: <b>${new_uid}</b></p>
            <a href="/customize?uid=${new_uid}" style="color:#58a6ff;">← Go Back</a>
        </body>
    `);
});

// ==========================================
// 14. Mail Gift Delivery Handler
// ==========================================
app.post('/api/v1/mail/send-gift', (req, res) => {
    const { target_uid, mail_title, gift_type, amount, message } = req.body;

    if (!userMails[target_uid]) userMails[target_uid] = [];

    if (userProfiles[target_uid]) {
        if (gift_type === 'diamonds') userProfiles[target_uid].diamonds += (parseInt(amount) || 0);
        else if (gift_type === 'gold') userProfiles[target_uid].gold += (parseInt(amount) || 0);
        else if (gift_type === 'ff_tokens') userProfiles[target_uid].ff_tokens += (parseInt(amount) || 0);
        else if (gift_type === 'magic_cube') userProfiles[target_uid].magic_cube += (parseInt(amount) || 0);
    }

    userMails[target_uid].push({
        mail_id: Date.now(),
        title: mail_title,
        content: `${message} [Gift: ${gift_type.toUpperCase()}]`,
        is_deletable: true,
        is_read: false
    });

    res.send(`<h2 style="color:green; text-align:center;">🎁 Gift sent to mail box!</h2><center><a href="/customize?uid=${target_uid}">Go Back</a></center>`);
});

// ==========================================
// 15. Store & Vault Handlers
// ==========================================
app.post('/api/v1/store/deduct', (req, res) => {
    const { uid, currency_type, cost } = req.body;
    const user = userProfiles[uid];

    if (!user) return res.status(404).json({ status: "error", message: "User not found" });

    const price = parseInt(cost) || 0;

    if (currency_type === 'diamonds' && user.diamonds >= price) {
        user.diamonds -= price;
        return res.json({ status: "success", remaining: user.diamonds });
    } else if (currency_type === 'gold' && user.gold >= price) {
        user.gold -= price;
        return res.json({ status: "success", remaining: user.gold });
    } else if (currency_type === 'ff_tokens' && user.ff_tokens >= price) {
        user.ff_tokens -= price;
        return res.json({ status: "success", remaining: user.ff_tokens });
    }

    res.json({ status: "failed", message: "Insufficient balance" });
});

app.all(['/store/*', '/vault/*'], (req, res) => {
    res.json({
        success: true,
        status: 0,
        message: "Store & Vault items successfully loaded and unlocked",
        items_status: "unlocked_ready_to_purchase"
    });
});

// ==========================================
// 16. localconfig.json Download Route (Proxy Format)
// ==========================================
app.get('/localconfig.json', (req, res) => {
    const configData = {
        serverLoginUrl: `${RENDER_URL}/`,
        allowed_version: BASE_APP_VERSION,
        patch_version: TARGET_PATCH_VERSION,
        bypass_official_server: true,
        event_loop_enabled: true,
        auth_url: `${RENDER_URL}/api/v1/auth/login`,
        notice_url: `${RENDER_URL}/api/v1/notice`,
        matchmaking_url: `${RENDER_URL}/api/v1/matchmaking/start`,
        mail_api: `${RENDER_URL}/api/v1/mail/list`,
        store_deduct_api: `${RENDER_URL}/api/v1/store/deduct`,
        config_settings: {
            auto_unlock_all: true,
            instant_npc_matchmaking: true,
            br_cs_mode_supported: true,
            custom_auth_supported: true,
            developer: DEVELOPER_NAME
        }
    };
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename=localconfig.json');
    res.send(JSON.stringify(configData, null, 4));
});

// ==========================================
// 17. Home Page Dashboard & Web Registration Portal
// ==========================================
app.get('/', (req, res) => {
    const totalAccounts = Object.keys(userProfiles).length;
    const activeEvent = getActiveEventData();

    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>${SERVER_NAME} Dashboard</title>
            <style>
                body { background: #0d1117; color: #fff; font-family: Arial, sans-serif; text-align: center; padding-top: 30px; }
                .stats-container { display: flex; justify-content: center; gap: 20px; margin: 20px 0; flex-wrap: wrap; }
                .stat-box { background: #161b22; border: 1px solid #30363d; padding: 15px 25px; border-radius: 10px; width: 200px; box-shadow: 0 4px 15px rgba(0,0,0,0.5); }
                .stat-num { font-size: 28px; font-weight: bold; color: #58a6ff; margin-top: 5px; }
                .form-box { background: #161b22; border: 1px solid #30363d; padding: 20px; border-radius: 10px; width: 320px; margin: 20px auto; text-align: left; }
                input { width: 100%; padding: 10px; margin-bottom: 10px; background: #0d1117; color: #fff; border: 1px solid #30363d; border-radius: 6px; box-sizing: border-box; }
                button { background: #238636; color: white; border: none; padding: 10px; width: 100%; border-radius: 6px; font-weight: bold; cursor: pointer; }
            </style>
        </head>
        <body>
            <h1>🔥 ${SERVER_NAME} 🔥</h1>
            <p><b>Developer:</b> ${DEVELOPER_NAME}</p>
            <p><b>Active Event:</b> ${activeEvent.title}</p>
            
            <div class="stats-container">
                <div class="stat-box">
                    <div>👥 Total Accounts</div>
                    <div class="stat-num">${totalAccounts}</div>
                </div>
            </div>

            <div class="form-box">
                <h3 style="margin-top:0; color:#58a6ff; text-align:center;">Register / Manage Account</h3>
                <form action="/api/v1/auth/login" method="POST">
                    <input type="hidden" name="action" value="register">
                    <label style="font-size:13px; color:#8b949e;">Username:</label>
                    <input type="text" name="username" placeholder="Enter username" required>
                    <label style="font-size:13px; color:#8b949e;">Password:</label>
                    <input type="password" name="password" placeholder="Enter password" required>
                    <button type="submit">Register Account</button>
                </form>
            </div>

            <br>
            <a href="/localconfig.json" style="background:#ff4757; color:white; padding:12px 20px; text-decoration:none; border-radius:50px; font-weight:bold;">
               📥 Download localconfig.json (Auth Format)
            </a>
        </body>
        </html>
    `);
});

app.listen(PORT, () => {
    console.log(`${SERVER_NAME} running on port ${PORT}`);
});