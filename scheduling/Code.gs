// ═══════════════════════════════════════════════════════════════
// Coach Scheduler — Apps Script Web App
// Setup:
//   1. Go to script.google.com → New Project (bound to a Google Sheet)
//   2. Paste this as Code.gs
//   3. Create a new file → HTML → name it "Page" → paste scheduling/index.html
//   4. Deploy → New Deployment → Web App
//      Execute as: Me | Access: Anyone
//   5. Copy the Web App URL and update the portal (index.html in rippner-workspace)
// ═══════════════════════════════════════════════════════════════

const SHEET_NAME = 'ScheduleData';

function doGet() {
  return HtmlService.createHtmlOutputFromFile('Page')
    .setTitle('Coach Scheduler — Rippner Tennis')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(['key', 'morning', 'evening', 'updatedAt']);
    sheet.setFrozenRows(1);
    sheet.setColumnWidth(1, 100);
    sheet.setColumnWidth(2, 80);
    sheet.setColumnWidth(3, 80);
    sheet.setColumnWidth(4, 160);
  }
  return sheet;
}

// Returns all stored shifts as { key: { morning, evening } }
function getScheduleData() {
  const sheet = getSheet();
  const rows = sheet.getDataRange().getValues();
  const data = {};
  for (let i = 1; i < rows.length; i++) {
    const [key, morning, evening] = rows[i];
    if (key) {
      data[key] = {
        morning: morning === '' || morning === 'null' ? null : String(morning),
        evening: evening === '' || evening === 'null' ? null : String(evening),
      };
    }
  }
  return data;
}

// Saves or updates a single shift
function saveShift(key, morning, evening) {
  const sheet = getSheet();
  const rows = sheet.getDataRange().getValues();
  const now = new Date().toISOString();
  const m = morning || '';
  const e = evening || '';

  for (let i = 1; i < rows.length; i++) {
    if (rows[i][0] === key) {
      const row = i + 1;
      sheet.getRange(row, 2).setValue(m);
      sheet.getRange(row, 3).setValue(e);
      sheet.getRange(row, 4).setValue(now);
      return { ok: true };
    }
  }

  sheet.appendRow([key, m, e, now]);
  return { ok: true };
}
