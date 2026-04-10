const express = require('express');
const app = express();
const cors = require('cors');
const chatRoutes = require('./routes/chatRoutes');

app.use(cors({
  origin: 'http://localhost:4200' 
}));

app.use(express.json());

app.use('/api/chats', chatRoutes);

app.listen(3000, () => console.log("Server running"));
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});