const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();  // هذا السطر مهم

app.use(express.json());
app.use(cors());

// إعدادات البريد الإلكتروني
const adminEmail = "7croman2@gmail.com"; // بريدك للإشعارات

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: adminEmail,  // ✨ بريدك
    pass: "iimm yudc qwpn bynf"  // ✨ كلمة مرور التطبيقات
  }
});

console.log("خادم البريد الإلكتروني جاهز!");
console.log("server ✅");

// روت إرسال البريد
app.post("/send-email", async (req, res) => {
  try {
    // توليد رقم الطلب يدويًا
    const invoiceNumber = `7CR${Math.floor(Math.random() * 10000) + 1000}`;
    console.log("رقم الطلب:", invoiceNumber);

    const { email, stadium, date, time, duration, price, location, phone } = req.body;
    const emailContent = `
      <h2>تفاصيل الحجز</h2>
      <p><strong>رقم الطلب:</strong> ${invoiceNumber}</p>
      <p><strong>الملعب:</strong> ${stadium || "غير متوفر"}</p>
      <p><strong>التاريخ:</strong> ${date || "غير متوفر"}</p>
      <p><strong>الوقت:</strong> ${time || "غير متوفر"}</p>
      <p><strong>المدة:</strong> ${duration || "غير متوفر"} ساعات</p>
      <p><strong>السعر:</strong> ${price || "غير متوفر"} ريال</p>
      <p><strong>الموقع:</strong> <a href="${location || "#"}" target="_blank">اضغط هنا</a></p>
      <p><strong>رقم الهاتف:</strong> ${phone || "غير متوفر"}</p>
    `;
    

    const mailOptionsClient = {
      from: adminEmail,
      to: email,
      subject: `تأكيد حجزك - ${invoiceNumber}`,
      html: emailContent
    };

    const mailOptionsAdmin = {
      from: adminEmail,
      to: adminEmail,
      subject: `إشعار بحجز جديد - ${invoiceNumber}`,
      html: `<h2>تم تسجيل حجز جديد</h2>` + emailContent
    };

    // إرسال البريد للعميل
    transporter.sendMail(mailOptionsClient, (error, info) => {
      if (error) {
        console.error("خطأ في إرسال البريد للعميل:", error);
        return res.status(500).send("فشل في إرسال البريد للعميل");
      }

      // إرسال البريد للإدارة
      transporter.sendMail(mailOptionsAdmin, (adminError, adminInfo) => {
        if (adminError) {
          console.error("خطأ في إرسال البريد للإدارة:", adminError);
          return res.status(500).send("فشل في إرسال البريد للإدارة");
        }

        res.send("تم إرسال البريد بنجاح");
      });
    });

  } catch (error) {
    console.error("خطأ في معالجة الطلب:", error);
    res.status(500).send("حدث خطأ في معالجة الطلب");
  }
});

// تشغيل الخادم
app.listen(3000, () => {
  console.log("الخادم يعمل على http://localhost:3000");
});