import mongoose from 'mongoose';

export const CATEGORIES = ['Food', 'Transport', 'Study', 'Housing', 'Health', 'Entertainment', 'Other'];

const expenseSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, required: true, trim: true, maxlength: 100 },
  amountPaise: { type: Number, required: true, min: 1 },
  category: { type: String, required: true, enum: CATEGORIES },
  spentAt: { type: Date, required: true },
  note: { type: String, trim: true, maxlength: 500, default: '' },
}, { timestamps: true });

expenseSchema.index({ user: 1, spentAt: -1 });
expenseSchema.index({ user: 1, category: 1, spentAt: -1 });

export default mongoose.model('Expense', expenseSchema);
