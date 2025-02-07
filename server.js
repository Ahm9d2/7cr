const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
require("dotenv").config(); // تحميل متغيرات البيئة

const app = express();
app.use(express.json());
app.use(cors());

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER, // يتم قراءته من .env
        pass: process.env.EMAIL_PASS // يتم قراءته من .env
    }
});

app.post("/send-email", (req, res) => {
    const { email, date, time, field, price, duration, invoiceNumber } = req.body;

    if (!email || !date || !time || !field) {
        return res.status(400).send("جميع الحقول مطلوبة!");
    }

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "تأكيد الحجز",
        text: `تم حجز ${field} في ${date} الساعة ${time}.\n\nتفاصيل الحجز:\n- المدة: ${duration} ساعة\n- السعر: ${price} ريال\n- رقم الفاتورة: ${invoiceNumber}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("خطأ أثناء إرسال البريد:", error);
            return res.status(500).send("حدث خطأ أثناء إرسال البريد.");
        }
        console.log("تم إرسال البريد بنجاح:", info.response);
        res.send("تم إرسال البريد بنجاح!");
    });
});

// تشغيل السيرفر على جميع الأجهزة في الشبكة المحلية
const PORT = 3000;
const HOST = "0.0.0.0"; // يسمح بالوصول من الهاتف عند الاتصال بنفس الشبكة

app.listen(PORT, HOST, () => {
    console.log(`السيرفر يعمل على http://localhost:${PORT}`);
});
