/**
 * Lamsa Glow — Orders webhook (Google Apps Script Web App)
 * ---------------------------------------------------------
 * Receives orders from the FastAPI backend and appends ONE row per order.
 *
 * Sheet columns (must match backend build_sheet_payload + your CSV):
 *   date, order, country, name, phone, product, sku, quantity, totalprice, currency, status
 *
 * Example row:
 *   01/05/2026 | nama-20260501-a1b2 | KSA | Sara | 966504752333 |
 *   لمسة كيراتين كولاجين/لمسة عطر الشعر | LAM-7K4M92/LAM-3N8P41 | 1/2 | 329 | SAR | (empty)
 *
 * SETUP
 * 1) Open your Google Sheet (Orders Lamsa Store). Use tab "Feuille 1" or rename SHEET_NAME below.
 * 2) Put this header in row 1 (exact order):
 *      date,order,country,name,phone,product,sku,quantity,totalprice,currency,status
 *    Or run setupHeader() once from the Apps Script editor.
 * 3) Extensions → Apps Script → paste this entire file.
 * 4) Set SHARED_SECRET below = backend env SHEET_SHARED_SECRET (same string).
 * 5) Deploy → New deployment → Web app
 *      Execute as: Me
 *      Who has access: Anyone
 * 6) Copy the /exec URL → EasyPanel backend env:
 *      GOOGLE_SHEET_WEBHOOK_URL=https://script.google.com/macros/s/XXXX/exec
 *      SHEET_SHARED_SECRET=<same as SHARED_SECRET below>
 * 7) Redeploy backend after saving env vars.
 *
 * After edits: Deploy → Manage deployments → Edit (pencil) → New version → Deploy.
 */

var SHARED_SECRET = 'CHANGE_ME_MATCHES_BACKEND'; // = backend SHEET_SHARED_SECRET

// Your CSV tab is "Feuille 1". Change if you rename the sheet tab.
// Leave empty ('') to always use the first tab.
var SHEET_NAME = 'Feuille 1';

var HEADERS = [
  'date',
  'order',
  'country',
  'name',
  'phone',
  'product',
  'sku',
  'quantity',
  'totalprice',
  'currency',
  'status'
];

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = null;
  if (SHEET_NAME) {
    sh = ss.getSheetByName(SHEET_NAME);
  }
  if (!sh) {
    sh = ss.getSheets()[0];
  }
  if (sh.getLastRow() === 0) {
    sh.appendRow(HEADERS);
    sh.setFrozenRows(1);
  }
  return sh;
}

/** Run once from the editor to write / reset the header row. */
function setupHeader() {
  var sh = getSheet_();
  sh.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
  sh.setFrozenRows(1);
}

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return json_({ ok: false, error: 'no body' });
    }
    var body = JSON.parse(e.postData.contents);

    if (!body.secret || body.secret !== SHARED_SECRET) {
      return json_({ ok: false, error: 'unauthorized' });
    }

    var o = body.order || {};
    var sh = getSheet_();

    // Idempotency: skip if this order id already exists (column B = order).
    if (o.order) {
      var lastRow = sh.getLastRow();
      if (lastRow > 1) {
        var existing = sh.getRange(2, 2, lastRow - 1, 1).getValues();
        for (var i = 0; i < existing.length; i++) {
          if (String(existing[i][0]) === String(o.order)) {
            return json_({ ok: true, duplicate: true });
          }
        }
      }
    }

    var row = [
      o.date || '',
      o.order || '',
      o.country || 'KSA',
      o.name || '',
      o.phone || '',
      o.product || '',
      o.sku || '',
      o.quantity || '',
      o.totalprice != null ? o.totalprice : '',
      o.currency || 'SAR',
      o.status || '' // left empty for the confirmation team
    ];

    sh.appendRow(row);
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

function doGet() {
  return json_({ ok: true, service: 'lamsa-glow-orders', columns: HEADERS });
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
