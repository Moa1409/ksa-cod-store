/**
 * Lamsa Glow — Orders webhook (paste into the SAME Google Sheet via Extensions → Apps Script)
 *
 * SETUP
 * 1) Open your Orders sheet → copy the ID from the URL:
 *    https://docs.google.com/spreadsheets/d/PASTE_THIS_ID/edit
 * 2) Paste that ID into SPREADSHEET_ID below.
 * 3) Leave SHARED_SECRET empty (unless you also set SHEET_SHARED_SECRET on backend).
 * 4) Deploy → New deployment → Web app
 *      Execute as: Me
 *      Who has access: Anyone
 * 5) Copy /exec URL → backend GOOGLE_SHEET_WEBHOOK_URL → redeploy backend.
 * 6) After ANY script edit: Manage deployments → Edit → New version → Deploy.
 *
 * Test: open the /exec URL in a browser — you should see {"ok":true,"service":"lamsa-glow-orders",...}
 */

// REQUIRED — from your sheet URL between /d/ and /edit
var SPREADSHEET_ID = 'PASTE_YOUR_SPREADSHEET_ID_HERE';

// Optional auth. Leave '' unless backend has SHEET_SHARED_SECRET set to the same value.
var SHARED_SECRET = '';

// Leave '' to use the first tab.
var SHEET_NAME = '';

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

function getSpreadsheet_() {
  if (!SPREADSHEET_ID || SPREADSHEET_ID.indexOf('PASTE_') === 0) {
    var active = SpreadsheetApp.getActiveSpreadsheet();
    if (active) return active;
    throw new Error('Set SPREADSHEET_ID in the script (from the sheet URL).');
  }
  return SpreadsheetApp.openById(SPREADSHEET_ID);
}

function getSheet_() {
  var ss = getSpreadsheet_();
  var sh = SHEET_NAME ? ss.getSheetByName(SHEET_NAME) : null;
  if (!sh) sh = ss.getSheets()[0];
  if (!sh) throw new Error('No sheet tab found');
  if (sh.getLastRow() === 0) {
    sh.appendRow(HEADERS);
    sh.setFrozenRows(1);
  }
  return sh;
}

/** Run once from the editor (Run ▶ setupHeader) to write the header row. */
function setupHeader() {
  var sh = getSheet_();
  sh.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
  sh.setFrozenRows(1);
}

/** Run once from the editor to verify write access — adds a test row. */
function testAppendRow() {
  var sh = getSheet_();
  sh.appendRow([
    Utilities.formatDate(new Date(), 'Asia/Riyadh', 'dd/MM/yyyy'),
    'lamsa-TEST-' + Date.now(),
    'KSA',
    'Apps Script Test',
    '966550000000',
    'TEST PRODUCT',
    'TEST-SKU',
    '1',
    1,
    'SAR',
    ''
  ]);
}

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return json_({ ok: false, error: 'no body' });
    }
    var body = JSON.parse(e.postData.contents);

    if (SHARED_SECRET) {
      if (!body.secret || body.secret !== SHARED_SECRET) {
        return json_({ ok: false, error: 'unauthorized' });
      }
    }

    var o = body.order || {};
    var sh = getSheet_();

    if (o.order) {
      var lastRow = sh.getLastRow();
      if (lastRow > 1) {
        var existing = sh.getRange(2, 2, lastRow, 2).getValues();
        for (var i = 0; i < existing.length; i++) {
          if (String(existing[i][0]) === String(o.order)) {
            return json_({ ok: true, duplicate: true });
          }
        }
      }
    }

    sh.appendRow([
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
      o.status || ''
    ]);

    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

function doGet() {
  try {
    var sh = getSheet_();
    return json_({
      ok: true,
      service: 'lamsa-glow-orders',
      sheet: sh.getName(),
      spreadsheet: getSpreadsheet_().getName(),
      columns: HEADERS
    });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
