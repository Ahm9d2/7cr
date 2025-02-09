// وظيفة لإضافة بيانات الحجز إلى Google Sheets
function addBookingToSheet(email, sales, date, time) {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    sheet.appendRow([date, time, email, sales, sales * 15]); // الحساب يتم على أساس سعر 15 ريال
    console.log("تم إضافة الحجز بنجاح");
}

// إنشاء واجهة API لتمكين الوصول من الموقع
function doPost(e) {
    var email = e.parameter.email;
    var sales = e.parameter.sales;
    var date = e.parameter.date;
    var time = e.parameter.time;

    // إضافة الحجز إلى Google Sheets
    addBookingToSheet(email, sales, date, time);

    return ContentService.createTextOutput("تم إضافة البيانات بنجاح");
}
