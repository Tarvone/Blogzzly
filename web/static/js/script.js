document.addEventListener('DOMContentLoaded', function () {

    const toggleTheme = () => {
        const darkMode =  document.documentElement.classList.toggle('dark');
        localStorage.setItem('theme', darkMode ? 'dark' : 'light');

        const themeToggleButton = document.getElementById('theme-toggle');
        if (themeToggleButton) {
            themeToggleButton.textContent = darkMode ? '🔆' : '🌙';
        }
    };

    // Event delegation because of the drawer
    document.addEventListener('click', (event) => {
        if (event.target?.id === 'theme-toggle') {
            toggleTheme();
        }
    });

    // Drawer
    const drawer = document.getElementById("drawer-navigation");
    const toggleButton = document.getElementById("drawer-toggle");
    const closeButton = document.getElementById("drawer-close");

    const toggleDrawer = () => {
        const isHidden = drawer.classList.contains('-translate-x-full');
        drawer.classList.toggle('-translate-x-full');
        toggleButton.setAttribute('aria-expanded', !isHidden);
    }

    toggleButton.addEventListener('click', toggleDrawer); // Opening
    closeButton.addEventListener('click', toggleDrawer); // Closing
});