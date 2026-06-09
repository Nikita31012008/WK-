const defaultSettings = {
    darkTheme: false,
    lightTheme: false,
    compactMode: false,
    hideRecommendations: false,
    hideAds: false,
    hideStories: false,
    colorScheme: 'default'
};

document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.sync.get(defaultSettings, (settings) => {
        // Set theme
        if (settings.darkTheme) {
            document.querySelector('input[name="theme"][value="dark"]').checked = true;
        } else if (settings.lightTheme) {
            document.querySelector('input[name="theme"][value="light"]').checked = true;
        } else {
            document.querySelector('input[name="theme"][value="default"]').checked = true;
        }

        // Set toggles
        document.getElementById('compactMode').checked = settings.compactMode;
        document.getElementById('hideRecommendations').checked = settings.hideRecommendations;
        document.getElementById('hideAds').checked = settings.hideAds;
        document.getElementById('hideStories').checked = settings.hideStories;

        // Set color scheme
        document.querySelectorAll('.color-btn').forEach(btn => {
            if (btn.dataset.color === settings.colorScheme) {
                btn.classList.add('active');
            }
        });
    });

    // Theme change listener
    document.querySelectorAll('input[name="theme"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            const settings = {\n                darkTheme: e.target.value === 'dark',
                lightTheme: e.target.value === 'light',
                compactMode: document.getElementById('compactMode').checked,
                hideRecommendations: document.getElementById('hideRecommendations').checked,
                hideAds: document.getElementById('hideAds').checked,
                hideStories: document.getElementById('hideStories').checked,
                colorScheme: document.querySelector('.color-btn.active').dataset.color
            };
            saveSetting(settings);
        });
    });

    // Toggle listeners
    document.getElementById('compactMode').addEventListener('change', () => {
        updateAndSave();
    });

    document.getElementById('hideRecommendations').addEventListener('change', () => {
        updateAndSave();
    });

    document.getElementById('hideAds').addEventListener('change', () => {
        updateAndSave();
    });

    document.getElementById('hideStories').addEventListener('change', () => {
        updateAndSave();
    });

    // Color scheme listeners
    document.querySelectorAll('.color-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            updateAndSave();
        });
    });

    // Reset button
    document.getElementById('resetBtn').addEventListener('click', () => {
        if (confirm('Сбросить все настройки?')) {
            chrome.storage.sync.clear(() => {
                chrome.storage.sync.set(defaultSettings, () => {
                    location.reload();
                });
            });
        }
    });
});

function updateAndSave() {
    const settings = {
        darkTheme: document.querySelector('input[name="theme"][value="dark"]').checked,
        lightTheme: document.querySelector('input[name="theme"][value="light"]').checked,
        compactMode: document.getElementById('compactMode').checked,
        hideRecommendations: document.getElementById('hideRecommendations').checked,
        hideAds: document.getElementById('hideAds').checked,
        hideStories: document.getElementById('hideStories').checked,
        colorScheme: document.querySelector('.color-btn.active').dataset.color
    };
    saveSetting(settings);
}

function saveSetting(settings) {
    chrome.storage.sync.set(settings, () => {
        // Notify content scripts
        chrome.tabs.query({ url: ['*://vk.com/*', '*://www.vk.com/*', '*://m.vk.com/*'] }, (tabs) => {
            tabs.forEach(tab => {
                chrome.tabs.sendMessage(tab.id, {
                    action: 'settingsUpdated',
                    settings: settings
                }).catch(() => {});
            });
        });
    });
}
