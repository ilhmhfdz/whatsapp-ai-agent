const { MongoClient } = require('mongodb');
require('dotenv').config();

const client = new MongoClient(process.env.MONGODB_URI);
let db;

async function connectDB() {
    try {
        await client.connect();
        // nama database-nya 'whatsapp_bot'
        db = client.db('whatsapp_bot'); 
        console.log('✅ Terhubung ke MongoDB Atlas');
    } catch (error) {
        console.error('❌ Gagal terhubung ke MongoDB:', error);
    }
}

async function getSystemPrompt() {
    // Pengaturan default jika database kosong atau gagal terhubung
    const defaultConfig = { 
        prompt: "Kamu adalah asisten AI yang ramah.", 
        knowledgeBase: "" 
    };

    if (!db) return defaultConfig; 
    
    try {
        const collection = db.collection('agent_config');
        const config = await collection.findOne({ type: 'system_prompt' });
        
        if (config) {
            // Mengembalikan Object berisi prompt dan knowledge_base
            return {
                prompt: config.prompt || defaultConfig.prompt,
                knowledgeBase: config.knowledge_base || ""
            };
        } else {
            return defaultConfig;
        }
    } catch (error) {
        console.error("❌ Gagal mengambil konfigurasi dari database:", error);
        return defaultConfig;
    }
}

module.exports = { connectDB, getSystemPrompt };