export default function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

    // 1. Receive data from the frontend
    const { osType, devices, batchSize, batchesPerWeek, totalApps, isUnlocked, startDateStr } = req.body;

    function addDaysToDate(dateStr, days) {
        let d = new Date(dateStr);
        d.setDate(d.getDate() + days);
        return d.toISOString().split('T')[0];
    }

    // --- SECURE MATH LOGIC ---
    let inceptionM = 1, discoveryM = 1, designM = 1, prepM = 1, pilotM = 1, hypercareM = 2;
    if (osType === 'mobile' || osType === 'mac') { hypercareM = 1; }

    let actualWeeklyThroughput = batchSize * batchesPerWeek;
    let migrationWeeks = Math.ceil(devices / actualWeeklyThroughput);
    let migrationM = Math.max(1, Math.ceil(migrationWeeks / 4.33));
    let deploy = (osType === 'mobile') ? Math.max(1, Math.ceil(actualWeeklyThroughput / 60)) : Math.max(1, Math.ceil(actualWeeklyThroughput / 600));
    let appFTE = (osType === 'mobile') ? 0 : Math.max(1, Math.ceil(totalApps / ((prepM * 4.33) * 100)));

    let totalMonths = inceptionM + discoveryM + designM + prepM + pilotM + migrationM + hypercareM;
    let visiblePoint = Math.ceil(totalMonths * 0.5);

    let pilotDate = addDaysToDate(startDateStr, (inceptionM + discoveryM + designM + prepM) * 30);
    let prodDate = addDaysToDate(pilotDate, pilotM * 30);
    let pilotSize = Math.min(500, Math.ceil(devices * 0.05));
    let migrationScopeSize = devices - pilotSize;

    // --- WAVES TABLE GENERATION ---
    let waveTable = `<tr><th>Wave Name</th><th>Target Devices</th><th>Status</th></tr>`;
    let remDevs = devices;
    if (pilotSize > 0) { waveTable += `<tr><td>Pilot Phase</td><td>${pilotSize.toLocaleString()}</td><td><span class="status-dot dot-green"></span> Planned</td></tr>`; remDevs -= pilotSize; }
    let waveNum = 1;
    while (remDevs > 0) {
        if (waveNum === 10 && remDevs > 0) {
            let remWaves = Math.ceil(remDevs / batchSize);
            waveTable += `<tr><td>Waves ${waveNum} to ${waveNum + remWaves - 1}</td><td>${remDevs.toLocaleString()}</td><td><span class="status-dot dot-green"></span> Planned</td></tr>`;
            remDevs = 0;
        } else {
            let bSize = Math.min(batchSize, remDevs);
            waveTable += `<tr><td>Wave ${waveNum}</td><td>${bSize.toLocaleString()}</td><td><span class="status-dot dot-green"></span> Planned</td></tr>`;
            remDevs -= bSize;
            waveNum++;
        }
    }

    // --- FTE CALCULATION ENGINE ---
    function getFTE(peak, role, m) {
        if (peak === 0) return 0;
        let phase = "";
        if (m <= inceptionM) phase = "Inception";
        else if (m <= inceptionM + discoveryM) phase = "Discovery";
        else if (m <= inceptionM + discoveryM + designM) phase = "Design";
        else if (m <= inceptionM + discoveryM + designM + prepM) phase = "Prep";
        else if (m <= inceptionM + discoveryM + designM + prepM + pilotM) phase = "Pilot";
        else if (m <= totalMonths - hypercareM) phase = "Migration";
        else phase = "Hypercare";

        let mult = 0;
        if (role === 'Arch') mult = (phase === "Migration" || phase === "Hypercare") ? 0.5 : 1.0;
        if (role === 'End') mult = (phase === "Inception" || phase === "Hypercare") ? 0.5 : 1.0;
        if (role === 'App') mult = (phase === "Inception" || phase === "Hypercare" || phase === "Migration") ? 0 : 1.0;
        if (role === 'Gpo') mult = (phase === "Inception" || phase === "Hypercare") ? 0.5 : 1.0;
        if (role === 'Dep') mult = (phase === "Pilot") ? 0.5 : (phase === "Migration") ? 1.0 : 0;
        if (role === 'Hyp') mult = (phase === "Hypercare" || phase === "Migration") ? 1.0 : 0;
        return mult === 0 ? 0 : Math.max(1, Math.round(peak * mult));
    }

    let reqArch = Math.max(1, Math.ceil(devices / 35000));
    let reqEnd = Math.max(1, Math.ceil(devices / 18000));
    const roles = [
        ['Architects', 'Arch', reqArch, '#3b82f6'],
        ['L3 Engineer', 'End', reqEnd, '#10b981'],
        ['App Packaging', 'App', appFTE, '#f59e0b'],
        ['GPO/Policy/CA Expert', 'Gpo', Math.max(1, Math.ceil(devices / 20000)), '#8b5cf6'],
        ['Deployment Engineers', 'Dep', deploy, '#ec4899'],
        ['Hypercare', 'Hyp', Math.max(1, Math.ceil(actualWeeklyThroughput / 800)), '#64748b']
    ];

    let matrixHeader = `<tr><td style="border: none; background: white;"></td><td colspan="${inceptionM + discoveryM}" class="bg-assess">Discovery & Design</td><td colspan="${designM + prepM}" class="bg-found">Preparation</td><td colspan="${pilotM}" class="bg-pilot">Pilot</td><td colspan="${migrationM}" class="bg-mig">Migration</td><td colspan="${hypercareM}" class="bg-hyp">Hypercare</td></tr>`;
    matrixHeader += '<tr style="background: #f8fafc;"><td class="role-name">Role Name</td>';
    for (let i = 1; i <= totalMonths; i++) { matrixHeader += `<td>M${i}</td>`; }
    matrixHeader += '</tr>';

    let monthlyTotals = new Array(totalMonths + 1).fill(0);
    let peakFTE = 0, totalPersonMonths = 0;
    let donutGlobalData = { labels: [], data: [], colors: [] };
    let previewRows = '';
    let fullRows = '';

    roles.forEach(role => {
        if (role[1] === 'App' && osType === 'mobile') return;
        previewRows += `<tr><td class="role-name"><i class="fa-solid fa-user" style="color:${role[3]}; margin-right:8px;"></i>${role[0]}</td>`;
        fullRows += `<tr><td class="role-name"><i class="fa-solid fa-user" style="color:${role[3]}; margin-right:8px;"></i>${role[0]}</td>`;
        let rSum = 0;
        for (let i = 1; i <= totalMonths; i++) {
            let fteValue = getFTE(role[2], role[1], i);
            monthlyTotals[i] += fteValue;
            rSum += fteValue;
            fullRows += `<td>${fteValue}</td>`;
            if (i > visiblePoint && !isUnlocked) {
                previewRows += '<td class="locked-cell">🔒</td>';
            } else {
                previewRows += `<td>${fteValue}</td>`;
            }
        }
        donutGlobalData.data.push(rSum);
        donutGlobalData.labels.push(role[0]);
        donutGlobalData.colors.push(role[3]);
        previewRows += '</tr>';
        fullRows += '</tr>';
    });

    let chartGlobalData = { labels: [], data: [], maxVal: 0 };
    for (let m = 1; m <= totalMonths; m++) {
        totalPersonMonths += monthlyTotals[m];
        if (monthlyTotals[m] > peakFTE) peakFTE = monthlyTotals[m];
        chartGlobalData.labels.push(`M${m}`);
        chartGlobalData.data.push(monthlyTotals[m]);
    }
    chartGlobalData.maxVal = peakFTE;

    let previewTotalRow = '<tr style="font-weight: bold; background: #f8fafc; color: var(--primary); border-top: 2px solid var(--border-color);"><td class="role-name">Total Combined FTE</td>';
    let fullTotalRow = '<tr style="font-weight: bold; background: #f8fafc; color: var(--primary); border-top: 2px solid var(--border-color);"><td class="role-name">Total Combined FTE</td>';

    for (let i = 1; i <= totalMonths; i++) {
        fullTotalRow += `<td>${monthlyTotals[i]}</td>`;
        if (i > visiblePoint && !isUnlocked) {
            previewTotalRow += '<td class="locked-cell">🔒</td>';
        } else {
            previewTotalRow += `<td>${monthlyTotals[i]}</td>`;
        }
    }
    previewTotalRow += '</tr>';
    fullTotalRow += '</tr>';

    let previewMatrixHTML = '<table class="matrix-table">' + matrixHeader + previewRows + previewTotalRow + '</table>';
    let fullMatrixHTML = '<table class="matrix-table">' + matrixHeader + fullRows + fullTotalRow + '</table>';

    // --- TIMELINE GANTT GENERATION ---
    let ganttHTML = `<div class="gantt-header">`;
    for(let i=1; i<=totalMonths; i+=2) ganttHTML += `<div class="gantt-month">M${i}</div>`;
    ganttHTML += `</div>`;
    function drawBar(name, st, dur, col) {
        let L = ((st - 1) / totalMonths) * 100;
        let W = (dur / totalMonths) * 100;
        return `<div class="gantt-row"><div class="gantt-label">${name}</div><div class="gantt-track"><div class="gantt-bar" style="left:${L}%; width:${W}%; background:${col};"></div></div></div>`;
    }
    ganttHTML += drawBar('Disc/Design', 1, inceptionM+discoveryM+designM, '#93c5fd');
    ganttHTML += drawBar('Preparation', 1+inceptionM+discoveryM+designM, prepM, '#86efac');
    ganttHTML += drawBar('Pilot', 1+inceptionM+discoveryM+designM+prepM, pilotM, '#fde047');
    ganttHTML += drawBar('Migration', 1+inceptionM+discoveryM+designM+prepM+pilotM, migrationM, '#c084fc');
    ganttHTML += drawBar('Hypercare', totalMonths-hypercareM+1, hypercareM, '#fca5a5');

    // --- EXCEL DOWNLOAD DATA ---
    let rawTasks = [];
    let cCode = 1001;
    function addTask(phase, name, days) { rawTasks.push({ code: cCode++, phase: phase, name: name, days: days }); }
    
    // Condensed Excel logic for brevity 
    addTask('Inception', 'Contract Execution - Client Sign-Off', 5);
    addTask('Discover', 'Device inventory report', 15);
    addTask('Design', 'Capture Scope / Prerequisites', 8);
    addTask('Env Prep', 'Group Creation for UAT & Corp', 15);
    addTask('Configuration', 'Intune Deployment Policies', 8);
    addTask('UAT / Pilot', 'Test Environment', 15);
    addTask('Migration', `Phases Wise Migration (${devices} Devices)`, (migrationM * 30) - 1); 
    addTask('Post Migration', 'Monitoring', 10);
    
    let currentDate = startDateStr;
    rawTasks.forEach(t => { t.startDate = currentDate; t.endDate = addDaysToDate(currentDate, t.days); currentDate = t.endDate; });
    let projectStartMs = new Date(startDateStr).getTime();
    let projectEndMs = new Date(rawTasks[rawTasks.length - 1].endDate).getTime();
    let totalProjectDays = Math.ceil((projectEndMs - projectStartMs) / (1000 * 60 * 60 * 24));
    let totalWeeks = Math.max(1, Math.ceil(totalProjectDays / 7));

    let finalExcelData = [['Milestone Code', 'Phase', 'Task / Milestone', 'Duration (Days)', 'Status', '% Completed', 'Start Date', 'End Date']];
    for(let w=1; w<=totalWeeks; w++) { finalExcelData[0].push('W'+w); }
    
    rawTasks.forEach(t => {
        let excelRow = [t.code, t.phase, t.name, t.days, 'Not Started', '0%', t.startDate, t.endDate];
        let taskStartMs = new Date(t.startDate).getTime();
        let taskEndMs = new Date(t.endDate).getTime();
        for(let w=1; w<=totalWeeks; w++) {
            let weekStartMs = projectStartMs + ((w - 1) * 7 * 24 * 60 * 60 * 1000);
            let weekEndMs = projectStartMs + (w * 7 * 24 * 60 * 60 * 1000) - 1;
            if (taskStartMs <= weekEndMs && taskEndMs >= weekStartMs) excelRow.push('Active');
            else excelRow.push('');
        }
        finalExcelData.push(excelRow);
    });

    let totalBatches = Math.ceil(devices / batchSize);
    let goLiveMonth = inceptionM + discoveryM + designM + prepM + pilotM + 1;

    // Send everything back to the frontend safely
    res.status(200).json({
        pilotDate, prodDate, waveTable, previewMatrixHTML, fullMatrixHTML, 
        peakFTE, totalPersonMonths, totalBatches, goLiveMonth, ganttHTML, 
        chartGlobalData, donutGlobalData, finalExcelData, totalMonths
    });
}
