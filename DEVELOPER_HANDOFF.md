# PP Flowers catalogue handoff

This is an interaction prototype using mock data. The real catalogue contains **more than 4,000 products**, according to the product owner. The current 48 products include 28 flower products with 192 offers and 12 plant products with 75 offers. These counts, the eight flower categories and four plant categories are fixtures, not production limits or a real assortment. Prices, stock, growers attached to products, lead times and images are illustrative. Some fixture products have no photograph.

## Intended buying experience

Find Flowers presents one horizontal row per flower category: all rose offers in Roses, all tulip offers in Tulips, and similarly for the other categories. Find Plants uses the same interaction, grouped into Orchids, Flowering plants, Green plants and Succulents. Buyers move vertically between categories and horizontally through a category. Desktop is the design priority: five complete cards on a laptop and six on a wider desktop, with arrow controls, trackpad scrolling and keyboard support. Cards must remain readable instead of shrinking indefinitely as the catalogue grows.

Each card represents **one purchasable grower offer**, not an aggregate price for a variety. Different growers of the same flower appear as separate cards with their own length, grade, origin, price, availability and quantity. Photos and Details are two presentations of the same matching offers. Favourite and repeat-order views retain their separate contextual layouts in this prototype.

Both views retain product name, grower, colour, stem length or plant height, plant pot diameter, quality, unit price, departure eligibility, quantity, order multiple/minimum, line total and comparison/add actions. Favourites belong to the product; quantity and basket lines belong to the offer. Opening comparison must preselect that exact offer and carry its quantity. Returning to the catalogue restores the row position and edited quantities.

## Product and offer identity

Production needs separate, stable IDs supplied by the backend:

- **Category ID:** a merchandising category from the production taxonomy. The row list/order comes from that taxonomy, not the prototype's hardcoded flower or plant groups. The fixture keeps the broad plants scope separate from its plantGroup merchandising category.
- **Product ID:** the product/variety identity used for product information, photos, colour, grouping and favourites. Agree the precise variant hierarchy with the catalogue owner.
- **Offer ID:** the exact purchasable stock/price proposition. A grower may supply the same product in several lengths, grades, pack sizes, locations or departure windows. Every distinct purchasable offer needs its own ID.

The demo constructs offer IDs from product and grower because its generated fixtures have only one offer per product/grower pair. **Do not adopt that composite as the production uniqueness rule.** Grower names and product names are display labels, not keys. Basket lines must reference the authoritative offer ID and the selected unit quantity.

Store money in integer minor units with an explicit currency; display the price per stem/plant/piece and VAT basis. Quantities are actual units, not bunch counts. Keep minimum quantity, quantity increment and stock limit as separate fields. The line total is unit price multiplied by unit quantity.

## Grouping, filtering and order

The catalogue groups its controls in two places: search, grower, length (height for plants) and departure in the search bar; Filters, category pills and a compact Sort by control directly beneath it. Equal desktop side columns keep the category group centered on the search bar independently of the Filters and Sort by label widths. Filters contains colour and maximum unit price, with no duplicate grower or length fields. Applied criteria can be removed below this strip. The results toolbar contains only Photos/Details. The sorting control remains a native select with custom closed-state styling; its value applies to every matching offer within each category. The overall catalogue heading and totals are available to assistive technology but are not shown visually; category headings and per-row counts remain visible. Category selection applies immediately; search fields apply on search submission. The layout is shared by catalogue scopes; Saved and Buy again retain their own contextual controls.

Search and filters constrain the offers before category rows are assembled. A grower or length/height search must match the same offer displayed on the card; matching the product through one grower and then showing another grower's price is incorrect.

- Search: product/variety plus applicable grower, size and other indexed offer attributes.
- Filters: category, grower, stem length or plant height, product colour and maximum unit price. Plant pot diameter is shown on each card and comparison offer; it is not yet a separate filter.
- Price sorting: sort **every matching offer within its category**, not just the cheapest/base offer of each product.
- Name sorting: product name, then unit price, with stable offer-ID tie breaks in production.
- Featured sorting: show the range of varieties before repeating their other growers, then continue through remaining offers. The mock implementation interleaves the first offer of each variety, then the second, and so on. Production must provide a stable diversity-aware ranking/cursor; avoid random ordering between requests.

Category chips restrict the displayed categories. Global filters apply to all rows. A row's summary distinguishes unique matching products/varieties from matching offer count. Counts must represent the **whole filtered result**, not just loaded cards. A category can have thousands of offers; do not split it into multiple vertical rows or impose a six-offer limit.

Hide an empty category only after its filtered result is confirmed empty. Loading and request failure are separate states, not zero results. Later-departure offers remain visible with their real date and a change-date action, as in this prototype; production stock/availability rules should come from the ordering service.

## Production loading for more than 4,000 products

The prototype filters its entire small fixture array in the browser and mounts all matching offer cards. This demonstrates the interaction only. **Do not send or mount the entire production catalogue or all grower offers at once.** This prototype has not been performance-tested with the real catalogue.

Recommended production flow:

1. Request ordered category summaries for the current search/filter context, including matching product and offer counts.
2. Fetch the first offer page for visible/near-visible categories. Load lower category rows as they approach the viewport.
3. Give each category its own cursor, loaded pages, loading/error state and end-of-results status. Moving Roses must not fetch, reset or advance Tulips.
4. Prefetch the next page as the buyer approaches the end of a row. The next arrow should load/advance to more offers; show loading feedback and disable repeated requests while the page is loading. Disable the forward control permanently only when the service reports no further page.
5. Virtualize long horizontal rows and, where necessary, vertically virtualize categories. Keep a small overscan window rather than thousands of DOM cards. Preserve card widths, accessible labels, focus and logical positions when recycling content.
6. Lazy-load appropriately sized photos, use stable placeholders and provide an honest missing-photo fallback. Do not embed the production image catalogue in one HTML file.
7. Cancel or ignore stale responses when search, filters or sorting change. Cache pages under a key containing category, query, filters, sort and any availability context that changes the results.
8. Restore the visited category's logical offer anchor and edited quantities after comparison. Prefer an offer ID plus offset rather than a fragile raw pixel offset when rows are virtualized or data changes.

A starting page size of roughly two desktop screens (for example, 12–24 offers) is a tuning choice, not a product requirement. Measure with realistic data and buyer hardware. Profile dense categories, many offers from the same grower, long names, missing images and rapid filter changes. Server-side search, aggregation and ordering should use indexed catalogue data.

## Suggested service boundaries (not implemented here)

A category-summary response should provide ordered category IDs/labels, unique product counts and offer counts for a query context. A category-offer response should provide offer records, product display data, a next cursor/end flag and a query/snapshot identity. Stable cursor pagination should use the selected ranking plus an offer-ID tie break, avoiding duplicates and skipped offers as pages are appended.

Each offer record needs authoritative identity, product/category/grower references, unit/currency/price/VAT basis, stem length or plant height, plant pot diameter, grade, origin, minimum/increment/stock and earliest/eligible departure information. Product records supply names, colour and photos. The precise API shape belongs to the production backend team; these are required semantics, not a deployed contract.

The default departure date is tomorrow in the business's configured timezone (the prototype follows the existing next-calendar-day rule, including weekends). “Departure” means dispatch, not carrier arrival. Production must reconcile that default with actual dispatch calendars and cutoffs without promising an arrival date.

Adding or changing a basket line and checkout must revalidate current price, offer identity, quantity multiple, stock and departure eligibility on the server. Explain changed prices or stock and request review rather than silently switching growers. Browser storage and generated availability in this demo are not authoritative production order infrastructure.

## Implemented in this prototype

- Shared horizontal row component, independent controls and Photos/Details cards.
- One category row containing each matching fixture offer exactly once.
- Variety-first featured ordering; complete per-offer price/name sorting.
- Combined search/filter matching on the exact offer.
- Offer-specific quantities, comparison selection and return-position restoration.
- Existing basket rules and saved-product behaviour retained.

Not implemented: live catalogue ingestion, production taxonomy service, server search/counts/cursors, incremental network loading, virtualization, production stock reservation, or real ordering/payment services. The source is a behavioural reference, not a production-scale backend design delivered as working software.

## Plant fixtures and illustrative images

Find Plants contains 12 mock products in four groups. Nine additional varieties include pink Phalaenopsis, Anthurium, Spathiphyllum, Begonia, Monstera, Ficus, Zamioculcas, Calathea and Aloe. Each new variety has six offer fixtures from explicitly fictional Demo-named nurseries. Existing plant offer IDs are retained to preserve existing baskets and saved orders; their supplier associations are still illustrative. Heights, pot diameters, prices, grades, quantities and availability are mock values, not supplier claims.

Ten AI-generated plant photos are stored in `assets/plant-mock/`, covering the nine added varieties and the previously missing succulent photo. `assets/plant-image-prompts.json` records the built-in image-generation mode, prompts, original outputs and final asset paths. Existing white orchid and Kalanchoe photos are retained. Optimized square JPEGs are embedded in the standalone demo build. Replace these illustrative images with verified supplier assets in production; a shared product image is not evidence of an individual grower offer’s exact appearance or size.

Plant cards, comparison and order-line metadata carry height and pot diameter; prices and quantities use individual plants, not stems. The same offer filtering, sorting and independent-row pagination contract applies to plants as to flowers.

## Recommended Best sellers

The Best sellers row is an eight-product mock merchandising fixture in `RF_BESTSELLER_PICKS`, shown first below the Recommended hero. It is not derived from observed PP Flowers sales and contains no fabricated order counts. Each card resolves an in-stock grower offer using the same departure-aware offer selection as the other recommendation rows; comparison and add actions use that exact offer. Product selection/order is separate from offer pricing.

For production, replace the fixture with product IDs and a stable ranking from verified sales data. Agree the ranking window and metric (for example fulfilled order frequency), exclude cancellations/returns as appropriate, and resolve current purchasable offers for the selected departure. Do not infer sales rank from fixture array order or advertised price. Reuse the same independent row loading and stock validation contract described above.

## Row discovery gesture

The shared row offers a one-time swipe hint as an overflowing row enters the viewport. It scrolls a small distance and returns to zero, rather than advancing to another product. Rows already used or restored from comparison are not moved. The hint stops for user input, loss of visibility and reduced-motion changes. While it runs, scroll events must not overwrite the buyer’s saved row position or change arrow state.

The prototype tracks hinted row IDs in memory until page reload. In production, retain the same category identity across pagination and virtualization; appended offer pages and recycled DOM nodes must not replay the gesture. Avoid running it during loading, on a focused row, or for reduced-motion users. It must never replace arrow navigation or take control from a buyer’s gesture.

## Wholesale Buy again worksheet

Buy again has its own compact table and search/sorting controls. It does not reuse the catalogue search masthead, category strip, generic Filters dialog or Photos/Details switch. Columns retain product/thumbnail, grower, size and pot diameter where applicable, quality, colour, previous quantity/date, current unit price, quantity to add, line total and availability. Quantities are actual stems, plants or pieces. Buyers type large quantities directly, use Enter to focus the next quantity cell, select rows and submit one bulk addition. A compact latest-order shortcut opens review; Previous orders exposes earlier orders with current-offer review and order details.

The fixture implementation aggregates purchase history by exact offer ID. The newest order supplies the previous quantity, price and date; duplicate lines within one order are combined, and purchase frequency counts distinct orders. Different growers, sizes or grades remain distinct rows even when the product is the same. Missing offers remain visible and cannot be selected for purchase; an alternatives action opens the appropriate catalogue scope. Do not silently substitute another grower.

Previous quantities are normalized only when current stock/minimum/increment makes the old amount invalid, with an adjustment notice. Valid edited quantities and selection are held in parent state across search, sorting and comparison/back. Invalid raw input stays visible and blocks adding. Select all affects visible available rows. Selections hidden by search remain selected and are explicitly counted with a clear-search action. Current prices and totals use integer cents.

Before bulk addition, validate every selected row's exact offer, quantity minimum/increment/stock and departure eligibility. Include existing basket quantities when calculating remaining stock. If an existing basket line has a different unit price, require review in the basket before adding more of that offer. The local batch either succeeds completely or leaves the basket unchanged; it does not add valid lines while silently skipping invalid ones. Whole-order review separately limits additions to remaining stock and discloses excluded lines, changed prices and quantity adjustments. Basket review still reconciles any current-offer changes before checkout.

For production, query and paginate purchase history and purchased-offer summaries on the server. Do not download or mount a buyer's entire history. Return current purchasable offers alongside historical quantity/price/date and purchase frequency, using stable offer IDs and deterministic pagination. Preserve edits and selections by offer ID across pages, sorting and filtering, and show the full selected count/subtotal even for unloaded or filtered rows. Provide loading, empty, unavailable and failure states separately. Large histories need a bounded rendered table window while preserving logical keyboard focus and row selection.

The ordering backend must revalidate current price, stock, departure and quantity rules atomically when adding the batch. Agree all-or-nothing semantics and surface changed rows for review rather than committing a partial batch. Browser fixture checks and localStorage are not inventory reservation or a production transaction service.

Validation for this update: 52 automated tests pass, including large merged quantities, persistence, exact-offer identity, unavailable offers, plant units, price changes and whole-order remaining stock. Desktop browser checks at 1864 × 984 cover editing, Enter navigation, selection/search, invalid quantities, stock warnings, order review and comparison return. The Add action was exercised through model tests rather than submitted in the user's browser. A separate browser test-account setup was abandoned after automatic approval review rejected its possible overwrite of saved basket data. The user's existing basket and order history remain unchanged. Narrower widths were not reverified in this pass.

## Developer acceptance scenarios

- With 4,000+ products and realistic grower multiplicity, initial page/DOM/network cost remains bounded; only near-visible rows and a limited card window are loaded.
- A dense rose category pages through all matching offers with no duplicates, gaps or mixing with other categories.
- Two offers for the same product and grower but different size/grade can coexist, have independent quantities and add the exact intended offer.
- Combined grower/length/colour/price search returns the matching offer's specifications and price.
- Filter changes during a pending request cannot append stale results.
- Row counts include unloaded results; empty, loading, failed and exhausted states are distinguishable.
- Comparison/back preserves the offer anchor and quantity, and does not move another category row.
- Keyboard focus survives paging/virtualization; arrows stop at the true end; reduced-motion preferences are respected.
- Existing baskets and saved orders survive navigation; checkout revalidates price, stock and departure.

Additional reorder acceptance scenarios: large unit quantities remain editable without repeated stepper clicks; exact grower/size/grade rows stay separate; filtered selections are visible in the summary; an invalid row prevents a partial batch; existing basket stock is included; price changes require review; keyboard focus and edited quantities survive paging and comparison.

## Display-only bulk purchase fixture

`sampleBulkPurchase` supplies the optional `sampleOrder` prop to Buy again in this prototype. It creates 24 exact offer lines across 22 products and 20 growers, using 16,540 stems plus 268 plants (€6,011.16 excluding VAT with the current catalogue fixtures). Requested example quantities are normalized to current fixture minimums, increments and stock. Two varieties have alternate growers to demonstrate distinct offer rows. The purchase date is yesterday in the browser's local calendar, and the ID is stable (`SAMPLE-BULK-24`). The strip and previous-orders list explicitly label this as a sample bulk order.

This sample is combined with account orders only for the Buy again presentation; it is not persisted into `state.orders`, My orders or billing, and it does not seed or replace browser storage. Reviewing it uses the same current-offer and existing-basket stock checks as a previous order. Only an explicit Add action can put selected current offers into the basket. Production should omit the `sampleOrder` prop and use the authenticated purchase-history service; the real empty-history state remains available when there are neither purchases nor a sample prop.

The table body now scrolls within a bounded viewport with sticky column headings. Its selected-line count, subtotal and bulk action sit below that viewport. This is a small 24-line fixture for visual review, not a substitute for the paged/virtualized production history described above. Browser verification covered all 24 selected rows, the final plant rows, sticky headings and the 24-line review. Basket additions were not submitted during this check.

## Seasonal, quality and saved recommendation rows

Recommended now places three further rows after Best sellers: In season now · {month}, Highest quality, and Favourites with the Saved by you eyebrow. The shared row/card interaction preserves exact offer identity, prices, labelled size/grade/colour, departure, comparison and buying controls; overflowing rows retain navigation and the discovery gesture.

`marketMonth` uses the Europe/Amsterdam business timezone. The page checks for a new month every minute and on visibility changes; both the title and `RF_SEASONAL_EDITS` product list change together. The small monthly mapping is editorial mock merchandising for a northern-European audience, with foliage/arrangement companions as well as seasonal flowers. It is not live local-harvest evidence or a guarantee of supplier stock. Sources and interpretation are in MARKET_RESEARCH.md. Production must supply region-appropriate seasonal product tags/windows and current purchasable offers; avoid treating a product's generic `season` category as proof it is in season now.

Highest quality filters current fixture offers to the explicit A1 Extra grade before resolving a product's offer. It displays up to the popular selection's matching products (currently nine); it never labels a cheaper A1 offer as A1 Extra. Departure-aware selection still prefers eligible offers and clearly shows a later departure if necessary. A1 Extra is the prototype's top listed label, not an independent inspection, verified supplier quality ranking or vase-life guarantee. Production must agree authoritative grading fields and ranking semantics with the catalogue owner rather than sort arbitrary grade text.

Favourites resolves only `state.saved` product IDs, deduplicates them, and excludes missing products/offers. It never inserts unrelated recommendations to fill a personal row. Empty or currently unavailable saved selections show a useful message and a link to Saved. Heart actions use the existing saved-product state, so the row follows saves/unsaves. Plant cards show height and pot diameter and retain prices/quantities per plant. Production should query the authenticated buyer's saved products with current offers and page long lists without leaking another buyer's selection.

Validation: 55 automated checks pass, including month/timezone switching, exact A1 Extra offer selection, personal-row identity and plant units. Wide-desktop browser checks covered all three rows, photo loading, independent row navigation, the exact A1 Extra grower comparison and the Saved link. No basket additions or saved-product mutations were submitted during these checks.

## Expanded reorder worksheet viewport

The short nested desktop scroll area has been removed in favour of a full-height, page-scrolling worksheet. At desktop widths of 1300 px and above, the table wrapper has no height cap and its overflow is visible. Column headings stick 84 px below the top of the viewport, and the bulk-action footer sticks above the existing basket bar. Keyboard-editable inputs have scroll margins to leave room for these controls. Below 1300 px, the table retains horizontal scrolling and a taller viewport based on screen height.

This presents all 24 fixture rows naturally in the prototype; production still needs the bounded loading/rendering strategy documented above for long histories. Preserve a generous visible table area and its sticky controls when introducing paging or virtualization. Browser checks at 1864 × 984 confirmed a 1,930 px table, eight complete visible rows while browsing, sticky headings through middle rows, and accessible final plant rows. No purchase data was modified.

## Compact wholesale reorder review

The shared import/reorder review now has its own wide modal class rather than the old RLines card stack. RModal accepts optional className/style props so unrelated dialogs retain their existing layout. The table contains product/thumbnail, origin/colour, exact grower, length or height/pot diameter, grade, current unit price, quantity, line total and removal. The header and footer stay outside the scrolling table viewport. Large orders use the available desktop height; short orders use a content-based row-count height to avoid a large blank area. The source row count is used for sizing so removing rows does not make the dialog jump.

Quantity cells use direct numeric entry, pack/minimum hints and Enter-to-next-row focus. Invalid raw input is retained and prevents adding. Its specific stock or pack error remains visible after blur. Changed prices show the historical price; quantities differing from history show the previous unit quantity. A compact notice strip counts changes and separately lists unavailable excluded lines. Per-review removal has undo/restoration and never deletes a line from the source order. All-removed/unavailable states disable Add.

`importReviewBatch` resolves current exact offers, rejects a price that changed after the displayed quote was prepared, and delegates to `reorderBatch` for date, minimum, increment, merged stock and existing-basket price validation. It returns authoritative offer snapshots with quantities, stripping review-only metadata. Submission validates the whole batch before the existing atomic cart update; no partial addition occurs. Current fixture stock/price checks do not replace the production backend transaction and stock reservation required elsewhere in this handoff.

Validation: 56 automated checks pass, including displayed-quote changes, stale stock and later/invalid departure. Browser checks cover both the 24-line sample and a two-line prior order, stock-limit and pack errors after blur, direct quantity entry/Enter focus, live totals, removal/undo, empty restoration and the last plant rows with fixed headings/footer. Browser Add actions were not submitted; existing basket and order history remain intact. Desktop at 1864 × 984 was verified; narrower layouts retain basic containment but were not the focus of this pass.

## Customer-facing ticket inbox

The Customer service help page's Get in touch action now opens the #tickets route. The customer inbox uses three columns: status folders, a searchable/sortable ticket list, and a conversation/composer pane. It deliberately does not replicate Outlook's mail-only controls such as forwarding, junk folders or bulk deletion. Customer actions are reading past conversations, starting a ticket and replying; assignment/status information is displayed rather than editable by the customer. Profile → Past tickets opens the same inbox, focusing the requested ticket; its new-ticket action opens the composer.

`src/support.jsx` owns the UI and `supportTicketList` presentation helper. The standalone build compiles it before app.jsx. Required ticket fields are id, subject, email, createdAt, updatedAt and status; optional fields include orderId, assignee and reference. The messages array contains stable id, author (customer/support), body, createdAt, optional display name and notSent. `M.ticketMessages` adapts old records containing only message/createdAt to a one-message thread. `M.createTicket` now creates the initial message and `M.replyTicket` appends immutably, preserving the original message, reference and all shopping data. Reply IDs are unique within the local thread; live IDs must come from the server. Replies update list activity and mark local records Not sent; these records are reachable under All tickets, without a separate Not sent folder. A support write is persisted before UI success, so storage errors keep the form and original account state intact.

Production must replace the browser-local adapter with the existing authenticated ticket service. Use buyer-scoped, paginated ticket search with status counts and activity ordering, plus separately paged message history. Fetch server-owned assignee/status data and real account-owned order references; do not trust order IDs or customer/agent authorship supplied by the browser. Create/reply endpoints need server validation, idempotency, sending/error states, duplicate prevention, and account authorization. Reconcile the authoritative saved response before clearing a composer. Distinguish ticket workflow status from message delivery status; the prototype's Not sent is local-only, not an assertion that an external ticket was delivered. Real incoming replies need polling or a service event channel and updated activity/counts. No transport, email service, credentials or API endpoint has been configured here.

`sampleSupportTickets` returns six marked SAMPLE-CS-* presentation records only. The switch hides them without affecting account tickets. Sample replies are component-memory previews and reset when the inbox unmounts or reloads; samples must be omitted in production. New-ticket drafts and per-ticket unsent reply text survive switching within the current inbox, but are not saved across navigation/reload. Production should add account-scoped draft persistence and navigation guards if that behavior is needed. New-ticket attachments, notifications, read receipts, team assignment controls and ticket-deletion actions are outside this prototype's implemented surface; do not imply they are available.

Desktop is the design priority. The workspace fills the available height; the ticket list and message body scroll independently while their headings and action areas remain available. The existing shopping basket has no support-page overlay. Keyboard folder controls, labelled form inputs, ticket-list Arrow Up/Down/Home/End navigation, status text, live validation and empty/search states are included. Existing order and basket state is shared without being mutated by support operations.

Validation: 61 automated checks pass, including backward compatibility, complete message round trips, invalid/missing reply rejection without mutation, sample separation and matching against old message bodies, order references and assignees. Browser checks at 1864 × 984 cover the help CTA, folders/search/sorting, keyboard ticket selection, composer errors and retained draft, empty history and preview reply. Persistence was verified in model tests; browser QA did not create a real account ticket or submit any external message.


## Compact ticket list — 21 October 2026

Reduced support ticket rows from 151 px to 100 px on wide desktop, preserving sender, date, subject, preview, status and message count. Removed the redundant Your support inbox sidebar label and aligned New ticket with search. The standalone build and whitespace checks pass. Browser verification at 1864 × 984 confirms all six sample tickets fit, ticket selection still opens the correct conversation, and there is no page overflow.


## Reply attachments

RSupportAttachmentPicker opens a multiple-file browser picker from the reply box. Pending files live in attachmentDrafts keyed by ticket ID, separately from reply text. The file list shows filenames and sizes, allows removal, and is retained when changing conversations within this inbox. Leaving/reloading clears unsent file drafts. The UI prevents replies and removal while file reading is in progress, handles read errors, and preserves draft contents if storage fails. Changing the active conversation unmounts the reader UI so a late read cannot attach files to a different ticket.

The local mock limit is five non-empty files and 2 MiB combined per reply. M.ticketAttachmentError checks count and sizes before reading; M.ticketAttachments also validates the serialized data and exact decoded byte count before a reply can be saved. M.replyTicket accepts optional files after its existing now argument. Message attachments contain a stable message-scoped ID, sanitized filename, byte size and an application/octet-stream base64 data URL. The generic download MIME prevents active inline previews; the download attribute retains the original filename. Attachment-only replies are valid and get a useful list preview. Search covers filenames as well as message bodies. Legacy messages without attachments are unaffected.

Account-ticket attachment bytes share the existing local JSON record; repeated attachments may reach the browser quota, at which point the atomic save fails without clearing the draft. Sample attachment replies use component memory only. These are prototype storage choices, not production upload infrastructure or a production file-size policy. New-ticket composition does not yet have attachments.

When integrating the live service, replace local data URLs with authenticated upload records and message attachment IDs, agree actual size/type limits with the ticket service, show progress and retry/cancel states, and commit a reply only after its files are uploaded. Server-side authorization, content validation and malware handling must follow the existing ticket service's policies. Downloads must enforce the same buyer/ticket access as the conversation. Do not trust filenames, MIME declarations or the browser's local validation as server security controls.

Validation: 63 automated checks pass. Browser checks used two generated sample text files to verify multiple selection, removal, ticket-specific retention, an attachment-only preview reply and the resulting downloadable payload. Exact bytes across a save/read cycle and malformed/oversized file rejection were verified in model tests. No account ticket, basket line or external upload was created during browser QA.


## Bank-transfer instructions and QR

After a successful transfer checkout, place saves the complete order record before changing the UI. Only then does it navigate to order/{id} and open the bank-transfer modal. Bank-transfer details are also available from any awaiting_payment transfer order. Confirmed/balance-paid orders do not expose that action. Storage errors leave the original in-memory basket/account state unchanged and return an actionable checkout error; no popup or success route is shown. Existing order validation and balance deductions are preserved.

The plain JS src/payment.js module supplies transferDetails(order) and qrMatrix(payload, factory). transferDetails accepts only awaiting_payment transfer orders, validates their saved total/reference, and returns a fresh immutable presentation snapshot. Totals come from order.totalCents (including saved shipping), not the current basket. The new src/payment.jsx components render the dialog and an SVG QR with a four-module quiet zone. Copy actions have feedback/fallback text. Escape, Close and View order dismiss the dialog and focus the order's details action. No client action marks a transfer as paid.

The current adapter is explicitly demo-only. Recipient is PP Flowers (demo); IBAN/BIC are unconfigured placeholders. Its QR contains ordinary UTF-8 text naming the mock order amount/reference and an explicit non-payment/do-not-pay notice. It is not an EPC transfer payload, banking-app payment request, payment URL or confirmation. This avoids inventing a real payee account. Neither QR generation nor copying sends order data to an external service. Runtime encoder qrcode-generator 2.0.4 and its MIT license are vendored; the independent jsQR 1.4.0 decoder is test-only and excluded from the website. Sources and hashes are in vendor/QR-NOTES.md.

Before enabling live transfers, replace this adapter with bank/PSP-issued instructions from the authenticated order service: verified legal recipient, IBAN/BIC when required, currency, final payable amount including applicable VAT/fees, unique reference and any expiry/status metadata. The prototype's totals exclude VAT and must not become live payable amounts unchanged. Persist a server-owned instruction snapshot/payment ID with the order, use the appropriate QR payload for the selected provider/banks, and validate that the visible bank details and encoded payment data match. QR compatibility with supported bank apps requires integration testing. A scan or customer click must never confirm settlement; only reconciliation/provider confirmation should update payment status, with server idempotency and duplicate-payment handling. No live payment implementation has been configured here.

For the provider decision, the European Payments Council distinguishes invoice-style SEPA data capture codes from QR codes intended for checkout/point-of-interaction use. Consult its [SCT QR guidelines, version 3.1](https://www.europeanpaymentscouncil.eu/sites/default/files/kb/file/2024-03/EPC069-12%20v3.1%20Quick%20Response%20Code%20-%20Guidelines%20to%20Enable%20the%20Data%20Capture%20for%20the%20Initiation%20of%20an%20SCT.pdf) and [MSCT QR standardisation guidance](https://www.europeanpaymentscouncil.eu/document-library/guidance-documents/standardisation-qr-codes-mscts). These inform the production choice; this prototype does not claim implementation or certification of either payment format.

Validation: 69 automated checks pass. Tests independently decode the QR and compare the complete UTF-8 payload, retain the order's original total through storage/reopening, reject invalid/paid orders, and exercise the actual checkout callback with an isolated in-memory account: persistence precedes modal/navigation, balance skips it, and failed storage preserves the basket. Browser checks used the existing pending PP-MVI9OJ61 order at €1,532.70 without creating another account order; copy feedback, close/Escape/focus, pending reopening, confirmed-order exclusion, modal containment and zero console errors were verified. No payment, banking-app transaction or new browser order was submitted.


## Transfer reference reminder — 21 October 2026

Added a warning beneath the existing demo notice that displays the current order's exact payment reference and explains that it is needed to match the transfer. Manual-payment guidance names the payment reference, message or description field and advises checking with the bank when another field is unclear. It does not tell buyers to put the reference into arbitrary bank fields. The existing non-payable demo disclosure remains visible.

The build and whitespace checks pass. Desktop browser verification confirms the dynamic PP-MVI9OJ61 reference, readable warning and visible footer actions within the 1864 × 984 viewport, with no horizontal overflow. Payment logic, QR payload and saved account data are unchanged.


Removed the bank-configuration explanation from the transfer popup at the buyer's request (21 October 2026). The preview notice and exact-reference guidance remain. Build and browser verification pass.


Added the buyer-requested bank-transfer warning (21 October 2026): “Please note: Prices may change until your bank transfer has been received.” This is display copy only; saved order totals and QR data are unchanged. Build, whitespace and desktop browser checks pass; popup actions remain visible without page overflow.


Updated the QR helper paragraph to the buyer's requested bank-app/manual-entry wording (21 October 2026). This is presentation copy for the intended payment flow; the QR remains non-payable demo text and the visible demo notices remain. Build, whitespace and desktop browser checks pass, including visible footer actions and no page overflow.


Added the buyer's confirmation-timing and automatic-crediting message below the payment-reference reminder (21 October 2026). This is prototype presentation copy; real settlement notifications, timing and account crediting still require the live payment integration. Tightened vertical spacing so all notices and footer actions fit at 1864 × 984 without an internal scrollbar. Build, whitespace and desktop browser checks pass; payment/order data are unchanged.


## Support conversation layout and simplified folders — 21 October 2026

The sidebar contains only All tickets, Awaiting you, In progress and Resolved. The Not sent and New ticket draft navigation items are removed. This does not remove local tickets or delivery-state disclosures: not_sent records stay visible under All tickets. New ticket reopens the retained composer draft in the current inbox session; drafts still reset on leaving/reloading.

The reading pane uses right-aligned dark customer bubbles and left-aligned white support bubbles. Adjacent messages are grouped by Europe/Amsterdam calendar day without reordering or changing the source messages; chat times use the same timezone, including DST transitions. Date groups expose Today, Yesterday or a calendar date. The compact header retains reference, workflow status, assigned agent and optional order. On opening or adding a reply, the thread scrolls to the latest message. Jump to latest appears when more than 80 px from the bottom. The compact composer keeps attachments and submission on one row; current validation, exact attachment bytes and per-ticket drafts are unchanged.

Production pagination should preserve authoritative message order and load earlier messages without moving the current reading position. Keep message delivery state separate from workflow folders. The new presentation introduces no support transport, delivery confirmation or server-side draft persistence.

Validation: 71 tests pass, including Amsterdam midnight boundaries, DST, invalid historical timestamps and grouping immutability. Browser checks covered a session-only text/file reply and download link, ticket-specific draft retention, the resumed new-ticket draft, resolved/search navigation and scrolling to latest. Desktop layouts at 1864 × 984 and 1280 × 720 keep actions visible without page overflow. No account ticket or shopping data was changed; browser console warnings/errors were absent. Local artifacts are refreshed.


## Support inbox palette — 22 October 2026

Matched the customer service workspace to the webshop's warm neutral and orange palette. The page and conversation canvas use the same cream background as the shop; the sidebar is warm beige, and selected folders/tickets, counts, focus states, date chips and the active Customer service link use soft orange accents. Search, composer, attachments, borders and secondary text now use warm neutrals. Green customer messages and white team replies retain their existing colours; semantic status badges are preserved.

The standalone build and whitespace checks pass. Browser inspection at 1280 × 720 and 1864 × 984 verifies the new surfaces, unchanged green/white message bubbles, visible reply controls and the matching new-ticket composer. No horizontal overflow or console warnings/errors appeared. This is a CSS-only update; ticket, attachment, basket and order behavior is unchanged. Local preview and developer package refreshed; not published. Screenshot: customer-service-warm-palette.png.


## Cleaner support labels — 22 October 2026

Removed all visible “sample” wording from the support inbox: the conversation header, ticket-list message counts, linked order labels, history switch and reply hint. The history switch now reads Show past conversations. Removed the assigned-agent badge beside the conversation subject and the static Up to 5 files · 2 MB total helper beside Attach files. Message senders and the attachment control remain visible. Attachment count/size validation still applies and reports an error when exceeded.

This is presentation cleanup: fixture identities and the sample/account isolation remain internal, and preview replies stay session-only. The existing local-only/preview notices still describe delivery behavior. No account records are changed. The build, whitespace check and nine support tests pass. Browser verification at 1864 × 984 confirms no visible sample text, no agent header badge, no file-limit helper, and an intact Attach files button. Screenshot: customer-service-clean-labels.png. Local preview and developer package refreshed; not published.


## Compact conversation header and reply box — 22 October 2026

Reduced the conversation header from 118 px to 71 px at 1864 × 984. The subject and status share a row, with the ticket reference and related order beneath it. Reduced the default reply form from 151 px to 85 px, with a single-line starting height, retained vertical resizing and an accessible hidden label. Attach files and Preview reply / Save reply remain available. Removed the static preview hint; success feedback still appears after a reply is added, and validation errors remain visible.

The message viewport gains 123 px at the verified desktop size. Build, whitespace checks and all nine support tests pass. Browser QA confirms the hint is absent, references/status remain, empty-reply validation works, multiline text can be entered, resizing remains enabled and console warnings/errors are absent. No reply or account mutation was saved during QA. Local preview and developer package refreshed; not published. Screenshot: customer-service-compact-composer.png.


Changed the active Customer service header button to light green (#eaf0e5) with dark green text (#254333), including its support-page hover state (22 October 2026). Build, whitespace and browser colour checks pass. The rest of the warm inbox palette is preserved. Local preview and developer package refreshed. Screenshot: customer-service-green-button.png.


Removed the large Customer service page heading and promoted HERE TO HELP YOUR BUSINESS to the sole page heading at 14 px (previously 10 px), using the webshop’s black text colour (#222), as requested on 22 October 2026. Kept the light green header link and Buying help action. Adjusted workspace height for the shorter heading row. Build, whitespace and desktop browser checks pass; no page overflow and reply controls remain visible. Local preview and developer package refreshed. Screenshot: customer-service-simple-heading.png.


## Saved order product worksheet — 22 October 2026

Replaced the tall product cards on saved order detail pages with a compact read-only table. Product, Grower, Origin, Size, Quality, Quantity, Unit price and Line total have separate columns; quantities and currency align to the right with tabular numerals. Small thumbnails, alternating rows and subtle grid lines aid scanning. Plant pot diameter appears beneath size when present, and quantity/price unit labels remain explicit. The heading shows the line count and VAT basis; the footer repeats the saved product subtotal.

ROrderLinesTable renders order.lines and order.subtotalCents directly. It never substitutes current catalogue prices or specifications, keeps multiple grower offers for the same product as separate rows and uses the saved product name for image text. Existing basket and checkout RLines, shipping, payment status, QR instructions and reorder actions are unchanged. Wider tables scroll within their own labelled region on narrow screens.

All 71 automated checks, build and whitespace checks pass. Browser QA used existing order PP-MVI9OJ61: all five lines, both Red Naomi growers, 5,000 Strong Gold stems, individual line totals, saved €1,508.20 product subtotal and €1,532.70 order total remain correct. Rows are 59 px tall. All eight columns fit at 1864 × 984 and 1280 × 720 without horizontal page overflow; browser console warnings/errors are absent. No order or payment was submitted and account data was not changed. Local preview and developer package refreshed; not published. Screenshot: order-products-spreadsheet.png.


## Checkout worksheet and transfer guidance — 22 October 2026

Checkout now uses the same compact eight-column product worksheet as saved order details: Product, Grower, Origin, Size, Quality, Quantity, Unit price and Line total, with the product subtotal beneath. RProductLinesTable takes an explicit line snapshot and subtotal; checkout supplies state.cart and its current reviewed subtotal, while saved orders retain their historical snapshots. Edit basket remains a non-submit button, and changed-offer warnings/actions remain visible above the table.

The Bank transfer option now says: “To help prevent delays to your order, use an instant bank transfer where available.” The transfer popup repeats that guidance beside the price-change notice and adds: “Transfers from outside the EU may take 1–2 business days to confirm.” The later confirmation note now starts “Once your transfer arrives” so it distinguishes arrival time from confirmation. Removed the selected Preview only — do not transfer money sentence. The demo QR label, placeholder bank fields, non-payable QR payload and unchanged awaiting-payment state remain. These are presentation messages for the intended service; live bank timing, reconciliation and automatic crediting are still not implemented.

Build, whitespace checks and all 73 tests pass. New component checks cover distinct historical grower offers, thousands of stems/plants, pot sizes, saved prices, totals, checkout table reuse, unchanged state, offer warnings and Edit basket behavior. The actual basket was empty during browser QA, so the populated checkout view was checked with isolated in-memory component data; it was not seeded into browser storage. The shared table was inspected on existing six-line PP-MVJCZY86 and its transfer popup at €1,124.10. Browser inspection confirms the new guidance, removed sentence, visible footer buttons and no console warnings/errors at 1864 × 984. No order, transfer or basket mutation was submitted. Local preview and developer package refreshed; not published. Screenshot: bank-transfer-instant-guidance.png.


## Editable basket worksheet — 22 October 2026

The basket now shares the product worksheet used by checkout and saved order details. Its eight columns retain product, grower, origin, size/pot diameter, quality, editable quantity, unit price and line total. Change offer and Remove sit beneath each product name. Quantity fields retain direct entry, +/- controls, unit multiples, validation, removal at zero and selection on focus. Product subtotal, Save this order, Clear basket and the existing summary/review actions remain.

RProductLinesTable defaults to read-only for checkout/history; only the basket supplies editable callbacks. Each callback receives the original exact grower line or its line ID. Existing quantity persistence, stock rules, removal undo and historical order snapshots are unchanged.

Build, whitespace checks and all 74 tests pass. The added regression test checks distinct grower identities for edits, zero-quantity removal, Change offer and Remove, while ensuring read-only views expose no editing controls. The current browser basket was empty. A static HTML layout preview was generated from the actual source components with two mock products and no scripts/storage access, but browser security blocks file: URLs, so populated-basket visual QA remains unverified. No user basket or order data was modified. Local implementation, exported preview and developer package refreshed; not published. Optional static artifact: basket-worksheet-static-preview.html.


## Consistent basket and order worksheets — 22 October 2026

Extended the spreadsheet layout to every full basket/order overview. The saved-order editor now reuses the editable product worksheet, while My orders, Buy again → Previous orders, Saved orders and profile Billing history share compact overview tables with warm headers, subtle grid lines, alternating rows and right-aligned amounts. Basket, checkout, order-detail products and the reorder review retain their existing worksheets. Monetary summary panels remain compact beside the product tables.

ROrdersTable presents saved order totals, statuses and dates; the previous-orders variant uses the saved product subtotal and clearly excludes shipping. RSavedOrders keeps Edit, Delete and Review & reorder actions, including disabled empty lists. RDraft edits a clone with the original grower-specific quantity/removal rules and only saves through its existing actions. Removed the obsolete RLines renderer. Labelled table regions scroll within their containers when needed.

Build, whitespace checks and all 77 automated tests pass. New checks cover historical amounts, exact order/action identity, empty saved orders and clone-only edits. Browser QA at 1864 × 984 verified populated basket and checkout worksheets (€523.20 products, €547.70 including shipping), the saved-order editor (€574.80), all six real order-history rows, the seven-entry previous-order list, reorder review and billing history. My orders rows are 57 px tall; no horizontal page overflow or console warnings/errors were observed. Search and View order navigation work. No quantities, saved orders, payments or account records were changed during QA. Local preview and developer package refreshed; not published.

Screenshots: orders-spreadsheet-overview.png, saved-order-edit-spreadsheet.png, basket-spreadsheet-overview.png, checkout-spreadsheet-overview.png, previous-orders-spreadsheet.png and billing-orders-spreadsheet.png. These populated basket/checkout captures supersede the earlier unverified static basket preview.


## Clearer order overview buttons — 22 October 2026

Replaced the small underlined order actions with compact buttons: orange Buy again with a repeat icon, and outlined View order with an arrow. The shared order table carries the same controls into previous-order and billing views. Existing accessible order-specific labels, disabled empty-order behavior and action callbacks are preserved. Saved-order Edit/Delete controls are unchanged.

Build, whitespace checks and all 77 tests pass. Browser QA at 1864 × 984 confirms 33 px button heights, 58 px order rows, no page overflow and no console warnings/errors. Buy again opens the correct three-line PP-MVJE0KJ0 review; cancelled without adding products. Local preview and developer package refreshed; not published. Screenshot: order-overview-improved-buttons.png.


Changed order-table Buy again / Review & reorder buttons from orange to light green (#eaf0e5), with dark green text (#254333) and a darker green hover state, on 22 October 2026. View order remains outlined. Build, whitespace and browser colour checks pass; button sizing and actions are unchanged. Local preview and developer package refreshed; not published. Screenshot: order-overview-green-buttons.png.


## About me completion text — 22 October 2026

About me now always shows the supplied Complete your profile heading, introductory paragraph and four benefits: Order without limits, Pay on account, Faster delivery slots and Correct paperwork, with the screenshot’s explanatory copy. The action always reads Complete your profile and opens Account information. Removed the saved-details alternative from About me; saved contact/profile values and completion timestamps remain intact in the account form. Kept the restored layout and all other styling.

Build, whitespace checks and all 77 tests pass. Browser verification confirms the requested copy and button label on the existing completed account, working navigation to Account information and no console warnings/errors. No profile data was saved or reset. Local preview and developer package refreshed; not published. Screenshot: profile-completion-text.png.


## Account verification workspace — 22 October 2026

Replaced the single Account information form with the reference’s eight-step structure in the current webshop design: warm neutral surfaces, orange active-step accents, compact white cards, existing profile navigation and shared buttons. The section heading is Account verification. A segmented progress bar and numbered step navigation cover Address, ID Doc, Business, Services, Transport, Customs, Contract and Deposit. Required fields validate before continuing, earlier steps can be revisited, and changing a step clears its later completion markers. Save draft and Save & continue persist progress; the final action saves the completed details.

The first step reuses the saved address as a starting point. Its business address is stored separately from the delivery address used by checkout. Business retains company/VAT and contact editing, Services supports multiple selections, Transport has conditional carrier details, and Customs offers optional references. Contract records readiness to review an agreement rather than signing one. Deposit records a funding preference and links to the existing demo balance dialog; saving does not deduct funds. The ID step accepts a sample PDF/JPG/PNG of up to 10 MB, with filename/type/size retained; file contents never enter storage or an upload. The UI explicitly identifies these preview limits.

Drafts are stored in profile.verification (version 1, step, completedSteps, section values, savedAt and status draft/details_saved). Existing profile fields and completedAt are preserved; a prior completed profile is not treated as verified. Final saving revalidates every step, never sets a verified/activated flag and performs no contract acceptance or payment. About me keeps the user-requested completion copy. Real identity verification, agreement delivery and activation still require service integration.

Build, whitespace checks and all 84 tests pass. Seven new regression checks cover legacy profiles, per-step and conditional validation, document limits, metadata-only persistence, separation from shipping/account state, final validation, reload, full eight-step progression and invalidation after edits. Browser QA inspected the Address workspace at 1864 × 984 and 1672 × 988, with no horizontal page overflow. An empty postal code blocks continuing, focuses the field and shows its error; reload restores the existing value. Later steps and persistence were exercised with isolated in-memory component/model data, without seeding browser storage or changing the user’s profile. No console warnings/errors were observed. Local preview and developer package refreshed; not published. Screenshot: account-verification-new-design.png.


Removed the Past tickets tab and its duplicate ticket view from Profile on 22 October 2026. Profile now contains About me, Account information, Billing history and Top-up history. Customer service remains the ticket workspace; no ticket data or support behavior was changed. Build, whitespace, all nine support tests and browser navigation checks pass. Local preview and developer package refreshed; not published. Screenshot: profile-without-past-tickets.png.


## Click-to-select reorder rows — 22 October 2026

Buy again product rows now toggle selection when their ordinary cells or empty areas are clicked. Eligible rows show a pointer cursor and expose aria-selected. Checkbox, quantity field, product/grower buttons, links and other interactive controls keep their own behavior without a second row toggle. Unavailable rows remain unselectable; an already selected row can still be deselected when it becomes unavailable. The empty-selection helper now says Click a row or enter quantities to select products.

Quantity callbacks in this worksheet now ignore unchanged values. This fixes an existing blur behavior where simply leaving an unchanged quantity field could select the row and interfere with the following checkbox/row click. Actual quantity changes still select their exact grower row; Enter-to-next-row, stock rules and batch validation remain.

Build, whitespace checks and all 86 tests pass. New regressions cover selection identity, toggling, interactive-control exclusion, unchanged quantity callbacks and unavailable rows. Browser QA at 1672 × 988 confirms selection/deselection from ordinary cells, correct behavior after quantity focus, single checkbox toggles, a €19.20 selected subtotal for 80 Porta Nova Red Naomi stems, and no selection of the stock-limited Bacardi row. No quantities or basket contents were changed; selection was cleared after QA. Console warnings/errors are absent. Local preview and developer package refreshed; not published. Screenshot: buy-again-row-selection.png.


## Larger worksheets and app typography — 22 October 2026

Expanded standard basket, checkout and order pages from a 1440 px to an 1840 px maximum width, with a 360 px summary column. At 1672 px, the basket’s product table grows from roughly 1000 to 1200 px. Below 1450 px, the summary moves beneath the product area to preserve space for reading the worksheet. Tables continue to scroll inside their own regions when the viewport is narrower than their minimum width.

All worksheet families now use larger data text (15–16 px), 14 px column labels, 12 px unit/helper text, roomier rows and larger product thumbnails. Editable quantity controls are 42 px tall with 16 px numerals. Applied this to basket, checkout, order details, order/saved-order overviews, Buy again, reorder review, saved-order editing, grower comparisons and profile history tables. Widened saved-order and reorder dialogs to suit the larger rows and controls. Light green order buttons, row selection and the existing warm/green palettes remain.

Increased smaller text throughout the application by 1–2 px, including buttons, navigation, metadata, form labels/inputs, support messages, catalogue controls and verification steps. The body baseline is 17 px; larger display headings keep their established sizes. Layouts grow with the content rather than using browser zoom or transformed text.

Build, whitespace checks and all 86 tests pass. Browser QA at 1672 × 988 confirms the basket/checkout tables are 1202 px wide with all eight columns visible, Buy again’s eleven columns fit at 1590 px, billing fits inside its 1183 px region, and the enlarged reorder/saved-order dialogs retain visible footer actions. Verified existing historical line values and subtotals, the larger grower comparison, account verification, support inbox and catalogue. No horizontal page overflow or console warnings/errors were observed. Basket, order and account data were not changed. Responsive stacking is implemented in CSS; smaller viewport visual QA was not performed in this pass. Local preview and developer package refreshed; not published.

Screenshots: basket-larger-readable-worksheet.png, checkout-larger-readable-worksheet.png, orders-larger-readable-overview.png, order-details-larger-readable-worksheet.png, buy-again-larger-readable-worksheet.png, reorder-review-larger-readable-worksheet.png, saved-order-larger-readable-worksheet.png, grower-comparison-larger-readable-worksheet.png and account-verification-larger-text.png.


## Readable product cards — 22 October 2026

Separated compact recommendation-card prices, unit/VAT notes and comparison buttons into their own rows. Added more padding, clearer grower/specification text, 42–44 px actions and natural wrapping. Compact specification grids switch to two columns below a 230 px card width; colour dots stay beside their values. Six cards remain visible across the normal desktop rail.

Photo cards now stack the unit-price note, give the comparison label/badge adequate space, and use separate full-width quantity and Add rows. Removed the older dense desktop control overrides so they cannot compress the new layout. Product names and colour labels wrap, cards grow with their content, and the comparison label reads Compare growers while its accessible grower-offer label remains. Reduced the mobile navigation gap to fit the enlarged type without page overflow.

Build, whitespace checks and all 86 existing tests pass. Browser checks at 1672, 1240 and 390 px confirm the card sections and controls fit without horizontal content overflow. Inspected all rendered photo cards and compact recommendation cards, the long-name/plant variants and the unchanged Details view. The normal viewport is restored. No basket, order, payment or profile data was modified. Local preview and developer package refreshed; not published.

Screenshots: homepage-cards-readable-spacing.png, catalogue-cards-readable-spacing.png and catalogue-cards-mobile-readable-spacing.png.


## Collapsing search command bar — 22 October 2026

Added a shared scroll controller for webshop home and catalogue. Above 40 px of page scroll, the full sticky search band collapses and the same form moves into the header. On desktop the compact pill is centred at top 20 px, width min(560 px, 42 vw), height 48 px, with 13.5 px semibold values, hidden segment labels, 20 px dividers and a 38 px submit button. Expanded search is 980 × 72 px with stacked labels, 26/30 px band padding and 34 px bottom margin; compact band padding/height/border/shadow are removed and its margin is 18 px. Desktop header height changes from 74 to 88 px. Catalogue keeps its existing departure dialog available through a compact calendar button.

Filter/category/sort rows and the catalogue view toolbar fold away. Main navigation fades, becomes inert and leaves the keyboard order while compact; the search controls keep their DOM identity, values and native select anchoring. A 220 ms ease transition plus a measured position/size animation moves the form without scaling text or programmatically changing scroll position. Scroll updates are passive and coalesced to one animation frame; layout scroll anchoring is disabled within these pages to avoid collapse feedback. Route changes remove listeners and pending frames. Reduced motion disables the movement animation and transitions.

At tablet/mobile widths the compact pill uses a second header row, clear of the logo/account tools. Small-screen expanded filters/sort and horizontally scrolling category chips occupy separate rows. Other routes retain their existing headers/search layout. Existing basket, checkout, order and profile behavior remains.

Build, whitespace checks and all 91 tests pass. Five new tests cover threshold/restoration, restored scroll positions, frame coalescing, cleanup, the movement animation and reduced motion. Updated the isolated checkout test React stub for useLayoutEffect; its payment/storage assertions are unchanged. Browser QA verifies expanded/collapsed geometry, retained query/grower/length values, submitting from the compact header, folded inert controls, the departure dialog, route restoration and 1672/1240/1024/390 px layouts. The normal viewport is restored. No basket, order, payment or profile data was changed. Local preview and handoff package refreshed; not published.

Screenshots: home-command-expanded.png, home-command-collapsed.png, catalogue-command-expanded.png, catalogue-command-collapsed.png, catalogue-command-mobile-expanded.png and catalogue-command-mobile-collapsed.png.


## Profile language preference — 22 October 2026

Added a globe-marked Language button at the bottom of the Profile sidebar. It shows the current preference and opens a Language preference dialog with English, Nederlands, Deutsch, Français, Español, Italiano, Português and Polski. Choices use native names plus English descriptions. The user explicitly chose preference storage only; selecting a language does not translate the webshop or alter date/currency formatting.

The pending choice stays local to the dialog until Save preference. Cancel/close discards it and restores focus to the sidebar button. Validated language codes are saved in profile.preferredLanguage through the existing account storage, preserving contact, verification draft, orders, basket and balance. Legacy/missing/unsupported preferences display English. A storage failure leaves the dialog open with an error and does not update account state.

The desktop sidebar now stays within the viewport and keeps its language button at the bottom, including on longer Profile sections. Its height shares the Profile header height variable to prevent page overflow. On small screens the sidebar flows normally, the button sits below the tab row, and the language choices use a single scrollable column.

Build, whitespace checks and all 95 tests pass. Four new checks cover legacy/default handling, immutable updates and persistence/reload, pending choices versus Save/Cancel, and storage errors. Browser QA at 1864 × 984 confirms bottom alignment, the complete picker, selecting Spanish then cancelling without changing English, focus restoration, no horizontal/page-height overflow and no console warnings/errors. Persistence was checked with isolated in-memory storage; no real account or shopping data was changed. Mobile CSS is implemented, but a visual check could not be completed because the browser viewport override did not take effect; the override was reset. Local preview and developer package refreshed; not published.

Screenshots: profile-language-sidebar.png and profile-language-picker.png.


## Customer identity in Profile — 22 October 2026

Added Customer ID directly below the buyer/location line in the About me identity card, above the membership date. A compact identity section beneath the sidebar Language button repeats the current account name and the same ID, with a small avatar and separator. The sidebar section remains available across Profile tabs, and identifiers can be selected as a complete value.

The existing demo data had no customer identifier. Added a stable PP-100001 demo fallback in the top-level customerId field; production account IDs can be supplied through that field. Saved string IDs retain leading zeroes, numeric IDs are normalized to strings, and older/missing/invalid values receive the same fallback on read. IDs are independent of names, email, address and language choices. Loading does not write to browser storage.

Build, whitespace checks and all 98 tests pass. Three new regressions cover backward-compatible IDs, preservation across contact/language edits and reloads, and use of the same supplied ID/current name in both UI locations. Browser QA at 1864 × 984 confirms placement, matching PP-100001 values, visibility on About me and Account information, no horizontal/page-height overflow and no console warnings/errors. No account or shopping data was saved during browser QA. Local preview and developer package refreshed; not published. Screenshot: profile-customer-identity.png.


## Profile Settings and contact verification preview — 22 October 2026

Added a gear-marked Settings button between Language and the customer identity footer, with a light-green selected state. It opens contact settings in the existing Profile layout. The screen has email/phone status notices, editable first name, last name, email and international phone fields, and Save changes. Add phone number focuses the empty phone field. The separate eight-step business onboarding remains in Account information.

Verification is a local demo because this prototype has no authentication or messaging backend. Each email/phone dialog explicitly says no message is sent, displays its six-digit demo code, and offers code entry, regeneration and cancellation. Codes remain in component memory, expire after five minutes and allow five attempts. Completion is labelled Verified in preview and stored only under profile.contactVerificationPreview with mode: demo and the normalized contact value. These records must never be used as real authentication claims or account activation. Live email/SMS delivery and server-side ownership verification still require integration; no 2FA or security setting is changed.

Contact edits validate the email and international phone format, preserve the shipping address, customer ID, language, balance, basket and saved orders, and synchronize the saved onboarding contact draft. Changed email/phone values invalidate their corresponding demo record. Save and demo completion persist before updating the visible account; storage failures retain the form/dialog with an error. Unsaved changes must be saved before starting verification. Cancel saves nothing, code input receives focus after the dialog opens, and closing restores focus to its trigger.

Build, whitespace checks and all 106 tests pass. Eight new checks cover settings placement/navigation, contact validation and state preservation, value-bound demo status, code errors/expiry/attempt limits, pending edits, cancellation, and atomic persistence failures. Browser QA at 1864 × 984 confirms placement, light-green selection, readable fields, no horizontal overflow, phone-field focus, email dialog focus, incorrect-code feedback, regeneration, cancellation and no console warnings/errors. Successful saves and completion were checked using isolated in-memory accounts; no browser account or shopping data was saved during QA. Responsive styles are included; mobile visual QA remains unverified because the browser viewport override was unavailable in the preceding profile work. Local preview and developer package refreshed; not published.

Screenshots: profile-settings.png and profile-email-verification-preview.png.


## Red contact-verification warnings — 22 October 2026

Changed unverified email/phone notices to pale-red backgrounds with red borders, icons, text and outlined actions. The matching Not verified badges are red; completed preview notices and badges retain their green styling. Build and whitespace checks pass. Browser QA confirms both red warning cards at 1864 × 984 without horizontal overflow. No account data changed. Screenshot: profile-settings-red-warnings.png. Local preview and handoff package refreshed; not published.


## Solid red verification actions — 22 October 2026

Filled the email and phone verification action buttons with solid red and white text, with a darker red hover state. Build and whitespace checks pass; browser QA confirms both button backgrounds and labels. Screenshot: profile-settings-solid-red-buttons.png. No account data changed; local preview and handoff files refreshed.


## Finance section removed — 22 October 2026

Removed Finance from the Profile navigation and reverted its overview, ledger model, styling and dedicated tests. The profile again contains About me, Account information, Billing history, Top-up history, Language and Settings. No saved account or shopping data was changed. Build, whitespace checks and all 106 remaining tests pass; browser QA confirms the Finance entry and screen are absent. Screenshot: profile-finance-removed.png. Local preview and handoff files refreshed; not published.


## Balance top-up QR popup — 22 October 2026

Submitting Add demo balance now opens a Balance top-up QR dialog with the selected euro amount, a stable TU reference, recipient/bank placeholders and copy controls. It uses the existing bank-transfer visual style with a top-up-specific QR label and a compact layout for shorter desktop windows. Change amount returns to the amount form with the entered value retained. Close/Escape restores focus to the original top-up button.

Opening or closing the QR preview does not persist a top-up or change the balance. Add demo credit is an explicit simulation step that saves the exact preview amount/reference to the existing top-up history. The confirmation persists before updating the account and handles storage failures in the dialog. The model and button both prevent duplicate credit from repeated confirmation. Existing immediate topUp model behavior remains available for compatibility, while both Profile and checkout now use the preview flow. No account, basket, order, customer identity or profile fields are otherwise changed.

The QR is generated locally with the pinned QR library and encodes a clearly marked non-payable demo record. No real bank details, transfer, payment confirmation service or external QR endpoint is introduced. The existing order bank-transfer popup retains its behavior and copy.

Build, whitespace checks and all 113 tests pass. Seven new checks cover unchanged state while preparing/cancelling, amount limits, exact-once confirmation, independent QR decoding to the displayed amount/reference, returning to the amount form, root callback persistence and storage failure, and rapid-click protection. Browser QA in a separate existing HTTP development preview confirms the QR opens, the amount changes correctly, closure leaves the balance/history unchanged, focus returns to the trigger, the complete popup fits at 1864 × 984, and the console has no warnings/errors. Confirmation was exercised only with isolated in-memory test accounts; no browser funds or history were changed. Browser security rejected inspection of the user-opened file:// page because only HTTP/HTTPS protocols are permitted, so the downloaded HTML was updated and byte-matched to the build but not visually verified at its file origin. Responsive/short-window CSS is included; no final small-screen visual pass was completed. Local preview, standalone HTML and developer package refreshed; not published.

Screenshot: profile-topup-qr.png.


## Demo billing history — 22 October 2026

Billing history now shows five display-only example entries automatically when no orders exist, with Show demo data / Hide demo data available to switch views. Examples include paid and awaiting-payment bank transfers and a paid account-balance order, using independent historical product snapshots and reconciled totals. Existing saved orders remain the default when present. The examples never write to storage, add orders, or change account credit.

View order on an example opens a read-only dialog with the matching product worksheet, payment status, shipping and total. It cannot navigate to a nonexistent saved order or initiate payment. Closing the dialog restores the billing table; hiding the examples restores the saved history or original empty state.

Build, whitespace checks and all 118 tests pass. Five new checks cover fixture totals and independence, empty-history fallback and toggling, preservation of saved records and their actions, read-only example details, and Profile integration. Desktop browser QA at 1864 × 984 confirms the five rows, matching order preview, saved-history restoration, no horizontal overflow and no console warnings/errors. No browser account or shopping data was saved during QA. The standalone HTML is byte-matched to the build; file-origin visual verification remains unavailable under the previously observed browser HTTP/HTTPS restriction. Responsive styles are included; no mobile visual pass was completed. Local preview, standalone HTML and developer package refreshed; not published.

Screenshots: profile-billing-demo.png and profile-billing-demo-order.png.


## Product-offer layout, vivid verification red and plant campaign — 22 October 2026

Reorganized the selected grower card into a grower header, labelled specifications, a price row, a departure block, quantity controls and a prominent line total. The desktop card is 340 px wide, with a 300 px intermediate layout. Stock and basket quantities remain visible as secondary information; selection feedback remains available to screen readers without repeating the grower beneath the action. Existing selection, quantity, stock, eligibility and add-to-basket rules are preserved, including plant height and pot dimensions.

Widened the desktop departure-date block from 265 to 340 px (320 px at intermediate widths). At the reviewed desktop size, “6 of 7 offers available for this date” fits on one line. Unverified email/phone actions and Not verified badges now share vivid #ec0028 backgrounds with white text; notice text, icons, borders and pale backgrounds use matching red tones. Completed preview statuses keep their green styling.

Replaced the Porta Nova rose spotlight on Recommended with a “Plants for every space” campaign using existing Monstera and Calathea imagery. Explore plants opens the plant catalogue, with its orchids, flowering plants, green plants and succulents groups. The campaign is independent of rose-offer availability.

Build, whitespace checks and all 118 existing tests pass. Browser QA at 1864 × 984 confirms the expanded date message stays on one line, selecting Porta Nova updates the card to 28 cm / €0.21 per stem / 500 stems / €105.00, the plant images load and the CTA opens Find plants, both verification actions and badges use the same vivid red, and the console has no warnings/errors or horizontal page overflow. No browser basket, order, balance or contact data was saved. Standalone HTML is byte-matched to the build; the known browser file-origin restriction and lack of a mobile visual pass remain. Local preview and developer package refreshed; not published.

Screenshots: product-selected-offer-refined.png, profile-verification-vivid-red.png and home-plant-promotion.png.


## Completed profile design preview — 23 October 2026

Added Preview completed profile beside the existing Complete your profile action in About me. It opens an inline completed-account design and Back to current profile restores the original completion pitch. Navigating to another Profile section also clears the preview. Entry focuses the overview heading; returning focuses the preview button.

The example shows the current account name, location and Customer ID with Profile complete / 8 of 8 steps completed, an Active account status, €2,450.00 wallet credit, €1,758.40 outstanding and two pending payment actions. Status and finances are clearly labelled design examples. Outstanding totals and action counts derive from the same independent demo billing orders already used in Billing history. Each View order action opens the matching read-only product/totals dialog. Wallet credit remains separate from outstanding amounts; no settlement is simulated.

This is component-local display state only. Opening or leaving it never saves verification, marks a real contact as verified, activates an account, credits a wallet, creates an order or changes browser storage. A live completed-account view still needs server-supplied account status, wallet and outstanding-ledger data. The existing onboarding form, Settings, billing history and top-up flow keep their behavior; no Finance navigation section is added.

Build, whitespace checks and all 121 tests pass. Three new regressions cover reversible preview navigation and state isolation, reconciled example metrics/actions and exact demo details, and leaving/re-entering About me. Browser QA at 1864 × 984 confirms the overview, action detail dialog, return to the completion screen, focus restoration, no horizontal overflow and no console warnings/errors. No browser account or shopping data was saved. Responsive layouts are included; mobile visuals and the standalone file origin were not browser-verified under the previously observed tool limitations. The standalone HTML is byte-matched to the build. Local preview and developer package refreshed; not published.

Screenshots: profile-completed-preview-button.png and profile-completed-preview.png.


## Account status chip in completed profile — 23 October 2026

Moved Active from the separate overview metric into a compact green chip beneath the name in the completed profile identity card. The chip has the accessible label Account status: Active and retains Verified and ready to trade as its tooltip. The remaining wallet, outstanding-balance and pending-action cards use three columns on desktop and wrap on smaller screens. Preview status and balances remain display-only.

Build, whitespace checks and the three completed-profile regression tests pass. Browser QA at 1864 × 984 confirms chip placement, removal of the separate status card, three remaining metrics, no horizontal overflow and no console warnings/errors. No account data changed. Local preview, standalone HTML and source/handoff package refreshed; not published. Screenshot: profile-active-status-chip.png.


## Personal greeting on Profile — 23 October 2026

Changed the About me content heading to Good morning, followed by the saved customer display name. It appears in both the current profile and completed-account preview. The sidebar keeps its About me label and other section headings are unchanged. Build, whitespace checks and six existing identity/completed-profile tests pass; desktop browser QA confirms the greeting in both views. Screenshot: profile-morning-greeting.png. Local preview and deliverable package refreshed; no account data changed.


## Compact pending actions — 23 October 2026

Reduced the completed-profile Pending actions panel with a smaller single-line header, tighter row and footer padding, smaller icons and a shorter demo-total note. Removed the repeated profile-completion sentence. Amounts, statuses, references, dates and both order-detail actions remain visible. At 1864 × 984 the panel height is approximately 233 px, down from 316 px (about 26% shorter), with no horizontal overflow or console warnings/errors. Build, whitespace checks and the three existing completed-profile tests pass. No account data changed. Local preview, standalone HTML and source/handoff package refreshed. Screenshot: profile-pending-actions-compact.png.


## Removed completed-overview heading — 23 October 2026

Removed Your account at a glance and its description. The three balance/action cards now align with the top of the identity card. The section retains its accessible Account overview name and receives focus when the preview opens. Build, whitespace checks and three existing completed-profile tests pass; desktop browser QA confirms the copy is absent, the cards align and there is no horizontal overflow. Screenshot: profile-overview-heading-removed.png. Local preview and deliverable package refreshed; no account data changed.


## Pending actions beneath balances — 23 October 2026

Moved the compact Pending actions panel into the right-hand account overview, directly beneath the three balance/action cards with a 20 px gap and matching edges. The identity card remains alongside it; the existing single-column layout applies on smaller screens. Build, whitespace checks and three existing completed-profile tests pass. Desktop browser QA confirms alignment, matched widths and no horizontal overflow. Screenshot: profile-pending-below-balances.png. No account data changed; local preview and deliverable package refreshed.


## Readable completed-profile identity card — 23 October 2026

Reorganized the completed-profile identity card into a left-aligned header with a smaller avatar, prominent name, buyer type and Active chip; a labelled definition list for Customer ID, Location and Member since; and a separate light completion footer. Consistent label/value spacing and thin separators replace the scattered centred text. Existing identity values, account-status chip and completion information are preserved. The original incomplete-profile card is unchanged. Wider stacked layouts show the three details as columns, returning to labelled rows on narrow screens.

Build, whitespace checks and six existing identity/completed-profile tests pass. Browser QA at 1864 × 984 confirms all values and labels, the new hierarchy, no horizontal overflow and no console warnings/errors. No account data changed. Local preview, standalone HTML and source/handoff package refreshed. Screenshot: profile-identity-card-organized.png.


## Completed profile is the only About me view — 23 October 2026

About me now opens the completed account layout immediately. Removed the incomplete identity/pitch branch, benefit copy, Complete your profile action, Preview completed profile toggle and Back to current profile action. The large preview banner is replaced by a small Demo account data note beneath the overview. Returning from another Profile section always shows the same completed layout. Account information, Settings, Billing history and Top-up history remain available.

The completed layout still uses display-only example status and finances; this UI change does not complete onboarding, activate an account, verify a contact, add funds, or change saved customer or shopping data. Pending-action details remain read-only demo order dialogs. The component is now named RCompletedProfile, and obsolete toggle state and callbacks are removed.

Build, whitespace checks and all 121 tests pass. Updated the existing identity and completed-profile tests for direct default rendering, state isolation, exact details and navigation persistence. Browser QA in a separate 1280 × 720 HTTP preview confirms immediate completed rendering, no obsolete prompt/buttons, returning to About me, working order details, no horizontal overflow and no console warnings/errors. The user’s product tab was preserved. The standalone HTML is byte-matched to the build; local preview and source/handoff package refreshed, not published. Screenshot: profile-completed-only.png.
