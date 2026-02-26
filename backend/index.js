const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { connectDB, getSystemPrompt } = require('./database');
const { generateAIResponse } = require('./ai');
const express = require('express'); // 1. Tambahan untuk Cloud

// 2. === SERVER DUMMY UNTUK CLOUD (Wajib agar tidak dimatikan server) ===
const app = express();
const port = process.env.PORT || 3000;
app.get('/', (req, res) => res.send('🚀 Mesin Bot WhatsApp AI sedang berjalan sehat!'));
app.listen(port, () => console.log(`🌍 Web server monitoring aktif di port ${port}`));

// 3. === KONFIGURASI PUPPETEER KHUSUS CLOUD LINUX ===
const client = new Client({ 
    authStrategy: new LocalAuth(),
    puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox'] // Izin wajib untuk Linux
    }
});

// === SISTEM MEMORI JANGKA PENDEK ===
const chatMemory = new Map(); 
const MAX_HISTORY = 10; 

// ... (KODE KE BAWAHNYA TETAP SAMA PERSIS SEPERTI SEBELUMNYA) ...
// client.on('qr', ...

const client = new Client({ authStrategy: new LocalAuth() });

// === SISTEM MEMORI JANGKA PENDEK ===
const chatMemory = new Map(); 
const MAX_HISTORY = 15; // Bot hanya mengingat 15 pesan terakhir per orang agar hemat biaya API

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

    const userId = message.from; // Nomor WA pembeli sebagai kunci (ID)

    // Jika ini chat pertama dari orang tersebut, buatkan memori kosong
    if (!chatMemory.has(userId)) {
        chatMemory.set(userId, []);
    }

    const userHistory = chatMemory.get(userId);

    // 1. Simpan pesan baru pelanggan ke memori
    userHistory.push({ role: "user", content: message.body });

    // Jaga agar memori tidak melebihi batas maksimal (hapus yang paling lama)
    if (userHistory.length > MAX_HISTORY) {
        userHistory.shift(); 
    }

    try {
        // 2. Ambil kepribadian bot dari Database
        const systemPrompt = await getSystemPrompt();

        // 3. Kirim SELURUH riwayat ke OpenAI
        const aiReply = await generateAIResponse(systemPrompt, userHistory);

        // 4. Simpan balasan AI ke memori agar bot ingat apa yang baru saja dia katakan
        userHistory.push({ role: "assistant", content: aiReply });

        // 5. Kirim ke WhatsApp
        message.reply(aiReply);
    } catch (error) {
        console.error('Terjadi kesalahan:', error);
    }
});

connectDB().then(() => {
    client.initialize();
});