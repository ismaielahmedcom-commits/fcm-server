const admin = require('firebase-admin');
const express = require('express');
const app = express();

app.use(express.json());

// بيانات الحساب
const serviceAccount = {
  "type": "service_account",
  "project_id": "al3arabidelivery",
  "private_key_id": "c37d02611a955e4588efc84d965fc76b1c04901a",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCKaJchzk6Hb5Dr\nAL4sTSkk1J1aGmIixV2jFdjb4XYs75IsozCFbzREENPIb+pYasQQ3mXZ3r+2ZSTS\n5z4s/e5h15cMOvYbuyPnb4m3WgnsBho7SyN7k/ATi0eSL7NqRT4zq/MaaY794UXS\nCF7sGgOHHXoR65BkEP/QyKldwc4JIHskUt3F5GVj4kMcd2kyf1syJSEobWwCG8tL\nJzoNFtk0FnqpwlrDmFBHSpskFQ7TdzJz/dx3aLv9npLOH+rscl4D/zce3uZPjXfV\n5ehiXz9gSic+oSU8nRmfwZaAMqcoDT7Bdi4+FHdgDOuYXtj9OjCiwlwZSeZzMzgV\nj7UlrkY5AgMBAAECggEABjvJ/5ybjLM2BAsPWurfZDoy8LGI8ZyC9nzBkhGYRsVE\nFc6vDrKELdFEazMt0kKaf99TbRm5aXJjRSAqfKXsqmQ0sUdgFdqlUpiRksMlFSRD\nqZ+kbS+rxkoB9K/sEYTsgBR7gidoWjFe+XklX4El+6Mi1XcAzYHTKBqtBoQGDq2p\nlWxYT3ac+Vc08fnMfmDgosSzsmSvQ7YN+xj7TslI8I1+oiTlvi6HuUC5MbQS56lk\n0jxY0ijwLIDWmzkSxzKBSzsoAdfUJr2UIlpPmRRpVI7YJJvgDHtfeX41N8d9/ds0\nVIlWzQ5ke1VPAGdocxKAkaJEQZskB6CJF6YmQUWAewKBgQC/PKIfP5eTKGFwdDny\naLC2DHmubgcsYHuuwJcB1xg8lZKi7PKdiTqn8Y0r0pBkfJGlyavMPKd6SjJ8VW6C\nG5U9J2oEJTbhIsG1dKlEqjW+8RP3KsTMzC9aWgX79NVo0lq/ADHcDWA0qRsJFOlu\nAUpAAEkKz2ACktVIEqSXcSmmdwKBgQC5R/vgpDg/PB5mef7U3O7nSYJQ47L2y36I\nxRxkWU+IXyS7+J7QC/5O9POKhmWYoCjYd721LKmbi9A8G6NEZMy45vOeywwQ/5B6\nn9uHGPqHjc7mr9UtJyMWwOfgbrW8MQ9ZXB4WEdvddFGkV30IvgO8hpHrpQtizOUK\n6BA9r/O0zwKBgQC+tWzH1NcHveFOD9op0BVJty8xsDAfJSiyoQT2pNZatJ7DM6DP\nUabZDJ5H8XhlfYSR3Igi6Onrnkqyi0/lGDTAA6pJ8ALGia67klerTkLC5A+REWmp\nAobGh7goB4U7P2uXxk3ysLQcT/fSGrSfK1IseRxeV2fbqSpg8ZaKICP1CQKBgQCy\nyYt8EftUyaZsLHyC206NUJm3hIFFNMg9IjdrfeMJLQY9fIODLo+PkT8RBO80gBfq\nCmG9WgOwXRHrbp/1d281XWboa/aQ0IuSSH+FtczK0UQ9xp5mm8V4R115bFth5dVx\n3ToLAeCvqXa+ps24ieMBILneMbzy8dRy2cwSOp9ocQKBgBMHN+KAeCjzuC9g+BjA\notT8hxu8AI8t7IHbKM/La19f0mYuli3JFviWQqZj2r/UMNkYsaxi479R3O59Q+XP\nyBRp139xIKQoaRN0ooxAaW0ANhgL8HMBW8WJHjyLlCswEHqVJ3OwKU8pTCSnx21L\n9t+5LdgP2JK6BWrouyHdx4R6\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-fbsvc@al3arabidelivery.iam.gserviceaccount.com",
  "client_id": "101003094137141508840",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40al3arabidelivery.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
};

// تهيئة Firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// API لإرسال إشعار لجهاز واحد
app.post('/send-notification', async (req, res) => {
  try {
    const { deviceToken, title, body } = req.body;
    
    const message = {
      notification: { 
        title: title,
        body: body
      },
      token: deviceToken
    };
    
    const response = await admin.messaging().send(message);
    res.json({ success: true, response });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
});

// API جديد: إرسال إشعار للمندوب عند تحويل الطلبات
app.post('/notify-delivery', async (req, res) => {
  try {
    const { deliveryToken, orderCount } = req.body;
    
    if (!deliveryToken || !orderCount) {
      return res.status(400).json({
        success: false,
        message: 'يجب إدخال deliveryToken و orderCount'
      });
    }
    
    const message = {
      notification: {
        title: '🎉 طلبات جديدة',
        body: `لقد تم إضافة ${orderCount} طلب/طلبات لديك`
      },
      token: deliveryToken
    };
    
    const response = await admin.messaging().send(message);
    
    res.json({ 
      success: true, 
      message: 'تم إرسال الإشعار للمندوب بنجاح',
      response: response 
    });
    
  } catch (error) {
    res.json({ 
      success: false, 
      error: error.message 
    });
  }
});

// صفحة الرئيسية
app.get('/', (req, res) => {
  res.send('FCM Server is Running!');
});

// تشغيل السيرفر
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 FCM Server running on port ${PORT}`);
});
