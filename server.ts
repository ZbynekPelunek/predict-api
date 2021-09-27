import express from "express";
const app = express();

app.use(express.json());

import predictRouter from "./routes/predict";
app.use('/predict', predictRouter);

app.get('/', (req, res) => {
    res.send('Server is working.');
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`App listening on PORT ${port}`);
});