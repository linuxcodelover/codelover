const mongoose = require("mongoose");

mongoose.get("strictQuery", true);
mongoose
    .connect("mongodb://127.0.0.1:27017/Registration", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("connection successful");
    })
    .catch((error) => {
        console.log("connection error: " + error);
    });