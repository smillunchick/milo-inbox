# Felix Session Recap — March 9, 2026 (Early)

## Shipped
1. **Compare hub pricing update** — Replaced generic "monthly fees" on 5 competitor cards (Trillet, Ring Eden, Dialzara, Rosie, CallBird) with specific pricing, minute caps, and overage details. Makes the hub more compelling and SEO-rich. [commit 3098cb0]
2. **301 redirects for dead OpenClaw URLs** — The only 3 pages indexed in search engines for getmilo.dev were old OpenClaw blog posts returning 404. Added 301 redirects to /blog to capture crawl equity and guide crawlers to current content. [commit 5d9b537]

## Key Findings

### 🔴 Critical: Zero AI Receptionist Content Indexed
- Brave search shows only 3 indexed pages — all old OpenClaw posts (now 404→301)
- Zero comparison pages, zero blog posts, zero landing pages showing up
- All current content was published March 8-9 — indexing lag is expected
- **Need:** Google Search Console access to submit sitemap and accelerate indexing

### 🔴 Stripe Account Mismatch
- Connected Stripe shows GBP balance — it's the Pathos Labs UK account
- Cannot monitor actual getmilo.dev revenue (checkout uses a different Stripe account)
- **Need:** Sam to confirm which Stripe account powers /buy/starter and connect it

### 🔴 Outreach Pipeline Blocked
- 9 personalized outreach emails ready (Wave 1 + Wave 2)
- All targeting comparison site listicles for Milo inclusion
- Zero sent — need approved from-address and Sam's go-ahead
- **Priority order:** LeadTruffle (contractor vertical) → NextPhone → Bookipi → LowCode Agency

### ✅ Abby Connect Page Is Live
- Earlier 404 report was a stale Firecrawl cache
- Page returns 200 with full content since the March 9 03:27 UTC deployment
- Kit does NOT need to fix anything here

### 📊 Competitive Landscape
- 6 new competitors identified (Trillet, Ring Eden, Sonant, XBert, Jenny AI, NextPhone)
- Comparison pages already built for Trillet and Ring Eden (both live)
- Trillet is the biggest SEO threat — building the same content moat
- Multiple "best AI receptionist 2026" listicles exist; Milo is on zero of them

### 🏗️ Deployment Architecture Mapped
- milo-inbox GitHub repo → Vercel project "milo-inbox" → getmilo.dev
- Commits auto-deploy
- vercel.json handles all routing (redirects + rewrites)
- 47 URLs in sitemap, all properly configured

## Proposed Next Actions (For Sam's Monday)

### Urgent (Today)
1. **Approve outreach pipeline** — Pick a from-address, review the 9 emails in comparison-outreach-wave2-march9.md, and start sending. One listicle inclusion = ongoing referral traffic worth 50+ cold emails.
2. **Google Search Console** — Add getmilo.dev, verify ownership, submit sitemap. This is the single biggest SEO accelerator.
3. **Confirm Stripe account** — Which account powers the /buy/starter checkout? Connect it so we can monitor revenue.

### This Week
4. **Post on Indie Hackers** — Show IH post is drafted (show-hn-post.md). The ownership-model angle is perfect for IH audience.
5. **Reddit replies** — Templates ready for r/Lawyertalk, r/HVAC, r/dentistry. Natural, non-salesy.
6. **Directory submissions** — AlternativeTo, G2, Alternative.me (all free, 15-20 min each). Detailed guide in directory-submission-guide.md.
7. **Podcast pitch** — AI Automations for Business is top target. Pitch drafted in podcast-pitch-ai-automations.md.

### Nice-to-Have
8. Update awesome-ai-tools repo Phone Calls section to include Milo (file too large for API edit — manual update needed)
9. Build comparison pages for NextPhone, Welco, NewVoices (newer competitors)
