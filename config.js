// =========================================================
// CENTRAL CONFIGURATION & SCORING ENGINE (LZebra UEM)
// =========================================================

const AppConfig = {
    pageTitles: {
        'planner': 'Planner Setup',
        'dashboard': 'Executive Dashboard',
        'gantt': 'Project Gantt Chart Plan',
        'timeline': 'High-Level Timeline & Waves',
        'resources': 'Resource Matrix & Analytics',
        'risks': 'Risks, Assumptions & Recommendations',
        'lifecycle': 'Device Deployment Phases',
        'config': 'Enterprise Readiness & Baselines',
        'reports': 'Executive Reports Hub'
    },

    assessmentCategories: [
        {
            title: "Identity & Access (Zero Trust)",
            icon: "fa-solid fa-fingerprint",
            items: [
                { name: "Microsoft Entra ID Integration", status: "ready" },
                { name: "Conditional Access Policies", status: "ready" },
                { name: "Multi-Factor Authentication", status: "ready" },
                { name: "SSO Configuration", status: "ready" },
                { name: "Identity Protection & PIM", status: "ready" }
            ]
        },
        {
            title: "Cloud Tenant Readiness",
            icon: "fa-solid fa-cloud",
            items: [
                { name: "Intune Tenant Provisioning", status: "ready" },
                { name: "Apple Push Certificate (APNs)", status: "ready" },
                { name: "Android Enterprise Setup", status: "ready" },
                { name: "Network & Firewall Whitelisting", status: "ready" }
            ]
        },
        {
            title: "Windows Platform Baselines",
            icon: "fa-brands fa-windows",
            items: [
                { name: "Windows Autopilot Configuration", status: "ready" },
                { name: "Enrollment Status Page (ESP)", status: "ready" },
                { name: "BitLocker Encryption Policy", status: "ready" },
                { name: "Windows Update Rings", status: "in_progress" },
                { name: "Defender Baseline & ASR Rules", status: "ready" }
            ]
        },
        {
            title: "Apple Platform Baselines (macOS & iOS)",
            icon: "fa-brands fa-apple",
            items: [
                { name: "Apple Business Manager (ABM) Token", status: "ready" },
                { name: "Automated Device Enrollment (ADE)", status: "ready" },
                { name: "FileVault & PPPC Profiles", status: "ready" },
                { name: "iOS VPP Token Integration", status: "missing" }
            ]
        },
        {
            title: "Android Enterprise & Mobility",
            icon: "fa-brands fa-android",
            items: [
                { name: "Managed Google Play Binding", status: "ready" },
                { name: "Android Enterprise Work Profile", status: "ready" },
                { name: "Fully Managed / COPE Setup", status: "ready" }
            ]
        },
        {
            title: "Application Readiness & Packaging",
            icon: "fa-solid fa-box-archive",
            items: [
                { name: "Win32 App Packaging Standard", status: "in_progress" },
                { name: "LOB App Repository Setup", status: "in_progress" },
                { name: "App Deployment Testing & Pilot", status: "missing" }
            ]
        },
        {
            title: "Reporting, Network & Monitoring",
            icon: "fa-solid fa-chart-line",
            items: [
                { name: "Endpoint Analytics Enabled", status: "ready" },
                { name: "Power BI Executive Dashboard", status: "ready" },
                { name: "Bandwidth & Delivery Optimization", status: "in_progress" }
            ]
        }
    ],

    calculateScores: function() {
        let totalScoreSum = 0;
        let categoriesResult = this.assessmentCategories.map(cat => {
            // Exclude 'na' items from the scoring denominator so they don't impact readiness score
            let validItems = cat.items.filter(item => item.status !== 'na');
            
            if (validItems.length === 0) {
                return { title: cat.title, score: 100 };
            }

            let catPoints = validItems.reduce((acc, item) => {
                if (item.status === 'ready') return acc + 100;
                if (item.status === 'in_progress') return acc + 60;
                if (item.status === 'planned') return acc + 40;
                return acc + 0; // 'missing'
            }, 0);

            let catScore = Math.round(catPoints / validItems.length);
            totalScoreSum += catScore;
            return { title: cat.title, score: catScore };
        });

        let overallScore = Math.round(totalScoreSum / categoriesResult.length);
        return { overall: overallScore, categories: categoriesResult };
    }
};

// Helper function to render the shared sidebar
function renderSidebar(activeKey) {
    const navContainer = document.getElementById('sidebar-nav-container');
    if (!navContainer) return;

    const navItems = [
        { key: 'planner', label: 'Planner Setup', icon: 'fa-solid fa-sliders', view: 'index.html?view=planner' },
        { key: 'dashboard', label: 'Executive Dashboard', icon: 'fa-solid fa-chart-pie', view: 'index.html?view=dashboard' },
        { key: 'gantt', label: 'Project Gantt Plan', icon: 'fa-solid fa-calendar-days', view: 'index.html?view=gantt' },
        { key: 'timeline', label: 'Timeline & Waves', icon: 'fa-solid fa-water', view: 'index.html?view=timeline' },
        { key: 'resources', label: 'Resource Matrix', icon: 'fa-solid fa-users', view: 'index.html?view=resources' },
        { key: 'risks', label: 'Risks & Notes', icon: 'fa-solid fa-triangle-exclamation', view: 'index.html?view=risks' },
        { key: 'lifecycle', label: 'Deployment Phases', icon: 'fa-solid fa-diagram-project', view: 'index.html?view=lifecycle' },
        { key: 'config', label: 'Migration Readiness Matrix', icon: 'fa-solid fa-gear', view: 'configuration.html' },
        { key: 'reports', label: 'Reports & Export', icon: 'fa-solid fa-file-pdf', view: 'reports.html' }
    ];

    navContainer.innerHTML = navItems.map(item => {
        let isActive = (activeKey === item.key) ? 'active' : '';
        return `<a href="${item.view}" class="nav-item ${isActive}"><i class="${item.icon}" style="width: 20px;"></i> ${item.label}</a>`;
    }).join('');
}
