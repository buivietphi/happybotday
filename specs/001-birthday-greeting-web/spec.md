# Feature Specification: Birthday Greeting Web

**Feature Branch**: `[001-birthday-greeting-web]`

**Created**: 2026-09-01

**Status**: Draft

**Input**: User description: "tôi muốn tạo 1 web chúc mừng sinh nhật độc đáo có slide ảnh, có hiệu ứng và có những lời yêu thương chân thành làm bằng nextjs"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Open the Greeting and See a Hero Welcome (Priority: P1)

The recipient (the birthday person) opens the URL shared by the gift-giver. They immediately see a visually rich welcome screen with the recipient's name, a warm birthday headline, a soft animated background (floating confetti, hearts, or particles), and a clear "Bắt đầu / Start" cue to begin the experience.

**Why this priority**: The opening moment sets the emotional tone. Without a personalized, animated entry, the rest of the experience feels generic and the gift loses its impact. This is the very first impression and must work on first load.

**Independent Test**: Open the site, verify the recipient's name is rendered, the headline reads as a birthday greeting, and at least one ambient visual effect (particles/confetti) is animating without user input.

**Acceptance Scenarios**:

1. **Given** the page is loaded for the first time, **When** the recipient views the hero section, **Then** their name and a personalized birthday headline are visible within 2 seconds and at least one ambient animation is playing.
2. **Given** the recipient is on the hero section, **When** they click the "Bắt đầu" (Start) button, **Then** the page transitions smoothly to the next section (slideshow) without a hard reload.

---

### User Story 2 - Watch the Photo Slideshow with Cinematic Transitions (Priority: P1)

As the recipient watches, the page presents a slideshow of curated photos (memories together, favorite places, milestone moments). Each photo transitions in with a distinct cinematic effect (ken-burns zoom, cross-fade, parallax, blur-in), accompanied by a short caption that appears with the image.

**Why this priority**: The slideshow is the visual core of the gift. Photos carry the emotional weight of shared memories; without cinematic transitions it feels like a plain image grid.

**Independent Test**: Reach the slideshow section, observe automatic advancement through the configured photos, verify each transition uses a visual effect (not just a hard cut), and verify captions appear with their corresponding photos.

**Acceptance Scenarios**:

1. **Given** the slideshow section is active, **When** it auto-advances, **Then** each photo displays for between 4–8 seconds and transitions to the next photo with a smooth animated effect (no hard cuts).
2. **Given** the recipient wants to control pace, **When** they tap/click a navigation control (next/prev or pause), **Then** the slideshow honors the action within 500 ms.
3. **Given** a photo with a caption, **When** the photo is displayed, **Then** the caption fades in alongside the photo, not before or after.

---

### User Story 3 - Read Heartfelt Loving Messages (Priority: P1)

The recipient scrolls or advances into a section that reveals a sequence of heartfelt, sincere messages — short paragraphs expressing gratitude, love, wishes for the year ahead. Each message appears with a deliberate reveal animation (typewriter, line-by-line fade, masked word reveal) so the words feel personal rather than dumped on screen.

**Why this priority**: The user's brief explicitly calls out "những lời yêu thương chân thành" — these messages are the soul of the gift. They must be readable, paced, and emotionally resonant.

**Independent Test**: Reach the messages section, observe at least 3 messages displayed one after another with reveal animations, verify each message is fully readable (text contrast, line length, font size) on both desktop and mobile widths.

**Acceptance Scenarios**:

1. **Given** the messages section is in view, **When** a new message is revealed, **Then** the animation completes within 3 seconds and the text remains on screen long enough to be read comfortably (≥ 6 seconds for messages ≤ 60 words).
2. **Given** a message contains multiple lines or paragraphs, **When** it animates, **Then** lines appear in reading order with a brief stagger (not all at once, not word-by-word that feels jittery).
3. **Given** the recipient reads the final message, **When** it finishes revealing, **Then** a clear "ending" cue appears (final wish, signature, or outro card) inviting a moment of reflection.

---

### User Story 4 - Optional Background Music with Toggle (Priority: P2)

While the experience plays, soft background music plays automatically after the recipient opts in (browsers block autoplay). A small, unobtrusive control lets them mute/unmute anytime.

**Why this priority**: Music dramatically enhances emotional impact but autoplay restrictions make it optional. A toggle is essential for user control and accessibility (hearing-impaired users, public viewing).

**Independent Test**: Click the play/music toggle, verify music starts; click again, verify it stops. Verify the toggle is reachable from every section.

**Acceptance Scenarios**:

1. **Given** music is configured, **When** the recipient clicks the music toggle for the first time, **Then** music begins at a low volume suitable for background listening.
2. **Given** music is playing, **When** the recipient clicks the toggle again, **Then** music stops immediately and the toggle state persists for the rest of the session.

---

### User Story 5 - Replay or Share the Experience (Priority: P3)

After the experience ends, the recipient can either replay from the beginning or share the URL with others who might want to see it.

**Why this priority**: Replay adds longevity (they can revisit the message any birthday week); share extends the reach to family/friends. Both are nice-to-haves that increase the gift's shelf-life.

**Independent Test**: Reach the outro section, click "Replay" → verify scroll/animation restarts from the hero; copy URL and open in a new tab → verify the same experience loads fresh.

**Acceptance Scenarios**:

1. **Given** the recipient is on the outro, **When** they click "Xem lại" (Replay), **Then** the page returns to the hero section and the experience can be watched again from the start.
2. **Given** the recipient wants to share, **When** they click the share control, **Then** the URL is copied to the clipboard (or the native share sheet opens on mobile) so they can send it to someone else.

---

### Edge Cases

- What happens when a photo fails to load (slow network, broken URL)? → A graceful placeholder or skip behavior keeps the slideshow moving instead of breaking the experience.
- What happens when the recipient opens the site on a very small screen (< 360px wide) or a very large 4K screen? → Layout remains readable and animations do not break the page.
- What happens when the recipient has motion sensitivity / prefers-reduced-motion enabled? → Heavy animations gracefully reduce to subtle fades or static compositions; auto-advancement respects user preferences.
- What happens when the recipient opens the URL offline after the first visit? → A previously visited page still shows its core content; the share button still works.
- What happens when there are 0 photos configured or only 1? → The slideshow section still functions (single-photo display with caption) instead of showing an empty/broken UI.
- What happens when the recipient interacts via keyboard only (no mouse/touch)? → All controls (Start, music toggle, Replay) are reachable and operable via keyboard with visible focus states.
- What happens when content (name, messages) contains Vietnamese diacritics or special characters? → All text renders correctly without encoding issues.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display a hero/welcome section with the recipient's name and a personalized birthday headline, visible on first load.
- **FR-002**: System MUST show at least one ambient visual effect on the hero (e.g., confetti, floating particles, hearts) that animates without requiring user input.
- **FR-003**: System MUST present a photo slideshow section that auto-advances through a configurable list of photos with a smooth animated transition between each (no hard cuts).
- **FR-004**: System MUST allow the recipient to manually pause/resume and navigate next/previous in the slideshow.
- **FR-005**: System MUST display a short caption alongside each photo, revealed together with the photo.
- **FR-006**: System MUST present a messages section containing at least 3 heartfelt messages, revealed one at a time with a deliberate reveal animation.
- **FR-007**: System MUST keep each message visible on screen long enough to be read in full before advancing to the next.
- **FR-008**: System MUST provide an outro/final-wish card after the last message, with a clear emotional conclusion and a "Replay" action.
- **FR-009**: System MUST provide a music toggle control that is reachable from any section, persists its state for the session, and respects the recipient's choice (does not auto-start without consent).
- **FR-010**: System MUST provide a "Replay" action that returns the experience to the hero section so the recipient can watch it again from the start.
- **FR-011**: System MUST provide a "Share" control that surfaces the page URL via clipboard or native share sheet.
- **FR-012**: System MUST honor the recipient's `prefers-reduced-motion` setting by reducing heavy animations to subtle fades or static compositions.
- **FR-013**: System MUST handle missing or broken photo URLs gracefully (placeholder image or skip) without breaking the slideshow.
- **FR-014**: System MUST keep all interactive controls (Start, music toggle, navigation, Replay, Share) keyboard-accessible with visible focus states.
- **FR-015**: System MUST render Vietnamese text (including diacritics) correctly across all sections.
- **FR-016**: System MUST remain readable and functional on viewport widths from 360px (small mobile) up to 2560px (large desktop).

### Key Entities *(include if feature involves data)*

- **Recipient**: The person being celebrated. Attributes: name (string), nickname (optional string). Drives personalization on the hero and outro.
- **PhotoSlide**: A single image in the slideshow. Attributes: image URL or path, caption (string), optional duration override (seconds).
- **BirthdayMessage**: A heartfelt message line/paragraph. Attributes: text (string), optional author/signature (string).
- **MusicTrack**: The background music asset. Attributes: source URL or path, optional volume default (0–1).
- **SiteConfig**: The top-level configuration tying everything together — recipient, ordered list of PhotoSlides, ordered list of BirthdayMessages, optional MusicTrack, and theme/color choices.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The recipient reaches the hero welcome within 2 seconds of opening the URL on a typical broadband connection (LCP ≤ 2s on desktop, ≤ 3s on 4G mobile).
- **SC-002**: 95% of visitors who click "Bắt đầu" successfully view the full experience (hero → slideshow → messages → outro) without encountering a broken state or error.
- **SC-003**: Each slideshow transition completes in under 1.2 seconds and never appears as a hard cut.
- **SC-004**: At least 90% of recipients who finish the experience replay it at least once OR share the URL with someone else.
- **SC-005**: The site achieves a Lighthouse Accessibility score ≥ 90 and is fully operable via keyboard.
- **SC-006**: With `prefers-reduced-motion: reduce` enabled, no animation runs longer than 400ms or moves elements more than 50px, and the experience remains emotionally coherent.
- **SC-007**: The site renders correctly (no overflow, no clipped text) at viewport widths 360px, 768px, 1280px, and 2560px.
- **SC-008**: When a photo URL is broken or slow (>5s load), the slideshow continues to the next photo within 8 seconds total instead of stalling.
- **SC-009**: Vietnamese text — including all diacritics in messages and the recipient's name — renders without mojibake or missing glyphs in 100% of test cases.

## Assumptions

- **Technology constraint (user-specified)**: The site is built with Next.js as the user requested. This is the only technical constraint imposed by the user; everything else (animation library, styling approach) is left open for planning.
- **Content customization model**: The recipient's name, photos, messages, and optional music are provided via a simple configuration (file-based or data file) at build/setup time. There is no admin UI in v1 — content changes happen in code/config.
- **Photo hosting**: Photos are either bundled with the project or referenced via stable URLs. There is no upload UI in v1.
- **Single language**: Content is in Vietnamese (matching the user's brief). i18n/multi-language support is out of scope for v1.
- **Modern browsers**: Target evergreen Chromium, Firefox, and Safari (last 2 versions). Legacy IE/old mobile browsers are out of scope.
- **Internet connection**: The site assumes the recipient has internet access for first load. After first load, core content remains viewable offline (service-worker caching is a nice-to-have, not required).
- **Audio asset licensing**: The gift-giver is responsible for choosing music they have the right to use; the system only provides the playback mechanism.
- **Recipient device**: The recipient may view on phone, tablet, or desktop. TVs and exotic form factors are out of scope.
- **Sharing scope**: Share is a simple URL share; there is no per-recipient personalization (no tokenized URLs in v1). Anyone with the link sees the same experience.
