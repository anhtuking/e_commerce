const mongoose = require('mongoose'); // Erase if already required
const bcrypt = require('bcryptjs');

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    mobile: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: 'User',
    },
    cart: {
      type: Array,
      default: [],
    },
    address: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Address",
      },
    ],
    wishlist: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Product",
      },
    ],
    isBlocked: {
      type: Boolean,
      default: false,
    },
    refreshToken: {
      type: String,
    },
    passwordChangedAt: {
      type: String,
    },
    passwordResetToken: {
      type: String,
    },
    passwordResetExpires: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Method pre để Hash password before khi save 
userSchema.pre('save', async function (next) {
  // Only hash the password khi nó đã Modified (or is new)
  if (!this.isModified('password')){
    return next();
  }
  const salt = bcrypt.genSaltSync(10)
  this.password = await bcrypt.hash(this.password, salt)
});

userSchema.methods = {
  isCorrectPassword: async function (password) {
    return await bcrypt.compare(password, this.password) // truyền vào đối số password và trả về true or falsefalse
  }
}
//Export the model
module.exports = mongoose.model("User", userSchema);
