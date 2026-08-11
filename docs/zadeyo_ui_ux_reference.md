# ZADEYO UI/UX Design Reference & Architecture Specification

> **Source Analysis & Synthesis:** Deep architectural breakdown of [zadeyo.com](https://zadeyo.com/)
> **Aesthetic Family:** Dark Cyber-Luxury / Premium Gaming Marketplace ("Gamer Sleek")
> **Target Audience:** Design-conscious gamers, digital software buyers, power users seeking reliability and instant delivery.

---

## 1. Executive Summary & Aesthetic Archetype

Zadeyo is a **dark-mode-first, cyber-luxe digital marketplace**. It avoids generic SaaS clichés and dated "hacker green" tropes by combining:
1. **A deep, nocturnal violet foundation** (`#0a0614` to `#0f0b1f`) with controlled violet/purple accents (`#7c3aed`, `#a855f7`, `#c4a7ff`).
2. **3D Mascot & Metallic Skeuomorphic Elements**: A charismatic hooded 3D character in matte/metallic purple armor holding a metallic logo emblem, surrounded by orbiting chrome game badges (Valorant, Apex, DayZ, Fortnite, Minecraft, LoL).
3. **Glassmorphism with Edge Highlights**: Subtle translucent containers (`bg-slate-900/60`, `backdrop-blur-xl`, `border-purple-900/30`) that provide elevation without visual clutter.
4. **Clear Trust Signals & Metrics**: Prominent real-time metrics (`4.9 / 5`, `26,700+ sales`, verified Trustpilot/Discord badges) integrated directly into the initial viewport.

---

## 2. Color Palette & Design Tokens

### 2.1 Backgrounds & Surfaces
| Token | Hex / Value | Usage |
| :--- | :--- | :--- |
| `--bg-base` | `#0a0614` | Page body background (deep void black with 5% violet undertone) |
| `--bg-surface-dark` | `#0f0b1f` | Secondary section background, subtle hero gradient stop |
| `--bg-footer` | `#0a0818` | Global footer background |
| `--surface-card` | `rgba(15, 23, 42, 0.60)` (`bg-slate-900/60`) | Elevated cards, metric blocks, feedback tiles |
| `--surface-card-hover`| `rgba(30, 41, 59, 0.80)` | Hover state for interactive cards and search inputs |
| `--surface-nav` | `rgba(0, 0, 0, 0.20)` + `backdrop-blur-xl` | Floating header navigation bar |
| `--surface-mobile-nav`| `rgba(10, 10, 12, 0.94)` + `backdrop-blur(24px)` | Floating bottom dock on mobile devices |

### 2.2 Accent & Brand Colors
| Token | Hex / Value | Usage |
| :--- | :--- | :--- |
| `--accent-primary` | `#7c3aed` (Violet 600) | Primary brand accent, button gradients, active states |
| `--accent-glow` | `#a855f7` (Purple 500) | Outer glow, badge highlights, active tab indicator |
| `--accent-soft` | `rgba(168, 85, 247, 0.15)` | Pill badge backgrounds, subtle card tints |
| `--accent-text-muted`| `rgba(196, 167, 255, 0.40)` | Muted footer text, secondary headers |
| `--accent-gradient` | `linear-gradient(135deg, #7c3aed 0%, #6d28d9 50%, #4c1d95 100%)` | Floating Action Button (FAB) / Support ticket button |

### 2.3 Borders & Elevation Lines
| Token | Hex / Value | Usage |
| :--- | :--- | :--- |
| `--border-subtle` | `rgba(124, 58, 237, 0.10)` | Section dividers, footer separation lines |
| `--border-card` | `rgba(147, 51, 234, 0.25)` (`border-purple-900/30`) | Metric cards, about feature cards, review cards |
| `--border-highlight`| `rgba(167, 139, 250, 0.35)` | Interactive buttons, focused search input, FAB border |

---

## 3. Typography Hierarchy

The typography pairs a geometric, modern sans-serif display face with high-contrast neutral body text.

| Level | Size (Desktop / Mobile) | Weight & Tracking | Color | Example Copy |
| :--- | :--- | :--- | :--- | :--- |
| **Hero Title (H1)** | `text-4xl md:text-5xl lg:text-[3.25rem]` | `font-bold tracking-tight leading-[1.12]` | `#ffffff` | *"Digital products built for reliability."* |
| **Section Title (H2)**| `text-2xl md:text-3xl lg:text-4xl` | `font-bold tracking-tight` | `#ffffff` | *"What We Offer Best"*, *"Worldwide support"* |
| **Section Eyebrow** | `text-xs sm:text-sm` | `font-semibold uppercase tracking-wider` | `#a855f7` (`text-purple-400`) | `ABOUT US`, `CUSTOMER FEEDBACK` |
| **Body Large (Hero Sub)**| `text-base sm:text-lg` | `font-normal leading-relaxed` | `#cbd5e1` (`text-slate-300`) | *"Security, quality, fast updates and first-class support."* |
| **Body Standard** | `text-sm sm:text-base` | `font-normal leading-relaxed` | `#94a3b8` (`text-slate-400`) | About us paragraphs, product descriptions |
| **Metrics Numbers** | `text-2xl md:text-3xl` | `font-bold tracking-tight` | `#ffffff` | `4.9 / 5`, `26,710` |
| **Micro Labels** | `text-[11px] sm:text-xs` | `font-medium` | `rgba(196, 167, 255, 0.40)` | *"Based on 1,605 feedbacks"*, *"All-time sales"* |

---

## 4. Layout Geometry & Section-by-Section Anatomy

```
+-----------------------------------------------------------------------------------+
|  [Logo ZADEYO]          [ Home | Products | Blog | Status ]       [EN v] [Discord] [Sign In] [Sign Up ->] |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|  [ (o) Worldwide + Instant delivery ]                                  ( 3D MASCOT )|
|                                                                     [DAYZ] [V] [F] |
|  Digital products built for                                            \   |   /   |
|  reliability.                                                         [   (o_o)   ] |
|                                                                        /   |   \   |
|  Security, quality, fast updates and first-class support.           [Apex] [Z] [LoL]|
|                                                                                   |
|  [ Get access -> ]                                                                |
|                                                                                   |
|  +--------------------+  +--------------------+                                   |
|  | 4.9 / 5            |  | 26,710             |                                   |
|  | Based on 1,605 rev |  | All-time sales     |                                   |
|  +--------------------+  +--------------------+                                   |
+-----------------------------------------------------------------------------------+
|                                 WHAT WE OFFER BEST                                |
|                              Explore our premium selection                         |
|  [ Card 1 ]  [ Card 2 ]  [ Card 3 ]  [ Card 4 ]  [ Card 5 ]  [ Card 6 ]  [ Card 7 ]...|
+-----------------------------------------------------------------------------------+
|  ABOUT US                                                                         |
|  Worldwide support, consistent delivery           [ (o) Worldwide presence      ] |
|                                                   [ (S) Consistency over hype   ] |
|  Founded in 2022, we have built a strong...       [ (v) Clear standards         ] |
+-----------------------------------------------------------------------------------+
|  CUSTOMER FEEDBACK                                                                |
|  Trusted by people who value consistency                                          |
|  [ ***** Review 1 ]      [ ***** Review 2 ]      [ ***** Review 3 ]      [ Review 4 ] |
+-----------------------------------------------------------------------------------+
|  [Products Catalog Page: Full Width Search + Game Badges + 6-Col Game Posters]    |
+-----------------------------------------------------------------------------------+
```

### 4.1 Header Navigation
* **Desktop**:
  * Fixed top header (`h-14 sm:h-16`) with `backdrop-blur-xl bg-black/20`.
  * Left: Brand logo (stylized purple 'Z' emblem) + bold wordmark.
  * Center: Floating segmented nav pill container with rounded items (`Home` active with `bg-white/[0.08] text-white`, `Products`, `Blog`, `Status` in `text-zinc-400`).
  * Right: Language selector dropdown with flag icon, Discord community icon button, Sign In link, and "Sign Up" high-contrast button.
* **Mobile**:
  * Clean minimal top bar (Logo + Language selector).
  * **Bottom Floating Dock**: Translucent rounded dock (`rounded-2xl bg-[#0a0a0c]/94 border border-purple-500/18 backdrop-blur-2xl`) with icon + label tabs (`Home`, `Products`, `Categories`, `Support`).

### 4.2 Hero Section
* **Grid Split**: 50/50 split on desktop (`lg:flex-row`), vertically stacked on mobile.
* **Left Column (Value Proposition & Conversion Engine)**:
  1. *Eyebrow Badge*: Rounded pill with globe icon (`bg-purple-950/50 border border-purple-800 text-purple-300`).
  2. *Headline*: Crisp high-contrast title with smooth dynamic keyword rotation.
  3. *Subhead*: Concise 1-line value explanation (`text-slate-300 max-w-xl`).
  4. *CTA Group*: High-visibility solid white button (`bg-white text-slate-900 hover:bg-slate-100 font-semibold px-8 h-12 shadow-lg`) with animated right arrow.
  5. *Dual Proof Metrics*: 2-column glass cards (`bg-slate-900/60 border border-purple-900/30 rounded-xl p-5`).
* **Right Column (Hero Visual Anchor)**:
  * High-fidelity 3D mascot character rendered as a transparent looping video (`Comp 1_4-export-transparent.webm` / WebM with alpha channel).
  * Orbiting metallic purple game badges floating dynamically in 3D space.

### 4.3 "What We Offer Best" Game Marquee
* Continuous smooth horizontal scrolling carousel showing game art covers (Payday 3, Pragmata, Operation Ember Rise, Red Dead 2, SCUM, Squad, The Finals, War Thunder).
* Each poster has a dark purple vignette overlay at the bottom and lifts slightly on mouse hover.

### 4.4 "About Us" Section
* Left Column: Editorial mission statement highlighting longevity (founded 2022), reliability, and human support.
* Right Column: Stacked feature cards with glowing icon containers:
  * *Worldwide presence* (Globe icon)
  * *Consistency over hype* (Shield icon)
  * *Clear standards* (Checkmark icon)

### 4.5 Customer Feedback / Social Proof
* Grid / horizontal slider of verified customer review cards.
* 5-star rating visual (`text-amber-400` stars).
* Authentic user quotes with reviewer avatar badge (initial letter in purple circle), reviewer username, and time ago (e.g. `Flux · 2 days ago`).

### 4.6 Product Catalog / Shop Page Experience
* **Search Header**: Centered search bar with quick keyboard focus and clear placeholder (`Search products...`).
* **Category Quick-Filter**: Horizontal scrollable list of popular game pills with icons.
* **6-Column Game Poster Grid**:
  * High-density vertical poster cards (aspect ratio ~2:3 or 3:4) with rounded corners (`rounded-2xl`).
  * Smooth hover transition: `scale-[1.04]`, border highlight brightening, and shadow bloom.
  * Supported game covers: Valorant, Fortnite, Rust, GTA V, Marvel Rivals, Arc Raiders, Dune Awakening, Genshin Impact, Hunt Showdown, League of Legends, Minecraft, Naraka Bladepoint.

### 4.7 Global Footer & Floating Support FAB
* 4-column structured footer with branded mission statement, navigation links, support docs, and legal policies.
* **Persistent Support FAB**: Floating Action Button in bottom-right corner (`h-[52px] w-[52px] rounded-2xl bg-gradient-to-br from-purple-600 to-purple-950 border border-purple-400/35 shadow-purple-500/40`) that launches support/ticket modal or direct Discord link.

---

## 5. Motion Design & Animation Specifications

```
+-----------------------------------------------------------------------------------+
|  [0.0s - 0.4s]  Navbar & Hero Background Gradient Fade In                          |
|  [0.2s - 0.7s]  Eyebrow Badge & Main Headline Stagger Reveal (y: 20 -> 0)          |
|  [0.4s - 0.9s]  Subhead & CTA Button Reveal                                       |
|  [0.6s - 1.1s]  Dual Metrics Cards Spring Fade-In (scale: 0.95 -> 1.0)             |
|  [0.3s - 1.2s]  3D Mascot Entry Slide (x: 40 -> 0) + Continuous Idle Float Loop   |
|  [Continuous]   Infinite Seamless Game Marquee Scroll (GSAP xPercent: -50)         |
+-----------------------------------------------------------------------------------+
```

### 5.1 GSAP & Motion Animation Rules
1. **Hero Entry Orchestration**:
   ```typescript
   // Staggered initial entrance
   const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });
   heroTl.from(".hero-badge", { opacity: 0, y: -15, duration: 0.6 })
         .from(".hero-headline", { opacity: 0, y: 25, duration: 0.8 }, "-=0.4")
         .from(".hero-sub", { opacity: 0, y: 20, duration: 0.6 }, "-=0.5")
         .from(".hero-cta", { opacity: 0, scale: 0.92, duration: 0.5 }, "-=0.4")
         .from(".hero-metric", { opacity: 0, y: 20, stagger: 0.15, duration: 0.6 }, "-=0.3")
         .from(".hero-mascot", { opacity: 0, x: 30, duration: 1 }, "-=0.8");
   ```

2. **Idle 3D Mascot Floating Effect**:
   ```typescript
   gsap.to(".mascot-wrapper", {
     y: -12,
     rotation: 1.5,
     duration: 3.5,
     repeat: -1,
     yoyo: true,
     ease: "sine.inOut"
   });
   ```

3. **Infinite Marquee Scroll**:
   ```typescript
   gsap.to(".marquee-track", {
     xPercent: -50,
     ease: "none",
     duration: 25,
     repeat: -1
   });
   ```

4. **Card Hover Physics (`motion/react`)**:
   * Hover: `scale: 1.03`, `y: -4`, `transition: { type: "spring", stiffness: 350, damping: 25 }`
   * Tap: `scale: 0.97`

---

## 6. Key Takeaways for Building Our Website

1. **Dark, Deep & Atmospheric**: Keep backgrounds dark charcoal/violet (`#0a0614`) with subtle ambient purple radial glows behind key visual elements.
2. **High-Converting Hero**: Split layout with high contrast white primary CTA, immediate numerical trust signals (ratings + sales), and an iconic 3D visual anchor.
3. **Card Consistency**: Standardize on `rounded-xl` or `rounded-2xl`, 1px purple-tinted borders (`rgba(168, 85, 247, 0.2)`), and dark translucent fills (`rgba(15, 23, 42, 0.6)`).
4. **Rich Game Catalog**: Visual-heavy grid featuring rich poster imagery, instant search filtering, and category quick-selectors.
5. **Mobile-First Glass Dock**: Ensure a bespoke floating bottom navigation for mobile viewports to provide a native-app feel.
