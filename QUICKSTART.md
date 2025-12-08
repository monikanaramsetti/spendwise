# 🚀 Quick Start Guide - SpendSmart

## Step-by-Step Setup

### 1️⃣ Install Dependencies
Open your terminal in the project directory and run:
```powershell
npm install
```

This will install all required packages:
- React & React DOM
- Vite (build tool)
- React Router DOM (navigation)
- Axios (HTTP requests)
- Tailwind CSS (styling)
- React Toastify (notifications)
- Recharts (charts)
- React Icons (icons)
- JSON Server (mock backend)

### 2️⃣ Start the Backend Server
Open a terminal window and run:
```powershell
npm run server
```

✅ **JSON Server will start on:** `http://localhost:3001`

This provides the mock API for:
- Transactions
- Categories
- Budgets

### 3️⃣ Start the Frontend
Open a **second terminal** window and run:
```powershell
npm run dev
```

✅ **Application will start on:** `http://localhost:5173`

### 4️⃣ Access the Application
1. Open your browser
2. Navigate to: `http://localhost:5173`
3. You'll see the **Sign In** page

## 🎯 First Time User Guide

### Create Your Account
1. Click "Sign up for free" on the Sign In page
2. Fill in your details:
   - Full Name
   - Email Address
   - Password (must meet requirements)
   - Confirm Password
3. Check "I agree to Terms of Service"
4. Click "Create Account"

### Password Requirements
✅ At least 8 characters
✅ One uppercase letter
✅ One lowercase letter
✅ One number

### Explore the Dashboard
After signing in, you'll see:
- **Total Income** - Green card
- **Total Expense** - Red card
- **Balance** - Purple card
- **Recent Transactions** - Latest 5 entries
- **Financial Health** - Your spending insights

## 📝 Quick Actions

### Add Your First Transaction
1. Click "Transactions" in the navbar
2. Click "Add Transaction" button
3. Select type (Income or Expense)
4. Enter amount
5. Choose category
6. Add description
7. Select date
8. Click "Add Transaction"

### Set Your First Budget
1. Navigate to "Budget" page
2. Click "Set Budget"
3. Choose a category (e.g., Food & Dining)
4. Enter budget amount (e.g., 500)
5. Select month
6. Click "Create"

### View Reports
1. Go to "Reports" page
2. Select the current month
3. Choose view type:
   - **Category Analysis** - See spending breakdown
   - **Trend Analysis** - View 6-month trends
4. Explore interactive charts

<!-- Categories UI removed. Categories can still be managed through the API or reintroduced later. -->

## 🎨 Sample Data

The application comes with sample data:

### Sample Transactions
- Grocery shopping (50)
- Monthly salary (3,000)
- Gas and maintenance (120)

### Pre-configured Categories
**Expense:** Food & Dining, Transportation, Shopping, Entertainment, Bills & Utilities, Healthcare, Education

**Income:** Salary, Business, Investments

### Sample Budgets
- Food & Dining: 500
- Transportation: 300
- Entertainment: 200

## 💡 Pro Tips

### Dashboard
- Check your "Financial Health" section regularly
- Monitor your "Savings Rate"
- Review recent transactions daily

### Transactions
- Use the search bar to find specific transactions
- Filter by type (Income/Expense)
- Sort by date, amount, or category
- Edit transactions by clicking the blue edit icon
- Delete unwanted transactions with the red trash icon

### Budget
- Set realistic monthly budgets
- Green = Good spending (< 80%)
- Yellow = Warning (80-100%)
- Red = Over budget (> 100%)

### Reports
- Use pie charts for quick category overview
- Bar charts show comparative spending
- Line charts reveal trends over time
- Switch between views for different insights

## 🔧 Troubleshooting

### Backend Server Not Running
**Error:** Can't connect to API
**Solution:** Make sure JSON Server is running on port 3001
```powershell
npm run server
```

### Frontend Not Loading
**Error:** Blank page or errors
**Solution:** Check if dev server is running
```powershell
npm run dev
```

### Port Already in Use
**Error:** Port 3001 or 5173 already in use
**Solution:** Kill the process or change ports in configs

### Data Not Saving
**Error:** Changes don't persist
**Solution:** Ensure db.json has write permissions

### Build Errors
**Error:** Module not found
**Solution:** Reinstall dependencies
```powershell
rm -rf node_modules
npm install
```

## 📚 Learn More

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run server` - Start JSON Server
- `npm run lint` - Run ESLint

### Project Structure
```
SpendSmart/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/         # Page components
│   ├── services/      # API services
│   ├── utils/         # Helper functions
│   ├── App.jsx        # Main app
│   └── main.jsx       # Entry point
├── db.json            # JSON Server database
└── package.json       # Dependencies
```

### Technologies Used
- **React 18** - UI library
- **Vite** - Build tool
- **React Router v6** - Routing
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **Recharts** - Charts
- **JSON Server** - Mock API

## 🎉 You're All Set!

Start tracking your expenses and managing your finances with SpendSmart!

Need help? Check the main README.md for more detailed information.

Happy budgeting! 💰✨
