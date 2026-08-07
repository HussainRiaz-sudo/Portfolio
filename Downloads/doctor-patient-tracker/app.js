// App State & Local Storage Keys
const DAILY_STORAGE_KEY = 'doctor_daily_patients';
const LEDGER_STORAGE_KEY = 'doctor_all_patients';
const ACTIVE_DAY_KEY = 'doctor_active_day';
const SHEETS_URL_KEY = 'doctor_google_sheet_url';

let dailyPatients = [];
let allPatients = [];
let activeDay = '';
let googleSheetUrl = '';

// Modal confirmation state
let pendingAction = null;

// Apps Script Code Snippet
const APPS_SCRIPT_CODE = `function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Check for connection test
    if (data.type === 'test') {
      return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "Connected!" }))
        .setMimeType(ContentService.MimeType.JSON)
        .addHeader("Access-Control-Allow-Origin", "*");
    }
    
    // Append headers if sheet is brand new
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["Daily No.", "Patient Name", "Date", "Gross Charges (Rs.)", "Doctor Share 30% (Rs.)", "Hospital Share 70% (Rs.)", "Unique ID"]);
    }
    
    sheet.appendRow([
      data.dailyIndex,
      data.name,
      data.date,
      data.charges,
      data.split30,
      data.split70,
      data.id
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({ status: "success" }))
      .setMimeType(ContentService.MimeType.JSON)
      .addHeader("Access-Control-Allow-Origin", "*");
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON)
      .addHeader("Access-Control-Allow-Origin", "*");
  }
}`;

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lucide Icons
    if (window.lucide) {
        window.lucide.createIcons();
    }

    // 2. Set default date to today
    const dateInput = document.getElementById('entry-date');
    const todayStr = getTodayLocalDateString();
    dateInput.value = todayStr;
    dateInput.max = todayStr; // Prevent future dates

    // 3. Load data
    loadState();

    // 4. Check for daily reset
    checkDailyReset();

    // 5. Setup event listeners
    setupEventListeners();

    // 6. Start Clock
    startClock();

    // 7. Initial Render
    renderAll();
});

// Helper: Get today's date in YYYY-MM-DD local format
function getTodayLocalDateString() {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
}

// Helper: Format Currency (Rs.)
function formatCurrency(value) {
    return new Intl.NumberFormat('en-PK', {
        style: 'currency',
        currency: 'PKR'
    }).format(value);
}

// Helper: Format Date for Display (e.g. Jul 15, 2026)
function formatDateDisplay(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr + 'T00:00:00'); // Prevent timezone offset shift
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
}

// Load state from LocalStorage
function loadState() {
    const storedDaily = localStorage.getItem(DAILY_STORAGE_KEY);
    const storedLedger = localStorage.getItem(LEDGER_STORAGE_KEY);
    const storedActiveDay = localStorage.getItem(ACTIVE_DAY_KEY);
    const storedSheetUrl = localStorage.getItem(SHEETS_URL_KEY);

    dailyPatients = storedDaily ? JSON.parse(storedDaily) : [];
    allPatients = storedLedger ? JSON.parse(storedLedger) : [];
    activeDay = storedActiveDay || getTodayLocalDateString();
    googleSheetUrl = storedSheetUrl || '';

    if (!storedActiveDay) {
        localStorage.setItem(ACTIVE_DAY_KEY, activeDay);
    }
}

// Save state to LocalStorage
function saveState() {
    localStorage.setItem(DAILY_STORAGE_KEY, JSON.stringify(dailyPatients));
    localStorage.setItem(LEDGER_STORAGE_KEY, JSON.stringify(allPatients));
    localStorage.setItem(ACTIVE_DAY_KEY, activeDay);
    if (googleSheetUrl) {
        localStorage.setItem(SHEETS_URL_KEY, googleSheetUrl);
    } else {
        localStorage.removeItem(SHEETS_URL_KEY);
    }
}

// Check if day rolled over and daily log needs clearing
function checkDailyReset() {
    const todayStr = getTodayLocalDateString();
    if (activeDay !== todayStr) {
        // Clear daily sheet for the new day
        if (dailyPatients.length > 0) {
            dailyPatients = [];
            showToast('Daily Log (Sheet 1) has been reset for the new day.', 'info');
        }
        activeDay = todayStr;
        saveState();
    }
}

// Clock updates date & time badge
function startClock() {
    const clockDisplay = document.getElementById('current-datetime-display');
    const update = () => {
        const now = new Date();
        const formatted = now.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        }) + ' | ' + now.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        clockDisplay.textContent = formatted;
    };
    update();
    setInterval(update, 1000);
}

// Setup Event Listeners
function setupEventListeners() {
    // Tab switching
    const tab1Btn = document.getElementById('tab1-btn');
    const tab2Btn = document.getElementById('tab2-btn');
    const sheet1 = document.getElementById('sheet1-content');
    const sheet2 = document.getElementById('sheet2-content');

    tab1Btn.addEventListener('click', () => {
        tab1Btn.classList.add('active');
        tab1Btn.setAttribute('aria-selected', 'true');
        tab2Btn.classList.remove('active');
        tab2Btn.setAttribute('aria-selected', 'false');
        sheet1.classList.add('active');
        sheet2.classList.remove('active');
        renderDailyTable();
    });

    tab2Btn.addEventListener('click', () => {
        tab2Btn.classList.add('active');
        tab2Btn.setAttribute('aria-selected', 'true');
        tab1Btn.classList.remove('active');
        tab1Btn.setAttribute('aria-selected', 'false');
        sheet2.classList.add('active');
        sheet1.classList.remove('active');
        renderLedgerTable();
    });

    // Patient Name Input: Auto-Count Badge preview
    const nameInput = document.getElementById('patient-name');
    const countPreview = document.getElementById('count-preview');

    nameInput.addEventListener('input', () => {
        const nameVal = nameInput.value.trim();
        if (nameVal.length > 0) {
            const nextCount = dailyPatients.length + 1;
            countPreview.textContent = `#${nextCount}`;
            countPreview.classList.add('visible');
        } else {
            countPreview.classList.remove('visible');
        }
    });

    // Form Submission
    const form = document.getElementById('patient-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        handleAddPatient();
    });

    // End Day Button
    document.getElementById('end-day-btn').addEventListener('click', () => {
        openModal(
            'End Current Day & Reset?',
            'This will clear today\'s patient log (Sheet 1). The All-Time Ledger (Sheet 2) is safe and will not be altered. Would you like to proceed?',
            () => {
                dailyPatients = [];
                saveState();
                renderAll();
                showToast('Daily Log cleared. Starting fresh.', 'info');
            }
        );
    });

    // Ledger Search / Filters
    document.getElementById('search-input').addEventListener('input', renderLedgerTable);
    document.getElementById('filter-start-date').addEventListener('change', renderLedgerTable);
    document.getElementById('filter-end-date').addEventListener('change', renderLedgerTable);

    // Clear Filters
    document.getElementById('clear-filters-btn').addEventListener('click', () => {
        document.getElementById('search-input').value = '';
        document.getElementById('filter-start-date').value = '';
        document.getElementById('filter-end-date').value = '';
        renderLedgerTable();
        showToast('Filters cleared', 'info');
    });

    // Export CSV
    document.getElementById('export-csv-btn').addEventListener('click', exportLedgerToCSV);

    // Delete All Ledger Entries Button
    document.getElementById('clear-ledger-btn').addEventListener('click', () => {
        if (allPatients.length === 0) {
            showToast('No records available to delete.', 'info');
            return;
        }
        openModal(
            'Delete All Ledger Records?',
            'Are you sure you want to permanently delete all records from the Main Ledger (Sheet 2)? This action cannot be undone.',
            () => {
                allPatients = [];
                dailyPatients = [];
                saveState();
                renderAll();
                showToast('All ledger records have been deleted permanently.', 'info');
            }
        );
    });

    // Sync All Button
    document.getElementById('sync-all-btn').addEventListener('click', syncAllPending);

    // Settings Modal Triggers
    const settingsModal = document.getElementById('settings-modal');
    const settingsBtn = document.getElementById('settings-btn');
    const closeSettings = document.getElementById('close-settings-btn');
    const cancelSettings = document.getElementById('cancel-settings-btn');
    const saveSettings = document.getElementById('save-settings-btn');
    const disconnectBtn = document.getElementById('disconnect-sheet-btn');
    const copyScriptBtn = document.getElementById('copy-script-btn');

    settingsBtn.addEventListener('click', () => {
        // Load settings values
        document.getElementById('apps-script-code').value = APPS_SCRIPT_CODE;
        document.getElementById('google-sheet-url').value = googleSheetUrl;
        
        if (googleSheetUrl) {
            disconnectBtn.style.display = 'block';
        } else {
            disconnectBtn.style.display = 'none';
        }
        
        settingsModal.classList.add('active');
    });

    const closeSettingsModal = () => {
        settingsModal.classList.remove('active');
    };

    closeSettings.addEventListener('click', closeSettingsModal);
    cancelSettings.addEventListener('click', closeSettingsModal);
    
    // Copy Code snippet
    copyScriptBtn.addEventListener('click', () => {
        const textarea = document.getElementById('apps-script-code');
        textarea.select();
        document.execCommand('copy');
        showToast('Apps Script code copied to clipboard!', 'success');
    });

    // Save and Test URL
    saveSettings.addEventListener('click', async () => {
        const urlInput = document.getElementById('google-sheet-url').value.trim();
        if (!urlInput) {
            googleSheetUrl = '';
            saveState();
            closeSettingsModal();
            renderAll();
            showToast('Google Sheet connection removed.', 'info');
            return;
        }

        // Validate basic URL structure
        if (!urlInput.startsWith('https://script.google.com/')) {
            showToast('Please enter a valid Google Apps Script Web App URL.', 'danger');
            return;
        }

        saveSettings.disabled = true;
        saveSettings.querySelector('span').textContent = 'Testing...';

        try {
            // Attempt to send connection test
            const response = await fetch(urlInput, {
                method: 'POST',
                mode: 'no-cors', // Avoids CORS blocker on redirect
                body: JSON.stringify({ type: 'test' }),
                headers: { 'Content-Type': 'text/plain' }
            });

            googleSheetUrl = urlInput;
            saveState();
            closeSettingsModal();
            renderAll();
            showToast('Google Sheet settings saved and test ping sent!', 'success');
            
            // Sync any existing pending unsynced records
            syncAllPending();
        } catch (err) {
            console.error(err);
            showToast('Connection failed. Please check the URL and try again.', 'danger');
        } finally {
            saveSettings.disabled = false;
            saveSettings.querySelector('span').textContent = 'Test & Save';
        }
    });

    // Disconnect Button
    disconnectBtn.addEventListener('click', () => {
        googleSheetUrl = '';
        
        // Reset all pending statuses back to local
        allPatients.forEach(p => {
            if (p.syncStatus === 'pending') {
                p.syncStatus = 'local';
            }
        });
        
        saveState();
        closeSettingsModal();
        renderAll();
        showToast('Disconnected from Google Sheet.', 'info');
    });

    // Confirmation Modal event hooks
    document.getElementById('modal-cancel-btn').addEventListener('click', closeModal);
    document.getElementById('confirm-modal').addEventListener('click', (e) => {
        if (e.target === document.getElementById('confirm-modal')) {
            closeModal();
        }
    });
    document.getElementById('modal-confirm-btn').addEventListener('click', () => {
        if (pendingAction) {
            pendingAction();
            closeModal();
        }
    });
}

// Add Patient Action
function handleAddPatient() {
    const nameInput = document.getElementById('patient-name');
    const dateInput = document.getElementById('entry-date');
    const chargesInput = document.getElementById('entry-charges');

    const name = nameInput.value.trim();
    const date = dateInput.value;
    const chargesVal = chargesInput.value;

    if (!name || !date || !chargesVal) {
        showToast('Please fill out all fields.', 'danger');
        return;
    }

    const charges = parseFloat(chargesVal);
    if (isNaN(charges) || charges < 0) {
        showToast('Please enter a valid charge amount.', 'danger');
        return;
    }

    const patientId = Date.now().toString();
    const nextDailyIndex = dailyPatients.length + 1;
    const initialSyncStatus = googleSheetUrl ? 'pending' : 'local';

    // Create records
    const dailyRecord = {
        id: patientId,
        dailyIndex: nextDailyIndex,
        name: name,
        date: date,
        charges: charges
    };

    const ledgerRecord = {
        id: patientId,
        dailyIndex: nextDailyIndex,
        name: name,
        date: date,
        charges: charges,
        split70: charges * 0.70,
        split30: charges * 0.30,
        syncStatus: initialSyncStatus
    };

    // Add to daily list
    dailyPatients.push(dailyRecord);

    // Add to all-time database
    allPatients.push(ledgerRecord);

    // Save
    saveState();

    // Reset Form Input
    nameInput.value = '';
    chargesInput.value = '';
    dateInput.value = getTodayLocalDateString();
    document.getElementById('count-preview').classList.remove('visible');

    // Trigger google sheets sync in background if URL is active
    if (googleSheetUrl) {
        syncRecordToGoogleSheet(patientId);
    }

    // Re-render
    renderAll();

    showToast(`Patient "${name}" added successfully!`, 'success');
}

// Push a single record to Google Sheets
function syncRecordToGoogleSheet(patientId) {
    const record = allPatients.find(p => p.id === patientId);
    if (!record || !googleSheetUrl) return;

    fetch(googleSheetUrl, {
        method: 'POST',
        mode: 'no-cors', // Omit CORS checks on redirects
        body: JSON.stringify(record),
        headers: { 'Content-Type': 'text/plain' }
    })
    .then(() => {
        // Mark as synced on successful post response
        updateRecordSyncStatus(patientId, 'synced');
    })
    .catch(err => {
        console.error("Sync error:", err);
        updateRecordSyncStatus(patientId, 'pending');
    });
}

// Update Sync Status for a specific record
function updateRecordSyncStatus(id, newStatus) {
    const record = allPatients.find(p => p.id === id);
    if (record) {
        record.syncStatus = newStatus;
        saveState();
        renderAll();
    }
}

// Sync all pending records
function syncAllPending() {
    if (!googleSheetUrl) {
        showToast('Please configure a Google Sheet connection first.', 'danger');
        return;
    }

    const pending = allPatients.filter(p => p.syncStatus === 'pending');
    if (pending.length === 0) return;

    showToast(`Syncing ${pending.length} pending record(s) to Google Sheets...`, 'info');

    let syncCompletedCount = 0;

    pending.forEach(p => {
        fetch(googleSheetUrl, {
            method: 'POST',
            mode: 'no-cors',
            body: JSON.stringify(p),
            headers: { 'Content-Type': 'text/plain' }
        })
        .then(() => {
            p.syncStatus = 'synced';
            syncCompletedCount++;
            if (syncCompletedCount === pending.length) {
                saveState();
                renderAll();
                showToast('All pending records synced successfully!', 'success');
            }
        })
        .catch(err => {
            console.error("Batch sync error for ID " + p.id + ":", err);
        });
    });
}

// Delete Patient Action
function handleDeletePatient(patientId, isFromLedger = false) {
    const listToSearch = isFromLedger ? allPatients : dailyPatients;
    const recordObj = listToSearch.find(p => p.id === patientId);

    if (!recordObj) return;

    openModal(
        'Delete Patient Record?',
        `Are you sure you want to delete the record for "${recordObj.name}"? This will remove it from both the Daily Log and All-Time Ledger permanently.`,
        () => {
            const dateToReindex = recordObj.date;

            // Remove from daily list
            dailyPatients = dailyPatients.filter(p => p.id !== patientId);
            // Remove from all-time ledger
            allPatients = allPatients.filter(p => p.id !== patientId);

            // Reindex daily lists for that date to keep indices sequential
            reindexDailyLog();
            reindexLedgerForDate(dateToReindex);

            saveState();
            renderAll();
            showToast('Patient record deleted and indices updated.', 'info');
        }
    );
}

// Reindex the current day's log
function reindexDailyLog() {
    dailyPatients.forEach((p, index) => {
        p.dailyIndex = index + 1;
    });
}

// Reindex archive entries for a specific date so they stay correct (1, 2, 3...)
function reindexLedgerForDate(dateStr) {
    const dayEntries = allPatients.filter(p => p.date === dateStr);
    dayEntries.sort((a, b) => a.id.localeCompare(b.id));
    dayEntries.forEach((p, index) => {
        p.dailyIndex = index + 1;
    });
}

// Render everything
function renderAll() {
    renderDailyTable();
    renderDailyStats();
    renderLedgerTable();
    renderLedgerStats();
    updateAutocompleteSource();
    updateSyncIndicator();
}

// Populate Autocomplete past-patients-list dynamically
function updateAutocompleteSource() {
    const datalist = document.getElementById('past-patients-list');
    datalist.innerHTML = '';
    
    // Find unique names from all patients
    const names = allPatients.map(p => p.name);
    const uniqueNames = [...new Set(names)].sort();

    uniqueNames.forEach(name => {
        const option = document.createElement('option');
        option.value = name;
        datalist.appendChild(option);
    });
}

// Update settings-related buttons and counts on Sheet 2
function updateSyncIndicator() {
    const pending = allPatients.filter(p => p.syncStatus === 'pending');
    const syncAllBtn = document.getElementById('sync-all-btn');
    
    if (googleSheetUrl && pending.length > 0) {
        syncAllBtn.style.display = 'inline-flex';
        document.getElementById('pending-sync-count').textContent = pending.length;
    } else {
        syncAllBtn.style.display = 'none';
    }
}

// Render Sheet 1 Stats
function renderDailyStats() {
    const todayCount = dailyPatients.length;
    const todayTotal = dailyPatients.reduce((sum, p) => sum + p.charges, 0);
    const todayShare30 = todayTotal * 0.30;

    document.getElementById('today-count').textContent = todayCount;
    document.getElementById('today-charges').textContent = formatCurrency(todayTotal);
    document.getElementById('today-split-30').textContent = formatCurrency(todayShare30);
}

// Render Sheet 1 Table
function renderDailyTable() {
    const tbody = document.getElementById('daily-table-body');
    const emptyState = document.getElementById('daily-empty-state');
    tbody.innerHTML = '';

    if (dailyPatients.length === 0) {
        emptyState.style.display = 'block';
        return;
    }

    emptyState.style.display = 'none';

    dailyPatients.forEach(p => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><span class="patient-badge">#${p.dailyIndex}</span></td>
            <td style="font-weight: 500;">${escapeHtml(p.name)}</td>
            <td>${formatDateDisplay(p.date)}</td>
            <td class="charge-text" style="text-align: right;">${formatCurrency(p.charges)}</td>
            <td style="text-align: right;">
                <button class="delete-row-btn" data-id="${p.id}" style="background: none; border: none; color: var(--danger); cursor: pointer; padding: 0.25rem;">
                    <i data-lucide="trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    // Initialize delete icon buttons
    tbody.querySelectorAll('.delete-row-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            handleDeletePatient(id, false);
        });
    });

    if (window.lucide) {
        window.lucide.createIcons();
    }
}

// Render Sheet 2 Stats
function renderLedgerStats() {
    const totalCount = allPatients.length;
    const grossTotal = allPatients.reduce((sum, p) => sum + p.charges, 0);
    const total70 = allPatients.reduce((sum, p) => sum + p.split70, 0);
    const total30 = allPatients.reduce((sum, p) => sum + p.split30, 0);

    document.getElementById('ledger-total-count').textContent = totalCount;
    document.getElementById('ledger-gross').textContent = formatCurrency(grossTotal);
    document.getElementById('ledger-share-70').textContent = formatCurrency(total70);
    document.getElementById('ledger-share-30').textContent = formatCurrency(total30);
}

// Render Sheet 2 Table with Filters
function renderLedgerTable() {
    const tbody = document.getElementById('ledger-table-body');
    const emptyState = document.getElementById('ledger-empty-state');
    tbody.innerHTML = '';

    const searchQuery = document.getElementById('search-input').value.toLowerCase().trim();
    const startDate = document.getElementById('filter-start-date').value;
    const endDate = document.getElementById('filter-end-date').value;

    // Filter patients list
    const filteredPatients = allPatients.filter(p => {
        // Name Search Match
        const matchesSearch = p.name.toLowerCase().includes(searchQuery);

        // Date range match
        let matchesStartDate = true;
        if (startDate) {
            matchesStartDate = p.date >= startDate;
        }

        let matchesEndDate = true;
        if (endDate) {
            matchesEndDate = p.date <= endDate;
        }

        return matchesSearch && matchesStartDate && matchesEndDate;
    });

    // Sort by date (descending, newer first), then by daily index (descending)
    filteredPatients.sort((a, b) => {
        if (a.date !== b.date) {
            return b.date.localeCompare(a.date);
        }
        return b.dailyIndex - a.dailyIndex;
    });

    if (filteredPatients.length === 0) {
        emptyState.style.display = 'block';
        return;
    }

    emptyState.style.display = 'none';

    filteredPatients.forEach(p => {
        const tr = document.createElement('tr');
        
        let syncBadgeHtml = '<span class="sync-badge local">Local</span>';
        if (p.syncStatus === 'synced') {
            syncBadgeHtml = '<span class="sync-badge synced"><i data-lucide="cloud-check" style="width:14px;height:14px;"></i> Synced</span>';
        } else if (p.syncStatus === 'pending') {
            syncBadgeHtml = '<span class="sync-badge pending" title="Click to retry syncing"><i data-lucide="alert-circle" style="width:14px;height:14px;"></i> Pending</span>';
        }

        tr.innerHTML = `
            <td><span class="patient-badge">#${p.dailyIndex}</span></td>
            <td style="font-weight: 500;">${escapeHtml(p.name)}</td>
            <td>${formatDateDisplay(p.date)}</td>
            <td class="charge-text" style="text-align: right;">${formatCurrency(p.charges)}</td>
            <td class="charge-text" style="text-align: right; color: var(--success); font-weight: 500;">${formatCurrency(p.split30)}</td>
            <td class="charge-text" style="text-align: right; color: var(--text-muted);">${formatCurrency(p.split70)}</td>
            <td style="text-align: center;">${syncBadgeHtml}</td>
            <td style="text-align: right;">
                <button class="delete-ledger-row-btn" data-id="${p.id}" style="background: none; border: none; color: var(--danger); cursor: pointer; padding: 0.25rem;">
                    <i data-lucide="trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    // Initialize delete icon buttons
    tbody.querySelectorAll('.delete-ledger-row-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            handleDeletePatient(id, true);
        });
    });

    // Initialize individual pending sync badge retries
    tbody.querySelectorAll('.sync-badge.pending').forEach(badge => {
        badge.addEventListener('click', (e) => {
            const rowId = badge.closest('tr').querySelector('.delete-ledger-row-btn').getAttribute('data-id');
            syncRecordToGoogleSheet(rowId);
        });
    });

    if (window.lucide) {
        window.lucide.createIcons();
    }
}

// Export ledger to CSV format
function exportLedgerToCSV() {
    if (allPatients.length === 0) {
        showToast('No records available to export.', 'danger');
        return;
    }

    // CSV Headers
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Serial No.,Patient Name,Date,Gross Charges (Rs.),Doctor Share 30% (Rs.),Hospital Share 70% (Rs.),Sync Status\r\n";

    // Sort all records chronologically before export
    const sorted = [...allPatients].sort((a, b) => {
        if (a.date !== b.date) return a.date.localeCompare(b.date);
        return a.dailyIndex - b.dailyIndex;
    });

    // CSV Rows
    sorted.forEach(p => {
        const row = [
            `#${p.dailyIndex}`,
            `"${p.name.replace(/"/g, '""')}"`, // escape quotes
            p.date,
            p.charges.toFixed(2),
            p.split30.toFixed(2),
            p.split70.toFixed(2),
            p.syncStatus || 'local'
        ].join(",");
        csvContent += row + "\r\n";
    });

    // Trigger Download
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    const todayStr = getTodayLocalDateString();
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Doctor_Ledger_Export_${todayStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('CSV file downloaded successfully!', 'success');
}

// Modal Utilities
function openModal(title, desc, confirmCallback) {
    document.getElementById('modal-title-text').textContent = title;
    document.getElementById('modal-desc-text').textContent = desc;
    document.getElementById('confirm-modal').classList.add('active');
    pendingAction = confirmCallback;
}

// Close Modal helper
function closeModal() {
    document.getElementById('confirm-modal').classList.remove('active');
    pendingAction = null;
}

// Toast System
function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    let iconName = 'check-circle';
    if (type === 'danger') iconName = 'alert-triangle';
    if (type === 'info') iconName = 'info';

    toast.innerHTML = `
        <i data-lucide="${iconName}"></i>
        <div class="toast-message">${escapeHtml(message)}</div>
    `;

    container.appendChild(toast);

    if (window.lucide) {
        window.lucide.createIcons();
    }

    // Auto remove after 4 seconds
    setTimeout(() => {
        toast.style.animation = 'slideIn 0.3s reverse';
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 4000);
}

// HTML escaping helper to prevent XSS
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.toString().replace(/[&<>"']/g, function(m) { return map[m]; });
}
