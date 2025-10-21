const express = require('express');
const app = express();

app.use(express.json());

app.post('/send-notification', (req, res) => {
  res.json({ success: true, message: 'FCM Server is ready!' });
});

app.get('/', (req, res) => {
  res.send('FCM Server is Running!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
