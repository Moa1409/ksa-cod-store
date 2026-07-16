/**
 * Lamsa Glow — Orders webhook (Google Apps Script Web App)
 * ---------------------------------------------------------
 * Receives orders from the FastAPI backend and appends one row per order.
 *
 * Sheet columns (must match backend build_sheet_payload):
 *   date, order, country, name, phone, product, sku, quantity, totalprice, currency, status
 *
 * SETUP
 * 1) Create a Google Sheet with a tab named "Orders" (or change SHEET_NAME).
 * 2) Extensions -> Apps Script -> paste this file.
 * 3) Set SHARED_SECRET below = backend env SHEET_SHARED_SECRET.
 * 4) Deploy -> New deployment -> Web app
 *      Execute as: Me
 *      Who has access: Anyone
 *    Copy the /exec URL -> backend GOOGLE_SHEET_WEBHOOK_URL on EasyPanel.
 * 5) (Optional) Run setupHeader() once to write the header row.
 */

var SHARED_SECRET = 'CHANGE_ME_MATCHES_BACKEND'; // = backend SHEET_SHARED_SECRET
var SHEET_NAME = 'Orders';

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
  var sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME);
  }
  if (sh.getLastRow() === 0) {
    sh.appendRow(HEADERS);
    sh.setFrozenRows(1);
  }
  return sh;
}

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

    // Idempotency: skip if this order id already exists (column B).
    if (o.order) {
      var lastRow = sh.getLastRow();
      if (lastRow > 1) {
        var existing = sh.getRange(2, 2, lastRow - 1, 1).getValues();
        for (var i = 0; i < existing.length; i++) {
          if (existing[i][0] === o.order) {
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
      o.totalprice || 0,
      o.currency || 'SAR',
      o.status || ''
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
