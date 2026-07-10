/**
 * Lamsa Glow — Orders webhook (Google Apps Script Web App)
 * ---------------------------------------------------------
 * Receives orders from the FastAPI backend and appends one row per order
 * to the "Orders" sheet.
 *
 * SETUP
 * 1) Create a Google Sheet named "Lamsa Glow — Orders" with a tab "Orders".
 * 2) Extensions -> Apps Script -> paste this file.
 * 3) Set SHARED_SECRET below to the SAME value as backend env SHEET_SHARED_SECRET.
 * 4) Deploy -> New deployment -> Web app -> Execute as: Me,
 *    Who has access: Anyone -> copy the /exec URL.
 * 5) Put that URL in backend env GOOGLE_SHEET_WEBHOOK_URL.
 * 6) (Optional) Run setupHeader() once to write the header row.
 */

var SHARED_SECRET = 'CHANGE_ME_MATCHES_BACKEND'; // must equal backend SHEET_SHARED_SECRET
var SHEET_NAME = 'Orders';

var HEADERS = [
  'timestamp', 'order_number', 'status', 'customer_name', 'phone', 'phone_e164',
  'items_summary', 'items_json', 'num_items', 'bundle_subtotal',
  'upsell_taken', 'upsell_slug', 'upsell_price', 'total', 'currency',
  'city', 'event_id', 'utm_source', 'utm_campaign', 'landing_url', 'notes'
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

    // Idempotency: skip if this order_number already exists.
    if (o.order_number) {
      var existing = sh.getRange(2, 2, Math.max(sh.getLastRow() - 1, 1), 1).getValues();
      for (var i = 0; i < existing.length; i++) {
        if (existing[i][0] === o.order_number) {
          return json_({ ok: true, duplicate: true });
        }
      }
    }

    var row = [
      o.timestamp || new Date().toISOString(),
      o.order_number || '',
      o.status || 'new',
      o.customer_name || '',
      o.phone || '',
      o.phone_e164 || '',
      o.items_summary || '',
      o.items_json || '',
      o.num_items || 0,
      o.bundle_subtotal || 0,
      o.upsell_taken ? 'yes' : 'no',
      o.upsell_slug || '',
      o.upsell_price || '',
      o.total || 0,
      o.currency || 'SAR',
      o.city || '',
      o.event_id || '',
      o.utm_source || '',
      o.utm_campaign || '',
      o.landing_url || '',
      o.notes || ''
    ];

    sh.appendRow(row);
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

function doGet() {
  // Health check for the web app URL.
  return json_({ ok: true, service: 'lamsa-glow-orders' });
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
