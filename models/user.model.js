/* Schema, modell och lösenordshantering för användare */
const Mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Schema för användare
const userSchema = Mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        }
    }
);

// Jämföra det hashade lösenordet
userSchema.methods.comparePassword = async function (password) {
    try {
        return await bcrypt.compare(password, this.password);
    } catch (error) {
        throw error;
    }
};

// Skapa modellen utifrån schemat
const User = Mongoose.model("User", userSchema);

// Exportera modellen för att kunna nås från andra filer
module.exports = User;
