// =========================================================
// ENTERPRISE GANTT & PHASE CALCULATION ENGINE (LZebra UEM)
// =========================================================

function generateEnterpriseGanttPlan(osType, totalDevices, totalApps, startDateStr) {
    let tasks = [];
    
    // --- PHASE 1: Discovery & Assessment ---
    const phase1 = [
        { id: "1001", task: "Project Kickoff", depends: "-" },
        { id: "1002", task: "Stakeholder Identification", depends: "1001" },
        { id: "1003", task: "Business Requirement Workshop", depends: "1002" },
        { id: "1004", task: "Current Environment Assessment", depends: "1003" },
        { id: "1005", task: "Device Inventory Collection", depends: "1004" },
        { id: "1006", task: "Application Inventory", depends: "1004" },
        { id: "1007", task: "License Assessment", depends: "1003" },
        { id: "1008", task: "Security Assessment", depends: "1003" },
        { id: "1009", task: "Risk Assessment", depends: "1008" },
        { id: "1010", task: "Migration Readiness Report", depends: "1005, 1006, 1009" }
    ];
    tasks.push({ phase: "Phase 1 – Discovery & Assessment", items: phase1 });

    // --- PHASE 2: Solution Design ---
    const phase2 = [
        { id: "2001", task: "Solution Architecture", depends: "1010" },
        { id: "2002", task: "Migration Strategy", depends: "2001" },
        { id: "2003", task: "Device Enrollment Design", depends: "2001" },
        { id: "2004", task: "Identity Design", depends: "2001" },
        { id: "2005", task: "Conditional Access Design", depends: "2004" },
        { id: "2006", task: "Security Baseline Design", depends: "2003" },
        { id: "2007", task: "Application Deployment Strategy", depends: "1006" },
        { id: "2008", task: "Compliance Policy Design", depends: "2006" },
        { id: "2009", task: "Certificate Design", depends: "2004" },
        { id: "2010", task: "Pilot Strategy", depends: "2002" },
        { id: "2011", task: "Wave Planning", depends: "2010" }
    ];
    tasks.push({ phase: "Phase 2 – Solution Design", items: phase2 });

    // --- PHASE 3: Infrastructure Preparation (Platform-Filtered) ---
    let phase3Items = [];
    if (osType === 'windows') {
        phase3Items = [
            { id: "3001", task: "Configure Microsoft Intune", depends: "2001" },
            { id: "3002", task: "Configure Entra ID", depends: "2004" },
            { id: "3003", task: "Configure Autopilot", depends: "3001" },
            { id: "3004", task: "Configure Enrollment Status Page", depends: "3003" },
            { id: "3005", task: "Configure Windows Update Rings", depends: "3001" },
            { id: "3006", task: "Configure Feature Updates", depends: "3005" },
            { id: "3007", task: "Configure Defender", depends: "3001" },
            { id: "3008", task: "Configure BitLocker", depends: "3007" },
            { id: "3009", task: "Configure LAPS", depends: "3001" },
            { id: "3010", task: "Configure Delivery Optimization", depends: "3001" }
        ];
    } else if (osType === 'mobile') {
        phase3Items = [
            { id: "3051", task: "Configure Apple Business Manager (ABM)", depends: "2001" },
            { id: "3052", task: "Configure ADE", depends: "3051" },
            { id: "3053", task: "Configure APNS", depends: "3051" },
            { id: "3054", task: "Configure VPP", depends: "3051" },
            { id: "3055", task: "Configure Shared iPad", depends: "3052" },
            { id: "3056", task: "Configure Managed Apple IDs", depends: "3051" },
            { id: "3057", task: "Configure Android Enterprise", depends: "2001" },
            { id: "3058", task: "Configure Managed Google Play", depends: "3057" },
            { id: "3059", task: "Configure OEMConfig", depends: "3057" },
            { id: "3060", task: "Configure Zero Touch", depends: "3057" },
            { id: "3061", task: "Configure COPE", depends: "3057" },
            { id: "3062", task: "Configure Fully Managed", depends: "3057" },
            { id: "3063", task: "Configure Dedicated Device Mode", depends: "3057" },
            { id: "3064", task: "Configure Managed Home Screen", depends: "3063" },
            { id: "3065", task: "Configure Zebra MX & StageNow", depends: "3057" }
        ];
    } else { // macOS
        phase3Items = [
            { id: "3101", task: "Configure Apple Business Manager (ABM)", depends: "2001" },
            { id: "3102", task: "Configure ADE", depends: "3101" },
            { id: "3103", task: "Configure Platform SSO", depends: "2004" },
            { id: "3104", task: "Configure FileVault", depends: "3103" },
            { id: "3105", task: "Configure PPPC", depends: "3103" },
            { id: "3106", task: "Configure System Extensions", depends: "3103" },
            { id: "3107", task: "Configure Wi-Fi & VPN", depends: "2001" },
            { id: "3108", task: "Configure Certificates", depends: "2009" },
            { id: "3109", task: "Configure Defender", depends: "3103" },
            { id: "3110", task: "Configure Company Portal", depends: "3103" }
        ];
    }
    tasks.push({ phase: "Phase 3 – Infrastructure Preparation", items: phase3Items });

    // --- PHASE 4: Application Preparation ---
    const phase4 = [
        { id: "4001", task: "Application Discovery", depends: "1006" },
        { id: "4002", task: "Application Rationalization", depends: "4001" },
        { id: "4003", task: "Packaging Standards", depends: "4002" },
        { id: "4004", task: "Win32 Packaging", depends: "4003" },
        { id: "4005", task: "LOB Packaging", depends: "4003" },
        { id: "4006", task: "macOS PKG Packaging", depends: "4003" },
        { id: "4007", task: "Android Managed Play Apps", depends: "4003" },
        { id: "4008", task: "iOS VPP Apps", depends: "4003" },
        { id: "4009", task: "Application Testing", depends: "4004, 4005" },
        { id: "4010", task: "Pilot Validation", depends: "4009" },
        { id: "4011", task: "Production Packaging", depends: "4010" }
    ];
    tasks.push({ phase: "Phase 4 – Application Preparation", items: phase4 });

    // --- PHASE 5: Security Configuration ---
    const phase5 = [
        { id: "5001", task: "Conditional Access", depends: "2005" },
        { id: "5002", task: "Compliance Policies", depends: "2008" },
        { id: "5003", task: "Configuration Profiles", depends: "3001" },
        { id: "5004", task: "Endpoint Security Policies", depends: "5003" },
        { id: "5005", task: "Attack Surface Reduction", depends: "5004" },
        { id: "5006", task: "Firewall Policies", depends: "5003" },
        { id: "5007", task: "BitLocker / FileVault", depends: "5004" },
        { id: "5008", task: "Defender", depends: "5004" },
        { id: "5009", task: "Certificates", depends: "2009" },
        { id: "5010", task: "VPN & Wi-Fi", depends: "5003" },
        { id: "5011", task: "App Protection Policies", depends: "2007" }
    ];
    tasks.push({ phase: "Phase 5 – Security Configuration", items: phase5 });

    // --- PHASE 6: Pilot ---
    const phase6 = [
        { id: "6001", task: "Pilot Planning", depends: "2010" },
        { id: "6002", task: "Pilot Device Selection", depends: "6001" },
        { id: "6003", task: "Pilot Enrollment", depends: "6002" },
        { id: "6004", task: "Pilot Application Deployment", depends: "4010, 6003" },
        { id: "6005", task: "Pilot Validation", depends: "6004" },
        { id: "6006", task: "Issue Resolution", depends: "6005" },
        { id: "6007", task: "Business Sign-off", depends: "6006" }
    ];
    tasks.push({ phase: "Phase 6 – Pilot", items: phase6 });

    // --- PHASE 7: Migration Waves ---
    let phase7 = [];
    for(let w = 0; w <= 7; w++) {
        let waveName = w === 0 ? "Wave 0 (IT & VIP Pilot)" : `Wave ${w} Rollout`;
        phase7.push({ id: `700${w}`, task: `${waveName} - Pre-check`, depends: w === 0 ? "6007" : `700${w-1}` });
        phase7.push({ id: `710${w}`, task: `${waveName} - Device Enrollment`, depends: `700${w}` });
        phase7.push({ id: `720${w}`, task: `${waveName} - Application Deployment`, depends: `710${w}` });
        phase7.push({ id: `730${w}`, task: `${waveName} - Validation`, depends: `720${w}` });
        phase7.push({ id: `740${w}`, task: `${waveName} - Business Sign-off`, depends: `730${w}` });
    }
    tasks.push({ phase: "Phase 7 – Migration Waves", items: phase7 });

    // --- PHASE 8: Reporting ---
    const phase8 = [
        { id: "8001", task: "Executive Dashboard", depends: "7407" },
        { id: "8002", task: "Migration Dashboard", depends: "7407" },
        { id: "8003", task: "Power BI Dashboard", depends: "8002" },
        { id: "8004", task: "Risk Dashboard", depends: "8001" },
        { id: "8005", task: "Compliance Dashboard", depends: "8001" },
        { id: "8006", task: "FTE Dashboard", depends: "8001" },
        { id: "8007", task: "Wave Dashboard", depends: "8002" }
    ];
    tasks.push({ phase: "Phase 8 – Reporting", items: phase8 });

    // --- PHASE 9: Hypercare ---
    const phase9 = [
        { id: "9001", task: "Incident Monitoring", depends: "7407" },
        { id: "9002", task: "Performance Monitoring", depends: "9001" },
        { id: "9003", task: "Application Issues Resolution", depends: "9001" },
        { id: "9004", task: "User Support", depends: "9001" },
        { id: "9005", task: "Knowledge Transfer", depends: "9004" },
        { id: "9006", task: "Lessons Learned", depends: "9005" },
        { id: "9007", task: "Project Closure", depends: "9006" }
    ];
    tasks.push({ phase: "Phase 9 – Hypercare", items: phase9 });

    return tasks;
}

// =========================================================
// DYNAMIC MONTH-ALIGNED MAPPING (MATCHES 14 MONTHS / 56 WEEKS)
// =========================================================
// =========================================================
// DYNAMIC MONTH-ALIGNED MAPPING (SCALES TO ANY MONTHS)
// =========================================================
function applyStrictPhaseMapping(enterprisePhases, totalMonths = 14) {
    let totalProjectWeeks = totalMonths * 4; // Dynamically scales (e.g. 19 months = 76 weeks)
    let weekHeaders = [];
    for(let w=1; w<=totalProjectWeeks; w++) weekHeaders.push(`W${w}`);

    let newExcelRows = [
        ["Milestone Code", "Phase", "Task / Milestone", "Depends On", "Duration (Days)", "Status", "% Completed", "Start Date", "End Date", ...weekHeaders]
    ];

    // Proportional scale factor relative to 14 standard months (56 weeks)
    let scale = totalProjectWeeks / 56;

    enterprisePhases.forEach(group => {
        // Scaled non-overlapping week boundaries
        let startWeek = Math.round(1 * scale), endWeek = Math.round(8 * scale);
        
        if (group.phase.includes("Solution Design"))      { startWeek = Math.round(5 * scale);  endWeek = Math.round(16 * scale); }
        else if (group.phase.includes("Infrastructure")) { startWeek = Math.round(9 * scale);  endWeek = Math.round(16 * scale); }
        else if (group.phase.includes("Application"))    { startWeek = Math.round(9 * scale);  endWeek = Math.round(20 * scale); }
        else if (group.phase.includes("Security"))       { startWeek = Math.round(13 * scale); endWeek = Math.round(20 * scale); }
        else if (group.phase.includes("Pilot"))          { startWeek = Math.round(17 * scale); endWeek = Math.round(20 * scale); }
        else if (group.phase.includes("Migration"))      { startWeek = Math.round(21 * scale); endWeek = Math.round(48 * scale); }
        else if (group.phase.includes("Reporting"))      { startWeek = Math.round(45 * scale); endWeek = Math.round(52 * scale); }
        else if (group.phase.includes("Hypercare"))      { startWeek = Math.round(49 * scale); endWeek = Math.round(totalProjectWeeks); }

        // Ensure bounds don't exceed total project weeks
        startWeek = Math.max(1, startWeek);
        endWeek = Math.min(endWeek, totalProjectWeeks);

        let groupTaskCount = group.items.length;
        let span = Math.max(1, Math.floor((endWeek - startWeek + 1) / groupTaskCount));

        group.items.forEach((item, idx) => {
            let taskStart = Math.min(startWeek + (idx * span), endWeek);
            let taskEnd = Math.min(taskStart + span, endWeek);
            if (taskStart === taskEnd) taskEnd = Math.min(taskStart + 1, totalProjectWeeks);

            let weekCells = [];
            for(let w = 1; w <= totalProjectWeeks; w++) {
                if(w >= taskStart && w <= taskEnd) {
                    weekCells.push("Active");
                } else {
                    weekCells.push("");
                }
            }

            let row = [
                item.id,
                group.phase,
                item.task,
                item.depends,
                5,
                "Not Started",
                "0%",
                "2026-07-30",
                "2026-07-30",
                ...weekCells
            ];
            newExcelRows.push(row);
        });
    });

    return newExcelRows;
}
