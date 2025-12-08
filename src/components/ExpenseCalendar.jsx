import { useMemo, useState } from 'react';
import { useTransactions } from '../context/TransactionContext';
import { FaCalendar, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { formatCurrency } from './SummaryCard';

const ExpenseCalendar = () => {
  const { transactions, settings } = useTransactions();
  const [currentDate, setCurrentDate] = useState(new Date());

  // Get calendar data for current month
  const calendarData = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Get first day of month and total days
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    // Calculate spending per day
    const dailySpending = {};
    transactions.forEach(t => {
      if (t.type === 'expense') {
        const tDate = new Date(t.date);
        if (tDate.getFullYear() === year && tDate.getMonth() === month) {
          const day = tDate.getDate();
          dailySpending[day] = (dailySpending[day] || 0) + parseFloat(t.amount || 0);
        }
      }
    });

    // Find max spending for color intensity
    const maxSpending = Math.max(...Object.values(dailySpending), 1);

    return { daysInMonth, startingDayOfWeek, dailySpending, maxSpending };
  }, [transactions, currentDate]);

  // Navigate months
  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Color intensity based on spending
  const getColorIntensity = (amount) => {
    if (!amount || amount === 0) return 'bg-gray-50 dark:bg-gray-800';
    const intensity = Math.min(amount / calendarData.maxSpending, 1);
    
    if (intensity < 0.2) return 'bg-purple-100 dark:bg-purple-900/20';
    if (intensity < 0.4) return 'bg-purple-200 dark:bg-purple-800/30';
    if (intensity < 0.6) return 'bg-purple-300 dark:bg-purple-700/40';
    if (intensity < 0.8) return 'bg-purple-400 dark:bg-purple-600/50';
    return 'bg-purple-500 dark:bg-purple-500/60';
  };

  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Create calendar grid
  const calendarGrid = [];
  const totalCells = Math.ceil((calendarData.daysInMonth + calendarData.startingDayOfWeek) / 7) * 7;

  for (let i = 0; i < totalCells; i++) {
    const dayNumber = i - calendarData.startingDayOfWeek + 1;
    const isValidDay = dayNumber > 0 && dayNumber <= calendarData.daysInMonth;
    const spending = isValidDay ? calendarData.dailySpending[dayNumber] || 0 : 0;
    const isToday = isValidDay && 
      dayNumber === new Date().getDate() && 
      currentDate.getMonth() === new Date().getMonth() &&
      currentDate.getFullYear() === new Date().getFullYear();

    calendarGrid.push({
      dayNumber: isValidDay ? dayNumber : null,
      spending,
      isToday
    });
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-2 rounded-lg shadow-md">
            <FaCalendar className="text-white text-base" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Expense Calendar</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">Spending heatmap</p>
          </div>
        </div>
        <button
          onClick={goToToday}
          className="px-3 py-1.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-800/40 transition-colors text-xs font-medium"
        >
          Today
        </button>
      </div>

      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={previousMonth}
          className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          aria-label="Previous month"
        >
          <FaChevronLeft className="text-gray-600 dark:text-gray-400 text-sm" />
        </button>
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">{monthName}</h3>
        <button
          onClick={nextMonth}
          className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          aria-label="Next month"
        >
          <FaChevronRight className="text-gray-600 dark:text-gray-400 text-sm" />
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1.5">
        {/* Week day headers */}
        {weekDays.map(day => (
          <div key={day} className="text-center text-xs font-semibold text-gray-500 dark:text-gray-400 py-1">
            {day}
          </div>
        ))}

        {/* Calendar days */}
        {calendarGrid.map((cell, index) => (
          <div
            key={index}
            className={`h-12 rounded-md border transition-all ${
              cell.dayNumber
                ? `${getColorIntensity(cell.spending)} border-gray-200 dark:border-gray-600 hover:ring-2 hover:ring-purple-400 cursor-pointer ${
                    cell.isToday ? 'ring-2 ring-indigo-500' : ''
                  }`
                : 'bg-transparent border-transparent'
            }`}
            title={cell.dayNumber ? `${formatCurrency(cell.spending, settings.currency)} spent` : ''}
          >
            {cell.dayNumber && (
              <div className="h-full flex flex-col items-center justify-center p-0.5">
                <span className={`text-xs font-semibold ${
                  cell.spending > 0 
                    ? 'text-gray-900 dark:text-white' 
                    : 'text-gray-400 dark:text-gray-500'
                } ${cell.isToday ? 'text-indigo-700 dark:text-indigo-300' : ''}`}>
                  {cell.dayNumber}
                </span>
                {cell.spending > 0 && (
                  <span className="text-[10px] font-medium text-gray-700 dark:text-gray-200 mt-0.5">
                    {formatCurrency(cell.spending, settings.currency)}
                  </span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-3 flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
          <span>Less</span>
          <div className="flex gap-0.5">
            <div className="w-3 h-3 rounded bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600"></div>
            <div className="w-3 h-3 rounded bg-purple-100 dark:bg-purple-900/20"></div>
            <div className="w-3 h-3 rounded bg-purple-200 dark:bg-purple-800/30"></div>
            <div className="w-3 h-3 rounded bg-purple-300 dark:bg-purple-700/40"></div>
            <div className="w-3 h-3 rounded bg-purple-400 dark:bg-purple-600/50"></div>
            <div className="w-3 h-3 rounded bg-purple-500 dark:bg-purple-500/60"></div>
          </div>
          <span>More</span>
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          Total: {formatCurrency(
            Object.values(calendarData.dailySpending).reduce((a, b) => a + b, 0),
            settings.currency
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpenseCalendar;
