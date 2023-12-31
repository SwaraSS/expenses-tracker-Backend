const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema({
    firstname:{
        required: [true, "Firstname is Required"],
        type: String,
    },
    lastname:{
        required: [true, "Lastname is Required"],
        type: String,
    },
    email:{
        required: [true, "Email is Required"],
        type: String,
    },
    password:{
        required: [true, "Password is Required"],
        type: String,
    },
    isAdmin:{
        type: Boolean,
        default: false,
    },
},
{
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
    timestamps: true,
  }
);

//virtual
userSchema.virtual("expenses", {
    ref: "Expense",
    foreignField: "user",
    localField: "_id",
  });
  
  //virtual method to populate created post
  userSchema.virtual("income", {
    ref: "Income",
    foreignField: "user",
    localField: "_id",
  });



//Hash Password

userSchema.pre("save", async function (next) {
if(!this.isModified("password")){
    next();
}
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.methods.isPasswordMatch = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
    };

const User = mongoose.model("User", userSchema);
module.exports = User;