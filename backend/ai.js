const { OpenAI } = require('openai');
require('dotenv').config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Sekarang menerima knowledgeBase sebagai parameter tambahan
async function generateAIResponse(systemPrompt, knowledgeBase, chatHistory) {
    try {
        // Gabungkan System Prompt utama dengan Knowledge Base (PDF)
        let finalSystemPrompt = systemPrompt;
        
        // Jika ada teks PDF dari database, suntikkan ke dalam instruksi AI
        if (knowledgeBase && knowledgeBase.trim() !== "") {
            finalSystemPrompt += `\n\n=== INFORMASI TAMBAHAN (KNOWLEDGE BASE) ===\nBerikut adalah data atau dokumen yang harus kamu jadikan acuan utama untuk menjawab pertanyaan pengguna (jika relevan):\n${knowledgeBase}`;
        }

        const messages = [
            { role: "system", content: finalSystemPrompt },
            ...chatHistory 
        ];

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: messages,
            temperature: 0.7,
        });
        return response.choices[0].message.content;
    } catch (error) {
        console.error('❌ Error OpenAI:', error);
        return "Maaf, sistem AI sedang beristirahat sebentar. Silakan coba lagi nanti.";
    }
}

module.exports = { generateAIResponse };