// Service Worker for VK Styles extension

chrome.runtime.onInstalled.addListener(() => {
    // Initialize default settings
    chrome.storage.sync.get({
        darkTheme: false,
        lightTheme: false,
        compactMode: false,
        hideRecommendations: false,
        hideAds: false,
        hideStories: false,
        colorScheme: 'default'
    }, (settings) => {
        // Settings already exist or are set to defaults
        console.log('VK Styles installed', settings);
    });
});
