require('dotenv').config();

const express = require('express');
const port = process.env.PORT || 5000;
const host = process.env.NODE_ENV !== 'production' ? 'localhost' : '0.0.0.0';
const app = express();

//JSON parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Allowed all origin
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

app.use('/api/v1/products', require('./routes/v1/productRoutes'));
app.use('/api/v1/categories', require('./routes/v1/productCategoryRoutes'));
app.use('/api/v1/user', require('./routes/v1/userRoutes'));
app.use('/api/v1/transactions', require('./routes/v1/transactionRoutes'));

app.get('/', (req, res) => {
    res.send("This is root for shamo-backend project");
})


app.listen(port, host, async () => {
    console.log(`Server is running on https://${host}:${port}`);
});



