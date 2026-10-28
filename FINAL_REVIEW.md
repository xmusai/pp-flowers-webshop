# PP Flowers — final desktop review

Reviewed 22 September 2026 at 1375 × 998. This pass preserves the requested design and focuses on useful buying information, navigation, accessibility and unnecessary content.

| Page | Changes / outcome | Verification |
| --- | --- | --- |
| Flower market | Removed repeated spotlight and grower-section copy; stated VAT treatment beside featured unit prices. Existing four-category merchandising remains. On shorter desktop screens, the hero and featured photos are more compact so Add buttons clear the fixed basket bar. | Hero, featured offers, growers, collections and footer inspected. |
| Flower catalogue | Delivery date can be changed beside availability filtering. Grower choices reflect the current catalogue. | Exact Red Naomi / Black Tulip / 65 cm search returned the €0.26 offer. Switching from 23 to 24 September recovered the result under Available only. |
| Photos and Details | Preserved five and six desktop columns and compact buying controls. | Desktop grids inspected; no horizontal overflow. |
| Plants | Replaced redundant All products / Potted plants choices with All plants. Used height labels and a legible missing-image placeholder. | Plant catalogue and comparison inspected. Source images remain sample assets. |
| Product comparison | Remaining stock now deducts quantity already in the basket. Return navigation retains search and filters. | Product selection, delivery modal and return to filtered results checked. |
| Basket | Replaced the vague review warning with the affected product, grower and direct resolution actions. Removed the repeated demo-price paragraph. | Added a later-date offer in a separate local test origin, moved delivery earlier and verified the actionable warning. Original local/site basket records were not changed. |
| Checkout | Removed the extra eyebrow and completed-minimum progress bar. Added selected payment method beside the total. Kept one concise demo-order notice. | Invalid email blocked submission; total and selected payment method displayed correctly. |
| Orders | Removed search when history is empty. Exposed existing Buy again catalogue. Order detail heading now identifies the order and placed date. | Existing confirmed and awaiting-payment records inspected without creating new records. €596.90 and €597.40 totals remain unchanged. |
| Repeat orders | Preserved current-offer review before adding; corrected singular/plural labels. | Opened and cancelled review of an existing order; source model tests cover atomic additions and stock limits. |
| Saved | Clearer Saved heading, counts limited to saved products, no inactive Save current basket action when basket is empty. | Three favourites produced Show 3 products in Filters; existing saved-order listing inspected. |
| Account | Removed test-only price/stock simulation switches. Improved secondary-text contrast; retained supplied profile layout and local account functionality. | About me, information, tickets, billing and top-up sections reviewed, including existing history. |
| Customer service | Updated delivery instructions to match current controls and clarified basket persistence copy. | Help content and navigation inspected. |
| Shared navigation | Skip link focuses the main content without changing routes. Page titles follow the current page. Malformed route encoding falls back safely. | Keyboard skip kept #support and focused main-content. New malformed-fragment regression test passes. |

## Validation and limits

All 24 existing and added automated checks pass. The production build succeeds. No browser warnings or errors were observed in the reviewed sessions.

Automatic approval review rejected creation of a new demo order because it would create a persistent record. No retry or indirect order creation was attempted. Confirmation, order history and repeat-order UI were instead inspected using existing local records; order creation, totals, address snapshots and balance deduction were validated by the automated model tests. This pass does not claim a newly submitted browser order.

Inventory, images, prices, growers and delivery windows remain supplied prototype data. Live fulfilment, payment processing, authenticated accounts, production inventory and tax/shipping integrations remain outside this design-review scope.

## Homepage recommendations — 23 September 2026

Added six existing catalogue products in two new buying sections and four colour shortcuts. Verified the white/pink/purple/orange filters return 2/6/3/1 products respectively, Sorbonne opens its grower comparison, and Explore all foliage returns the four foliage products. At 1728 × 998, the new sections have no horizontal overflow and all six product images load. Browser warning/error log is empty; all 24 automated checks pass. Existing basket and order records were left unchanged. Source remains local while the earlier publication approval is pending.

## Departure-date update — 23 September 2026

Replaced order-date wording throughout the buying flow with departure dates, and separated shipping charges and destination addresses from the dispatch date. The picker and order summary clarify that the carrier determines arrival timing.

Tomorrow is the default on each picker opening, including weekends; choosing a later date requires confirmation. Closing or cancelling preserves the confirmed date. An expired saved date resets to tomorrow on load without changing basket lines or historical orders.

Verified locally at 1375 × 998: homepage and catalogue show departure on 24 September; the picker starts with Tomorrow · Thu 24 Sept and includes Saturday and Sunday; selecting Saturday and cancelling leaves Thursday unchanged; reopening starts with tomorrow; confirmation survives reload. Product comparison uses Earliest departure and the basket identifies an offer that cannot depart until 25 September. Order history and help contain no delivery-date wording. No browser warnings or errors were observed. All 27 automated checks pass and the production build succeeds. No new order was submitted. Publication remains pending the earlier approval.

## Foliage section redesign — 23 September 2026

Removed the large green wrapper and introductory column. The new section uses two horizontal cards with full-height photography, larger buying details and aligned price/action rows. Browser verification at 1375 × 998 confirmed equal 334 px card heights, both images loaded, no horizontal overflow, working product comparison and the four-product foliage catalogue link. This presentation-only change preserves existing buying behaviour and basket contents. Production build succeeds.

## Catalogue departure selector — 23 September 2026

Moved departure date into the top search bar after Length, with a calendar icon, label, selected date and chevron. Removed the date control from the catalogue heading and the Available only checkbox. The search bar adapts to narrow screens while keeping the date alongside the other criteria.

Verified at 1375 × 998: all 28 flower products remain visible, there is no horizontal overflow, and the date picker opens with tomorrow selected without submitting or clearing an unfinished search. Cancelling preserves the confirmed date. Browser warnings/errors are empty and the production build succeeds.

## Customer service tickets — 23 September 2026

Replaced the market-return button with “Still have questions? Get in touch”, opening a customer service ticket form. The form prefills the account email and supports an optional existing order reference, subject and message. Required-field errors focus the first invalid field. Successful local storage creates a reference and confirmation, and Profile → Past tickets lists saved tickets and opens their full messages. Storage failure keeps the message in the form for retry. Tickets are explicitly marked Not sent; this prototype has no support backend.

Removed the “Is this a real order?” FAQ card as requested. The remaining five questions and contact action were checked in the local preview without horizontal overflow.

All 29 model checks pass, including ticket validation, older-account compatibility, unique references, persistence and unchanged shopping state. The production build succeeds. Browser checks covered the form, required-field errors and optional order selector; an isolated localhost origin verified creation, reload, ticket history and details, with no browser warnings/errors. The main preview's basket, order history and ticket list were not changed by testing. Live publication remains pending the earlier approval.

## Saved orders redesign — 23 September 2026

Replaced the small draft tiles with full-width order rows showing flower thumbnails, product names, line count and a clearly labelled saved subtotal excluding VAT. Review & reorder opens the existing current-offer review directly; editing and recoverable deletion remain secondary. The section includes an order count, an outlined Save current basket button and a useful empty state. Narrow layouts reflow the actions below the order details.

Verified at 1375 × 998: both saved-order photos load, the €574.80 saved subtotal matches the review, and Review & reorder, Edit order and Save current basket each open the correct dialog. Cancel/close leaves the saved order and basket intact. No horizontal overflow or browser warnings/errors. Production build succeeds; the ordering model is unchanged.

## Easier catalogue and repeat ordering — 6 October 2026

- Split Saved into Favourite products and Saved orders views, with counts and direct navigation. Product search, filters, sorting and Photos/Details controls appear only with favourite products; reusable orders retain their previews and Review & reorder action.
- Removed duplicate Grower and Length fields from Filters. The search bar owns those criteria; Filters contains Colour and Maximum price per unit. Reset colour & price preserves the selected grower and length, and the filter badge counts only the fields in that dialog.
- Added Buy again to the main navigation, with context-specific search and the existing Review last order flow. Accounts without previous orders see a useful empty state rather than favourite products presented as past purchases.
- Adapted the four navigation links for narrow screens, including the compact header at 320 px.

Verification: all 29 automated checks pass and the production build succeeds. Browser checks covered preserved grower/length selections after a filter reset, independent saved views, saved-order review, repeat-order review, and the no-orders state on an isolated localhost origin. Desktop and 390/320 px layouts were inspected; there is no page overflow or browser warning/error. Existing basket, saved order and order history were left unchanged. This update is ready in the local preview; live publication remains pending the earlier approval.

## Homepage product carousels — 6 October 2026

Desktop buying is the design priority. Five- and six-card layouts keep specifications and purchasing controls visible together; mobile retains basic responsive support.

Popular flower offers now contains ten existing catalogue products and More for your bouquets contains eight. Both sections use horizontal scroll-snap rows with previous/next buttons, keyboard controls and native touch/trackpad scrolling. Five cards fit at 1375 px and six at wider desktop sizes; mobile shows a full card and part of the next. No automatic rotation is used, and reduced-motion preferences are respected.

The compact cards preserve unit price, VAT context, grower/origin, labelled length, quality grade and colour, departure date, basket quantity, grower comparison, order quantity and line total. Purchase and comparison actions keep the exact offer identity and the existing quantity/availability rules. Foliage and catalogue cards retain their separate designs.

Verification: production build and all 29 automated tests pass. Browser checks confirmed five and six complete desktop cards, independent carousel paging and disabled end controls, keyboard Home navigation, horizontal mobile scrolling without page overflow, loaded product images and exact-offer comparison for Athena. Existing basket and orders were not changed. The local preview continues at the same address; publication remains pending the earlier approval.

The active source checkout is now `refined-site` in the PP Flowers workspace, copied with its existing Git history from the previous task directory. The previous source was preserved, and the local preview now serves this checkout.

## Tighter desktop product cards — 6 October 2026

Reduced homepage card height by about 20% while retaining product photos, grower and origin, labelled length/quality/colour, unit price and VAT context, departure, comparison and add-to-basket controls. Price and grower comparison now share one row; existing basket quantities appear as photo badges rather than reserving a second departure line. Specification values sit in a compact, lightly tinted panel.

The production build succeeds. Desktop checks at 1375 px and 1864 px confirm five and six complete cards respectively, with no content clipping or page overflow. Popular cards measure about 408 px and 432 px high (previously about 513 px and 543 px). The relocated comparison action opens Bacardi’s matching Deliflor offer (70 cm, A1, €0.42 per stem); no browser warnings or errors appeared. Basic responsive behaviour is retained; this pass focuses on desktop. Local preview only.

## Homepage colour section removed — 6 October 2026

Removed Shop by colour and its unused homepage data and styling. Popular flower offers now leads directly into More for your bouquets. The production build succeeds, and the local browser confirms the section is absent. Product colour specifications and catalogue filters remain available.

## Foliage uses the shared product cards — 6 October 2026

Greens & foliage now uses the same compact product cards and row component as the other homepage recommendations. Both existing products keep photos, notes, grower/origin, labelled length/quality/colour, price, departure and purchase controls. View all foliage retains its catalogue filter. Unneeded carousel arrows are hidden when all cards fit. The older wide foliage layout and unused styling were removed.

Production build and whitespace checks pass. Desktop inspection confirms the same card width as Popular flower offers, both images loaded, preserved offer information and no page overflow. Updated locally.

## Category rows and developer handoff — 6 October 2026

Find Flowers now has one independently scrolling row per category in both Photos and Details views. The prototype shows every matching grower offer as its own card, retaining exact grower, size, grade, origin, price, quantity and departure. Featured order cycles through varieties before alternate growers; price sorting includes every offer. Search, filters and category selection constrain the same displayed offers. Quantities are keyed by offer ID, and comparison/back restores the horizontal row position.

The eight flower rows and 192 offers are mock counts, not production limits. See [DEVELOPER_HANDOFF.md](DEVELOPER_HANDOFF.md) for the 4,000+ product requirement, production identity rules, per-category cursor pagination, lazy loading, virtualization, server validation and acceptance scenarios. These production services are documented, not implemented by the local prototype.

All 33 automated checks pass, including complete category partitioning, variety-first ordering, combined exact-grower filtering and per-offer price sorting. The build succeeds. Browser checks cover independent Roses/Tulips scrolling, true end controls, Photos/Details, five-card laptop and six-card wide desktop layouts without clipping, a targeted alternate-grower search, quantity isolation, exact-offer comparison and return-position restoration. No browser warnings/errors appeared. Existing basket and order data were unchanged. Local preview only; not published.

## Catalogue filter strip — 6 October 2026

Moved the flower category controls directly below the search bar, following the supplied filter-strip reference. Filters comes first, followed by a subtle divider and compact rounded category buttons. The complete strip and applied-filter chips are centered beneath the search bar. Search, grower, length and departure stay together above; applied filters and a removable search chip sit beneath the strip when needed. Sorting now appears at the end of the centered filter strip as a rounded “Sort by” control with an icon, clear current value and keyboard focus state. The results toolbar retains the Photos/Details switch. The overall catalogue title and product/offer totals have been removed visually at the user’s request; a hidden heading and result announcement retain screen-reader context. Category headings and their counts remain visible.

The existing category rows and exact-offer buying controls remain intact. Browser verification covered category selection, colour filtering and clearing, query search and clearing, per-offer price sorting, both views, and laptop/wide desktop spacing. All flower categories fit at 1375 px and 1864 px with no page overflow. The production build and all 33 automated checks pass, with no browser warnings/errors. Basket data was not changed. Updated local preview only.

Sort-control follow-up: desktop verification confirmed correct lowest-price ordering and a complete centered filter/category/sort strip at 1375 px without clipping or page overflow. The native select retains keyboard interaction. The build succeeds; local preview and source package refreshed.

## Find Plants category rows and AI photos — 6 October 2026

Find Plants now shares the centered category/filter/sort strip and independently scrolling offer rows used by Find Flowers. Twelve plant varieties (nine added) are grouped into Orchids, Flowering plants, Green plants and Succulents, with 75 illustrative grower offers. Photos and Details retain grower, height, pot diameter, grade, colour, price per plant, departure, quantities and buying controls. Comparison and basket metadata retain the selected plant specifications.

Ten new catalogue photos were generated with the built-in image-generation tool and optimized as square JPEGs in `assets/plant-mock/`. The prompt and asset manifest is `assets/plant-image-prompts.json`. These are illustrative AI images and mock inventory, not verified supplier stock; the developer handoff documents this and the production loading requirements for more than 4,000 products. Existing plant offer identities are preserved.

Verification: all 37 automated checks pass and the standalone build succeeds. Desktop inspection confirms five/six complete cards, independent category scrolling, no clipping or page overflow, and loaded photos for all 12 plants. Combined Monstera/grower/height search returns the exact matching offer. Comparison preserves the selected nursery, height, pot diameter, quantity and calculated total. Both Photos and Details work; the browser reports no warnings or errors. Existing basket and order data were not changed. Ready in the local preview; not published.

## Balanced category alignment — 6 October 2026

The desktop filter strip now uses equal side columns for Filters and Sort by, so the category buttons themselves align with the center of the search bar. Previously the longer sorting control shifted the category group slightly left even though the complete strip was centered. Verified flower and plant views at 1375 px and the wide desktop view, including the longer Highest price label: categories remain centered and fit without page overflow. The build and whitespace checks pass; shopping logic is unchanged.

## Recommended Best sellers — 7 October 2026

Added Best sellers as the first product row beneath the Recommended hero. Eight existing catalogue products use the shared compact cards, Best seller badges and independent horizontal navigation. Prices, exact grower, length, quality, colour, departure, basket indicators and buying actions remain visible. The existing Popular flower offers, bouquet and foliage rows remain available.

This selection is mock merchandising data, not a measured sales ranking. The developer handoff explains how to replace it with a verified sales-backed selection. Build and whitespace checks pass. Browser verification confirms eight loaded product photos, independent row scrolling, complete desktop cards without page overflow and exact-offer comparison (Red Naomi, Porta Nova, 70 cm, A1 Extra, €0.24/stem, 80 stems). No console warnings/errors were reported. The local preview server was restarted; existing basket data was preserved.

## Product-row swipe discovery — 21 October 2026

Every overflowing product row now makes a brief sideways nudge and returns to its starting position when it is at least 65% visible between the fixed header and basket bar. The gesture lasts 1.25 seconds, moves at most 88 px and plays once per row per page load, including Recommended and the flower/plant category rows. Rows that fit, rows with a restored scroll position, and reduced-motion preferences skip the hint. Pointer, touch, horizontal wheel and keyboard/focus interaction take control immediately. Leaving the viewport or hiding the page cancels the gesture; temporary hint positions are excluded from saved category scroll positions.

Verification: all 42 automated checks and the build pass. Browser observations confirmed the Best sellers and Popular flower offers rows move out and return to zero independently when scrolled into view; a later bouquet row also shows the cue. Returning to the homepage does not replay completed hints. Catalogue arrow navigation still advances Roses independently of Tulips. No page overflow or browser warnings/errors appeared; existing basket data was preserved. Updated locally.

## Wholesale reorder worksheet — 21 October 2026

Buy again now uses a compact spreadsheet-style worksheet instead of large product cards. Each exact grower offer occupies one row with a small photo, product, grower, size, quality, colour, last quantity/date, current unit price, editable quantity, line total and availability. Previous quantities are prefilled; buyers can type thousands of stems directly, press Enter to move to the next row, select several lines and add them together. A compact last-order shortcut and a separate previous-orders view support whole-order review. The large search masthead, view switch and generic catalogue filters are removed from this page.

Selections and valid edited quantities survive search, sorting and comparison/back. Search explicitly reports selected lines that are hidden. Invalid quantities remain visible and block bulk adding. Exact offer identity, minimums, increments, departure eligibility, existing-basket quantities and stock are validated before the batch changes the basket. A changed price in an existing basket line requires basket review. Whole-order review accounts for stock already in the basket and discloses adjusted quantities and changed prices. Unavailable historical offers stay visible with an alternatives action rather than silently choosing another grower.

Verification: all 52 automated checks and the standalone build pass. Browser checks at 1864 × 984 covered 500 roses plus 2,000 tulips (€500), Enter-to-next-row, search/hidden selections, invalid increments, remaining stock, previous-order review and exact-grower comparison/back. No page overflow or browser warnings/errors appeared. Actual bulk merging and persistence were tested with model fixtures; browser additions were not submitted, preserving the existing basket and history. Automatic approval review rejected a separate browser test-account setup because it could overwrite saved basket data, so that setup was abandoned. This pass prioritizes desktop; narrower layouts were not reverified. The local preview and developer package are updated; not published.

## Large sample wholesale order — 21 October 2026

Buy again now includes a labelled, display-only sample purchase with 24 exact offer lines: 22 varieties from 20 growers, comprising 16,540 stems and 268 plants. The sample subtotal is €6,011.16 excluding VAT. It includes alternate growers of the same variety, flowers, foliage and plants; quantities respect each fixture offer's stock and order multiple. Sample data is merged only into the Buy again display and is never written to account order history, billing or the existing basket. The sample can be reviewed through the current-offer review flow.

The worksheet has a bounded scroll area, fixed column headings and a bulk-action footer beneath the table. Desktop browser verification at 1864 × 984 reached the final plant row with the headings still visible, selected all 24 lines, and confirmed a €6,006.56 add subtotal after reducing Avalanche+ by 10 stems to account for existing basket stock. The complete 24-line review opens and discloses that adjustment; no addition was submitted. The fixture has 24 unique offer IDs and valid unit quantities, all 52 existing automated checks pass, and the standalone build succeeds. No page overflow or browser warnings/errors appeared. Local preview and developer package refreshed.

## Seasonal, quality and personal recommendations — 21 October 2026

Recommended now includes In season now · October, Highest quality, and a Favourites row under the Saved by you label. The current seasonal edit has six products; its heading and editorial selection follow the current month in Europe/Amsterdam, refreshed on visibility changes and every minute while open. Highest quality contains nine offers with the fixture's A1 Extra grade, using the actual matching grower offer rather than the cheapest lower-grade offer. Favourites uses only the buyer's saved product IDs, includes a View all favourites link, and has an honest empty/unavailable state without suggested products presented as personal saves. Saved plants retain height and pot diameter alongside their unit price.

The three sections use the shared compact product cards, independent horizontal rows, arrows, keyboard navigation and one-time swipe discovery when the row overflows. All buying details and exact-offer comparison/add actions are preserved. Existing recommendation sections remain available.

Verification: all 55 automated checks and the standalone build pass. Tests cover the Amsterdam month boundary, changing seasonal picks, strict top-grade offer selection, unavailable offers, deduplicated personal favourites and plant quantities. Desktop browser checks at 1864 × 984 confirm the three new rows, loaded photos, six complete cards, independent quality-row end/Home navigation, and View all favourites opening Saved. Quality comparison opens Strong Gold from Rosaprima, 38 cm, A1 Extra, €0.23/stem, 500 stems (€115), matching its card. No page overflow or browser warnings/errors appeared. Existing saved products and basket were unchanged. Local preview and developer package refreshed; not published.

## Taller Buy again worksheet — 21 October 2026

Removed the short desktop worksheet viewport. All 24 purchase lines now extend down the page, using normal page scrolling rather than a nested five-row box. Column headings stick below the main navigation and the bulk controls remain above the basket bar. Field scroll margins leave room for those controls. At narrower widths, horizontal containment remains available with a taller internal viewport.

The standalone build and whitespace checks pass. Browser verification at 1864 × 984 confirms the table grows from 472 px to 1,930 px, exposes eight complete rows plus another partial row while browsing, and reaches the final plant rows. Headings and bulk controls remain accessible through page scrolling, with no nested vertical scrolling, page overflow or console warnings/errors. Quantities, selection and basket data were not changed. The local preview and developer package are refreshed.

## Wholesale reorder review — 21 October 2026

Replaced the large vertical product blocks in Review items to add with a wider Review your reorder worksheet. Compact table rows retain the product photo/name, origin/colour, exact grower, size and pot diameter, grade, current unit price, editable unit quantity and line total. Buyers type large quantities directly and use Enter for the next row. Column headings, total unit quantities, subtotal, Cancel and Add remain visible while scrolling the rows. Larger source orders use the tall desktop dialog; smaller orders open in a shorter window.

Changed prices and quantities are shown inline and counted above the table. Excluded unavailable lines are listed separately. Removing a review line has an undo action and leaves the source order unchanged; an empty review offers restoration and disables Add. Invalid raw quantities remain visible and block submission, including a specific remaining-stock message. The review validates the displayed price, exact offer, departure, quantity rules and cumulative basket stock again before one atomic addition.

All 56 automated checks and the standalone build pass. Desktop browser verification at 1864 × 984 covered the 24-line sample, scrolling to the last plant rows with fixed headings/footer, direct editing and Enter navigation, invalid pack quantities, stock limits, removal/undo, and a two-line previous order with price/quantity changes. Empty-review removal/restoration also works. The sample review subtotal is €6,006.56 after accounting for existing basket stock. No additions were submitted, and original orders and basket contents are unchanged. No horizontal overflow or browser warnings/errors appeared. Local preview and developer package refreshed.

## Orange reorder review action — 21 October 2026

The latest-order review button now uses the shared orange primary-action style, making Review sample order / Reorder last order easier to find. The build and whitespace checks pass; desktop browser inspection confirms the orange background and the existing review opening correctly.
