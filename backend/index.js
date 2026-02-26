const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { connectDB, getSystemPrompt } = require('./database');
const { generateAIResponse } = require('./ai');
const express = require('express');

// === SERVER DUMMY UNTUK CLOUD ===
const app = express();
const port = process.env.PORT || 3000;
app.get('/', (req, res) => res.send('🚀 Mesin Bot WhatsApp AI sedang berjalan sehat!'));
app.listen(port, () => console.log(`🌍 Web server monitoring aktif di port ${port}`));

// === KONFIGURASI PUPPETEER KHUSUS CLOUD LINUX ===
// (Hanya ada SATU deklarasi client sekarang)
const client = new Client({ 
    authStrategy: new LocalAuth(),
    puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox'] 
    }
});

// === SISTEM MEMORI JANGKA PENDEK ===
const chatMemory = new Map(); 
const MAX_HISTORY = 10; 

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
    console.log('Silakan scan QR Code di atas!');
});

client.on('ready', () => {
    console.log('✅ Bot WhatsApp sudah siap menerima pesan!');
});

client.on('message', async message => {
    // Abaikan pesan dari grup atau status
    if (message.from.includes('@g.us') || message.from === 'status@broadcast') return;

    const userId = message.from; 

    // Jika ini chat pertama dari orang tersebut, buatkan memori kosong
    if (!chatMemory.has(userId)) {
        chatMemory.set(userId, []);
    }

    const userHistory = chatMemory.get(userId);
    userHistory.push({ role: "user", content: message.body });

    if (userHistory.length > MAX_HISTORY) {
        userHistory.shift(); 
    }

    try {
        const systemPrompt = await getSystemPrompt();
        const aiReply = await generateAIResponse(systemPrompt, userHistory);

        userHistory.push({ role: "assistant", content: aiReply });
        message.reply(aiReply);
    } catch (error) {
        console.error('Terjadi kesalahan:', error);
    }
});

connectDB().then(() => {
    client.initialize();
});