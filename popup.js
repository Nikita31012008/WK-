// Default settings
const defaultSettings = {
    darkTheme: false,
    lightTheme: false,
    compactMode: false,
    hideRecommendations: false,
    hideAds: false,
    hideStories: false,
    colorScheme: 'default'
};

// Load settings on popup open
document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.sync.get(defaultSettings, (settings) => {
        document.getElementById('darkTheme').checked = settings.darkTheme;
        document.getElementById('lightTheme').checked = settings.lightTheme;
        document.getElementById('compactMode').checked = settings.compactMode;
        document.getElementById('hideRecommendations').checked = settings.hideRecommendations;
        document.getElementById('hideAds').checked = settings.hideAds;
        document.getElementById('hideStories').checked = settings.hideStories;

        // Highlight active color button
        document.querySelectorAll('.color-btn').forEach(btn => {
            if (btn.dataset.color === settings.colorScheme) {
                btn.classList.add('active');
            }
        });
    });

    // Toggle listeners
    document.getElementById('darkTheme').addEventListener('change', (e) => {
        if (e.target.checked) {
            document.getElementById('lightTheme').checked = false;
        }
        saveSetting('darkTheme', e.target.checked);
    });

    document.getElementById('lightTheme').addEventListener('change', (e) => {
        if (e.target.checked) {
            document.getElementById('darkTheme').checked = false;
        }
        saveSetting('lightTheme', e.target.checked);
    });

    document.getElementById('compactMode').addEventListener('change', (e) => {
        saveSetting('compactMode', e.target.checked);
    });

    document.getElementById('hideRecommendations').addEventListener('change', (e) => {
        saveSetting('hideRecommendations', e.target.checked);
    });

    document.getElementById('hideAds').addEventListener('change', (e) => {
        saveSetting('hideAds', e.target.checked);
    });

    document.getElementById('hideStories').addEventListener('change', (e) => {
        saveSetting('hideStories', e.target.checked);
    });

    // Color scheme selector
    document.querySelectorAll('.color-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            saveSetting('colorScheme', btn.dataset.color);
        });
    });

    // Reset button
    document.getElementById('resetBtn').addEventListener('click', () => {
        if (confirm('Вы уверены? Все настройки будут сброшены.')) {
            chrome.storage.sync.clear(() => {
                chrome.storage.sync.set(defaultSettings, () => {
                    location.reload();
                });
            });
        }
    });
});

function saveSetting(key, value) {
    chrome.storage.sync.set({ [key]: value }, () => {
        // Notify content scripts about change
        chrome.tabs.query({ url: ['*://vk.com/*', '*://www.vk.com/*', '*://m.vk.com/*'] }, (tabs) => {
            tabs.forEach(tab => {
                chrome.tabs.sendMessage(tab.id, {
                    action: 'settingsUpdated',
                    settings: { [key]: value }
                }).catch(() => {
                    // Tab might not be ready yet
                });
            });
        });
    });
}
