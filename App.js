import React, { useState, useEffect } from 'react';
import AddExpense from './components/AddExpense';
import BudgetTracker from './components/BudgetTracker';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

function App() {
  const [expenses, setExpenses] = useState([]);
  const [budget, setBudget] = useState(0);
  const [actual, setActual] = useState(0);
  const [advice, setAdvice] = useState(null);
  const [savingsGoal, setSavingsGoal] = useState(0);
  const [showChart, setShowChart] = useState(false); // To toggle bar chart display

  // Handle adding new expenses
  const handleAddExpense = (expense) => {
    setExpenses([...expenses, expense]);
    setActual(prev => prev + parseFloat(expense.amount));
  };

  // Check if 10% of the budget is left, and give advice
  useEffect(() => {
    if (budget > 0 && actual >= budget * 0.9) {
      setAdvice("Only 10% of your budget is left. Time to cut back on spending!");
    } else {
      setAdvice(null);
    }
  }, [actual, budget]);

  // Handle user input for setting the budget and savings goal
  const handleSetBudget = (e) => {
    e.preventDefault();
    const enteredBudget = parseFloat(e.target.budget.value);
    const enteredSavingsGoal = parseFloat(e.target.savingsGoal.value);

    if (!isNaN(enteredBudget) && enteredBudget > 0) {
      setBudget(enteredBudget);
    }
    if (!isNaN(enteredSavingsGoal) && enteredSavingsGoal > 0) {
      setSavingsGoal(enteredSavingsGoal);
    }
  };

  // Function to get monthly expenses data for chart
  const getMonthlyExpensesData = () => {
    const monthlyExpenses = new Array(12).fill(0); // Array to store monthly expenses (Jan - Dec)
    expenses.forEach((expense) => {
      const date = new Date(expense.date); // Assuming each expense has a date field
      const month = date.getMonth(); // Get month (0 for January, 11 for December)
      monthlyExpenses[month] += parseFloat(expense.amount);
    });
    return monthlyExpenses;
  };

  // Bar chart data configuration
  const chartData = {
    labels: [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ],
    datasets: [
      {
        label: 'Monthly Expenses (₹)',
        data: getMonthlyExpensesData(),
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
      {
        label: 'Monthly Budget (₹)',
        data: new Array(12).fill(budget), // Monthly budget as a flat line
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      }
    ]
  };

  // Chart options to set a fixed height and adjust the y-axis limit to ₹50k
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 50000 // Set y-axis max to ₹50,000
      }
    },
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <header className="text-center py-4 bg-teal-600 text-white rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold">Financial Spends Tracker</h1>
        <p className="text-sm italic">Track your expenses, plan your budget, and reach your savings goal!</p>
      </header>

      {/* Budget and Savings Goal Input Form */}
      <div className="my-6 bg-gray-100 p-6 rounded-lg shadow-md">
        <form onSubmit={handleSetBudget} className="text-center">
          <label className="block text-xl mb-2 font-bold text-gray-700">
            Set Your Budget (₹):
          </label>
          <input
            type="number"
            name="budget"
            placeholder="Enter your budget"
            className="p-2 border rounded-md w-64"
          />
          <label className="block text-xl mt-4 mb-2 font-bold text-gray-700">
            Set Your Savings Goal (₹):
          </label>
          <input
            type="number"
            name="savingsGoal"
            placeholder="Enter your savings goal"
            className="p-2 border rounded-md w-64"
          />
          <button type="submit" className="mt-4 bg-teal-600 text-white p-2 rounded-md shadow-md">
            Set Budget & Goal
          </button>
        </form>
      </div>

      {/* Budget Tracker and Bar Chart */}
      {budget > 0 && (
        <div className="my-6 bg-teal-600 text-white p-6 rounded-lg shadow-md">
          <BudgetTracker budget={budget} actual={actual} currency="₹" />

          {/* Bar showing total expenses as a portion of the budget */}
          <div className="relative w-full bg-gray-300 rounded-lg h-8 mt-4">
            <div
              className="absolute top-0 left-0 h-full bg-teal-500 rounded-lg"
              style={{ width: `${(actual / budget) * 100}%` }}
            ></div>
            <p className="absolute top-0 left-0 h-full w-full text-center text-black font-bold">
              {`${Math.min((actual / budget) * 100, 100).toFixed(2)}% of budget spent`}
            </p>
          </div>
        </div>
      )}

      {/* Savings Goal Tracker */}
      {savingsGoal > 0 && (
        <div className="my-6 bg-green-500 text-white p-6 rounded-lg shadow-md">
          <p className="font-bold">Savings Goal: ₹{savingsGoal}</p>
          <p>Amount left for savings: ₹{Math.max(0, budget - actual - savingsGoal)}</p>
        </div>
      )}

      {/* Expense Advice */}
      {advice && (
        <div className="my-4 bg-red-500 text-white p-4 rounded-lg shadow-md text-center">
          <p className="font-bold">Expense Advice:</p>
          <p>{advice}</p>
        </div>
      )}

      {/* Add Expense Form */}
      <div className="my-6 bg-gray-100 p-6 rounded-lg shadow-md">
        <AddExpense onAddExpense={handleAddExpense} />
      </div>

      {/* Display last added expense */}
      {expenses.length > 0 && (
        <div className="my-6 bg-gray-100 p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-bold mb-4 text-teal-600">Last Added Expense:</h2>
          <p className="text-gray-700">
            {expenses[expenses.length - 1].description} - ₹{expenses[expenses.length - 1].amount} ({expenses[expenses.length - 1].category})
          </p>
        </div>
      )}

      {/* Button to toggle monthly expense chart */}
      <div className="my-6 bg-gray-100 p-6 rounded-lg shadow-md text-center">
        <button
          onClick={() => setShowChart(!showChart)}
          className="bg-teal-600 text-white p-2 rounded-md shadow-md"
        >
          {showChart ? 'Hide Monthly Expenses Chart' : 'Show Monthly Expenses Chart'}
        </button>
      </div>

      {/* Monthly Expenses Bar Chart */}
      {showChart && (
        <div className="my-6 bg-gray-100 p-6 rounded-lg shadow-md" style={{ height: '400px' }}>
          <Bar data={chartData} options={chartOptions} />
        </div>
      )}
    </div>
  );
}

export default App;
