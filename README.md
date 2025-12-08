# SpendSmart - Personal Expense Tracker

A modern personal finance management application that helps users track income and expenses, categorize transactions, view monthly summaries, and set budgets.

## ✨ Features

### � Authentication
- **Beautiful Sign In Page** - Modern UI with animated background
- **Sign Up Page** - Complete registration with password validation
- **Protected Routes** - Secure access to dashboard and features
- **User Profile** - Display user information and logout functionality

### 📊 Dashboard
- Overview of income, expenses, and balance
- Recent transactions display
- Monthly financial summary
- Financial health indicators
- Savings rate calculation

### 💰 Transaction Management
- Add, edit, delete income and expenses
- Search and filter transactions
- Sort by date, amount, or category
- Real-time updates with toast notifications

<!-- Categories UI removed from README: categories can still be managed via API or reintroduced later -->

### 💳 Budget Tracking
<!-- Categories page removed from UI. Categories can still be managed via API or reintroduced later. -->
- Visual progress bars
- Real-time spending tracking
- Budget status indicators (good/warning/exceeded)

### 📈 Reports & Analytics
- **Pie Charts** - Expense and income breakdown
- **Bar Charts** - Category comparison
- **Line Charts** - 6-month trend analysis
- **Monthly Comparison** - Income vs Expense visualization
- Interactive charts with Recharts

### 🎨 Modern UI/UX
- Clean, responsive design with Tailwind CSS
- Smooth animations and transitions
- Gradient backgrounds and cards
- Mobile-friendly interface
- Toast notifications for user feedback

## 📸 Screenshots

### Authentication Pages
- **Sign In** - Beautiful gradient background with animated blobs
- **Sign Up** - Password strength validation and real-time feedback

### Main Application
- **Dashboard** - Financial overview with stats cards
- **Transactions** - Complete transaction management
- **Budget** - Visual budget tracking with progress bars
- **Reports** - Interactive charts and analytics
- **Categories** - Manage custom categories

## Tech Stack

- **Frontend**: React.js with Vite
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Backend**: JSON Server
- **Styling**: Tailwind CSS
- **Icons**: React Icons
- **Notifications**: React Toastify
- **Charts**: Recharts

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Git

## Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd SpendSmart
```

2. Install dependencies:
```bash
npm install
```

3. Start JSON Server (in one terminal):
```bash
npm run server
```
The backend will run on http://localhost:3001

4. Start the development server (in another terminal):
```bash
npm run dev
```
The app will run on http://localhost:5173

## Project Structure

```
SpendSmart/
├── src/
│   ├── components/        # Reusable components
│   ├── pages/            # Page components
│   ├── services/         # API services
│   ├── utils/            # Utility functions
│   ├── App.jsx           # Main app component
│   ├── main.jsx          # Entry point
│   └── index.css         # Global styles
├── db.json               # JSON Server database
├── package.json          # Dependencies
└── vite.config.js        # Vite configuration
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run server` - Start JSON Server backend

## API Endpoints

- `GET /transactions` - Get all transactions
- `POST /transactions` - Create new transaction
- `PUT /transactions/:id` - Update transaction
- `DELETE /transactions/:id` - Delete transaction
- `GET /budgets` - Get all budgets
- `POST /budgets` - Create new budget

## 🎯 Usage

### Authentication
1. Start by creating an account on the **Sign Up** page
2. Enter your full name, email, and a secure password
3. Or sign in if you already have an account
4. Use the demo credentials or create your own

### Managing Transactions
1. Navigate to the **Transactions** page
2. Click "Add Transaction" to create new entries
3. Select income or expense type
4. Choose a category and enter details
5. Edit or delete transactions as needed

### Setting Budgets
1. Go to the **Budget** page
2. Click "Set Budget" for any category
3. Enter the monthly budget amount
4. Track your spending with visual progress bars

### Viewing Reports
1. Visit the **Reports** page
2. Select the month you want to analyze
3. Switch between Category Analysis and Trend Analysis
4. View interactive charts and insights

## 🔒 Security Features

- Client-side authentication with localStorage
- Password validation with strength indicators
- Protected routes with PrivateRoute component
- Secure logout functionality
- Form validation and error handling

## 🎨 Design Features

- **Gradient Backgrounds** - Beautiful color transitions
- **Animated Blobs** - Floating background animations
- **Glass Morphism** - Frosted glass effects
- **Smooth Transitions** - Fluid animations throughout
- **Responsive Design** - Works on all device sizes
- **Custom Icons** - Emoji support for categories
- **Toast Notifications** - User-friendly feedback

## 🔲 Custom Site Background (how to set your Pinterest image)

Want the whole site to use a custom background like the Pinterest image you linked? Here's how to apply it:

1. Download the image you want to use from Pinterest or save it locally. (Make sure you have the right to use the image.)
2. Place the image at `public/images/website-bg.jpg` in the project root. You can replace the placeholder SVG that ships with the project.
3. Start the dev server (`npm run dev`) and your image will be used as the site-wide background.

If you'd like to keep a different background for dark mode or separate variants, add another file `public/images/website-bg-dark.jpg` and edit `src/index.css` accordingly.

## 📱 Responsive Design

The application is fully responsive and works seamlessly on:
- 💻 Desktop (1920px+)
- 💻 Laptop (1024px - 1919px)
- 📱 Tablet (768px - 1023px)
- 📱 Mobile (320px - 767px)

## License

MIT
