const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { sequelize } = require('./models');
const userRoutes = require('./routes/users/userRoutes');
const authRoutes = require('./routes/auth/authRoutes');
const productRoutes = require('./routes/products/productRoutes');
const cartRoutes = require('./routes/carts/cartRoutes');
const favouriteRoutes = require('./routes/favourite/favouriteRoutes');
const promotionRoutes = require('./routes/promotion/promotionRoutes');
const path = require('path');

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const PORT = process.env.PORT || 4000;

app.use(cors());
// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'public_html/curtainshop/uploads')));
app.use(express.json());
app.use('/api', userRoutes);
app.use('/api/auth', authRoutes );
app.use('/api/product', productRoutes );
app.use('/api/cart', cartRoutes);
app.use('/api/favourite', favouriteRoutes);
app.use('/api/promotion', promotionRoutes);
sequelize.sync().then(() => {
    console.log('Database connected successfully');
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
});
