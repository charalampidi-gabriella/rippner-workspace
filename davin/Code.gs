// ═══════════════════════════════════════════════════════════════
// Davin Branch Manager Tracker — Apps Script Web App
// Setup:
//   1. Paste this as Code.gs
//   2. Paste the HTML as Page.html
//   3. Deploy → New Deployment → Web App
//      Execute as: Me | Access: Anyone
//   4. Share the Web App URL with your team
// ═══════════════════════════════════════════════════════════════

const SHEET_NAME = "TrackerData";

function doGet() {
  return HtmlService.createHtmlOutputFromFile("Page")
    .setTitle("Davin — Branch Manager Progress")
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(["key", "status", "note", "updatedAt"]);
    sheet.setFrozenRows(1);
    sheet.setColumnWidth(1, 120);
    sheet.setColumnWidth(3, 400);
  }
  return sheet;
}

function getAllData() {
  const sheet = getSheet();
  const rows = sheet.getDataRange().getValues();
  const data = {};
  for (let i = 1; i < rows.length; i++) {
    const [key, status, note, updatedAt] = rows[i];
    if (key) data[key] = { status: String(status), note: note || "", updatedAt: updatedAt || "" };
  }
  return data;
}

function deleteItem(key) {
  const sheet = getSheet();
  const rows = sheet.getDataRange().getValues();
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][0] === key) {
      sheet.deleteRow(i + 1);
      return { ok: true };
    }
  }
  return { ok: false, error: "Key not found" };
}

function saveItem(key, status, note) {
  const sheet = getSheet();
  const rows = sheet.getDataRange().getValues();
  const now = new Date().toISOString();

  for (let i = 1; i < rows.length; i++) {
    if (rows[i][0] === key) {
      const row = i + 1;
      if (status !== undefined && status !== null) sheet.getRange(row, 2).setValue(status);
      if (note !== undefined && note !== null) sheet.getRange(row, 3).setValue(note);
      sheet.getRange(row, 4).setValue(now);
      return { ok: true, updatedAt: now };
    }
  }

  sheet.appendRow([key, status || "0", note || "", now]);
  return { ok: true, updatedAt: now };
}
