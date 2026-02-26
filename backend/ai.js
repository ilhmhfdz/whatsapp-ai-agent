const { OpenAI } = require('openai');
require('dotenv').config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// fungsi ini menerima chatHistory (array) bukan hanya userMessage (string)
async function generateAIResponse(systemPrompt, chatHistory) {
    try {
        // Gabungkan instruksi sistem dengan riwayat obrolan pembeli
        const messages = [
            { role: "system", content: systemPrompt },
            ...chatHistory // Menggabungkan semua isi array riwayat chat ke sini
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