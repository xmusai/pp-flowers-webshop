# PP Flowers — Refined desktop buying experience

A standalone ordering prototype refined from **PP Flowers My Dashboard (Offline).html**. Desktop is the priority. The original branding, imagery, catalogue and sample offers are retained.

## Run

- Open `dist/index.html` in a browser. All runtime assets are embedded; no server or installation is required.
- To rebuild: `npm run build` (Node.js; Babel is vendored for build-time compilation).
- To check the ordering model: `npm test`.
- For local browser development: `npm run dev`, then open the printed localhost URL.

## Desktop refinements

- Photos view now shows five cards per row from 1200 px: smaller images show the complete bouquet, with compact pricing, comparison and purchasing controls. The six-column Details view is preserved.

- Redesigned the six-column Details cards for side-by-side comparison: wider catalogue workspace, aligned unit prices and grower names, a consistent Length / Grade / Colour / Origin panel, explicit grower comparison, separate quantity controls and a full-width Add button showing the line total. Delivery, stock and basket quantities occupy consistent positions.
- Combined categories, filters and sorting into one toolbar and moved catalogue shortcuts beside the heading, so the first row is available sooner.

- Profile follows the supplied account reference: a minimal header, warm background, left navigation, identity card and profile-completion benefits with an orange action. The identity card uses the saved buyer name and city.
- Account information validates and saves contact, business and delivery details. About me reflects saved details. Billing history uses actual demo orders, top-up history records new demo credits, and Past tickets lists locally saved customer service tickets with readable details and a new-ticket action.

- Header and search follow the supplied September 14 reference: centered Recommended / Find Flowers / Find Plants navigation, customer service and account/order/saved/basket icons, and a rounded Search / Grower / Length bar with an orange search button.
- Search combines the three fields against exact grower offers. Flower and plant navigation scopes the catalogue; the toolbar retains additional filters and sorting. The six-column Details view is retained.

- Sales-led Flower market homepage at `#shop`: rose collection, grower spotlight, four featured offers, grower assortment links, and Roses, Tulips and Chrysanthemums collections under “Shop by flower”. Each collection opens its matching catalogue category.
- Removed the global delivery strip. Delivery dates remain available through buying actions, the basket and checkout; availability and order validation still use the selected date.
- Reduced the homepage’s bottom padding and aligned the footer to the “Know exactly what you need?” content edges. Basket clearance is retained when the order bar is visible.
- Removed the redundant “All products / Buy again” shortcuts from the catalogue heading; the Photos / Details switch remains beside the title.
- A dedicated `#catalogue` route keeps the complete Photos / Details catalogue accessible from All products. Homepage search, collection links and grower tiles apply the matching catalogue filters.
- Removed “The rose edit” label from the homepage banner.
- Removed the explanatory price note beneath the homepage’s featured offers.
- Featured offers use existing sample prices and prefer offers available for the selected delivery date. Each card opens its exact grower for comparison or adds the displayed order lot; stock, date and basket validation still apply. No discounts or popularity claims are fabricated.

- Photo cards now show the product colour name and a matching swatch at the upper right of the card details, beside the product name, using the same colour data as Details and filters. Mixed colours use the existing multicolour swatch.
- Six-column Details grid on desktop screens from 1200 px, with smaller thumbnails, compact specifications and visible quantity/Add controls.
- Compact catalogue with visible categories and a Photos / Details switch. Detailed cards restore the earlier specification layout: small thumbnail, unit price, length, delivery, grower offers, colour, grade, grower and origin. The order lot initializes the quantity control; minimums and multiples are stated beneath it.
- Compact detail cards keep the first row’s quantity and Add controls in the initial desktop viewport. Unit prices share a baseline, specifications use two columns, and Compare grower offers and Add to basket are separate full-width actions.
- Catalogue quantities survive switching between Photos and Details and opening/returning from offer comparison. The chosen Photos/Details preference persists in this browser.
- Available-for-date filtering uses matching offers, stock and the chosen date together. Later offers have an actionable delivery control; an expired saved delivery date has an explicit recovery prompt.
- The desktop basket bar shows progress toward the €500 minimum; add confirmations link directly to the basket.
- Consistent selected-date availability in product and ordering views.
- Compact product photo with enlargement on demand; the larger offer comparison appears directly below the product summary. The duplicate bottom product purchase bar is hidden when the sidebar has room.
- Redesigned the product overview as a compact buying summary with matching grower price ranges, stem-length filters and an actionable delivery date showing how many offers qualify. Changing length keeps the selected grower in the visible comparison; sold-out offers are excluded from advertised price ranges.
- Selectable grower rows separate price, length, grade, origin, delivery and minimum quantity. Sort by price, delivery or length; the adjacent purchase panel updates quantity and total immediately.
- Chosen grower, length, grade, origin and price are preserved in the order.
- Search and filters match individual grower offers, including combined inputs such as `Red Naomi Black Tulip 65cm`.
- Cleaned up the basket heading: removed “Your next order”, placed an outlined Continue shopping button in its own row above the title, aligned to the right, and removed the shared Offline demo heading badge and footer note.
- A single saved order model drives basket, checkout, balance and order history. Quantities always mean stems/plants/pieces, never a hidden conversion to bunches.
- Validated address and email, editable delivery details, explicit price/stock review and clear transfer vs balance states.
- Editable named saved orders, unified favourites, repeat-order review, removal undo, native accessible dialogs and visible keyboard focus.
- Runtime file reduced from about 15 MB to 5.8 MB by removing unused legacy screens, fonts and browser-side Babel compilation.

## Scope and limits

This is a design and interaction prototype, not a live shop. No payments, emails, dispatches or support tickets are sent. Inventory, growers, prices and weekday delivery options are fixtures inherited from the supplied sample; they are not a current commercial offer. The €500 product minimum and €24.50 delivery are sample rules; totals exclude VAT.

State is saved in this browser's local storage. Each file/site origin has its own local data. Previous orders from the old prototype are not migrated because their quantities and prices were inconsistent. The original source file is preserved. The `src/legacy/` files and `src/legacy.css` remain as a reference but are not shipped in the new runtime.

Profile completion benefits and the membership date reproduce the supplied design fixture. Saving profile details does not grant account verification, credit terms or transport priority.

Live launch still needs authoritative inventory/pricing, shipping/cutoff and VAT calculations, account authentication, server-side order persistence and idempotency, payment processing and order notifications.

## Validation

24 automated checks pass: malformed-route recovery, product overview price ranges and length filtering, sold-out and expired-date overview states, atomic top-up balance/history updates and persistence, featured-offer date/stock selection, delivery filtering with stock and grower constraints, expired-date filtering, canonical €596.90 regression, alternate grower identity, persistence, saved address snapshots, quantity multiples and stock, €500 minimum, email/address validation, available dates, price/stock revalidation, exact balance deduction, atomic repeat-order additions, combined offer search and filters, catalogue integrity and storage fallback.

The latest homepage update was checked at 1567×994: the delivery strip is absent, the new collection tiles render correctly, Chrysanthemums opens the three matching products, and the footer shares the catalogue callout’s left and right edges. An expired delivery date can still be updated through the featured offer’s delivery action. No browser errors were observed.

The five-column Photos view was checked at 1920×994, with full bouquet images and all five first-row quantity/Add controls visible above the basket bar. The updated Details catalogue was checked at 1680×994: all six first-row Add buttons remain above the basket bar, quantity changes update the line total, comparison and return preserve that quantity, and a 110-stem Avalanche+ addition retains Marginpar at €0.46 per stem (€50.60 total). The profile was visually checked at 1567×994, including email validation, saved account details after reload, existing billing records, ticket empty state, and a €50 demo top-up updating balance and history together. The reference header was checked on desktop, including plant navigation and combined product/grower/length search. The six-column catalogue was visually checked at 1488×998, including quantity totals and comparison navigation. The sales homepage was checked at 1920×994: collection and grower navigation, exact-offer search, comparison, featured-offer basket additions, image rendering and catalogue route reload. Browser checks also cover first-screen purchasing at 1519×994 with no horizontal overflow, date-filter empty-state recovery, actionable delivery changes, retained catalogue quantities through comparison and view switching, persistent view preference, add-confirmation basket navigation, compact product photos, grower radio selection and sorting, minimum-quantity adjustment, later-delivery guidance, synchronized purchase controls, exact selected-offer basket additions, desktop catalogue/search/filtering, keyboard quick order, grower replacement, basket navigation/reload, saved-order editing, repeat-order review, invalid checkout details, transfer confirmation and balance payment. No browser errors were observed on the optimized build. A 390 px layout overflow discovered during early inspection was corrected; further mobile refinement is deferred in favor of desktop.

The €596.90 test order (10 Red Naomi stems at €0.24 plus 3,000 Strong Gold stems at €0.19, with €24.50 delivery) remains €596.90 in checkout and saved order history. The edited address and requested date are preserved.

The product overview was checked at 1567×994 on Athena: 40 cm filters seven offers to three and selects Porta Nova, prices update to €0.35–€0.44, delivery availability changes from 2/3 to 3/3 for the next date, All lengths restores seven offers, and the larger photo opens correctly. Saving toggles the saved state and no browser errors were observed.

The basket cleanup was checked on desktop with both an empty basket and three existing product lines. The Continue shopping button returns to the flower market, and the removed heading/footer labels are absent. No browser errors were observed.

## Research-led homepage selection — 22 September 2026

The hero, four featured offers, category-scoped grower links and flower collections now focus on roses, tulips, chrysanthemums and gerberas. Porta Nova / Red Naomi replaces the generic grower spotlight. Each collection opens the matching flower category; each grower tile applies both the category and grower. Existing catalogue prices, stock and ordering rules remain in use.

See [Market research and asset notes](MARKET_RESEARCH.md) for the evidence, scope and illustration provenance.

## Shared button design — 22 September 2026

The product, checkout, basket and order back actions share an outlined button with a directional icon. Purchase actions retain the orange brand colour; secondary actions, comparisons, saved items, view toggles and length choices use consistent geometry and green interaction states. Quantity controls and modal close actions use matching SVG icons. Hover, pressed, keyboard focus and disabled states are explicit, with reduced-motion support. The five-column photo and six-column detail layouts retain their compact controls.

Verified at 1375×998: five photo cards and six detail cards fit without horizontal overflow; all six first-row detail purchase buttons sit above the basket bar. Product length selection, quantity totals, photo modal close, return navigation and basket actions work. Keyboard focus produces a visible 3 px ring. Existing basket contents were preserved.

## Final page-by-page review — 22 September 2026

See [Final desktop review](FINAL_REVIEW.md) for changes and validation by page. The review removes redundant content, exposes delivery selection within the catalogue, fixes saved-product filter counts and cross-page filter leakage, adds actionable basket issue resolution, clarifies checkout payment selection, removes account test switches, and fixes keyboard skip navigation and malformed URL fragments. The supplied header/profile design, five-column Photos and six-column Details layouts are preserved.

### More homepage recommendations — 23 September 2026

- Added four bouquet-building recommendations: Sorbonne, Alissa Purple, Verena Blue and Anastasia, each with a brief reason to consider it and the existing offer comparison/buying controls.
- Added a foliage section with Eucalyptus Cinerea and Italian Ruscus, plus a route to the full foliage assortment.
- Added white, pink, purple and orange flower shortcuts with catalogue-derived counts and working colour filters.
- Selection rationale and sources are recorded in `MARKET_RESEARCH.md`. These are editorial recommendations, not personal recommendations or PP Flowers sales rankings.

## Departure dates — 23 September 2026

All customer-facing order-date labels now describe departure, including product cards, grower comparisons, basket, checkout, order history and help. Shipping costs and destination addresses remain distinct from departure timing. The date picker and order summary explain that arrival timing depends on the logistics company.

The picker starts with tomorrow every time it opens, including weekends. A later date is applied only after confirmation; cancelling keeps the confirmed date. New baskets and expired saved dates default to tomorrow, while valid future selections and historical order dates are preserved. The stored `delivery` property remains compatible with existing records.

All 27 automated checks pass, including calendar boundaries, weekend departure, stale-date recovery and offer availability. The production build succeeds. Browser checks confirmed the tomorrow default, later-date cancellation, reopening, persistence, departure labels and basket availability warnings.

## Foliage section redesign — 23 September 2026

Replaced the tinted panel and side introduction with a standard Greens & foliage heading, an outlined View all foliage action, and two horizontal product cards. Full-height bunch photos sit beside the product details; prices, departure dates and purchase controls align across both cards. Saved state, offer comparison, exact-offer additions and departure selection reuse the established buying controls.

Checked at 1375 × 998: both cards and images render without overflow, their purchase controls share the same baseline, Eucalyptus Cinerea opens its seven-grower comparison, and View all foliage returns all four matching products. Existing basket contents are unchanged.

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

## Customer service inbox — 21 October 2026

“Still have questions? Get in touch” now opens #tickets, an Outlook-inspired customer inbox with a folder sidebar, searchable ticket list and conversation reading pane. All tickets, Awaiting you, In progress and Resolved show counts. Browser-local unsent tickets remain available under All tickets. The ticket list supports newest/oldest sorting and Arrow Up/Down, Home and End navigation. Conversations show the reference, status, assigned team member, optional related order, participants and full dated message history. Each pane scrolls independently, with the reply action remaining visible on desktop.

New ticket opens a composer in the reading pane, prefills the account email, and offers the buyer's existing order references. Subject/message/email validation focuses the first error. Closing the composer retains its draft while moving around this inbox; the draft and reply text are session-only and are not retained after leaving/reloading. Submitted tickets and replies use the existing browser-local account storage, visibly marked Not sent, and remain readable from Profile → Past tickets. Legacy single-message tickets are adapted without rewriting their original content. Storage is completed before showing success; a failure preserves the typed text for retry.

Six clearly labelled sample conversations demonstrate ongoing, awaiting-customer and resolved history. Show sample conversations toggles these presentation fixtures. Preview replies to samples are kept only in component memory and never become account history. No messages are transmitted, no support backend is connected, and no Outlook integration is used. The interface follows Outlook's three-pane organization while retaining PP Flowers branding.

Validation: all 61 automated checks pass, covering legacy-ticket compatibility, reply validation and immutability, message identities, browser-storage round trips, folder/search/sort behavior, and sample/account separation. The standalone build and whitespace checks pass. Desktop browser checks at 1864 × 984 verified Get in touch routing, conversation reading, folder filters, searching an earlier message, sorting, keyboard selection, required fields, draft retention, empty history and a session-only reply preview. No new account tickets were created during browser QA; the existing four-line basket and order history were left unchanged. Local preview and source package refreshed; not published.


## Compact ticket list — 21 October 2026

Reduced support ticket rows from 151 px to 100 px on wide desktop, preserving sender, date, subject, preview, status and message count. Removed the redundant Your support inbox sidebar label and aligned New ticket with search. The standalone build and whitespace checks pass. Browser verification at 1864 × 984 confirms all six sample tickets fit, ticket selection still opens the correct conversation, and there is no page overflow.


## Reply attachments — 21 October 2026

The ticket reply box now has a paperclip Attach files button. Buyers can choose multiple files, see their names and sizes, remove them, and switch conversations without losing each ticket's pending files. Replying can include text, attachments, or both. Files appear as download links on the saved message; attachment names are included in conversation search. The local prototype accepts up to five non-empty files and 2 MB total per reply, with validation before file reading and before saving. Replying is disabled while files are being read.

For account tickets, the exact file bytes are saved with the message in browser-local storage and retained on reload; storage failure keeps the draft message and selected files for retry. Sample replies and their attachments remain session-only. No files are uploaded to a server. New-ticket composition is unchanged; this attachment control is scoped to replies.

All 63 automated checks, the standalone build and whitespace checks pass. New tests cover exact attachment-byte persistence, attachment-only replies, filename search, payload validation, file-count/combined-size limits and unchanged account shopping state. Desktop browser checks covered multiple-file selection, removal, per-conversation draft retention and a session-only attachment reply with a download link. Browser QA used generated sample text files and did not save an account ticket or change the basket.


## Bank-transfer QR popup — 21 October 2026

Saving a bank-transfer checkout order now opens a Bank transfer dialog on its order page. The dialog contains a locally generated QR code, the saved total including shipping, the order's payment reference, recipient/IBAN/BIC fields, and copy controls for the amount, reference or all details. Pending transfer orders expose Bank transfer details to reopen it later. Balance-paid/confirmed orders skip the dialog. Closing, copying or scanning does not change payment status. Checkout persistence now succeeds before the basket is cleared in UI or the success route/dialog opens; a storage failure retains the checkout basket for retry.

No verified bank account or payment provider is configured in this prototype. Bank fields visibly say Not configured, the recipient is labelled demo, and the scannable QR encodes non-payable demo text rather than a real transfer payload. An explicit do-not-pay notice appears alongside it. The amount and reference are real values from that saved mock order, rather than the current basket. There is no invented IBAN, payment initiation, payment confirmation or remote QR service.

All 69 checks pass. An independent QR decoder verifies exact UTF-8 payload contents; tests cover pending-only instructions, saved totals/references after reload and basket changes, actual checkout callback ordering, balance checkout and storage failure. Browser verification at 1864 × 984 used an existing pending order (PP-MVI9OJ61, €1,532.70): layout, correct saved values, copy feedback, Escape/focus return, paid-order exclusion and reopening all pass, with no page overflow or console errors. No new order or payment was submitted during browser QA. The local preview and developer package are refreshed.


## Transfer reference reminder — 21 October 2026

Added a warning beneath the existing demo notice that displays the current order's exact payment reference and explains that it is needed to match the transfer. Manual-payment guidance names the payment reference, message or description field and advises checking with the bank when another field is unclear. It does not tell buyers to put the reference into arbitrary bank fields. The existing non-payable demo disclosure remains visible.

The build and whitespace checks pass. Desktop browser verification confirms the dynamic PP-MVI9OJ61 reference, readable warning and visible footer actions within the 1864 × 984 viewport, with no horizontal overflow. Payment logic, QR payload and saved account data are unchanged.


Removed the bank-configuration explanation from the transfer popup at the buyer's request (21 October 2026). The preview notice and exact-reference guidance remain. Build and browser verification pass.


Added the buyer-requested bank-transfer warning (21 October 2026): “Please note: Prices may change until your bank transfer has been received.” This is display copy only; saved order totals and QR data are unchanged. Build, whitespace and desktop browser checks pass; popup actions remain visible without page overflow.


Updated the QR helper paragraph to the buyer's requested bank-app/manual-entry wording (21 October 2026). This is presentation copy for the intended payment flow; the QR remains non-payable demo text and the visible demo notices remain. Build, whitespace and desktop browser checks pass, including visible footer actions and no page overflow.


Added the buyer's confirmation-timing and automatic-crediting message below the payment-reference reminder (21 October 2026). This is prototype presentation copy; real settlement notifications, timing and account crediting still require the live payment integration. Tightened vertical spacing so all notices and footer actions fit at 1864 × 984 without an internal scrollbar. Build, whitespace and desktop browser checks pass; payment/order data are unchanged.


## Simpler support folders and chat — 21 October 2026

Removed Not sent and New ticket draft from the sidebar. New ticket still resumes an unfinished composer while moving around the inbox; local unsent tickets remain accessible under All tickets with their delivery notice intact.

Conversations now use readable message bubbles: customer messages on the right in dark green, team replies on the left in white. Compact names and times, Amsterdam calendar-day separators, and a smaller agent/order header make the history easier to scan. Opening a conversation starts at the latest message; Jump to latest appears when reading older messages. The reply area is shorter, with Attach files and the reply action together. Ticket-specific text/files, validation, downloads and sample-only preview behavior are preserved.

All 71 automated checks, the standalone build and whitespace checks pass. Browser verification at 1864 × 984 and 1280 × 720 confirms no page overflow and visible reply controls. Sample-only QA covered text and file replies, draft retention, date separators, searching, resolved tickets and Jump to latest. No account ticket, basket or order was changed. Screenshot: outputs/customer-service-chat-redesign.png. Local preview and developer package refreshed; not published.


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
