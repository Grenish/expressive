## What this changes

<!-- What does this PR do, and why? Link the issue it closes, e.g. "Closes #12". -->

## Type of change

- [ ] Bug fix
- [ ] New component
- [ ] Change to an existing component
- [ ] Tokens, theming or motion
- [ ] CLI
- [ ] Docs site
- [ ] Other:

## Screenshots

<!-- For visual changes: before and after, in light and dark mode. Delete this section otherwise. -->

## Checklist

- [ ] `pnpm typecheck`, `pnpm test` and `pnpm build` pass
- [ ] Components and tokens: the registry is rebuilt (`pnpm --filter @expressive/registry build`)
- [ ] Components: styles use tokens only, with no raw colors, radii or durations
- [ ] Components: keyboard, focus ring and screen reader behavior checked, and reduced motion respected
- [ ] Docs updated (component docs, demo, and the "19 components and counting" copy for a new component)
- [ ] Checked in light and dark mode, and at phone width (390px)
- [ ] No version bumps (the maintainer handles releases)
