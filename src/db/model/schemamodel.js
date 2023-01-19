const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerSchema = new mongoose.Schema({
    firstname: {
        type: String,
        require: true,
    },
    lastname: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: true,
        unique: true,
    },
    phone: {
        type: Number,
        require: true,
    },
    age: {
        type: Number,
        require: true,
    },
    password: {
        type: String,
        require: true,
        minlength: 3,
    },
    confirmpassword: {
        type: String,
        require: true,
        minlength: 3,
    },
    tokens: [{
        token: {
            type: String,
            require: true,
        },
    }, ],
});

// generating the token

registerSchema.methods.generateAuthToken = async function() {
    try {
        // console.log(this._id);
        const token = jwt.sign({ _id: this._id.toString() },
            process.env.SECRET_KEY
        );
        // console.log(token); // token generated
        this.tokens = this.tokens.concat({ token: token });
        // console.log(this.tokens);
        await this.save();
        return token;
    } catch (error) {
        // res.send("token not generate due to");
        console.log("token not generate due to" + error);
    }
};

// hashing the password
registerSchema.pre("save", async function(next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
        this.confirmpassword = await bcrypt.hash(this.confirmpassword, 10);
        // this.confirmpassword = undefined;
    }
    next();
});

// generate the token

// now we need to create model

const Register = new mongoose.model("Register", registerSchema);

module.exports = Register;