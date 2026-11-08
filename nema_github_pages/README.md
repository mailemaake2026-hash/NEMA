# NEMA EVENTS — The Art of Presence

A responsive, editorial fashion storefront built for GitHub Pages using the supplied NEMA imagery. The project is deliberately framework-free and uses optimised WebP assets, plain CSS and vanilla JavaScript.

## Preview locally

1. Extract the ZIP.
2. Open `index.html` in a modern browser, or serve the folder with a simple local web server.
3. The mood preference, saved pieces, enquiry bag and newsletter preview are stored locally in the visitor's browser.

## Included experience

- Cinematic editorial homepage with image-led sections and reveal animations.
- Four-way NEMA mood selector: Merlot, Noir, Cloud and Denim. Each mood changes the hero image, atmosphere palette, accent colours and supporting caption as one interaction.
- Responsive desktop and mobile navigation.
- Collection category filters and live product search.
- Saved-pieces wishlist with local persistence.
- Product detail modal with size and quantity selection.
- Persistent enquiry bag with quantity controls and remove actions.
- WhatsApp enquiry message generated from the complete selection.
- Newsletter preview interaction with a clear notice that no mailing-list service is connected.
- Scroll progress indicator, subtle hero parallax, scroll reveals and reduced-motion support.

## GitHub Pages deployment

1. Extract this ZIP.
2. Open the `nema_github_pages` folder.
3. Upload the contents of that folder (including `index.html`, `styles.css`, `app.js`, `.nojekyll` and `assets/`) to the root of your GitHub Pages repository, or use the folder as the published directory in your deployment workflow.
4. In GitHub, open **Settings → Pages** and confirm the correct branch/folder or deployment workflow.

All asset paths are relative, so the site works from a repository root or a GitHub Pages project path.

## Before accepting real orders

This is a front-end enquiry storefront, not a production commerce backend. It does not process card payments, manage stock, create customer accounts or send newsletter campaigns. The enquiry bag opens WhatsApp with the visitor's selected products; the studio confirms availability, size and price directly.

Before publishing, verify the WhatsApp number (`+27 63 205 4610`), product names, descriptions, size ranges, imagery, branding, policies and availability. Some accessory imagery is retained as visual reference and is explicitly described as subject to confirmation. Do not present those references as confirmed stocked products until verified.

For full e-commerce, connect a secure product/inventory backend, a South African payment provider, order notifications, delivery/tracking and a mailing-list service. Never put API secrets, admin passwords or payment credentials in front-end files.

## Project files

- `index.html` — page structure and metadata
- `styles.css` — visual system, responsive layouts and motion
- `app.js` — mood engine, product data, search, filters, saved pieces and enquiry bag
- `assets/` — optimised supplied WebP imagery
