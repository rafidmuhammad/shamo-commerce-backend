require('dotenv').config();

const express = require('express');
const port = process.env.PORT || 5000;
const app = express();

//JSON parser
app.use(express.json());
app.use(express.urlencoded({extended: false}));

//Allowed all origin
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

app.use('/api/v1/products', require('./routes/v1/productRoutes'));

app.get('/', (req, res) => {
    res.send("This is root for shamo-backend project");
})


app.listen(port, async () => {
    console.log(`Server is running on port ${port}`);
});



