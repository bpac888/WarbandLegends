# 0.40.2 — consistent release loading and title-screen access

The splash replay button exists in main but a user could not see it at the public Safari URL. The environment cannot access the GitHub Pages host, so the exact live-deployment/cache state could not be confirmed.

To prevent a mixed cached release, all local JavaScript imports, worker entry points, core data fetches, the app entry point and stylesheets now carry the package release version. `tools/stamp-release.mjs` applies the version idempotently before tests and builds, with the stamped source files checked in because Pages serves main directly. Workers receive versioned dependencies too; this is not limited to the top-level app script.

The splash footer displays the release number. Guide → Tools now has a Title Screen button. This navigation does not reset saved progress.

A direct diagnostic link is `/WarbandLegends/?release=0.40.2#/splash`: its fresh document URL and explicit route distinguish the title screen from a restored game route. It should display Play Intro and v0.40.2 after Pages deploys the new commit.

Validation: 59 test files and build pass; `test:release-cache` simulates stale unversioned JS/CSS and confirms they are bypassed, replay/version are visible, and title-screen navigation preserves progress. The full upgrades browser test also passes with versioned modules and a real Auto weekly victory.
