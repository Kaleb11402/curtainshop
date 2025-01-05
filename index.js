const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { sequelize } = require('./models');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/api/users', userRoutes);
//app.use('/api/products', productRoutes);

sequelize.sync().then(() => {
    console.log('Database connected successfully');
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
});