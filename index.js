const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { sequelize } = require('./models');
const userRoutes = require('./routes/users/userRoutes');
const authRoutes = require('./routes/auth/authRoutes');
const productRoutes = require('./routes/products/productRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/api', userRoutes);
app.use('/api/auth', authRoutes );

sequelize.sync().then(() => {
    console.log('Database connected successfully');
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
});