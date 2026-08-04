const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '/')));

app.post('/api/contact', async (req, res) => {
  const { name, store, phone, email, message } = req.body;
  if(!name || !email || !message){
    return res.status(400).json({ error: '이름, 이메일, 문의 내용은 필수입니다.' });
  }

  const requiredEnv = ['SMTP_HOST', 'SMTP_USER', 'SMTP_PASS', 'SMTP_FROM'];
  const missingEnv = requiredEnv.filter(key => !process.env[key]);
  if(missingEnv.length){
    return res.status(500).json({ error: `SMTP 설정이 누락되었습니다: ${missingEnv.join(', ')}` });
  }

  try{
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: process.env.CONTACT_TO || 'jeongmyongkuk@gmail.com',
      subject: `Max Jeju 제작상담 문의: ${name}${store ? ' / ' + store : ''}`,
      text: `이름: ${name}\n매장명: ${store}\n전화번호: ${phone}\n이메일: ${email}\n\n문의 내용:\n${message}`,
    };

    await transporter.sendMail(mailOptions);
    res.json({ ok:true });
  }catch(err){
    console.error('Mail send failed', err);
    res.status(500).json({ error: '메일 전송에 실패했습니다. SMTP 정보와 서버 상태를 확인해주세요.' });
  }
});

app.listen(port, ()=>{
  console.log(`Server started on http://localhost:${port}`);
});
