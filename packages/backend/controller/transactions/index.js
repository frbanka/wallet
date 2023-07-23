const Transaction = require('../../service/schemas/transactions');
const categoryList = require('../../data/categories.json');

const createTransaction = async (req, res, next) => {
  const { isExpense, amount, date, comment, category } = req.body;
  const owner = req.user._id;
  try {
    const newTransaction = new Transaction({
      isExpense,
      amount,
      date,
      comment,
      category,
      owner,
    });

    await newTransaction.save();

    res.status(201).json({
      _id: newTransaction._id,
      isExpense,
      amount,
      date,
      comment,
      category: newTransaction.category,
    });
  } catch (e) {
    console.error(e);
    next(e);
  }
};

const getTransactions = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;
    const owner = req.user._id;

    const results = await Transaction.find({ owner }, { owner: 0, __v: 0 })
      .skip(skip)
      .limit(limit);

    res.status(200).json(results);
  } catch (e) {
    console.error(e);
    next(e);
  }
};

const getTransactionsMonthly = async (req, res, next) => {
  const { month, year } = req.params;
  const startOfMonth = new Date(year, month - 1);
  const endOfMonth = new Date(year, month);
  const owner = req.user._id;

  try {
    const transactions = await Transaction.find({
      date: { $gte: startOfMonth, $lt: endOfMonth },
      owner,
    });

    const expenseTransactions = transactions.filter(
      (transaction) => transaction.isExpense === true
    );

    const expenseByCategory = categoryList
      .filter((category) => category.name !== 'Income')
      .map((category) => {
        const amountByCategory = expenseTransactions.reduce((acc, el) => {
          return acc + (el.category === category.name ? el.amount : 0);
        }, 0);
        return { category: category.name, amount: amountByCategory };
      });

    const calculateBalance = (type) => {
      const isExpense = type === 'expense';
      return transactions
        .filter((t) => t.isExpense === isExpense)
        .map((t) => t.amount)
        .reduce((acc, num) => {
          return acc + num;
        }, 0);
    };

    res.status(200).json({
      expenseByCategory,
      income: calculateBalance('income'),
      expense: calculateBalance('expense'),
    });
  } catch (e) {
    console.error(e);
    next(e);
  }
};

const updateTransaction = async (req, res, next) => {
  const owner = req.user._id;
  const { id } = req.params;
  const { isExpense, amount, date, comment, category } = req.body;

  try {
    const result = await Transaction.findByIdAndUpdate(
      { _id: id, owner },
      { isExpense, amount, date, comment, category }
    );
    if (result) {
      res.status(200).json({
        _id: result._id,
        isExpense,
        amount,
        date,
        comment,
        category,
      });
    } else {
      res.status(404).json({
        message: `Transaction ${id} not found`,
      });
    }
  } catch (e) {
    console.error(e);
    next(e);
  }
};

const removeTransaction = async (req, res, next) => {
  const owner = req.user._id;
  const { id } = req.params;

  console.log(req.params);

  try {
    const result = await Transaction.findByIdAndRemove({ _id: id, owner });
    if (result) {
      res.status(200).json({
        message: 'Transaction deleted',
      });
    } else {
      res.status(404).json({ message: `Transaction ${id} not found` });
    }
  } catch (e) {
    console.error(e);
    next(e);
  }
};

const getBalance = async (req, res, next) => {
  const owner = req.user._id;
  let balance = 0;
  try {
    const transactions = await Transaction.find({ owner });

    transactions.forEach((el) => {
      if (el.isExpense) {
        balance = balance - el.amount;
      } else {
        balance = balance + el.amount;
      }
    });

    res.status(200).json({ balance });
  } catch (e) {
    console.error(e);
    next(e);
  }
};

const getCategoriesList = (req, res) => {
  res.status(200).json(categoryList);
};

module.exports = {
  createTransaction,
  getTransactions,
  getTransactionsMonthly,
  updateTransaction,
  removeTransaction,
  getBalance,
  getCategoriesList,
};
