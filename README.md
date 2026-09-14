# WARDOGS Field Intel

[WARDOGS Field Intel](https://wardogsdb.org/) is an independent player resource for **WARDOGS**. It is built for the moments between deployments: checking a weapon, putting together a legal kit, protecting a cash reserve, learning a system, or catching up after a patch.

The site is a fan project. It is not affiliated with, endorsed by, or connected to the official WARDOGS game or its rights holders.

## What WARDOGS players can find here

WARDOGS is a combined-arms battlefield game where a player’s kit, route, team role and cash reserve all matter. A good decision is rarely just “which gun is best?” It is whether that gun has the right ammunition, whether the loadout can be replaced, whether the squad can reach the objective, and whether the role helps the team keep pressure on the Control Zone.

Field Intel keeps those decisions practical:

- Read weapon, ammunition, attachment, gear and vehicle records without leaving the list.
- Build a compatible deployment kit and see its cost, weight, storage and selected utility together.
- Compare weapons for the job at hand instead of chasing a universal “best” pick.
- Learn core systems through four focused guides written for a player preparing to use them.
- Follow the patch timeline when an update changes the way a kit or role should be played.

## Site guide

| Page | What it is for |
| --- | --- |
| [Home](https://wardogsdb.org/) | A quick route to the most useful player resources, current field notes and commonly checked items. |
| [Wiki](https://wardogsdb.org/wiki) | Weapons, ammunition, attachments, equipment and vehicles with the information needed before a purchase. |
| [Guides](https://wardogsdb.org/guides) | Four detailed play guides: first match, cash economy, helicopter controls and Control Zone play. |
| [Loadout Builder](https://wardogsdb.org/builder) | Build a compatible kit from weapon through ammunition, attachments and backpack space. |
| [Tier Lists](https://wardogsdb.org/tier-list) | Community-oriented category picks, intended as a starting point for comparison rather than a final verdict. |
| [Tools](https://wardogsdb.org/tools) | Weapon comparison and a deployment budget planner for clearer pre-match choices. |
| [Updates](https://wardogsdb.org/updates) | One timeline for listed versions, dates and player-relevant changes. |

## Featured guides

- [WARDOGS Beginner Guide](https://wardogsdb.org/guides/beginner-guide) — choose a role, buy an affordable first kit and learn from every life.
- [WARDOGS Cash Economy Guide](https://wardogsdb.org/guides/cash-economy) — protect a reserve while deciding when specialist equipment is worth the risk.
- [WARDOGS Helicopter Guide](https://wardogsdb.org/guides/helicopter-controls) — prepare, fly, land and support a squad without throwing away a team asset.
- [WARDOGS Control Zone Guide](https://wardogsdb.org/guides/control-zone-guide) — create objective pressure with routes, presence and reinforcement timing.

## Frequently asked questions

### Is WARDOGS Field Intel official?

No. It is an independent fan site. For official news, support and release information, use the channels published by the WARDOGS rights holders.

### Are all listed values permanent?

No. WARDOGS is subject to updates, and some records may reflect a specific checked build. A last-checked date is more useful than pretending a changing game has permanent numbers.

### Why does the Builder remove ammunition after a weapon change?

The Builder follows weapon compatibility. When the selected weapon changes, ammunition and attachments that do not fit it are removed so the displayed kit remains possible to equip.

### How can I report an issue?

Send the page URL, the value or relationship that needs attention, the game version or date and any public evidence to [wyong@wardogsdb.org](mailto:wyong@wardogsdb.org). See [Contact Us](https://wardogsdb.org/contact) and [Copyright](https://wardogsdb.org/copyright) for attribution or rights requests.

## Legal

- [Privacy Policy](https://wardogsdb.org/privacy)
- [Terms of Service](https://wardogsdb.org/terms)
- [Copyright Notice](https://wardogsdb.org/copyright)
- [About Us](https://wardogsdb.org/about)
- [Contact Us](https://wardogsdb.org/contact)

Copyright © 2026 WARDOGS Field Intel. All rights reserved.

## Development

```bash
npm ci
npm run dev
```

Run `npm run check` before committing. It performs the TypeScript check, ESLint, unit tests and catalog integrity validation. Run `npm run build` for the production build. `npm run data:sync` refreshes the community snapshot and validates the resulting catalog and image references.

The production smoke workflow checks the public homepage, robots file, sitemap, Builder and Budget Planner every day. It also fails when a required security response header is missing, so deployment or proxy regressions surface through the repository's Actions notifications.
