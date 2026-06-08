const fetch = require('node-fetch');

const envoyerWhatsApp = async (numero, message) => {
  try {
    const url = `https://api.callmebot.com/whatsapp.php?phone=${numero}&text=${encodeURIComponent(message)}&apikey=YOUR_API_KEY`;
    await fetch(url);
    console.log(`Message envoyé à ${numero}`);
  } catch (err) {
    console.error('Erreur WhatsApp:', err);
  }
};

module.exports = { envoyerWhatsApp };
