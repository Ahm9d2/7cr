document.addEventListener("DOMContentLoaded", function () {
    // استرجاع بيانات الحجوزات من localStorage
    let bookedTimes = JSON.parse(localStorage.getItem("bookedTimes")) || {};
    // استرجاع اسم الملعب الذي تم اختياره من الصفحة السابقة (أو افتراضي)
    let selectedField = localStorage.getItem("selectedField") || "ملعب غير معروف";
    let selectedTime = "";  // لتخزين الوقت الذي يختاره المستخدم
    const basePricePerHour = 15000; // سعر الساعة (مثلاً 15,000 ريال)

    // عرض اسم الملعب في العنوان
    document.getElementById("selectedFieldTitle").textContent = `حجز ${selectedField}`;

    // دالة تحديث الواجهة الخاصة بأوقات الحجز
    function updateUI() {
        let selectedDate = document.getElementById("bookingDate").value;
        let buttons = document.querySelectorAll(".time-btn");
        let dayOfWeekText = document.getElementById("dayOfWeek");

        if (selectedDate) {
            let date = new Date(selectedDate);
            let days = ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
            dayOfWeekText.textContent = `اليوم المختار: ${days[date.getDay()]}`;
        } else {
            dayOfWeekText.textContent = "";
        }

        buttons.forEach(button => {
            let timeSlot = button.innerText;
            if (selectedDate && bookedTimes[selectedDate] && bookedTimes[selectedDate].includes(timeSlot)) {
                button.disabled = true;
                button.style.background = "gray";
                button.innerText = `${timeSlot} (محجوز)`;
            } else {
                button.disabled = false;
                button.style.background = "lightblue";
                button.innerText = timeSlot;
            }
        });
    }

    // تحديث الواجهة عند اختيار تاريخ جديد
    document.getElementById("bookingDate").addEventListener("change", updateUI);

    // دالة اختيار الوقت (يظهر تمييز للوقت المحدد)
    window.selectTime = function (button) {
        selectedTime = button.innerText.replace(" (محجوز)", "");
        // تمييز الزر المحدد
        document.querySelectorAll(".time-btn").forEach(btn => {
            btn.style.border = "";
        });
        button.style.border = "2px solid green";
    };

    // دالة حساب السعر حسب مدة الحجز المختارة
    window.calculatePrice = function () {
        let duration = parseInt(document.getElementById("durationSelect").value);
        let totalPrice = basePricePerHour * duration;
        document.getElementById("priceDisplay").textContent = `السعر: ${totalPrice.toLocaleString()} ريال`;
    };

    // دالة تأكيد الحجز وإرسال البريد الإلكتروني عبر السيرفر
    window.confirmBooking = function () {
        let selectedDate = document.getElementById("bookingDate").value;
        let email = document.getElementById("emailInput").value.trim();
        let duration = parseInt(document.getElementById("durationSelect").value);

        if (!selectedDate) {
            alert("يرجى اختيار تاريخ الحجز أولاً!");
            return;
        }
        if (!email) {
            alert("يرجى إدخال بريدك الإلكتروني!");
            return;
        }
        if (!selectedTime) {
            alert("يرجى اختيار وقت الحجز!");
            return;
        }

        // التأكد من عدم حجز نفس الوقت مرتين لنفس التاريخ
        if (!bookedTimes[selectedDate]) {
            bookedTimes[selectedDate] = [];
        }
        if (bookedTimes[selectedDate].includes(selectedTime)) {
            alert("هذا الوقت محجوز بالفعل، اختر وقتًا آخر.");
            return;
        }
        bookedTimes[selectedDate].push(selectedTime);
        localStorage.setItem("bookedTimes", JSON.stringify(bookedTimes));

        // إرسال البريد الإلكتروني عبر السيرفر (استخدم إعدادات السيرفر المناسب)
        sendEmail(email, selectedDate, selectedTime, selectedField, duration);

        alert(`تم حجز ${selectedField} في ${selectedDate} الساعة ${selectedTime} لمدة ${duration} ساعة`);

        // تفعيل زر الدفع بعد تأكيد الحجز
        document.getElementById("payButton").disabled = false;
        updateUI();
    };

    // دالة إرسال البريد الإلكتروني عبر السيرفر باستخدام fetch
    function sendEmail(email, date, time, field, duration) {
        fetch("http://localhost:3000/send-email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, date, time, field, duration })
        })
        .then(response => response.text())
        .then(data => console.log("تم إرسال البريد:", data))
        .catch(error => console.error("خطأ في إرسال البريد:", error));
    }

    // دالة إعادة توجيه المستخدم إلى صفحة الدفع
    window.redirectToPayment = function () {
        let duration = parseInt(document.getElementById("durationSelect").value);
        let totalPrice = basePricePerHour * duration;
        // يتم بناء رابط الدفع مع تمرير معطيات الحجز كـ query string
        let paymentUrl = `https://tip.dokan.sa/tx2r`;
        window.location.href = paymentUrl;
    };

    updateUI();
    calculatePrice(); // تحديث السعر عند تحميل الصفحة
});
(function() {
    emailjs.init("service_zwcdiwa"); // ضع User ID من EmailJS هنا
})();

function sendEmail() {
    let params = {
        email: document.getElementById("email").value,
        date: document.getElementById("date").value,
        time: document.getElementById("time").value,
        field: document.getElementById("field").value
    };

    emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", params)
        .then(function(response) {
            alert("تم إرسال الحجز بنجاح!");
        }, function(error) {
            alert("حدث خطأ أثناء الإرسال: " + error);
        });
}

