# Austin Events

Event feed and calendar for Austin: Moody Center, Q2 Stadium, DKR–Texas
Memorial Stadium, Moody Amphitheater, ACL Live and 3TEN, Bass Concert Hall,
Circuit of the Americas, Germania Insurance Amphitheater, the H-E-B Center,
Dell Diamond and Zilker Park, then the Red River and East Side rooms
(Stubb's, Emo's, Mohawk, Scoot Inn, Antone's, Come and Take It Live, the
Concourse Project, Radio/East) and Whitewater Amphitheater — with the home
teams' seasons (Longhorns football and basketball, Austin FC, the Round Rock
Express, the Texas Stars) in a Teams view.

Live at **https://austin.here.events/** once the domain is wired (GitHub
Pages, built by the Actions workflow once a day at noon Central).

One of the cities on the lqa-events codebase: everything that makes this
Austin's is `site/city.js` (every team, venue, type, default, share-code
registry and string), `site/index.html`, `scripts/fetch-events.mjs` (the
sources), `site/embed.js`, `outlook.json`, `scripts/data/postseason.json`,
the manifest and icons (the Lone Star, rendered from `favicon.svg`).
Everything else is lqa-events' own, byte for byte — copy from there, never
edit here.

## Embed

```html
<div id="austin-events"></div>
<script src="https://austin.here.events/embed.js" data-max="8" defer></script>
```

## Sources

- **Ticketmaster Discovery API** — every room by its venue id (every page):
  21 rooms, from the stadiums to the 350-seat 3TEN. There is no city sweep:
  the API stops a query at its thousandth event and Austin fills that in
  weeks. Calls are paced a second apart (the key is shared with the sister
  cities' builds). Church events are left out (`isChurch`).
- **Seasons** — ESPN for the Longhorns (football and men's basketball) and
  Austin FC; MLB's stats API for the Express (Triple-A, sportId 11); the
  AHL's HockeyTech feed for the Stars (`scripts/schedules.mjs`, shared with
  lqa). Longhorns football and the Express have no full ticket feed, so
  their home dates are injected from the league schedules.

Next to add: the rooms whose shows Ticketmaster never lists (the Continental
Club, the Saxon Pub, the Paramount and Stateside, the Long Center, Gruene
Hall), Stubb's indoor room (a second Ticketmaster id), and the festivals
(ACL Fest, SXSW).

## Local run

```sh
cp .env.example .env   # TICKETMASTER_API_KEY=…
ALLOW_NO_ARCHIVE=1 node scripts/fetch-events.mjs   # ALLOW_NO_ARCHIVE only until the site has published once
node --test scripts/*.test.mjs
```
