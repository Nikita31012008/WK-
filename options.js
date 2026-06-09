const defaultSettings = {
    darkTheme: false,
    lightTheme: false,
    compactMode: false,
    hideRecommendations: false,
    hideAds: false,
    hideStories: false,
    colorScheme: 'default'
};

let currentTheme = 'default';

document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.sync.get(defaultSettings, (settings) => {
        // Set theme
        if (settings.darkTheme) {
            document.getElementById('themeDark').checked = true;
            currentTheme = 'dark';
        } else if (settings.lightTheme) {
            document.getElementById('themeLight').checked = true;
            currentTheme = 'light';
        } else {
            document.getElementById('themeDefault').checked = true;
            currentTheme = 'default';
        }

        // Set toggles
        document.getElementById('compactMode').checked = settings.compactMode;
        document.getElementById('hideRecommendations').checked = settings.hideRecommendations;
        document.getElementById('hideAds').checked = settings.hideAds;
        document.getElementById('hideStories').checked = settings.hideStories;

        // Set color scheme
        document.querySelectorAll('.color-item').forEach(item => {
            if (item.dataset.color === settings.colorScheme) {
                item.classList.add('active');
            }
        });
    });

    // Theme listeners
    document.querySelectorAll('input[name="theme"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            currentTheme = e.target.value;
        });
    });

    // Color scheme listeners
    document.querySelectorAll('.color-item').forEach(item => {
        item.addEventListener('click', () => {
            document.querySelectorAll('.color-item').forEach(i => i.classList.remove('active'));
            item.classList.add('active');
        });
    });

    // Save button
    document.getElementById('saveBtn').addEventListener('click', () => {
        const settings = {
            darkTheme: currentTheme === 'dark',
            lightTheme: currentTheme === 'light',
            compactMode: document.getElementById('compactMode').checked,
            hideRecommendations: document.getElementById('hideRecommendations').checked,
            hideAds: document.getElementById('hideAds').checked,
            hideStories: document.getElementById('hideStories').checked,
            colorScheme: document.querySelector('.color-item.active').dataset.color
        };

        chrome.storage.sync.set(settings, () => {
            // Show success message
            const btn = document.getElementById('saveBtn');
            const originalText = btn.textContent;
            btn.textContent = '✓ Сохранено!';
            btn.style.background = '#27ae60';

            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.background = '';
            }, 2000);

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
    });

    // Reset button
    document.getElementById('resetBtn').addEventListener('click', () => {
        if (confirm('Вы уверены? Все настройки будут сброшены в стандартные.')) {
            chrome.storage.sync.clear(() => {
                chrome.storage.sync.set(defaultSettings, () => {
                    location.reload();
                });
            });
        }
    });
});