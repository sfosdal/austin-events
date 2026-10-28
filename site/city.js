// The city — every fact that makes this calendar Austin's rather than
// another town's, in one place (2026-10-11: one of the day's new cities on
// lqa-events, after Everett and Chicago). The browser (filter.js, app.js)
// and the build (scripts/*.mjs) both read it; nothing else names a venue or
// a team. The shared files (app.js, filter.js, styles.css bar its --v-*
// hues, scripts/*.mjs bar fetch-events.mjs and sources.mjs) are lqa-events'
// own, byte for byte — see README "Sister sites".
//
// Loaded before filter.js (a plain script, so the tests can share it): it
// sets globalThis.LQACity (the name is the shared code's, not the city's).
(function (global) {
  'use strict';

  // The home teams, matched on the event title whatever the venue. Order =
  // the Teams strip, left to right; the first match wins (app.js teamFor),
  // so the football Longhorns' pattern steps aside for a basketball title.
  // Per team:
  //   re        the title match
  //   venue     the home building; schedule = the club's own schedule page
  //   sport     keys the strip icon (app.js SPORT_ICONS), the game clock,
  //             the leader categories
  //   colors    [primary, accent] — the season calendar's home cells and
  //             card frames
  //   espn      ESPN's sport/league/team id (the Longhorns' two programs and
  //             Austin FC); the Express' season comes from MLB's stats API
  //             (Triple-A is on it, sportId 11) and the Stars' from the AHL's
  //             HockeyTech feed, as Everett's Silvertips (schedules.mjs)
  //   inject    a club whose home dates no ticket feed lists: the league's
  //             schedule puts them on the calendar under this ticket link
  //   club      the club's name on Ticketmaster; news the outlets' feeds;
  //             wiki the article (teamPage: college seasons are titled
  //             "2026 Texas Longhorns football team"); opens when the
  //             season usually starts
  var AHL = { league: 'ahl', key: 'ccb91f29d6744675' }; // HockeyTech's public AHL client code and key
  var TEAMS = [
    // Texas Longhorns football, SEC, Darrell K Royal–Texas Memorial Stadium.
    // No ticket feed carries the home games with their times, so the
    // schedule is injected (the Husky Stadium pattern in lqa)
    { slug: 'longhorns', label: 'Longhorns', name: 'Texas Longhorns', abbr: 'TEX', re: /longhorns football|longhorns(?!.*basketball)/i, sport: 'football', venue: 'DKR Stadium', colors: ['#bf5700', '#ffffff'],
      espn: { sport: 'football', league: 'college-football', id: '251' }, season: { kind: 'espn' }, form: { kind: 'espn' },
      inject: { url: 'https://texaslonghorns.com/sports/football/schedule' },
      logo: 'https://a.espncdn.com/i/teamlogos/ncaa/500/251.png', schedule: 'https://texaslonghorns.com/sports/football/schedule',
      club: 'Texas Longhorns Football', opens: 'late August', wiki: { title: 'Texas Longhorns football', teamPage: true },
      news: [['https://texaslonghorns.com/rss?path=football', 'TexasLonghorns.com']] },
    // Texas Longhorns men's basketball, SEC, Moody Center. ESPN's plain
    // schedule call shows only the preseason until the season opens in
    // early November (the shared adapter merges the regular season only
    // for the NBA), and app.js cannot draw a tab for a club with no games
    // (renderTeamForm reads the last one), so `strip: false` keeps the
    // club to its filter row and the game titles until ESPN flips — then
    // drop that flag (2026-10-11)
    { slug: 'texashoops', label: 'Texas Hoops', name: 'Texas Longhorns', abbr: 'TEX', re: /longhorns.*basketball/i, sport: 'basketball', venue: 'Moody Center', colors: ['#bf5700', '#333f48'],
      espn: { sport: 'basketball', league: 'mens-college-basketball', id: '251' }, season: { kind: 'espn' }, form: { kind: 'espn' }, strip: false,
      logo: 'https://a.espncdn.com/i/teamlogos/ncaa/500/251.png', schedule: 'https://texaslonghorns.com/sports/mens-basketball/schedule',
      club: "Texas Longhorns Men's Basketball", opens: 'early November', wiki: { title: "Texas Longhorns men's basketball", teamPage: true } },
    // Austin FC, MLS, Q2 Stadium
    { slug: 'austinfc', label: 'Austin FC', name: 'Austin FC', abbr: 'ATX', re: /austin fc/i, sport: 'soccer', venue: 'Q2 Stadium', colors: ['#00b140', '#000000'],
      espn: { sport: 'soccer', league: 'usa.1', id: '20906' }, season: { kind: 'espn' }, form: { kind: 'espn' },
      logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/20906.png', schedule: 'https://www.austinfc.com/schedule/',
      club: 'Austin FC', opens: 'late February', wiki: { title: 'Austin FC' } },
    // Round Rock Express, Triple-A Pacific Coast League (Rangers affiliate), Dell Diamond
    { slug: 'express', label: 'Express', name: 'Round Rock Express', abbr: 'RR', re: /round rock express|\bexpress\b/i, sport: 'baseball', venue: 'Dell Diamond', colors: ['#13294b', '#c8102e'],
      season: { kind: 'mlb', id: 102, sportId: 11 }, form: { kind: 'milb', id: 102, league: 112, leagueName: 'Pacific Coast League' },
      inject: { url: 'https://www.milb.com/round-rock/tickets' }, // Ticketmaster lists the home stands without first-pitch times; the league's schedule supplies the rest
      logo: 'https://www.mlbstatic.com/team-logos/102.svg', schedule: 'https://www.milb.com/round-rock/schedule',
      club: 'Round Rock Express', opens: 'late March', wiki: { title: 'Round Rock Express', club: true },
      news: [['https://www.milb.com/round-rock/feeds/news/rss.xml', 'MiLB.com']] },
    // Texas Stars, AHL (Dallas Stars affiliate), H-E-B Center at Cedar Park
    { slug: 'stars', label: 'Stars', name: 'Texas Stars', abbr: 'TEX', re: /texas stars/i, sport: 'hockey', venue: 'H-E-B Center', colors: ['#006847', '#8f8f8c'],
      season: { kind: 'hockeytech', league: AHL.league, key: AHL.key, id: 380, leagueName: 'AHL' }, form: { kind: 'hockeytech', league: AHL.league, key: AHL.key, id: 380 },
      logo: 'https://assets.leaguestat.com/ahl/logos/380.png', schedule: 'https://www.texasstars.com/schedule',
      club: 'Texas Stars', opens: 'mid October', wiki: { title: 'Texas Stars', club: true } },
  ];

  // The venues, one record each — downtown, the campus and the stadiums
  // first, then the music rooms and the towns around. Per venue:
  //   capacity how many people the place holds
  //   area     'town' for the Red River and East Side music rooms and the
  //            Hill Country amphitheatre (the panel's second group);
  //            absent = downtown, the campus and the stadiums
  //   type     the event type when the title decides nothing
  //   cssVar   the hue styles.css sets for it (dark block --v-*); color
  //            the same hue as a value, for the series graph
  //   url      the venue's own events listing — not a ticket vendor
  //   icon     a mark for listings without a team crest
  //   tm       its Ticketmaster Discovery listing (fetch-events.mjs reads
  //            the venue by id — every page). There is NO city sweep here:
  //            the API stops a query at its thousandth event, and Austin
  //            fills that in weeks
  //   alias    the other spellings the feeds use for it, folded to this name
  // No festivals yet, so the panel's Festivals group folds away (app.js).
  var VENUES = {
    // --- Downtown, the campus and the stadiums ---
    'Moody Center': {
      geo: [30.28073, -97.73084],
      capacity: 15000,
      type: 'concert',
      cssVar: '--v-moody',
      color: '#ea8686',
      url: 'https://www.moodycenteratx.com/events',
      icon: 'https://www.google.com/s2/favicons?domain=www.moodycenteratx.com&sz=128',
      tm: { id: 'KovZ917ANwG', match: 'moody center', fallbackUrl: 'https://www.moodycenteratx.com/events', exclude: /parking|tour/i },
      feed: { kind: 'tribe', secondary: true, url: 'https://moodycenteratx.com/wp-json/tribe/events/v1/events', drop: /parking|\btours?\b/i }, // the arena's own calendar (The Events Calendar), filling what Ticketmaster lacks (2026-10-27)
      alias: /^moody center/i,
    },
    'Q2 Stadium': {
      geo: [30.38629, -97.71877],
      capacity: 20738,
      type: 'sports',
      cssVar: '--v-q2',
      color: '#86eaa3',
      url: 'https://www.q2stadium.com/events/',
      icon: 'https://www.google.com/s2/favicons?domain=www.q2stadium.com&sz=128',
      tm: { id: 'KovZ917AJ9n', match: 'q2 stadium', fallbackUrl: 'https://www.q2stadium.com/events/', exclude: /parking/i },
      feed: { kind: 'cards', secondary: true, url: 'https://www.q2stadium.com/events/', item: /<div class="event-column">/, title: /<h3\s+class="heading-6 book"><a href="([^"]+)">([^<]+)</, when: /<div\s+class="event-date">([^<]+)</ }, // the stadium's own Up Next list ("October 28, 2026 · 7:30 pm"), secondary behind Ticketmaster (2026-10-27)
      alias: /q2 stadium/i,
    },
    'DKR Stadium': {
      geo: [30.2837, -97.73405],
      capacity: 100119,
      type: 'sports',
      cssVar: '--v-dkr',
      color: '#c086ea',
      url: 'https://texaslonghorns.com/sports/football/schedule',
      icon: 'https://www.google.com/s2/favicons?domain=texaslonghorns.com&sz=128',
      tm: { id: 'KovZpZAJE6dA', match: 'royal', fallbackUrl: 'https://texaslonghorns.com/sports/football/schedule', exclude: /parking/i },
      alias: /darrell k\.? royal|dkr|texas memorial stadium/i,
    },
    'Moody Amphitheater': {
      geo: [30.27218, -97.73486],
      capacity: 5000,
      type: 'concert',
      cssVar: '--v-moodyamp',
      color: '#eadd86',
      url: 'https://www.moodyamphitheater.com/',
      icon: 'https://www.google.com/s2/favicons?domain=www.moodyamphitheater.com&sz=128',
      tm: { id: 'KovZ917AJ_x', match: 'moody amphitheater', fallbackUrl: 'https://www.moodyamphitheater.com/' },
      feed: { kind: 'cards', secondary: true, url: 'https://www.moodyamphitheater.com/events-tickets', item: /<div role="listitem" class="collection-item w-dyn-item">/, title: /<a href="(\/events\/[^"]+)"[\s\S]*?<div class="event-headliner">([^<]+)</, when: /date-month">([^<]+)<\/div><div class="date-day">([^<]+)</ }, // the amphitheater's Webflow list: headliner and "Nov 5" only — its clock is the doors time, which kept a show two hours later on Ticketmaster from folding, so the date alone; secondary (2026-10-27)
      alias: /moody amphitheat|waterloo park/i,
    },
    'ACL Live': {
      geo: [30.26537, -97.74712],
      capacity: 2750,
      type: 'concert',
      cssVar: '--v-acllive',
      color: '#86d9ea',
      url: 'https://acl-live.com/calendar',
      icon: 'https://www.google.com/s2/favicons?domain=acl-live.com&sz=128',
      tm: { id: 'KovZpZAJJlvA', match: 'moody theater', fallbackUrl: 'https://acl-live.com/calendar' },
      feed: { kind: 'cards', secondary: true, url: 'https://www.acllive.com/events/all', venues: /moody theater/i, item: /<div class="eventItem entry /, title: /<h3 class="title[^"]*">\s*<a href="([^"]+)"[^>]*>([^<]+)</, when: /<a href="\/event\/(\d{4}-\d{2}-\d{2})-[a-z0-9-]*?(?:-at-(\d{1,2})-([ap]m))?"/, place: /<div class="location">\s*([^<]+?)\s*</ }, // acllive.com's whole listing (both halls, this hall's cards kept): the date and an on-the-hour clock from the event slug, secondary (2026-10-27)
      alias: /acl live at the moody|moody theater/i,
    },
    '3TEN ACL Live': {
      geo: [30.26575, -97.74708],
      capacity: 350,
      type: 'concert',
      cssVar: '--v-threeten',
      color: '#ea86bc',
      url: 'https://acl-live.com/calendar',
      icon: 'https://www.google.com/s2/favicons?domain=acl-live.com&sz=128',
      tm: { id: 'KovZ917AxfF', match: '3ten', fallbackUrl: 'https://acl-live.com/calendar' },
      feed: { kind: 'cards', secondary: true, url: 'https://www.acllive.com/events/all', venues: /3ten/i, item: /<div class="eventItem entry /, title: /<h3 class="title[^"]*">\s*<a href="([^"]+)"[^>]*>([^<]+)</, when: /<a href="\/event\/(\d{4}-\d{2}-\d{2})-[a-z0-9-]*?(?:-at-(\d{1,2})-([ap]m))?"/, place: /<div class="location">\s*([^<]+?)\s*</ }, // the same acllive.com listing, 3TEN's cards (2026-10-27)
      alias: /3ten/i,
    },
    'Bass Concert Hall': {
      geo: [30.2851, -97.7307],
      capacity: 2900,
      type: 'arts',
      cssVar: '--v-bass',
      color: '#9fea86',
      url: 'https://texasperformingarts.org/events/',
      icon: 'https://www.google.com/s2/favicons?domain=texasperformingarts.org&sz=128',
      tm: { id: 'KovZpZAJJ7AA', match: 'bass concert hall', fallbackUrl: 'https://texasperformingarts.org/events/' },
      alias: /bass concert hall/i,
    },
    'Circuit of the Americas': {
      geo: [30.13527, -97.63566],
      capacity: 120000,
      type: 'sports',
      cssVar: '--v-cota',
      color: '#8a86ea',
      url: 'https://circuitoftheamericas.com/events/',
      icon: 'https://www.google.com/s2/favicons?domain=circuitoftheamericas.com&sz=128',
      tm: { id: 'KovZpZAJEF1A', match: 'circuit of the americas', fallbackUrl: 'https://circuitoftheamericas.com/events/', exclude: /parking|camping|shuttle/i },
      feed: { kind: 'cards', secondary: true, url: 'https://circuitoftheamericas.com/events/', item: /<div class="event-single"/, title: /<a href="([^"]+)"[^>]*>[\s\S]*?<h3>([^<]+)<\/h3>/, when: /<div class="event-detail">\s*<span>([^<]+)<\/span>/, drop: /parking|camping|shuttle|nascar|formula e/i }, // the track's own events list ("April 23-25, 2027" = a row per day, no clocks), secondary; the NASCAR and Formula E weekends are Ticketmaster's per-day rows (2026-10-27)
      alias: /circuit of the americas|\bcota\b/i,
    },
    'Germania Insurance Amphitheater': {
      geo: [30.13538, -97.63801],
      capacity: 14000,
      type: 'concert',
      cssVar: '--v-germania',
      color: '#eaa786',
      url: 'https://germaniaamp.com/events/',
      icon: 'https://www.google.com/s2/favicons?domain=germaniaamp.com&sz=128',
      tm: { id: 'KovZpZAJEFJA', match: 'germania', fallbackUrl: 'https://germaniaamp.com/events/', exclude: /parking/i },
      alias: /germania/i,
    },
    'H-E-B Center': {
      geo: [30.54174, -97.81978],
      capacity: 8700,
      type: 'sports',
      cssVar: '--v-heb',
      color: '#86eac4',
      url: 'https://www.hebcenter.com/events',
      icon: 'https://www.google.com/s2/favicons?domain=www.hebcenter.com&sz=128',
      tm: { id: 'KovZpZAJJn6A', match: 'h-e-b center', fallbackUrl: 'https://www.hebcenter.com/events', exclude: /parking/i },
      feed: { kind: 'cards', secondary: true, url: 'https://www.hebcenter.com/events/all', item: /<div class="m-eventItem /, title: /<h3 class="m-eventItem__title[^"]*">\s*<a href="([^"]+)"[^>]*>([^<]+?)\s*</, when: /m-date__month">([^<]+)<\/span><span class="m-date__day">([^<]+)<[\s\S]*?(?:m-eventItem__start">([^<]*)<|m-eventItem__buttons btn-group)/, drop: /parking/i }, // the arena's Carbonhouse list ("Oct 31", "7:07 PM"; no year printed), secondary (2026-10-27)
      alias: /h-?e-?b center/i,
    },
    'Dell Diamond': {
      geo: [30.52744, -97.63094],
      capacity: 11631,
      type: 'sports',
      cssVar: '--v-dell',
      color: '#e186ea',
      url: 'https://www.milb.com/round-rock/schedule',
      icon: 'https://www.google.com/s2/favicons?domain=www.milb.com&sz=128',
      tm: { id: 'KovZpZA1v1lA', match: 'dell diamond', fallbackUrl: 'https://www.milb.com/round-rock/schedule', exclude: /parking/i },
      alias: /dell diamond/i,
    },
    'Zilker Park': {
      geo: [30.24567, -97.76884],
      capacity: 75000,
      type: 'community',
      cssVar: '--v-zilker',
      color: '#d5ea86',
      url: 'https://www.aclfestival.com/',
      icon: 'https://www.google.com/s2/favicons?domain=www.aclfestival.com&sz=128',
      tm: { id: 'KovZpZAEkItA', match: 'zilker', fallbackUrl: 'https://www.aclfestival.com/' },
      feed: { kind: 'jsonld', secondary: true, url: 'https://www.aclfestival.com/' }, // the festival's own page marks the next ACL Fest up as one schema.org Event (its first day; the lineup year comes when they publish it), secondary (2026-10-27)
      alias: /zilker/i,
    },
    // --- Music rooms and the towns around (`area: 'town'`): Red River, the East Side, Cedar Park's clubs and New Braunfels ---
    "Stubb's": {
      geo: [30.26849, -97.73619],
      area: 'town',
      capacity: 2200,
      type: 'concert',
      cssVar: '--v-stubbs',
      color: '#86b7ea',
      url: 'https://www.stubbsaustin.com/',
      icon: 'https://www.google.com/s2/favicons?domain=www.stubbsaustin.com&sz=128',
      tm: { id: 'KovZ917AxzU', match: 'stubb', fallbackUrl: 'https://www.stubbsaustin.com/' },
      alias: /stubb'?s/i,
    },
    "Emo's": {
      geo: [30.23957, -97.72805],
      area: 'town',
      capacity: 1700,
      type: 'concert',
      cssVar: '--v-emos',
      color: '#ea869a',
      url: 'https://www.emosaustin.com/',
      icon: 'https://www.google.com/s2/favicons?domain=www.emosaustin.com&sz=128',
      tm: { id: 'KovZpZAEAEeA', match: "emo's", fallbackUrl: 'https://www.emosaustin.com/' },
      feed: { kind: 'jsonld', secondary: true, url: 'https://www.emosaustin.com/', at: /emo's/i, drop: /\d[- ]day (?:ticket|pass)/i }, // the club's own page (Live Nation) marks each show up as a MusicEvent, secondary (2026-10-27)
      alias: /emo'?s/i,
    },
    'Mohawk': {
      geo: [30.27015, -97.73604],
      area: 'town',
      capacity: 900,
      type: 'concert',
      cssVar: '--v-mohawk',
      color: '#86ea8e',
      url: 'https://mohawkaustin.com/',
      icon: 'https://www.google.com/s2/favicons?domain=mohawkaustin.com&sz=128',
      tm: { id: 'KovZ917ACM7', match: 'mohawk', fallbackUrl: 'https://mohawkaustin.com/' },
      alias: /mohawk/i,
    },
    'Scoot Inn': {
      geo: [30.26213, -97.7294],
      area: 'town',
      capacity: 1000,
      type: 'concert',
      cssVar: '--v-scoot',
      color: '#ab86ea',
      url: 'https://scootinnaustin.com/',
      icon: 'https://www.google.com/s2/favicons?domain=scootinnaustin.com&sz=128',
      tm: { id: 'KovZpZAE6kIA', match: 'scoot inn', fallbackUrl: 'https://scootinnaustin.com/' },
      feed: { kind: 'jsonld', secondary: true, url: 'https://www.scootinnaustin.com/', at: /scoot inn/i }, // the same Live Nation page shape as Emo's, secondary (2026-10-27)
      alias: /scoot inn/i,
    },
    "Antone's": {
      geo: [30.26605, -97.7404],
      area: 'town',
      capacity: 500,
      type: 'concert',
      cssVar: '--v-antones',
      color: '#eac886',
      url: 'https://antonesnightclub.com/',
      icon: 'https://www.google.com/s2/favicons?domain=antonesnightclub.com&sz=128',
      tm: { id: 'KovZpZAtv1nA', match: 'antone', fallbackUrl: 'https://antonesnightclub.com/' },
      feed: { kind: 'cards', secondary: true, url: 'https://antonesnightclub.com/', item: /<div class="tw-event-item">/, title: /<div class="tw-name">\s*<a href="([^"]+)">([^<]+)</, when: /tw-event-date">([^<]+)<[\s\S]*?tw-event-time">([^<]+)</ }, // the club's own upcoming list on its home page ("October 28, 2026", "8:00pm"), secondary (2026-10-27)
      alias: /antone'?s/i,
    },
    'Come and Take It Live': {
      geo: [30.24106, -97.7288],
      area: 'town',
      capacity: 800,
      type: 'concert',
      cssVar: '--v-catil',
      color: '#86eae6',
      url: 'https://www.comeandtakeitlive.com/',
      icon: 'https://www.google.com/s2/favicons?domain=www.comeandtakeitlive.com&sz=128',
      tm: { secondary: true, id: 'KovZ917AmbH', match: 'come and take it', fallbackUrl: 'https://www.comeandtakeitlive.com/' },
      feed: { kind: 'cards', url: 'https://comeandtakeitproductions.com/calendar/', venues: /come-and-take-it-live/, item: /<div class = "col-12 eventWrapper rhpSingleEvent/, title: /<a id = "eventTitle" class="url" href="([^"]+)"[^>]*>\s*<h2[^>]*>\s*([^<]+?)\s*<\/h2>/, when: /singleEventDate text-uppercase\s*">\s*([^<]+?)\s*<[\s\S]*?rhp-event__time-text--list">\s*(?:Doors:[^<\/]*\/\/\s*)?(?:Show:\s*)?([^<]+?)\s*</, place: /id = "eventTitle" class="url" href="[^"]*\/event\/[^"\/]+\/([^"\/]+)\//, type: 'concert' }, // the promoter's calendar (comeandtakeitproductions.com, Etix): every show at the club by its venue slug, "Wed, Oct 28" + the Show clock — leads, Ticketmaster lists a fraction (2026-10-27)
      alias: /come and take it/i,
    },
    'The Concourse Project': {
      geo: [30.18083, -97.68644],
      area: 'town',
      capacity: 3000,
      type: 'concert',
      cssVar: '--v-concourse',
      color: '#ea86d0',
      url: 'https://concourseproject.com/',
      icon: 'https://www.google.com/s2/favicons?domain=concourseproject.com&sz=128',
      tm: { secondary: true, id: 'KovZ917AYuG', match: 'concourse', fallbackUrl: 'https://concourseproject.com/' },
      feed: { kind: 'cards', chrome: true, url: 'https://concourseproject.com/', venues: /concourse/i, item: /<div class="seetickets-list-view-event-image-container">/, title: /<p class="fs-18 bold mb-12 event-title"><a href="([^"]+)"\s*>(.*?)(?: at (?:The )?Concourse[^<]*)?<\/a>/, when: /event-date">([^<]+)<[\s\S]*?see-showtime\s*">([^<]*)</, place: /<p class="fs-12 venue">at ([^<]+)</, type: 'concert' }, // the club's own SeeTickets list on its home page ("Thu Oct 29", "9:00PM") — leads, Ticketmaster lists a fraction; its edge refuses curl but answers Node (2026-10-27)
      alias: /concourse project/i,
    },
    'Radio/East': {
      geo: [30.20794, -97.71552],
      area: 'town',
      capacity: 1500,
      type: 'concert',
      cssVar: '--v-radioeast',
      color: '#b3ea86',
      url: 'https://radioeastatx.com/',
      icon: 'https://www.google.com/s2/favicons?domain=radioeastatx.com&sz=128',
      tm: { id: 'KovZ917ASir', match: 'radio', fallbackUrl: 'https://radioeastatx.com/' },
      alias: /radio\s*\/?\s*east/i,
    },
    'Whitewater Amphitheater': {
      geo: [29.86201, -98.15697],
      area: 'town',
      capacity: 5000,
      type: 'concert',
      cssVar: '--v-whitewater',
      color: '#8696ea',
      url: 'https://whitewaterrocks.com/',
      icon: 'https://www.google.com/s2/favicons?domain=whitewaterrocks.com&sz=128',
      tm: { id: 'KovZpZAIdEeA', match: 'whitewater', fallbackUrl: 'https://whitewaterrocks.com/', exclude: /parking|camping/i },
      alias: /whitewater amphitheat/i,
    },
  };

  // The usual view: every room on — nothing here lists nightly bar programs
  var DEFAULT_ON = ['Moody Center', 'Q2 Stadium', 'DKR Stadium', 'Moody Amphitheater', 'ACL Live', '3TEN ACL Live', 'Bass Concert Hall', 'Circuit of the Americas', 'Germania Insurance Amphitheater', 'H-E-B Center', 'Dell Diamond', 'Zilker Park', "Stubb's", "Emo's", 'Mohawk', 'Scoot Inn', "Antone's", 'Come and Take It Live', 'The Concourse Project', 'Radio/East', 'Whitewater Amphitheater'];
  var DEFAULT_OFF = [];
  var PREFS_KNOWN_FROM = null; // no default-off venue yet, so nothing for saved prefs to be told about

  // Event types: every event lands in exactly one, from its flags, title,
  // then venue. The rows the panel shows, in order.
  var TYPES = [
    { key: 'concert', label: 'Concerts', title: 'Live music — arena tours to Red River club nights' },
    { key: 'sports', label: 'Sports', title: 'Longhorns, Austin FC, Express and Stars home games, race weekends at COTA' },
    { key: 'arts', label: 'Arts & Theater', title: 'Texas Performing Arts at Bass Concert Hall, comedy, dance' },
    { key: 'community', label: 'Community', title: 'Zilker Park, festivals, family days' },
  ];
  var MOVIE_VENUE = null; // no cinema here

  // Share codes (?f=CODE): REGISTRY is every filterable key in a fixed
  // order and a code is a bitmask over it, so the list is APPEND-ONLY —
  // adding an entry adds a bit and every existing code keeps meaning what
  // it meant; removing or reordering one changes every link out there.
  // 34 slots from the first build: seven base-36 digits.
  var CODE_LENGTH = 7;
  var REGISTRY = [
    ['venue', 'Moody Center'], ['venue', 'Q2 Stadium'], ['venue', 'DKR Stadium'], ['venue', 'Moody Amphitheater'], ['venue', 'ACL Live'], ['venue', '3TEN ACL Live'], ['venue', 'Bass Concert Hall'], ['venue', 'Circuit of the Americas'], ['venue', 'Germania Insurance Amphitheater'], ['venue', 'H-E-B Center'], ['venue', 'Dell Diamond'], ['venue', 'Zilker Park'], ['venue', "Stubb's"], ['venue', "Emo's"], ['venue', 'Mohawk'], ['venue', 'Scoot Inn'], ['venue', "Antone's"], ['venue', 'Come and Take It Live'], ['venue', 'The Concourse Project'], ['venue', 'Radio/East'], ['venue', 'Whitewater Amphitheater'],
    ['badge', 'concert'], ['badge', 'sports'], ['badge', 'arts'], ['badge', 'community'],
    ['team', 'longhorns'], ['team', 'texashoops'], ['team', 'austinfc'], ['team', 'express'], ['team', 'stars'],
    ['cap', 'stadium'], ['cap', 'arena'], ['cap', 'hall'], ['cap', 'room'],
  ];

  // The words the page uses for the place
  var WORDS = {
    teamCity: 'Austin', // the board drops it from the clubs' names ("Austin FC" stays — it has no nickname)
    presetDefault: 'Every venue — the stadiums, Moody Center, the campus halls, the Red River clubs and the amphitheatres out of town — every team and type',
    presetNeighborhood: 'Downtown, the campus and the stadiums only',
    presetBig: 'Only the places that hold 2,000 or more — the stadiums, the arenas and the amphitheatres',
    phrases: { all: 'Showing everything.', none: 'Showing nothing yet — open Filter and pick some venues.', neighborhood: 'Showing downtown, the campus and the stadiums only.', big: 'Showing the big venues only — the stadiums, the arenas and the amphitheatres.' },
  };

  global.LQACity = {
    key: 'austin',
    name: 'Austin',
    site: 'https://austin.here.events/',
    userAgent: 'Mozilla/5.0 (compatible; austin-events/1.0; +https://austin.here.events/)',
    tz: 'America/Chicago', tzName: 'Central', // the city's time zone: the ICS feed's TZID, the game clocks, the poster's footer
    state: "Texas", stateOutline: 'M20.5 7.6L20.8 7.8L21.2 7.8L21.2 9.0L21.2 10.1L21.5 11.0L21.8 11.7L22.0 12.2L21.9 12.8L21.7 13.5L21.5 14.1L20.4 15.0L20.2 14.9L19.9 14.7L19.9 15.1L19.3 16.0L18.2 16.6L18.1 16.6L17.4 16.5L17.4 16.8L17.2 17.1L16.9 17.4L16.6 17.4L16.6 17.7L16.1 18.0L15.9 18.9L16.0 19.1L16.0 19.9L16.5 21.1L16.2 21.4L15.5 21.2L14.3 20.8L13.5 20.4L13.0 19.4L13.0 19.0L12.9 18.5L12.0 17.4L11.6 16.8L11.0 15.6L10.2 14.8L9.8 14.5L8.9 14.4L8.2 14.6L7.7 15.5L7.2 15.9L5.9 15.2L5.1 14.4L4.6 13.0L3.0 11.6L2.3 11.0L2.4 10.5L4.1 10.5L5.8 10.5L7.5 10.5L7.5 8.0L7.5 5.5L7.5 3.0L8.4 2.5L9.9 2.5L11.3 2.5L12.1 3.0L12.1 4.0L12.2 5.1L12.2 6.0L13.0 6.3L13.3 6.3L13.5 6.6L14.4 6.8L15.0 6.7L15.3 7.2L15.7 7.0L15.8 7.1L16.2 7.2L16.4 7.3L16.6 7.4L16.8 7.1L17.1 7.2L17.3 7.2L17.7 7.5L18.3 7.2L18.9 7.1L19.2 7.2L19.8 7.3Z', // the masthead's small state, linking to here.events (scripts/state-outline.mjs, Natural Earth 1:50m)
    // the calendar feed's header; the UID domain never changes (changing it
    // re-creates every event in subscribers' calendars)
    ics: { name: 'Austin Events', short: 'Austin Events', teams: 'Austin home teams — every season', prodid: '-//here.events//austin-events//EN', uidDomain: 'fosdal.net', // the UID domain the whole family issues (the shared ics test pins it)
      desc: 'Upcoming events around Austin\\, TX — Moody Center\\, Q2 Stadium\\, DKR\\, ACL Live\\, the Red River clubs and the amphitheatres' },
    teams: TEAMS,
    map: { // the Map view (local-map.js; the ground drawn once by scripts/build-local-map.mjs from OpenStreetMap, committed as site/local-map.json) — every city gets one, Steve, 2026-10-26
      kind: 'urban',
      bbox: [29.76, -98.236, 30.644, -97.552], // south, west, north, east — every room, with a margin
      home: [30.073, -97.802, 30.449, -97.602], // the view at first: the city's own rooms; the fit button shows the whole frame
      roads: ['motorway', 'trunk', 'primary'],
      tolerance: 0.8,
      labels: [
        { name: 'Austin', lat: 30.267, lon: -97.743, anchor: 'middle' },
        { name: 'Cedar Park', lat: 30.52171, lon: -97.82783, anchor: 'middle' },
        { name: 'Round Rock', lat: 30.50859, lon: -97.67881, anchor: 'middle' },
      ],
    },
    venues: VENUES,
    defaultOn: DEFAULT_ON,
    defaultOff: DEFAULT_OFF,
    prefsKnownFrom: PREFS_KNOWN_FROM,
    types: TYPES,
    movieVenue: MOVIE_VENUE,
    groundsVenue: null, // every listing is read by room, so nothing arrives under a name city.js lacks
    codeLength: CODE_LENGTH,
    registry: REGISTRY,
    words: WORDS,
  };
})(typeof globalThis !== 'undefined' ? globalThis : window);
