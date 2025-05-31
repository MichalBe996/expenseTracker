const mongoose = require("mongoose")




const expenseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please name an expense"]
    },
    cost: {
        type: Number,
        required: [true, "The entry must have an amount of money spent (in dollars)"]
    },
    dateOfExpense: {
        type: Date,
        required: [true, "Please enter the date of expense in format dd-mm-yyyy"]
    }
})





const Expense = mongoose.model("Expense", expenseSchema)

module.exports = Expense;