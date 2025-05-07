const dropdownConfig = {
    'categoryDropdownContainer': {
        filePath: 'directory.html', 
        contentSelector: '.Danh-muc',  
        loaded: false,
        element: null
    },
    'accountDropdownContainer': {
        filePath: 'account.html',
        contentSelector: '.account',
        loaded: false,
        element: null
    }
};
function initializeDOMElements() {
    for (const id in dropdownConfig) {
        dropdownConfig[id].element = document.getElementById(id);
        if (!dropdownConfig[id].element) {
            console.error(`Dropdown container with ID '${id}' not found.`);
        }
    }
}

async function fetchContent(filePath, contentSelector) {
    console.log(`Fetching content from: ${filePath} with selector: ${contentSelector}`);
    try {
        const response = await fetch(filePath);
        console.log(`Response status for ${filePath}: ${response.status}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status} for ${filePath}`);
        }
        const htmlText = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlText, 'text/html');
        const contentElement = doc.querySelector(contentSelector);

        if (contentElement) {
            console.log(`Element found with selector "${contentSelector}" in ${filePath}.`);
            return contentElement.outerHTML;
        } else {
            console.error(`Content selector "${contentSelector}" not found in ${filePath}. Searched in body:`, doc.body.innerHTML);
            return `<p style="color:red;">Error: Content not found with selector ${contentSelector}.</p>`;
        }
    } catch (error) {
        console.error(`Error fetching dropdown content from ${filePath}:`, error);
        return `<p style="color:red;">Error loading content from ${filePath}. Check console.</p>`;
    }
}
function closeAllActiveDropdowns(excludeId = null) {
    for (const id in dropdownConfig) {
        if (id !== excludeId && dropdownConfig[id].element && dropdownConfig[id].element.classList.contains('active')) {
            dropdownConfig[id].element.classList.remove('active');
            console.log(`Hiding content for ${id} via closeAllActiveDropdowns.`);
        }
    }
}
async function toggleDropdown(containerId, event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
        console.log(`>>> toggleDropdown CALLED for: ${containerId} by event:`, event.target);
    } else {
        console.log(`>>> toggleDropdown CALLED for: ${containerId} programmatically`);
    }

    const config = dropdownConfig[containerId];
    if (!config || !config.element) {
        console.error('Dropdown configuration or element not found for ID:', containerId);
        return;
    }

    const dropdownElement = config.element;
    const isActiveBeforeToggle = dropdownElement.classList.contains('active');
    console.log(`Is ${containerId} active before toggle? ${isActiveBeforeToggle}`);
    if (!isActiveBeforeToggle) {
        closeAllActiveDropdowns(containerId);
    }

    
    if (isActiveBeforeToggle) { 
        dropdownElement.classList.remove('active');
        console.log(`Hiding content for ${containerId}. Class 'active' removed.`);
    } else {
        if (!config.loaded) {
            dropdownElement.innerHTML = '<p>Loading...</p>';
            const contentHTML = await fetchContent(config.filePath, config.contentSelector);
            dropdownElement.innerHTML = contentHTML;
            if (!contentHTML.includes("Error:")) {
                config.loaded = true;
            }
            console.log(`Content fetched/refetched for ${containerId}. Loaded status: ${config.loaded}`);
        } else {
            console.log(`Showing existing content for ${containerId}.`);
        }
        dropdownElement.classList.add('active');
        console.log(`Showing content for ${containerId}. Class 'active' added.`);
    }
    console.log(`Is ${containerId} active AFTER toggle? ${dropdownElement.classList.contains('active')}`);
}

document.addEventListener('click', function(event) {
    let clickedInsideAnActiveDropdownOrItsTrigger = false;
    const activeDropdownTriggers = document.querySelectorAll('a[onclick*="toggleDropdown"]');

    activeDropdownTriggers.forEach(trigger => {
        const onclickAttr = trigger.getAttribute('onclick');
        const match = onclickAttr.match(/toggleDropdown\('([^']+)'/);
        if (match && match[1]) {
            const containerId = match[1];
            const config = dropdownConfig[containerId];
            if (config && config.element && config.element.classList.contains('active')) {
                if (trigger.contains(event.target) || config.element.contains(event.target)) {
                    clickedInsideAnActiveDropdownOrItsTrigger = true;
                }
            }
        }
    });

    if (!clickedInsideAnActiveDropdownOrItsTrigger) {
        closeAllActiveDropdowns();
    }
});

document.addEventListener('DOMContentLoaded', () => {
    initializeDOMElements();

    const searchBox = document.querySelector('.search-box');
    const searchIcon = document.querySelector('#search-icon');
    const navbar = document.querySelector('.navbar');
    const menuIcon = document.querySelector('#menu-icon');
    const header = document.querySelector('header'); 

    if (searchIcon && searchBox) {
        searchIcon.addEventListener('click', (e) => { 
            closeAllActiveDropdowns(); 
        });
    }

    if (menuIcon && navbar) {
        menuIcon.addEventListener('click', (e) => { 
            closeAllActiveDropdowns(); 
        });
    }
    
    if (header) {
        window.addEventListener('scroll', () => {
            closeAllActiveDropdowns(); 
        });
    }

    console.log("current3.js script initialized and handling dropdowns.");
});