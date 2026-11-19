# CLAUDE.md

Guidance for working in this repo (Ayokunle Ogunfidodo's portfolio).

## Stack
Next.js 15 App Router, React 19, TypeScript, Tailwind CSS, Framer Motion + GSAP for animation, Prisma (Postgres/Neon), single-page anchor navigation (`app/components/Navigation.tsx` links to `#home #about #skills #projects #experience #contact #blog`).

## Design tokens
Colors are OKLCH CSS variables defined in `app/globals.css` and mapped into Tailwind via `tailwind.config.ts` (`--primary`, `--primary-text` for WCAG-safe text color, `--accent`, `--secondary`, `--muted`, `--destructive`, `--success`, `--border`, etc.). Reuse these and the existing component classes (`.button`, `.button-secondary`, `.card`, `.badge`, `.heading`, `.subheading`, `.glass`/`.glass-card`) — never hardcode new colors. Font is Google `Inter` via `next/font`.

## Dark mode
`tailwind.config.ts` sets `darkMode: "class"` — this is load-bearing. Without it, Tailwind's `dark:` utility variants fall back to the OS `prefers-color-scheme` media query while the `.dark` CSS-variable block in `globals.css` only activates via the class, so the two systems desync (card backgrounds swap on OS dark mode but the page background and CSS-variable-driven text don't, breaking contrast). `ThemeToggle.tsx` sets/removes `.dark` on `<html>` and persists the choice to `localStorage`; an inline script in `layout.tsx`'s `<head>` applies it before paint to avoid a flash. Two `ThemeToggle` instances are mounted (desktop nav, mobile top bar) — they sync via a `window` CustomEvent (`portfolio-theme-change`), not local state alone, since each mounts independently. Prefer the design tokens (`bg-card`, `text-card-foreground`, `text-muted-foreground`, `border-border`, etc.) over ad hoc `dark:bg-[#...]`/`text-gray-*` pairs — the tokens already carry audited contrast ratios (see comments in `globals.css`) and only need to be set once.

## Editing the profile photo
If a headshot has a visible black/matte border or corner in the circular crop, it usually means the source image already has a circular mask baked in (photo content inside an inscribed circle, black outside it) rather than being a clean rectangle — cropping to the bounding box of non-black pixels isn't enough. Use `sharp` (already a transitive dependency) to sample pixels, fit a circle to the content/background boundary (Kasa least-squares fit), then `extract()` a square centered on that circle with a few px of inward safety margin so the existing `rounded-full` CSS mask lines up exactly with the photo's own circle. Always clear `.next/cache/images` (or hard-reload) after replacing a file at the same public path — Next's image optimizer caches transformed output per URL and won't pick up new bytes otherwise.

## Database: shared Neon instance — never run `prisma db push`
The Neon database this project connects to (`neondb` on `ep-late-star-a52kfd5j`) is **shared with another, unrelated project** that has its own tables (`engagements`, `vote_intentions`, confirmed by the user 2026-11-19) not declared in this repo's `prisma/schema.prisma`. `prisma db push` syncs the DB to exactly match the schema file, including dropping anything it doesn't recognize — it already attempted to drop both of those tables once and was only stopped by a dependent-policy error. **Never run `db push` or any other full-schema-sync against this database.** For schema changes, generate a pure model-to-model diff instead (no live DB connection involved in the diff itself, so it can't touch unrelated tables): diff the last-committed `prisma/schema.prisma` (via `git show HEAD:prisma/schema.prisma`) against the new one with `prisma migrate diff --from-schema-datamodel <old> --to-schema-datamodel prisma/schema.prisma --script`, review the output has no unexpected `DROP`/`ALTER` on tables outside this project, save it as a normal `prisma/migrations/<timestamp>_<name>/migration.sql`, apply with `prisma db execute --file ... --schema prisma/schema.prisma`, then `prisma migrate resolve --applied <timestamp>_<name>` to keep migration history consistent. (Plain `prisma migrate dev` also doesn't work here for unrelated reasons — its shadow database doesn't have the `vector` extension enabled, so replaying the pgvector migration fails there; the diff-and-resolve approach above sidesteps that too.)

## RAG sync rule
`data/portfolio-data.txt` is the context fed to the chat widget (`app/api/chat/route.ts`, `app/lib/embeddingConfig.ts`). Whenever About/Skills/Experience/Projects content changes in the UI, mirror the change into this file so the chatbot's answers stay accurate.

## Patterns to reuse
- Project cards live in `PROJECTS` in `app/components/Projects.tsx`. Every tech tag used there must have a matching entry in `TECH_CONFIG` (icon from `react-icons/si`, color, bgOpacity) or `TechBadge` silently drops it.
- Shared Framer Motion variants live in `app/lib/motion.ts` (`fadeUp`, `staggerContainer`, `cardHover`, etc.) — import from there instead of redefining fade/stagger animations inline.
- Resume file: `public/resume.pdf`, linked from the Hero/Nav download button.

## Environment constraints
No AI image-generation tool is available in this CLI environment. "Formalize/improve a photo" means a CSS treatment (grayscale/duotone filter, ring border, shadow) applied to the existing image — not generating a new one — unless the user supplies a pre-edited file.

## Future ideas (not yet built)
- **AI resume updater.** Sources to pull from: the site's own experience/skills data, plus the user's LinkedIn profile (https://www.linkedin.com/in/ayokunle-ogunfidodo/) — specifically Experience, Licenses & Certifications, and Posts. **Must be human-in-the-loop**: the AI proposes a diff against the current resume, the user reviews and approves before anything is written to `public/resume.pdf` (or the Experience/Skills components / `data/portfolio-data.txt`) — never auto-publish.
  - Open design question: LinkedIn has no general-purpose scraping API and scraping profile pages directly is against its ToS, so the realistic input path is either (a) the user periodically exports their own data via LinkedIn's "Get a copy of your data" feature and uploads/pastes it, or (b) the user pastes the specific updated section (a new role, a new cert, a notable post) manually. Either way the AI parses the given input, diffs it against the current resume/site content, and presents a change proposal for approval — not live scraping.
  - Not scoped or built yet; revisit with the user before implementing.

## Verification before calling something done
`npm run type-check` && `npm run lint` && `npm run build`, then run `npm run dev` and visually check affected sections in light mode, dark mode, and at mobile width (Playwright MCP tools are available for this).
