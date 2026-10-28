# Homepage flower selection

Researched 22 September 2026. Market scope: the Dutch wholesale flower trade.

## Evidence

[AIPH / Union Fleurs, International Statistics Flowers and Plants 2024, Sales and Markets, page 35](https://aiph.org/wp-content/uploads/2024/12/vol72_v3_SYB2024_trade.pdf#page=35) reproduces Royal FloraHolland clock and direct sales volumes for 2023. These are sold units, not order frequency or PP Flowers sales.

| Flower category | 2023 volume, million pieces | Representative product in the existing catalogue |
| --- | ---: | --- |
| Roses | 2,948 | Red Naomi |
| Tulips | 1,559 | Strong Gold |
| Spray chrysanthemums | 1,031 | Bacardi |
| Gerberas | 683 | Pre Intenzz |

Disbudded chrysanthemums account for a further 115 million pieces; combining the two chrysanthemum groups does not change the top-four category ordering.

These are the four highest-volume named flower categories in that table. Cultivars were selected from the existing catalogue to represent the categories; the research does not rank the individual cultivars, colours or growers. The homepage therefore uses “market favourites” and “popular flower offers”, not “our best sellers” or a live September sales ranking. Annual popularity is distinct from seasonal availability; delivery and availability continue to come from the existing prototype offer model.

## Currency and limits

Royal FloraHolland's [2025 annual report](https://np-royalfloraholland-production.s3-eu-west-1.amazonaws.com/RFH-jaarverslag-2025-ENG-DEF.pdf) was inspected, but no flower-category volume ranking was found. AIPH's [2025 yearbook announcement](https://aiph.org/latest-news/crucial-global-data-released-international-statistics-flowers-and-plants-2025/) says it covers the 2024 calendar year and offers its full data by paid download or member access. That data was not purchased. The verified public 2023 volume table is used explicitly as the selection benchmark, not presented as 2025 or 2026 sales data.

[Porta Nova](https://portanova.nl/nl/) confirms its specialisation in Red Naomi roses, supporting the new spotlight. Other growers and offer values are retained prototype fixtures, not a verified supplier or sales ranking. No live inventory or prices were imported.

## Implementation

- Hero: four clickable flower categories, with category filtering.
- Featured offers: one representative of each category, with the existing live-in-prototype offer selection and buying controls.
- Grower tiles: one existing catalogue supplier per category; counts and links are scoped to that category.
- Collections: the same four popular flower types, replacing the previous three-tile assortment.
- Final catalogue action: opens the flower assortment.

## Image provenance

The old Pre Intenzz image was a blurred placeholder. Its replacement is an AI-generated representative gerbera illustration, not a photograph of supplier stock or evidence of cultivar authenticity. Other product images are reused.

Saved asset: `/Users/andres/Documents/Codex/2026-09-08/le/work/refined-site/assets/gerbera-market-illustration.png`

Mode: built-in image_gen tool.

Final prompt:

> Use case: product-mockup. Asset type: illustrative product photograph for a flower wholesale webshop prototype. Create one portrait 2:3 studio photograph of a modest tied bunch of fresh coral-orange mini gerberas (germini), with long slender green bare stems visible all the way to the cut ends. Clearly recognisable daisy-like gerbera heads, orange petals and dark centres, about 12 to 15 blooms. Full bouquet centered, flowers in upper half, stems lower half, entire bunch inside the frame with generous neutral space. Warm light grey/beige seamless backdrop, natural soft studio light, delicate ground shadow, botanical realism. No vase, no wrapper, no extra foliage, no other flower species. No text, logo or watermark. Intended as representative illustration, not proof of an actual cultivar or supplier's stock.

## Recommendation expansion — 23 September 2026

The homepage already featured the four high-volume flower families above. This update adds buying uses that were missing, using six products already in the catalogue. These are editorial selections based on floristry guidance, not claims about PP Flowers best sellers, customer purchase histories, current trends, discounts or verified live stock.

| Added selection | Reason and source |
| --- | --- |
| Sorbonne lily | A focal flower for mixed bouquets. The [Plants & Flowers Foundation Holland lily guide](https://www.plantsandflowersfoundationholland.org/en/flowerguide/lily/) describes large flowers, mixed-bouquet uses and fragrant Oriental varieties. |
| Alissa Purple lisianthus | Soft, layered texture for bouquets and event work. The Foundation's [lisianthus guide](https://www.plantsandflowersfoundationholland.org/en/flowerguide/lisianthus/) describes layered petals, branching stems and use in bouquets. |
| Verena Blue hydrangea | Rounded flower heads to build shape and fullness, informed by the Foundation's [hydrangea styling guide](https://www.plantsandflowersfoundationholland.org/en/hydrangea-styling-tips/). |
| Anastasia chrysanthemum | A different shape and green colour within an established high-volume family. The Foundation's [chrysanthemum autumn guidance](https://www.funnyhowflowersdothat.co.uk/chrysanthemums-your-home) describes varied colours and use in mixed arrangements. The exact cultivar choice is editorial. |
| Eucalyptus Cinerea and Italian Ruscus | Complementary foliage to finish an order. The Foundation uses eucalyptus and ruscus in its [bouquet examples](https://www.plantsandflowersfoundationholland.org/en/bridal-bouquet-inspiration-every-season/). The selection of these catalogue varieties and their pairing is our editorial interpretation, not an assertion that these two varieties lead sales. |

Four colour shortcuts (white, pink, purple and orange) are a browsing design choice. They use existing catalogue colour data and filters, with counts derived from the same flower scope. The sources support use-based recommendations; they do not rank these colours.

Each recommendation uses the existing offer selector: eligible offers are prioritised by price, out-of-stock products are omitted, and later availability is shown when no offer fits the date. Existing lot sizes, minimums, limits and VAT labels are retained. No new supplier, product, price or inventory facts were imported. Tulips remain in the original annual-popularity selection; no autumn-availability claim was added.

### Recommendation image provenance

Three images were produced with the built-in imagegen tool to replace blurred or absent prototype imagery: pink Oriental lilies (`l-sorbonne`), purple double lisianthus (`s-lisianthus`) and Italian ruscus (`gr-ruscus`). They are representative illustrations, not supplier stock photographs or verified cultivar images. Original PNGs are retained in the output assets folder; JPEG encodings are embedded in the site for a smaller download. Exact prompts and original generation paths are in `assets/recommendation-prompts.json`. Other recommendation images are reused from the supplied prototype.

## Monthly seasonal merchandising — 21 October 2026

The new In season now row is a monthly editorial edit of existing prototype products, interpreted for a northern-European audience. The current October list combines chrysanthemums and hydrangea/lisianthus bouquet flowers with eucalyptus and ruscus foliage. It is mock merchandising rather than a local-harvest calendar or live availability feed. The title uses the current Europe/Amsterdam month; other monthly edits highlight spring bulbs, late-spring peonies, summer bouquet flowers and winter arrangement companions.

Primary sources inspected for the seasonal direction:

- The [Plants & Flowers Foundation Holland tulip guide](https://www.plantsandflowersfoundationholland.org/en/flowerguide/tulip/) describes late-winter/spring flowering and cut-flower availability from late January, while noting that growing techniques extend supply beyond the natural season.
- Its [peony guide](https://www.plantsandflowersfoundationholland.org/en/flowerguide/peony/) identifies May and June as the peak cut-flower period. This supports using peonies in the May/June edit rather than October.
- The [Flower Council of Holland's chrysanthemum autumn guidance](https://www.funnyhowflowersdothat.co.uk/chrysanthemums-your-home) presents chrysanthemums as a late-summer/autumn flower for mixed seasonal arrangements.
- The Foundation's [lisianthus guide](https://www.plantsandflowersfoundationholland.org/en/flowerguide/lisianthus/) distinguishes natural summer/early-autumn flowering from year-round cut-flower supply. Its use later in an autumn edit is an arrangement choice, not a claim about a local harvest peak.
- Its [hydrangea styling guide](https://www.plantsandflowersfoundationholland.org/en/hydrangea-styling-tips/) supports use of rounded hydrangea flower heads in bouquets; it does not verify this fixture cultivar's October stock. Foliage pairing follows the bouquet guidance already recorded above.

The complete month mapping, exact cultivar choices and companions are our editorial interpretation. These sources do not verify individual grower prices, stock, seasonal quality or shipment windows. The production merchandising service should replace the fixture mapping with supplier-verified seasonal windows and regional availability. Current prototype offers continue to determine the displayed grower, price and departure eligibility.

Highest quality uses the mock offer's explicit A1 Extra grade; no external quality awards or guarantees were added. Saved by you / Favourites comes solely from the buyer's existing saved product IDs. No new photos, stock data or customer purchase claims were generated for these sections.
