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
    if (!db) return "Kamu adalah asisten AI yang ramah."; // Fallback jika DB gagal
    
    const collection = db.collection('agent_config');
    const config = await collection.findOne({ type: 'system_prompt' });
    
    //  gunakan prompt default
    return config ? config.prompt : "Kamu adalah Customer Service toko sepatu. Jawab dengan ramah, gunakan emoji, dan maksimal 3 kalimat.";
}

module.exports = { connectDB, getSystemPrompt };