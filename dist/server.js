"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var app = (0, express_1.default)();
app.use(express_1.default.json());
var predict_1 = __importDefault(require("./routes/predict"));
app.use('/predict', predict_1.default);
app.get('/', function (req, res) {
    res.send('Server is working.');
});
var port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log("App listening on PORT " + port);
});
