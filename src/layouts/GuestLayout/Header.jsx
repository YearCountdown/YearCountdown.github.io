import { useTheme } from '../../context/ThemeContext';

const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const nextTheme = theme === 'dark' ? 'light' : 'dark';

  return (
    <header className="flex items-center justify-between border-b border-slate-300 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-900">
      <p className="text-sm font-medium text-slate-900 dark:text-slate-100">YearCountdown</p>
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={`Switch to ${nextTheme} theme`}
        className="rounded-md border border-slate-400 px-3 py-1.5 text-sm text-slate-900 transition hover:bg-slate-100 dark:border-slate-500 dark:text-slate-100 dark:hover:bg-slate-800"
      >
        Switch to {nextTheme}
      </button>
    </header>
  );
};

export default Header;
