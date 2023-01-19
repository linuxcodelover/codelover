require("dotenv").config();
const express = require("express");
const path = require("path");
const app = express();
const hbs = require("hbs");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const auth = require("./middleware/auth");

require("./db/connection/connection");
const Register = require("./db/model/schemamodel");

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

const static_path = path.join(__dirname, "../public");
const partialPath = path.join(__dirname, "../template/partials");
const templatesPath = path.join(__dirname, "../template/views");
hbs.registerPartials(partialPath);

app.use(express.static(static_path));
app.set("view engine", "hbs");

app.get("/", (req, res) => {
    app.set("views", templatesPath);
    res.render("index");
});
app.get("/secret", auth, (req, res) => {
    // console.log(`this is my stored cookie ${req.cookies.jwt}`);
    // res.send(`this is my stored cookie ${req.cookies.jwt}`);
    res.render("secret");
});

app.get("/register", (req, res) => {
    res.render("register");
});
app.get("/login", (req, res) => {
    res.render("login");
});
app.get("/logout", auth, async(req, res) => {
    try {
        // for the single logout
        // req.user.tokens = req.user.tokens.filter((currEle) => {
        //     console.log("removed" + currEle);
        //     return currEle.token !== req.token;
        // });

        // full log out
        req.user.tokens = [];

        // to clear cookie
        res.clearCookie("jwt");
        await req.user.save();
        console.log("logged out successfully");
        res.send("log out succesfully...");
    } catch (error) {
        res.status(401).send(error);
        console.log("the log out error is" + error);
    }
});

//the registration detail
app.post("/register", async(req, res) => {
    try {
        const password = req.body.password;
        const cpassword = req.body.confirmpassword;

        if (password === cpassword) {
            const CodeLoverForm = new Register({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                phone: req.body.phone,
                age: req.body.age,
                password: password,
                confirmpassword: cpassword,
            });

            // console.log(CodeLoverForm);
            // token  middelware

            const token = await CodeLoverForm.generateAuthToken();

            res.cookie("jwt", token, {
                expires: new Date(Date.now() + 100000),
                httpOnly: true,
                // secure: true,
            });
            const registered = await CodeLoverForm.save();
            res.status(201).render("login");
            // .send(
            // `${req.body.firstname}  ${req.body.lastname} successfully registered`
            // );
        } else res.send("password are not matching");
    } catch (error) {
        res.status(400).send(error);
        console.log(error);
    }
});

// the log in page
app.post("/login", async(req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const usermail = await Register.findOne({ email: email });
        // if (usermail.password === password) { // before password bcrypted
        isMatch = await bcrypt.compare(password, usermail.password);

        const token = await usermail.generateAuthToken();
        // console.log(token);
        res.cookie("jwt", token, {
            expires: new Date(Date.now() + 5000000),
            httpOnly: true,
            // secure: true,
        });

        if (isMatch) {
            // res.status(201).send(`${email} log in thai gayu`);
            res.status(201).render("secret");
        } else {
            res.status(404).send("invalid  login password");
            console.log(error);
        }
    } catch (error) {
        res.status(400).send("invalid login detail");
    }
});

app.listen(port, () => {
    console.log(`the port is running on http://127.0.0.1:${port}/`);
});