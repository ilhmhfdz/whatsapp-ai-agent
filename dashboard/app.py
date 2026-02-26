import streamlit as st
from pymongo import MongoClient
import os
from dotenv import load_dotenv
import certifi

load_dotenv()
MONGO_URI = os.getenv("MONGODB_URI")

# Pengaturan halaman harus di paling atas
st.set_page_config(page_title="AI Agent Dashboard | Portofolio", page_icon="🤖", layout="wide")

@st.cache_resource
def init_connection():
    return MongoClient(MONGO_URI, tlsCAFile=certifi.where())

try:
    client = init_connection()
    db = client['whatsapp_bot'] 
    collection = db['agent_config']
except Exception as e:
    st.error(f"❌ Gagal terhubung ke MongoDB: {e}")
    st.stop()

# --- SIDEBAR (Panel Samping) ---
with st.sidebar:
    
    # Tombol WhatsApp langsung ke Bot
    st.markdown("🎯 **Live Demo**")
    st.markdown("Klik tombol di bawah untuk langsung menguji respons bot di WhatsApp.")
    st.link_button("💬 Test Bot di WhatsApp", "https://wa.me/62881082895498", type="primary", use_container_width=True)
    
    st.header("⚙️ Status Sistem")
    st.success("🟢 MongoDB: Terhubung")
    st.info("🧠 Model: GPT-4o-mini")
    st.info("💾 Memori: 15 Pesan Terakhir")
    st.divider()

    st.title("👨‍💻 Tentang Developer")
    st.markdown("**Ilham Hafidz**")
    st.markdown("*AI Engineer*")
    st.markdown("[Lihat Repositori GitHub](https://github.com/ilhmhfdz)")
    st.divider()

# --- MAIN LAYOUT (Panel Utama) ---
st.title("Control Panel AI Agent")
st.markdown("Antarmuka manajemen *prompt* dinamis untuk agen layanan pelanggan WhatsApp. Setiap perubahan di sini akan langsung memperbarui kepribadian bot secara *real-time*.")
st.divider()

# Tarik data lama
current_config = collection.find_one({"type": "system_prompt"})
default_prompt = current_config["prompt"] if current_config else "Kamu adalah Customer Service toko sepatu..."

# Membagi layar menggunakan Tabs agar terlihat profesional
tab1, tab2 = st.tabs(["📝 Konfigurasi Prompt", "🧩 Info Arsitektur"])

# TAB 1: KONFIGURASI PROMPT
with tab1:
    col1, col2 = st.columns([2, 1])

    with col1:
        with st.form("prompt_form"):
            st.subheader("Instruksi Utama (System Prompt)")
            new_prompt = st.text_area(
                "Tentukan persona, gaya bahasa, dan batasan operasional bot:", 
                value=default_prompt, 
                height=250
            )
            
            # Tombol simpan yang lebar penuh
            submit_button = st.form_submit_button(label="Simpan & Terapkan Perubahan ", use_container_width=True)

        if submit_button:
            try:
                collection.update_one(
                    {"type": "system_prompt"},
                    {"$set": {"prompt": new_prompt}},
                    upsert=True 
                )
                st.success("✅ Sukses! Konfigurasi bot telah diperbarui. Silakan uji melalui tombol WhatsApp di sidebar.")
            except Exception as e:
                st.error(f"❌ Terjadi kesalahan: {e}")

    # PENTING: with col2 sekarang berada di dalam with tab1
    with col2:
        st.subheader("📚 Library Prompt")
        st.markdown("Pilih referensi gaya di bawah ini:")
        
        with st.expander("Gaya Customer Service", expanded=True):
            st.code(
                "Kamu adalah CS toko fashion 'GayaKita'.\n"
                "Jawab dengan ramah, gunakan kata 'Kak', \n"
                "dan selalu tawarkan promo diskon 10% di akhir kalimat.", 
                language="markdown"
            )
        
        with st.expander("Gaya Tech Support"):
            st.code(
                "Kamu adalah IT Support.\n"
                "Jawab dengan sangat teknis, profesional, \n"
                "dan minta user melakukan restart atau hapus cache sebagai solusi pertama.", 
                language="markdown"
            )
            
        with st.expander("Gaya Asisten Santai"):
            st.code(
                "Kamu adalah asisten tongkrongan.\n"
                "Panggil user dengan sebutan 'Bro' atau 'Bang'. \n"
                "Gunakan bahasa gaul Jakarta Selatan.", 
                language="markdown"
            )

# TAB 2: INFO ARSITEKTUR
with tab2:
    st.subheader("Arsitektur Sistem MVP")
    st.markdown("""
    Sistem ini dibangun untuk memisahkan logika *prompt* dari *source code* utama, memungkinkan iterasi yang cepat tanpa waktu henti (*zero downtime*).
    
    * **Frontend Control:** Streamlit (Python)
    * **Backend Engine:** Node.js & `whatsapp-web.js`
    * **Database Configuration:** MongoDB Atlas (NoSQL)
    * **AI Engine:** OpenAI API (GPT-4o-mini) terintegrasi dengan memori percakapan berantai.
    """)