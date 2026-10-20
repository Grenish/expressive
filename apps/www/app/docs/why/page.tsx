import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { C, Callout, DocsPage, H2, H3, LinkTiles, List, P, TextLink } from "@/components/docs/prose";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/registry/components/table";

export const metadata: Metadata = pageMetadata("/docs/why");

/** A comparison table: first column is the row label. */
function Compare({ label, columns, rows }: { label: string; columns: string[]; rows: Array<[string, ...React.ReactNode[]]> }) {
  return (
    <Table aria-label={label} variant="outlined" density="compact" className="text-body-medium">
      <TableHeader>
        <TableRow>
          <TableHead>
            <span className="sr-only">Aspect</span>
          </TableHead>
          {columns.map((column) => (
            <TableHead key={column}>{column}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map(([aspect, ...cells]) => (
          <TableRow key={aspect}>
            <TableCell className="text-title-small text-on-surface-variant">{aspect}</TableCell>
            {cells.map((value, i) => (
              <TableCell key={i} className="py-2 align-top whitespace-normal">
                {value}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function Mapping({ label, from, rows }: { label: string; from: string; rows: Array<[React.ReactNode, React.ReactNode]> }) {
  return (
    <Table aria-label={label} variant="outlined" density="compact" className="text-body-medium">
      <TableHeader>
        <TableRow>
          <TableHead>{from}</TableHead>
          <TableHead>Expressive</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map(([source, target], i) => (
          <TableRow key={i}>
            <TableCell className="py-2 align-top whitespace-normal">{source}</TableCell>
            <TableCell className="py-2 align-top whitespace-normal">{target}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default function Why() {
  return (
    <DocsPage
      href="/docs/why"
      eyebrow="Getting started"
      title="Why Expressive"
      lead="What Expressive gives you, how it compares with MUI, Material Web, shadcn/ui and headless libraries, and when one of those is the better choice."
    >
      <H2>What you get</H2>
      <List>
        <li>
          <strong>Material 3 Expressive, on the web.</strong> The 2025 evolution of Material You: corners that morph on press and
          selection, spring physics instead of fixed durations, and the new components (button groups, split buttons, FAB menus,
          floating toolbars, the shape-morph loading indicator and 35 expressive shapes).
        </li>
        <li>
          <strong>Code you own.</strong> The CLI copies each component into your project as a readable <C>.tsx</C> file. Change it
          like any other file in your app; there&apos;s no runtime UI package to override or wait on.
        </li>
        <li>
          <strong>Tailwind-native.</strong> Every token is a utility (<C>bg-primary</C>, <C>text-title-large</C>,{" "}
          <C>rounded-shape-large</C>, <C>spring-spatial-fast</C>), so your own components match the library without a second
          styling system.
        </li>
        <li>
          <strong>A whole theme from one color.</strong> Google&apos;s <C>material-color-utilities</C> turn a seed into every color role
          in light, dark and higher-contrast schemes, each paired with a readable <C>on-</C> color.
        </li>
        <li>
          <strong>Motion that respects people.</strong> Springs run as CSS by default (no JavaScript, works with server rendering), or
          on Motion or GSAP. Reduced motion is handled everywhere.
        </li>
        <li>
          <strong>Accessible behavior from Base UI.</strong> Keyboard support, focus management and ARIA come from{" "}
          <TextLink href="https://base-ui.com">Base UI</TextLink> primitives, and every component has keyboard, ARIA and axe tests.
        </li>
        <li>
          <strong>Ready for AI agents.</strong> Plain source, an <TextLink href="/llms-full.txt">llms-full.txt</TextLink> and{" "}
          <TextLink href="/docs/agent-skills">agent skills</TextLink> mean coding agents write code that uses the system.
        </li>
      </List>

      <H2>At a glance</H2>
      <P>Status of other projects as of October 2026.</P>
      <Compare
        label="Expressive compared with MUI, Material Web and shadcn/ui"
        columns={["Expressive", "MUI", "Material Web", "shadcn/ui"]}
        rows={[
          ["Design language", "Material 3 Expressive", "Material Design 2, themeable", "Material 3 (baseline)", "Neutral; you design it"],
          ["Delivery", "Source copied in by a CLI", "npm package", "npm package (web components)", "Source copied in by a CLI"],
          ["Styling", "Tailwind v4 utilities over CSS variables", "Emotion CSS-in-JS (sx, styled)", "CSS custom properties, shadow DOM", "Tailwind"],
          ["Theme", "One seed color → full light/dark scheme", "Palette object you define", "Set --md-sys-* CSS variables", "A few CSS variables you choose"],
          ["Motion", "Spring tokens, three schemes, swappable engine", "Duration and easing transitions", "Material motion (baseline)", "Per-component CSS animations"],
          ["Behavior", "Base UI", "MUI's own", "Lit components", "Radix-based"],
          ["Frameworks", "React 19", "React", "Any (web components)", "React"],
          ["Maturity", "Young; 45 components", "Very large; MUI X add-ons", "Maintenance mode since 2024", "Large ecosystem"],
        ]}
      />

      <H2>Compared with each alternative</H2>

      <H3>MUI (Material UI)</H3>
      <P>
        The most widely used React component library: a runtime package with its own styling engine, a large component set and MUI X
        (data grid, date and time pickers, charts; advanced features are commercial). It implements Material Design 2; Material 3 has
        been planned for years but hasn&apos;t shipped, and MUI&apos;s{" "}
        <TextLink href="https://mui.com/blog/2026-and-beyond/">2026 roadmap</TextLink> doesn&apos;t commit to it.
      </P>
      <List>
        <li>
          <strong>Choose Expressive</strong> for the current Material spec, Tailwind instead of CSS-in-JS, and component code you can
          read and change instead of override.
        </li>
        <li>
          <strong>Choose MUI</strong> if you need a data grid, date and time pickers, autocomplete or charts today, already have an MUI
          codebase, don&apos;t use Tailwind, or need paid support.
        </li>
      </List>

      <H3>Material Web</H3>
      <P>
        Google&apos;s official Material 3 web components. It has been in{" "}
        <TextLink href="https://github.com/material-components/material-web/discussions/5642">maintenance mode since June 2024</TextLink>:
        not deprecated, but with no new features or components planned. It predates M3 Expressive.
      </P>
      <List>
        <li>
          <strong>Choose Expressive</strong> for M3 Expressive, active development, React APIs and Tailwind styling.
        </li>
        <li>
          <strong>Choose Material Web</strong> if you need framework-agnostic web components and baseline Material 3 with minimal
          maintenance is enough.
        </li>
      </List>

      <H3>shadcn/ui</H3>
      <P>
        Expressive works the way shadcn/ui does: a CLI copies components into your repo, and you own them. The difference is the goal.
        shadcn/ui is a neutral starting point you design yourself; Expressive ships a complete design language, with generated color,
        type, shape, elevation, state layers and spring motion already decided.
      </P>
      <List>
        <li>
          <strong>Choose Expressive</strong> for a coherent Material system without designing tokens, motion and states yourself, and
          for Material&apos;s navigation patterns and the new Expressive components.
        </li>
        <li>
          <strong>Choose shadcn/ui</strong> if your brand needs its own look, or you want its large ecosystem of blocks, charts and
          community components.
        </li>
        <li>
          <strong>Don&apos;t install both in one app.</strong> Both define Tailwind colors like <C>primary</C> with different meanings, so
          whichever loads last restyles the other.
        </li>
      </List>

      <H3>Headless libraries: Base UI, Radix, React Aria</H3>
      <P>
        These give behavior and accessibility without any styling. Expressive is Base UI underneath, plus Material tokens, styling and
        motion. Use a headless library directly if you have your own design system; use Expressive if you want Material done for you,
        and reach for Base UI (already installed) for anything Expressive doesn&apos;t cover yet.
      </P>

      <H3>Mantine, Chakra UI, Ant Design</H3>
      <P>
        Runtime libraries, each with its own design language. Pick them for breadth (date pickers, rich text, data-heavy admin screens)
        or because you like their look. Pick Expressive for Material 3 Expressive, Tailwind-native styling and owned source.
      </P>

      <H3>Native Material: Jetpack Compose, Flutter, Angular Material</H3>
      <P>
        Compose is where Google builds M3 Expressive for Android, Flutter has its own Material 3, and Angular Material serves Angular.
        Expressive follows the same published spec for React on the web, so an Android app and a web app can share a seed color and feel
        like one product.
      </P>

      <H3>Building Material 3 yourself</H3>
      <P>
        Doing it by hand means re-creating the color pipeline and its 40-plus roles in every scheme, 15 type roles with emphasized
        versions, a corner scale with pills that morph without snapping, state layers and focus rings, springs sampled into CSS easing
        with reduced-motion handling, and accessible behavior for every component. Expressive is that work, done once, as code you can
        still edit.
      </P>

      <H2>When not to use Expressive</H2>
      <List>
        <li>
          <strong>Your stack isn&apos;t React 19 with Tailwind CSS v4.</strong>
        </li>
        <li>
          <strong>You want updates without thinking about them.</strong> Owned code means improvements arrive when you pull them, with{" "}
          <C>expressive diff</C> and <C>add --overwrite</C>.
        </li>
        <li>
          <strong>You need vendor support.</strong> Expressive is a young open-source project.
        </li>
      </List>

      <H2>Migrating from MUI</H2>
      <Mapping
        label="MUI to Expressive"
        from="MUI"
        rows={[
          [<C>{'<Button variant="contained">'}</C>, <><C>{"<Button>"}</C> (filled), or <C>variant=&quot;tonal&quot;</C> for secondary actions</>],
          [<C>{'variant="outlined" / "text"'}</C>, <C>{'variant="outlined" / "text"'}</C>],
          [<C>{"<ButtonGroup> / <ToggleButtonGroup>"}</C>, <><C>{"<ButtonGroup>"}</C> / <C>{"<ConnectedButtonGroup>"}</C></>],
          [<C>{"<Fab> / <SpeedDial>"}</C>, <><C>{"<Fab>"}</C> / <C>{"<FabMenu>"}</C></>],
          [<C>{"<Chip>"}</C>, <>Assist, suggestion, filter or input chip, by purpose</>],
          [<C>{"<TextField>"}</C>, <><C>{"<TextField>"}</C>, with <C>invalid</C> and <C>errorText</C></>],
          [<C>{"<FormControlLabel>"}</C>, <>A plain <C>{"<label>"}</C> around the control</>],
          [<C>{"<Select> / <Menu>"}</C>, <><C>{"<Menu>"}</C> with <C>MenuRadioGroup</C></>],
          [<C>{"<AppBar>"}</C>, <C>{"<TopAppBar>"}</C>],
          [<C>{"<BottomNavigation>"}</C>, <C>{"<NavigationBar>"}</C>],
          [<C>{"<Drawer>"}</C>, <><C>{"<NavigationDrawer>"}</C>, <C>{"<ModalNavigationDrawer>"}</C> or <C>{"<SideSheet>"}</C></>],
          [<C>{'<SwipeableDrawer anchor="bottom">'}</C>, <C>{"<BottomSheet>"}</C>],
          [<C>{"<Snackbar>"}</C>, <><C>useSnackbar()</C>, or <C>useToast()</C> for stacked notifications</>],
          [<C>{"<DataGrid>"}</C>, <><C>{"<Table>"}</C> with TanStack Table</>],
          [<C>{"sx, styled()"}</C>, <>Tailwind classes with token utilities, merged with <C>cn()</C></>],
          [<C>theme.palette.primary.main</C>, <><C>bg-primary</C> or <C>var(--ex-color-primary)</C></>],
          [<C>theme.typography.h6</C>, <>A type role such as <C>text-title-large</C></>],
        ]}
      />

      <H2>Migrating from shadcn/ui</H2>
      <Mapping
        label="shadcn/ui to Expressive"
        from="shadcn/ui"
        rows={[
          [<C>default / secondary / outline / ghost</C>, <><C>filled</C> / <C>tonal</C> / <C>outlined</C> / <C>text</C></>],
          [<C>variant=&quot;destructive&quot;</C>, <><C>className=&quot;bg-error text-on-error&quot;</C>, and confirm in a dialog</>],
          [<C>DropdownMenu</C>, <C>Menu</C>],
          [<C>Sheet / Drawer</C>, <><C>SideSheet</C> / <C>BottomSheet</C></>],
          [<C>Sonner</C>, <><C>useToast()</C>, or <C>useSnackbar()</C> for one message at a time</>],
          [<C>Input + Label</C>, <><C>TextField</C> (label built in)</>],
          [<C>ToggleGroup</C>, <C>ConnectedButtonGroup</C>],
          [<C>Separator</C>, <C>Divider</C>],
          [<C>Badge (a label pill)</C>, <>A chip or a styled span: Expressive&apos;s <C>Badge</C> is a notification dot or count</>],
          [<C>bg-primary text-primary-foreground</C>, <C>bg-primary text-on-primary</C>],
          [<C>bg-muted text-muted-foreground</C>, <C>bg-surface-container text-on-surface-variant</C>],
          [<C>border-border, bg-background</C>, <C>border-outline-variant, bg-surface</C>],
        ]}
      />

      <Callout title="Inspired by, not affiliated with, Material Design">
        Expressive follows the published Material 3 Expressive guidelines. It isn&apos;t a Google project.
      </Callout>

      <H2>Next steps</H2>
      <LinkTiles
        items={[
          { href: "/docs/installation", title: "Install", description: "Set up Expressive in a React project with one command." },
          { href: "/docs/agent-skills", title: "Agent skills", description: "Teach your coding agent to build with Expressive." },
          { href: "/docs/components/button", title: "Components", description: "Forty-five and counting, each with a working demo." },
        ]}
      />
    </DocsPage>
  );
}
