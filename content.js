// Load and apply settings
chrome.storage.sync.get({
    darkTheme: false,
    lightTheme: false,
    compactMode: false,
    hideRecommendations: false,
    hideAds: false,
    hideStories: false,
    colorScheme: 'default'
}, (settings) => {
    applySettings(settings);
});

// Listen for settings updates
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'settingsUpdated') {
        chrome.storage.sync.get({
            darkTheme: false,
            lightTheme: false,
            compactMode: false,
            hideRecommendations: false,
            hideAds: false,
            hideStories: false,
            colorScheme: 'default'
        }, (settings) => {
            applySettings(settings);
        });
    }
});

function applySettings(settings) {
    // Remove all theme classes first
    document.documentElement.classList.remove(
        'vk-styles-dark',
        'vk-styles-light',
        'vk-styles-compact'
    );

    // Apply theme
    if (settings.darkTheme) {
        document.documentElement.classList.add('vk-styles-dark');
    } else if (settings.lightTheme) {
        document.documentElement.classList.add('vk-styles-light');
    }

    // Apply compact mode
    if (settings.compactMode) {
        document.documentElement.classList.add('vk-styles-compact');
    }

    // Apply color scheme
    applyColorScheme(settings.colorScheme);

    // Hide elements
    hideElements(settings);
}

function applyColorScheme(scheme) {
    const colorSchemes = {
        'default': {
            primary: '#4a90e2',
            dark: '#357abd',
            light: '#e5f0ff'
        },
        'purple': {
            primary: '#9b59b6',
            dark: '#7d3c98',
            light: '#f0e5ff'
        },
        'green': {
            primary: '#27ae60',
            dark: '#1e8449',
            light: '#e5f5e5'
        },
        'red': {
            primary: '#e74c3c',
            dark: '#c0392b',
            light: '#ffe5e5'
        },
        'orange': {
            primary: '#f39c12',
            dark: '#d68910',
            light: '#fff5e5'
        },
        'pink': {
            primary: '#e91e63',
            dark: '#c2185b',
            light: '#ffe5f0'
        }
    };

    const colors = colorSchemes[scheme] || colorSchemes['default'];

    // Create style element
    let styleEl = document.getElementById('vk-styles-colors');
    if (styleEl) {
        styleEl.remove();
    }

    styleEl = document.createElement('style');
    styleEl.id = 'vk-styles-colors';
    styleEl.textContent = `
        :root {
            --vk-primary: ${colors.primary};
            --vk-primary-dark: ${colors.dark};
            --vk-primary-light: ${colors.light};
        }
    `;
    document.head.appendChild(styleEl);
}

function hideElements(settings) {
    // Hide recommendations
    if (settings.hideRecommendations) {
        document.documentElement.classList.add('vk-styles-hide-recommendations');
    } else {
        document.documentElement.classList.remove('vk-styles-hide-recommendations');
    }

    // Hide ads
    if (settings.hideAds) {
        document.documentElement.classList.add('vk-styles-hide-ads');
    } else {
        document.documentElement.classList.remove('vk-styles-hide-ads');
    }

    // Hide stories
    if (settings.hideStories) {
        document.documentElement.classList.add('vk-styles-hide-stories');
    } else {
        document.documentElement.classList.remove('vk-styles-hide-stories');
    }
}
