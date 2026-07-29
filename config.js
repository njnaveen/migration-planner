// =========================================================
// SECURE CONFIGURATION NAVIGATION GUARD
// =========================================================
function openConfiguration() {
    let unlockUntil = localStorage.getItem('planner_unlocked_until');
    let isUnlocked = false;

    if (localStorage.getItem('planner_unlocked') === 'true') {
        isUnlocked = true;
    } else if (unlockUntil && new Date().getTime() < parseInt(unlockUntil)) {
        isUnlocked = true;
    }

    if (!isUnlocked) {
        alert("Please complete payment in the 'Planner Setup' tab to unlock the detailed Dashboards and Reports.");
        if (!document.getElementById('view-planner')) {
            window.location.href = "index.html?view=planner";
        }
    } else {
        window.location.href = "configuration.html";
    }
}

// =========================================================
// CENTRAL APP CONFIGURATION & ENTERPRISE READINESS ENGINE
// =========================================================
const AppConfig = {
    // 1. LEFT-HAND SIDEBAR MENU ITEMS
    sidebarNavigation: [
        { id: 'planner',   label: 'Planner Setup',             icon: 'fa-solid fa-sliders',              action: "switchMainView('planner')" },
        { id: 'dashboard', label: 'Executive Dashboard',       icon: 'fa-solid fa-chart-pie',            action: "switchMainView('dashboard')" },
        { id: 'gantt',     label: 'Project Gantt Plan',        icon: 'fa-solid fa-list-check',           action: "switchMainView('gantt')" },
        { id: 'timeline',  label: 'Timeline & Waves',          icon: 'fa-solid fa-timeline',             action: "switchMainView('timeline')" },
        { id: 'resources', label: 'Resource Matrix',           icon: 'fa-solid fa-users',                action: "switchMainView('resources')" },
        { id: 'risks',     label: 'Risks & Notes',             icon: 'fa-solid fa-triangle-exclamation', action: "switchMainView('risks')" },
        { id: 'lifecycle', label: 'Deployment Phases',         icon: 'fa-solid fa-diagram-project',      action: "switchMainView('lifecycle')" },
        { id: 'config',    label: 'Configuration & Baselines', icon: 'fa-solid fa-gears',                action: "openConfiguration()" }
    ],

    // 2. PAGE TITLE MAPPINGS FOR HEADER
    pageTitles: {
        'planner':   'Planner Setup',
        'dashboard': 'Executive Dashboard',
        'gantt':     'Project Gantt Chart Plan',
        'timeline':  'High-Level Timeline & Waves',
        'resources': 'Resource Matrix & Analytics',
        'risks':     'Risks, Assumptions & Recommendations',
        'lifecycle': 'Device Deployment Phases'
    },

    // 3. ENTERPRISE READINESS ASSESSMENT CATEGORIES
    assessmentCategories: [
        {
            id: 'identity',
            title: 'Identity & Access (Zero Trust)',
            icon: 'fa-solid fa-id-badge',
            items: [
                { name: 'Microsoft Entra ID Integration', status: 'ready',       risk: 'Low Risk' },
                { name: 'Conditional Access Policies',    status: 'in_progress', risk: 'High Risk' },
                { name: 'Multi-Factor Authentication',    status: 'ready',       risk: 'Low Risk' },
                { name: 'SSO Configuration',              status: 'ready',       risk: 'Low Risk' },
                { name: 'Identity Protection & PIM',      status: 'planned',     risk: 'Medium Risk' }
            ]
        },
        {
            id: 'cloud',
            title: 'Cloud Tenant Readiness',
            icon: 'fa-solid fa-cloud',
            items: [
                { name: 'Microsoft Intune Tenant Ready',  status: 'ready',       risk: 'Low Risk' },
                { name: 'Microsoft Graph API Permissions',status: 'ready',       risk: 'Low Risk' },
                { name: 'Licensing Assigned & Verified',  status: 'ready',       risk: 'Low Risk' },
                { name: 'Intune Connectors & Intune Certificate PKI', status: 'in_progress', risk: 'Medium Risk' }
            ]
        },
        {
            id: 'windows',
            title: 'Windows Platform Baselines',
            icon: 'fa-brands fa-windows',
            items: [
                { name: 'Windows Autopilot Deployment',   status: 'ready',       risk: 'Low Risk' },
                { name: 'Co-management (SCCM + Intune)',  status: 'ready',       risk: 'Low Risk' },
                { name: 'Enrollment Status Page (ESP)',   status: 'ready',       risk: 'Low Risk' },
                { name: 'Defender for Endpoint & LAPS',   status: 'ready',       risk: 'Low Risk' },
                { name: 'BitLocker & Credential Guard',   status: 'in_progress', risk: 'Medium Risk' },
                { name: 'Windows Update for Business',    status: 'ready',       risk: 'Low Risk' }
            ]
        },
        {
            id: 'apple',
            title: 'Apple Platform Baselines (macOS & iOS)',
            icon: 'fa-brands fa-apple',
            items: [
                { name: 'Apple Business Manager (ABM)',   status: 'ready',       risk: 'Low Risk' },
                { name: 'Automated Device Enrollment (ADE)', status: 'ready',    risk: 'Low Risk' },
                { name: 'Apps & Books (VPP) Sync',        status: 'in_progress', risk: 'Medium Risk' },
                { name: 'macOS Platform SSO & FileVault', status: 'ready',       risk: 'Low Risk' },
                { name: 'PPPC & System Extensions',       status: 'ready',       risk: 'Low Risk' }
            ]
        },
        {
            id: 'mobile',
            title: 'Android Enterprise & Mobility',
            icon: 'fa-solid fa-mobile-screen',
            items: [
                { name: 'Android Enterprise Fully Managed', status: 'ready',     risk: 'Low Risk' },
                { name: 'Corporate-Owned Work Profile (COPE)', status: 'ready',  risk: 'Low Risk' },
                { name: 'OEMConfig & Hardware Profiles',  status: 'missing',     risk: 'High Risk' },
                { name: 'Zero-Touch Enrollment',          status: 'ready',       risk: 'Low Risk' }
            ]
        },
        {
            id: 'apps',
            title: 'Application Readiness & Packaging',
            icon: 'fa-solid fa-box-open',
            items: [
                { name: 'Win32 Application Packaging',    status: 'in_progress', risk: 'High Risk' },
                { name: 'LOB Applications Packaged',      status: 'planned',     risk: 'Medium Risk' },
                { name: 'App Dependencies & Detection Rules', status: 'in_progress', risk: 'Medium Risk' },
                { name: 'Application UAT Testing Complete', status: 'planned',   risk: 'High Risk' }
            ]
        },
        {
            id: 'reporting',
            title: 'Reporting, Network & Monitoring',
            icon: 'fa-solid fa-chart-line',
            items: [
                { name: 'Endpoint Analytics Configured',  status: 'ready',       risk: 'Low Risk' },
                { name: 'Device Compliance Dashboard',    status: 'ready',       risk: 'Low Risk' },
                { name: 'Wi-Fi, VPN & PKI Certificates',  status: 'ready',       risk: 'Low Risk' },
                { name: 'Log Analytics Workspace / Power BI', status: 'planned', risk: 'Low Risk' }
            ]
        }
    ],

    // 4. SCORING ENGINE
    calculateScores: function() {
        let totalScore = 0;
        let totalCount = 0;
        const weights = { 'ready': 100, 'in_progress': 65, 'planned': 40, 'missing': 0 };

        const categoryScores = this.assessmentCategories.map(cat => {
            let catSum = 0;
            cat.items.forEach(item => {
                catSum += weights[item.status] || 0;
                totalScore += weights[item.status] || 0;
                totalCount++;
            });
            const catScore = Math.round(catSum / cat.items.length);
            return { id: cat.id, title: cat.title, score: catScore };
        });

        const overall = totalCount > 0 ? Math.round(totalScore / totalCount) : 0;
        return { overall, categories: categoryScores };
    },

    // 5. DEFAULT PLATFORM BASELINES
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

// =========================================================
// SMART PAGE-AWARE SIDEBAR RENDERER
// =========================================================
function renderSidebar(activeId) {
    const navContainer = document.getElementById('sidebar-nav-container');
    if (!navContainer) return;

    const isSeparatePage = !document.getElementById('view-planner');

    navContainer.innerHTML = AppConfig.sidebarNavigation.map(item => {
        if (isSeparatePage) {
            if (item.id === 'config') {
                return `<a class="nav-item active" id="nav-${item.id}" href="configuration.html"><i class="${item.icon}"></i> ${item.label}</a>`;
            } else {
                return `<a class="nav-item" id="nav-${item.id}" href="index.html?view=${item.id}"><i class="${item.icon}"></i> ${item.label}</a>`;
            }
        } else {
            return `<a class="nav-item ${item.id === activeId ? 'active' : ''}" id="nav-${item.id}" onclick="${item.action}"><i class="${item.icon}"></i> ${item.label}</a>`;
        }
    }).join('');
}
