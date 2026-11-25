# Wren & Ledger: Astro + Sanity demo

A small business-consulting site for a **fictional** firm, built to show how a content-managed site can work without WordPress:

- **The owner's team edits everything in Sanity**: homepage, services, blog posts, redirects and site settings.
- **The site is plain, fast HTML** built by Astro. There are no plugins to patch and no page builder markup.
- **Editorial rules live in the editor**, so nobody can publish around them:
  - links aren't allowed in a page's first paragraph,
  - template leftovers ("PREVIEW", "Sitemap v9", "lorem ipsum", `{{placeholders}}`) block publishing,
  - every page needs a Google title and description, with length warnings,
  - a redirect to the homepage triggers a warning to pick the closest page instead.
- **One booking button and the phone number sit at the top of every page**, set once in Site settings.
- **One URL per page.** Every page ends with a trailing slash, and redirects are managed in the editor and written to `_redirects` on each build.

```
web/      Astro site (runs on built-in demo content until Sanity is connected)
studio/   Sanity Studio: the editor, schemas and seed script
```

## 1. Run the site (no accounts needed)

From the `sanity-demo` folder:

```bash
npm run setup    # installs the site's packages in web/
npm run dev
```

Open http://localhost:4321. With no Sanity project set, the pages read `src/data/demo-content.js`.

## 2. Connect Sanity

```bash
cd studio
npm install
npx sanity login
npx sanity init --bare          # creates a project and prints its ID
cp .env.example .env            # paste the ID into SANITY_STUDIO_PROJECT_ID
npm run seed                    # loads the demo content into Sanity
npm run dev                     # editor at http://localhost:3333
```

Then in `web/`, copy `.env.example` to `.env`, set `SANITY_PROJECT_ID` to the same ID, and restart `npm run dev`. The pages now come from Sanity.

If `npm install` in `studio/` complains about versions, run `npm create sanity@latest` in a new folder and copy `schemaTypes/`, `sanity.config.js` and `scripts/` into it.

## 3. Publish and auto-update

1. Push the repo to GitHub and import `web/` into **Netlify** (build command `npm run build`, publish directory `dist`). Add the same environment variables there.
2. In Netlify, create a **build hook** (Site configuration, then Build & deploy).
3. In Sanity (sanity.io/manage, then API, then Webhooks), add a webhook to that build hook URL for create, update and delete.
4. Deploy the editor with `npm run deploy` in `studio/`. It gets a `*.sanity.studio` address.

Now publishing in the editor rebuilds the live site in about a minute.

## Ownership

For a client build, create the Sanity project, the Netlify site and the GitHub repo under the **client's** accounts and add yourself as a member. Nothing should live only in the developer's name.

---

*All names, client stories and numbers on this site are made up.*
