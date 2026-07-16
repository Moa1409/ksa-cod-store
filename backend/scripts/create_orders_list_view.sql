-- Simple order list for pgweb: order #, phone, city, what they ordered.
-- Run once in pgweb Query tab. Then open "orders_list" in the sidebar.

CREATE OR REPLACE VIEW orders_list AS
SELECT
    o.order_number AS order_number,
    o.phone AS phone,
    COALESCE(NULLIF(TRIM(o.city), ''), '—') AS city,
    COALESCE(
        (
            SELECT string_agg(oi.name || ' ×' || oi.qty::text, '، ' ORDER BY oi.sort_order)
            FROM order_items oi
            WHERE oi.order_id = o.id
        ),
        (
            SELECT string_agg(
                COALESCE(elem->>'name', elem->>'slug') || ' ×' || COALESCE(elem->>'qty', '1'),
                '، '
            )
            FROM jsonb_array_elements(o.items) AS elem
        ),
        '—'
    ) AS ordered_items,
    o.created_at AS ordered_at
FROM orders o;
