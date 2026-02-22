import { useTheme } from '../../context/ThemeContext';

const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const nextTheme = theme === 'dark' ? 'light' : 'dark';

  return (
    <header className="flex items-center justify-between border-b border-gray-300 bg-white px-4 py-3 dark:border-gray-700 dark:bg-black">
      <p className="text-sm font-medium text-black dark:text-white">YearCountdown</p>
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={`Switch to ${nextTheme} theme`}
        className="rounded-md border border-gray-400 px-3 py-1.5 text-sm text-black transition hover:bg-gray-100 dark:border-gray-500 dark:text-white dark:hover:bg-gray-900"
      >
        Switch to {nextTheme}
      </button>
    </header>
  );
};

export default Header;
