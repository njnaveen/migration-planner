// ==========================================
// CENTRAL APP CONFIGURATION & NAVIGATION
// ==========================================

const AppConfig = {
    // 1. LEFT-HAND SIDEBAR MENU ITEMS
    // Notice we added the new "Configuration & Baselines" link pointing to configuration.html!
    sidebarNavigation: [
        { id: 'planner',   label: 'Planner Setup',             icon: 'fa-solid fa-sliders',             url: 'index.html?view=planner' },
        { id: 'dashboard', label: 'Executive Dashboard',       icon: 'fa-solid fa-chart-pie',           url: 'index.html?view=dashboard' },
        { id: 'gantt',     label: 'Project Gantt Plan',        icon: 'fa-solid fa-list-check',          url: 'index.html?view=gantt' },
        { id: 'timeline',  label: 'Timeline & Waves',          icon: 'fa-solid fa-timeline',            url: 'index.html?view=timeline' },
        { id: 'resources', label: 'Resource Matrix',           icon: 'fa-solid fa-users',               url: 'index.html?view=resources' },
        { id: 'risks',     label: 'Risks & Notes',             icon: 'fa-solid fa-triangle-exclamation',url: 'index.html?view=risks' },
        { id: 'lifecycle', label: 'Deployment Phases',         icon: 'fa-solid fa-diagram-project',     url: 'index.html?view=lifecycle' },
        { id: 'config',    label: 'Configuration & Baselines', icon: 'fa-solid fa-gears',               url: 'configuration.html' }
    ],

    // 2. DEFAULT PLATFORM BASELINES (Shared across pages)
    baselines: {
        windows: [
            "Autopilot Provisioning",
            "Co-management",
            "Hybrid Azure AD Join",
            "Windows Defender AV",
            "BitLocker Encryption"
        ],
        mobile: [
            "Apple Business Manager (ABM)",
            "ADE / VPP Configured",
            "Android Enterprise",
            "Shared Devices (No User Affinity)"
        ],
        mac: [
            "FileVault Encryption",
            "PPPC & System Extensions",
            "Platform SSO"
        ]
    }
};

// Global helper to render the sidebar dynamically on ANY page
function renderSidebar(activeId) {
    const navContainer = document.getElementById('sidebar-nav-container');
    if (!navContainer) return;

    navContainer.innerHTML = AppConfig.sidebarNavigation.map(item => `
        <a class="nav-item ${item.id === activeId ? 'active' : ''}" 
           id="nav-${item.id}" 
           href="${item.url}">
           <i class="${item.icon}"></i> ${item.label}
        </a>
    `).join('');
}
