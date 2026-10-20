import { Hct, argbFromHex, hexFromArgb } from "@material/material-color-utilities";
import type { ColorRoles, generateScheme } from "@/registry/tokens/colors";
import { type MaterialShapeName, shapePaths } from "@/registry/tokens/material-shapes";
import { springAt } from "@/registry/lib/spring";
import type { OgArt } from "@/lib/seo";

/*
 * Artwork for each Open Graph card: the right-hand illustration, drawn in the
 * page's own Material scheme. Satori rules apply: explicit display: flex on
 * any element with several children, flexbox layout, inline SVG.
 */

type Palettes = ReturnType<typeof generateScheme>["palettes"];
export interface ArtProps {
  art: OgArt;
  c: ColorRoles;
  p: Palettes;
  seed: string;
}

type Style = React.CSSProperties;
/** Satori chokes on properties set to undefined, so drop them. */
const clean = (s: Style): Style => Object.fromEntries(Object.entries(s).filter(([, v]) => v !== undefined)) as Style;
const row = (s: Style = {}): Style => clean({ display: "flex", flexDirection: "row", alignItems: "center", ...s });
const col = (s: Style = {}): Style => clean({ display: "flex", flexDirection: "column", ...s });
const display = (size: number, weight: 600 | 700 = 700): Style => ({ fontFamily: "Bricolage", fontWeight: weight, fontSize: size, letterSpacing: "-0.02em", lineHeight: 1.1 });
const body = (size: number): Style => ({ fontFamily: "Roboto Flex", fontSize: size, lineHeight: 1.3 });
const mono = (size: number): Style => ({ fontFamily: "JetBrains Mono", fontSize: size });

/*
 * The site's icons are Phosphor (bold), so cards use the same paths. The
 * checkbox, chip and switch draw their own check mark in the library, so those
 * cards keep it ("mark").
 */
const ICONS = {
  check: { viewBox: "0 0 256 256", d: "M232.49,80.49l-128,128a12,12,0,0,1-17,0l-56-56a12,12,0,1,1,17-17L96,183,215.51,63.51a12,12,0,0,1,17,17Z" },
  add: { viewBox: "0 0 256 256", d: "M228,128a12,12,0,0,1-12,12H140v76a12,12,0,0,1-24,0V140H40a12,12,0,0,1,0-24h76V40a12,12,0,0,1,24,0v76h76A12,12,0,0,1,228,128Z" },
  menu: {
    viewBox: "0 0 256 256",
    d: "M228,128a12,12,0,0,1-12,12H40a12,12,0,0,1,0-24H216A12,12,0,0,1,228,128ZM40,76H216a12,12,0,0,0,0-24H40a12,12,0,0,0,0,24ZM216,180H40a12,12,0,0,0,0,24H216a12,12,0,0,0,0-24Z",
  },
  mark: { viewBox: "0 0 24 24", d: "M9.55 18 3.85 12.3l1.43-1.43 4.27 4.28 9.17-9.18 1.43 1.43Z" },
};

function Icon({ name, size, color }: { name: keyof typeof ICONS; size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox={ICONS[name].viewBox}>
      <path d={ICONS[name].d} fill={color} />
    </svg>
  );
}

/** A Material shape, absolutely positioned. */
export function Shape({ name, size, color, x, y, rotate = 0, opacity = 1 }: { name: MaterialShapeName; size: number; color: string; x: number; y: number; rotate?: number; opacity?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ position: "absolute", left: x, top: y, transform: `rotate(${rotate}deg)`, opacity }}>
      <path d={shapePaths[name]} fill={color} />
    </svg>
  );
}

/** A Material shape in normal flow. */
function Glyph({ name, size, color, rotate = 0 }: { name: MaterialShapeName; size: number; color: string; rotate?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ transform: `rotate(${rotate}deg)` }}>
      <path d={shapePaths[name]} fill={color} />
    </svg>
  );
}

function Pill({ label, bg, fg, border, width, height = 84, radius = 999, size = 30 }: { label: string; bg: string; fg: string; border?: string; width?: number; height?: number; radius?: number; size?: number }) {
  return (
    <div style={row({ justifyContent: "center", width, height, padding: width ? 0 : "0 40px", borderRadius: radius, backgroundColor: bg, color: fg, border: border ? `3px solid ${border}` : undefined, ...display(size, 600) })}>{label}</div>
  );
}

function Terminal({ c, lines }: { c: ColorRoles; lines: Array<{ cmd?: string; out?: string }> }) {
  return (
    <div style={col({ width: 480, padding: "30px 32px", borderRadius: 32, backgroundColor: c.inverseSurface, gap: 12, boxShadow: "0 24px 60px rgba(0,0,0,0.22)" })}>
      <div style={row({ gap: 10, marginBottom: 10 })}>
        {[c.error, c.tertiary, c.primary].map((dot) => (
          <div key={dot} style={{ display: "flex", width: 16, height: 16, borderRadius: 99, backgroundColor: dot, opacity: 0.85 }} />
        ))}
      </div>
      {lines.map((line, i) =>
        line.cmd ? (
          <div key={i} style={row({ gap: 12, ...mono(19), color: c.inverseOnSurface })}>
            <span style={{ color: c.inversePrimary }}>$</span>
            <span>{line.cmd}</span>
          </div>
        ) : (
          <div key={i} style={row({ gap: 12, ...mono(17), color: c.inverseOnSurface, opacity: 0.75 })}>
            <Icon name="check" size={22} color={c.inversePrimary} />
            <span>{line.out}</span>
          </div>
        ),
      )}
    </div>
  );
}

function hueColor(hue: number, tone = 62) {
  return hexFromArgb(Hct.from(hue, 60, tone).toInt());
}

function ColorWheel({ c, p, seed }: Omit<ArtProps, "art">) {
  const R = 150;
  const W = 44;
  const C = 175;
  const steps = 60;
  const point = (a: number) => `${(C + Math.cos(a) * R).toFixed(1)} ${(C + Math.sin(a) * R).toFixed(1)}`;
  const seedHue = Hct.fromInt(argbFromHex(seed)).hue;
  const knob = ((seedHue - 90) * Math.PI) / 180;
  return (
    <div style={col({ alignItems: "center", gap: 30 })}>
      <svg width={350} height={350} viewBox="0 0 350 350">
        {Array.from({ length: steps }, (_, i) => {
          const a0 = (i / steps) * Math.PI * 2 - Math.PI / 2;
          const a1 = ((i + 1.05) / steps) * Math.PI * 2 - Math.PI / 2;
          return <path key={i} d={`M ${point(a0)} A ${R} ${R} 0 0 1 ${point(a1)}`} stroke={hueColor((i / steps) * 360)} strokeWidth={W} fill="none" />;
        })}
        <circle cx={C + Math.cos(knob) * R} cy={C + Math.sin(knob) * R} r={34} fill={c.primary} stroke="#ffffff" strokeWidth={8} />
        <circle cx={C} cy={C} r={92} fill={c.primaryContainer} />
      </svg>
      <div style={col({ gap: 8 })}>
        {(["primary", "secondary", "tertiary", "neutral"] as const).map((name) => (
          <div key={name} style={row({ gap: 6 })}>
            {([10, 20, 30, 40, 50, 60, 70, 80, 90, 95] as const).map((tone) => (
              <div key={tone} style={{ display: "flex", width: 34, height: 22, borderRadius: 6, backgroundColor: p[name][tone] }} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function SpringGraph({ c }: { c: ColorRoles }) {
  const w = 440;
  const h = 300;
  const spring = { dampingRatio: 0.5, stiffness: 300 };
  const y = (v: number) => h - 40 - v * (h - 110);
  const pts = Array.from({ length: 81 }, (_, i) => {
    const t = (i / 80) * 1.1;
    return `${i === 0 ? "M" : "L"} ${((i / 80) * w).toFixed(1)} ${y(springAt(spring, t)).toFixed(1)}`;
  }).join(" ");
  return (
    <div style={col({ alignItems: "center", gap: 18, padding: 30, borderRadius: 40, backgroundColor: c.surfaceContainer })}>
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
        <line x1={0} x2={w} y1={y(1)} y2={y(1)} stroke={c.outline} strokeWidth={3} strokeDasharray="10 12" />
        <line x1={0} x2={w} y1={y(0)} y2={y(0)} stroke={c.outlineVariant} strokeWidth={3} />
        <path d={pts} stroke={c.primary} strokeWidth={9} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        {[0.08, 0.16, 0.26].map((t, i) => (
          <circle key={t} cx={(t / 1.1) * w} cy={y(springAt(spring, t))} r={12 - i * 2} fill={c.primary} opacity={0.25 + i * 0.15} />
        ))}
        <circle cx={(0.36 / 1.1) * w} cy={y(springAt(spring, 0.36))} r={24} fill={c.tertiary} />
      </svg>
      <div style={row({ ...mono(20), color: c.onSurfaceVariant, gap: 18 })}>
        <span>damping 0.5</span>
        <span>stiffness 300</span>
      </div>
    </div>
  );
}

function component(name: string, { c, p }: Omit<ArtProps, "art" | "seed">) {
  switch (name) {
    case "button":
      return (
        <div style={col({ gap: 24, alignItems: "flex-start" })}>
          <Pill label="Get started" bg={c.primary} fg={c.onPrimary} />
          <Pill label="Pressed" bg={c.primary} fg={c.onPrimary} radius={24} />
          <Pill label="Learn more" bg={c.secondaryContainer} fg={c.onSecondaryContainer} />
          <Pill label="Cancel" bg="transparent" fg={c.primary} border={c.outline} />
        </div>
      );
    case "icon-button": {
      const btn = (bg: string, fg: string, shape: MaterialShapeName, opts: Style = {}) => (
        <div style={row({ justifyContent: "center", width: 120, height: 120, borderRadius: 60, backgroundColor: bg, ...opts })}>
          <Glyph name={shape} size={52} color={fg} />
        </div>
      );
      return (
        <div style={col({ gap: 26 })}>
          <div style={row({ gap: 22 })}>
            {btn(c.primary, c.onPrimary, "heart")}
            {btn(c.secondaryContainer, c.onSecondaryContainer, "sunny")}
            {btn("transparent", c.onSurfaceVariant, "clover-4", { border: `3px solid ${c.outline}` })}
          </div>
          <div style={row({ gap: 22 })}>
            {btn(c.primary, c.onPrimary, "cookie-4", { width: 200, borderRadius: 32 })}
            {btn(c.surfaceContainerHighest, c.onSurfaceVariant, "heart", { borderRadius: 32 })}
          </div>
        </div>
      );
    }
    case "fab":
      return (
        <div style={col({ gap: 28, alignItems: "center" })}>
          <div style={row({ gap: 28, alignItems: "flex-end" })}>
            <div style={row({ justifyContent: "center", width: 200, height: 200, borderRadius: 60, backgroundColor: c.primaryContainer, boxShadow: "0 12px 30px rgba(0,0,0,0.18)" })}>
              <Icon name="add" size={90} color={c.onPrimaryContainer} />
            </div>
            <div style={row({ justifyContent: "center", width: 112, height: 112, borderRadius: 32, backgroundColor: c.tertiaryContainer, boxShadow: "0 8px 20px rgba(0,0,0,0.16)" })}>
              <Icon name="add" size={52} color={c.onTertiaryContainer} />
            </div>
          </div>
          <div style={row({ gap: 14, height: 112, padding: "0 40px 0 30px", borderRadius: 32, backgroundColor: c.secondaryContainer, color: c.onSecondaryContainer, boxShadow: "0 8px 20px rgba(0,0,0,0.16)", ...display(34, 600) })}>
            <Icon name="add" size={48} color={c.onSecondaryContainer} />
            <span>Compose</span>
          </div>
        </div>
      );
    case "chip": {
      const chip = (label: string, selected: boolean) => (
        <div style={row({ gap: 10, height: 68, padding: selected ? "0 28px 0 18px" : "0 28px", borderRadius: 18, backgroundColor: selected ? c.secondaryContainer : "transparent", border: selected ? undefined : `3px solid ${c.outlineVariant}`, color: selected ? c.onSecondaryContainer : c.onSurfaceVariant, ...display(28, 600) })}>
          {selected && <Icon name="mark" size={34} color={c.onSecondaryContainer} />}
          <span>{label}</span>
        </div>
      );
      return (
        <div style={{ display: "flex", flexWrap: "wrap", width: 470, gap: 16 }}>
          {chip("Jazz", true)}
          {chip("Soul", false)}
          {chip("Lo-fi", true)}
          {chip("Focus", false)}
          {chip("Ambient", false)}
          {chip("Classical", false)}
        </div>
      );
    }
    case "card":
      return (
        <div style={col({ width: 420, borderRadius: 40, overflow: "hidden", backgroundColor: c.surfaceContainerLowest, boxShadow: "0 18px 50px rgba(0,0,0,0.16)" })}>
          <div style={row({ justifyContent: "center", height: 210, backgroundColor: c.primaryContainer })}>
            <Glyph name="flower" size={150} color={c.primary} rotate={12} />
          </div>
          <div style={col({ padding: "26px 30px 30px", gap: 8 })}>
            <span style={{ ...display(42), color: c.onSurface }}>Lisbon</span>
            <span style={{ ...body(24), color: c.onSurfaceVariant }}>May 3 – 9 · 2 travelers</span>
            <div style={row({ gap: 16, marginTop: 14 })}>
              <Pill label="Book" bg={c.primary} fg={c.onPrimary} height={64} size={26} />
              <Pill label="Details" bg="transparent" fg={c.primary} height={64} size={26} />
            </div>
          </div>
        </div>
      );
    case "dialog":
      return (
        <div style={col({ width: 440, padding: 44, borderRadius: 56, backgroundColor: c.surfaceContainerHigh, alignItems: "center", gap: 18, boxShadow: "0 24px 60px rgba(0,0,0,0.22)" })}>
          <Glyph name="sunny" size={60} color={c.secondary} />
          <span style={{ ...display(40, 600), color: c.onSurface }}>Save this mix?</span>
          <span style={{ ...body(25), color: c.onSurfaceVariant, textAlign: "center" }}>It will appear in your library on every device.</span>
          <div style={row({ alignSelf: "flex-end", gap: 34, marginTop: 14, ...display(28, 600), color: c.primary })}>
            <span>Cancel</span>
            <span>Save</span>
          </div>
        </div>
      );
    case "checkbox": {
      const box = (state: "on" | "mixed" | "off", label: string) => (
        <div style={row({ gap: 26 })}>
          <div style={row({ justifyContent: "center", width: 68, height: 68, borderRadius: 14, backgroundColor: state === "off" ? "transparent" : c.primary, border: state === "off" ? `5px solid ${c.onSurfaceVariant}` : undefined })}>
            {state === "on" && <Icon name="mark" size={54} color={c.onPrimary} />}
            {state === "mixed" && <div style={{ display: "flex", width: 34, height: 7, borderRadius: 4, backgroundColor: c.onPrimary }} />}
          </div>
          <span style={{ ...body(36), color: c.onSurface }}>{label}</span>
        </div>
      );
      return (
        <div style={col({ gap: 34 })}>
          {box("on", "Email updates")}
          {box("mixed", "All notifications")}
          {box("off", "Weekly digest")}
        </div>
      );
    }
    case "radio-group": {
      const radio = (on: boolean, label: string) => (
        <div style={row({ gap: 26 })}>
          <div style={row({ justifyContent: "center", width: 68, height: 68, borderRadius: 34, border: `5px solid ${on ? c.primary : c.onSurfaceVariant}` })}>
            {on && <div style={{ display: "flex", width: 30, height: 30, borderRadius: 15, backgroundColor: c.primary }} />}
          </div>
          <span style={{ ...body(36), color: c.onSurface }}>{label}</span>
        </div>
      );
      return (
        <div style={col({ gap: 34 })}>
          {radio(false, "Standard")}
          {radio(true, "Express")}
          {radio(false, "Pickup")}
        </div>
      );
    }
    case "slider": {
      const slider = (value: number, width: number, bubble?: string) => (
        <div style={col({ alignItems: "flex-start", gap: 14 })}>
          {bubble && (
            <div style={row({ justifyContent: "center", marginLeft: value * width - 44, width: 88, height: 60, borderRadius: 30, backgroundColor: c.inverseSurface, color: c.inverseOnSurface, ...display(30, 600) })}>{bubble}</div>
          )}
          <div style={row({ width, gap: 10 })}>
            <div style={{ display: "flex", width: value * width - 14, height: 36, borderRadius: 18, backgroundColor: c.primary }} />
            <div style={{ display: "flex", width: 9, height: 96, borderRadius: 5, backgroundColor: c.primary }} />
            <div style={{ display: "flex", flex: 1, height: 36, borderRadius: 18, backgroundColor: c.secondaryContainer }} />
          </div>
        </div>
      );
      return (
        <div style={col({ gap: 50 })}>
          {slider(0.62, 460, "72")}
          {slider(0.35, 460)}
        </div>
      );
    }
    case "switch": {
      const sw = (on: boolean, label: string) => (
        <div style={row({ width: 460, justifyContent: "space-between" })}>
          <span style={{ ...body(38), color: c.onSurface }}>{label}</span>
          <div style={row({ width: 208, height: 128, padding: on ? "0 16px 0 0" : "0 0 0 22px", borderRadius: 64, justifyContent: on ? "flex-end" : "flex-start", backgroundColor: on ? c.primary : c.surfaceContainerHighest, border: on ? undefined : `6px solid ${c.outline}` })}>
            <div style={row({ justifyContent: "center", width: on ? 96 : 64, height: on ? 96 : 64, borderRadius: 48, backgroundColor: on ? c.onPrimary : c.outline })}>
              {on && <Icon name="mark" size={52} color={c.primary} />}
            </div>
          </div>
        </div>
      );
      return (
        <div style={col({ gap: 40 })}>
          {sw(true, "Wi-Fi")}
          {sw(false, "Bluetooth")}
        </div>
      );
    }
    case "text-field":
      return (
        <div style={col({ gap: 44, width: 470 })}>
          <div style={col({ gap: 10 })}>
            <div style={row({ position: "relative", height: 112, padding: "0 28px", borderRadius: 16, border: `4px solid ${c.primary}` })}>
              <span style={{ position: "absolute", left: 20, top: -20, padding: "0 8px", backgroundColor: c.surfaceContainerLow, ...body(24), color: c.primary }}>Email</span>
              <span style={{ ...body(32), color: c.onSurface }}>ada@expressive.dev</span>
              <div style={{ display: "flex", width: 3, height: 40, marginLeft: 4, backgroundColor: c.primary }} />
            </div>
            <span style={{ ...body(22), color: c.onSurfaceVariant, paddingLeft: 28 }}>We will never share your email.</span>
          </div>
          <div style={col({ justifyContent: "center", height: 112, padding: "0 28px", borderRadius: "16px 16px 0 0", backgroundColor: c.surfaceContainerHighest, borderBottom: `4px solid ${c.onSurfaceVariant}` })}>
            <span style={{ ...body(22), color: c.onSurfaceVariant }}>Name</span>
            <span style={{ ...body(32), color: c.onSurface }}>Ada Lovelace</span>
          </div>
        </div>
      );
    case "navigation-bar": {
      const items: Array<[MaterialShapeName, string]> = [["cookie-4", "Home"], ["circle", "Search"], ["clover-4", "Library"], ["sunny", "You"]];
      return (
        <div style={row({ width: 500, height: 170, justifyContent: "space-around", borderRadius: 40, backgroundColor: c.surfaceContainer, boxShadow: "0 12px 30px rgba(0,0,0,0.1)" })}>
          {items.map(([shape, label], i) => (
            <div key={label} style={col({ alignItems: "center", gap: 10, position: "relative" })}>
              <div style={row({ justifyContent: "center", width: 108, height: 64, borderRadius: 32, backgroundColor: i === 1 ? c.secondaryContainer : "transparent" })}>
                <Glyph name={shape} size={36} color={i === 1 ? c.onSecondaryContainer : c.onSurfaceVariant} />
              </div>
              <span style={{ ...display(22, 600), color: i === 1 ? c.onSurface : c.onSurfaceVariant }}>{label}</span>
              {i === 2 && <div style={row({ justifyContent: "center", position: "absolute", left: 62, top: -6, width: 32, height: 32, borderRadius: 16, backgroundColor: c.error, color: c.onError, ...display(18, 600) })}>3</div>}
            </div>
          ))}
        </div>
      );
    }
    case "navigation-rail": {
      const items: Array<[MaterialShapeName, string]> = [["cookie-4", "Inbox"], ["circle", "Starred"], ["clover-4", "Sent"], ["sunny", "Settings"]];
      return (
        <div style={row({ gap: 30, alignItems: "stretch" })}>
          <div style={col({ width: 170, padding: "30px 0", alignItems: "center", gap: 20, borderRadius: 40, backgroundColor: c.surfaceContainer })}>
            <div style={row({ justifyContent: "center", width: 100, height: 100, borderRadius: 30, backgroundColor: c.tertiaryContainer })}>
              <Icon name="add" size={48} color={c.onTertiaryContainer} />
            </div>
            {items.slice(0, 3).map(([shape, label], i) => (
              <div key={label} style={col({ alignItems: "center", gap: 6 })}>
                <div style={row({ justifyContent: "center", width: 108, height: 60, borderRadius: 30, backgroundColor: i === 0 ? c.secondaryContainer : "transparent" })}>
                  <Glyph name={shape} size={34} color={i === 0 ? c.onSecondaryContainer : c.onSurfaceVariant} />
                </div>
                <span style={{ ...display(20, 600), color: c.onSurfaceVariant }}>{label}</span>
              </div>
            ))}
          </div>
          <div style={col({ width: 250, gap: 18, paddingTop: 20 })}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={col({ gap: 10, padding: 22, borderRadius: 24, backgroundColor: i === 0 ? c.primaryContainer : c.surfaceContainerLow })}>
                <div style={{ display: "flex", width: 150, height: 14, borderRadius: 7, backgroundColor: c.onSurface, opacity: 0.8 }} />
                <div style={{ display: "flex", width: 190, height: 10, borderRadius: 5, backgroundColor: c.onSurfaceVariant, opacity: 0.5 }} />
              </div>
            ))}
          </div>
        </div>
      );
    }
    case "top-app-bar":
      return (
        <div style={col({ gap: 30, width: 480 })}>
          <div style={row({ height: 120, padding: "0 28px", gap: 26, borderRadius: 32, backgroundColor: c.surfaceContainer })}>
            <Icon name="menu" size={46} color={c.onSurface} />
            <span style={{ ...display(40, 600), color: c.onSurface, flex: 1 }}>Trips</span>
            <div style={{ display: "flex", width: 64, height: 64, borderRadius: 32, backgroundImage: `linear-gradient(135deg, ${c.tertiary}, ${c.primary})` }} />
          </div>
          <div style={col({ height: 240, padding: "28px 28px 30px", justifyContent: "space-between", borderRadius: 32, backgroundColor: c.surfaceContainerLow, border: `3px solid ${c.outlineVariant}` })}>
            <div style={row({ justifyContent: "space-between" })}>
              <Icon name="menu" size={46} color={c.onSurface} />
              <Glyph name="heart" size={40} color={c.onSurfaceVariant} />
            </div>
            <span style={{ ...display(44), color: c.onSurface }}>Weekend in Lisbon</span>
          </div>
        </div>
      );
    case "progress": {
      const w = 470;
      const wave = Array.from({ length: 61 }, (_, i) => `${i === 0 ? "M" : "L"} ${((i / 60) * 300 + 8).toFixed(1)} ${(30 + Math.sin(i / 3.2) * 11).toFixed(1)}`).join(" ");
      const R = 90;
      const arc = (deg: number) => {
        const a = ((deg - 90) * Math.PI) / 180;
        return `${(110 + Math.cos(a) * R).toFixed(1)} ${(110 + Math.sin(a) * R).toFixed(1)}`;
      };
      return (
        <div style={col({ gap: 46, alignItems: "center" })}>
          <svg width={w} height={60} viewBox={`0 0 ${w} 60`}>
            <path d={wave} stroke={c.primary} strokeWidth={14} fill="none" strokeLinecap="round" />
            <line x1={334} x2={w - 22} y1={30} y2={30} stroke={c.secondaryContainer} strokeWidth={14} strokeLinecap="round" />
            <circle cx={w - 8} cy={30} r={7} fill={c.primary} />
          </svg>
          <svg width={220} height={220} viewBox="0 0 220 220">
            <circle cx={110} cy={110} r={R} stroke={c.secondaryContainer} strokeWidth={18} fill="none" />
            <path d={`M ${arc(0)} A ${R} ${R} 0 1 1 ${arc(250)}`} stroke={c.primary} strokeWidth={18} fill="none" strokeLinecap="round" />
          </svg>
        </div>
      );
    }
    case "snackbar":
      return (
        <div style={col({ gap: 22, width: 480 })}>
          <div style={row({ height: 112, padding: "0 30px 0 36px", justifyContent: "space-between", borderRadius: 16, backgroundColor: c.inverseSurface, boxShadow: "0 12px 30px rgba(0,0,0,0.22)" })}>
            <span style={{ ...body(30), color: c.inverseOnSurface }}>Photo deleted</span>
            <span style={{ ...display(30, 600), color: c.inversePrimary }}>Undo</span>
          </div>
          <div style={col({ padding: "26px 30px 22px 36px", gap: 12, borderRadius: 16, backgroundColor: c.inverseSurface, boxShadow: "0 12px 30px rgba(0,0,0,0.22)" })}>
            <span style={{ ...body(28), color: c.inverseOnSurface }}>Couldn't send the photo. Check your connection and try again.</span>
            <span style={{ ...display(28, 600), color: c.inversePrimary, alignSelf: "flex-end" }}>Retry</span>
          </div>
        </div>
      );
    case "tooltip":
      return (
        <div style={row({ gap: 34, alignItems: "flex-end" })}>
          <div style={col({ alignItems: "center", gap: 18 })}>
            <div style={row({ padding: "16px 24px", borderRadius: 12, backgroundColor: c.inverseSurface, color: c.inverseOnSurface, ...body(26) })}>Add to favorites</div>
            <div style={row({ justifyContent: "center", width: 112, height: 112, borderRadius: 56, backgroundColor: c.surfaceContainerHighest })}>
              <Glyph name="heart" size={50} color={c.primary} />
            </div>
          </div>
          <div style={col({ width: 250, padding: 28, gap: 12, borderRadius: 24, backgroundColor: c.surfaceContainer, boxShadow: "0 12px 30px rgba(0,0,0,0.14)" })}>
            <span style={{ ...display(28, 600), color: c.onSurface }}>Rich tooltip</span>
            <span style={{ ...body(22), color: c.onSurfaceVariant }}>Explain a feature with a title, text and an action.</span>
            <span style={{ ...display(24, 600), color: c.primary, marginTop: 6 }}>Learn more</span>
          </div>
        </div>
      );
    case "shape": {
      const arrow = <span style={{ ...display(54), color: c.outline }}>→</span>;
      const small: MaterialShapeName[] = ["sunny", "gem", "pill", "heart", "soft-burst"];
      return (
        <div style={col({ gap: 40, alignItems: "center" })}>
          <div style={row({ gap: 18 })}>
            <Glyph name="cookie-9" size={130} color={p.primary[70]} />
            {arrow}
            <Glyph name="clover-4" size={130} color={p.tertiary[60]} />
            {arrow}
            <Glyph name="flower" size={130} color={c.primary} rotate={10} />
          </div>
          <div style={row({ gap: 22 })}>
            {small.map((name, i) => (
              <Glyph key={name} name={name} size={74} color={[p.secondary[70], p.primary[80], p.tertiary[70], c.primary, p.secondary[60]][i]!} />
            ))}
          </div>
        </div>
      );
    }
    case "loading":
      return (
        <div style={col({ gap: 40, alignItems: "center" })}>
          <div style={row({ justifyContent: "center", width: 280, height: 280, borderRadius: 140, backgroundColor: c.primaryContainer })}>
            <Glyph name="cookie-9" size={210} color={c.onPrimaryContainer} rotate={22} />
          </div>
          <div style={row({ gap: 26 })}>
            {["soft-burst", "pentagon", "pill", "sunny"].map((name, i) => (
              <Glyph key={name} name={name as MaterialShapeName} size={64} color={c.primary} rotate={i * 30} />
            ))}
          </div>
        </div>
      );
    case "button-group": {
      const segment = (label: string, i: number, selected: boolean) => (
        <div
          key={label}
          style={row({
            justifyContent: "center",
            height: 96,
            padding: "0 34px",
            borderRadius: selected ? 48 : i === 0 ? "48px 12px 12px 48px" : i === 2 ? "12px 48px 48px 12px" : 12,
            backgroundColor: selected ? c.primary : c.surfaceContainer,
            color: selected ? c.onPrimary : c.onSurfaceVariant,
            ...display(32, 600),
          })}
        >
          {label}
        </div>
      );
      return (
        <div style={col({ gap: 40, alignItems: "center" })}>
          <div style={row({ gap: 4 })}>{["Day", "Week", "Month"].map((label, i) => segment(label, i, i === 1))}</div>
          <div style={row({ gap: 16 })}>
            <div style={row({ width: 96, height: 96, justifyContent: "center", borderRadius: 48, backgroundColor: c.secondaryContainer })}>
              <Glyph name="triangle" size={36} color={c.onSecondaryContainer} rotate={-90} />
            </div>
            <div style={row({ height: 96, padding: "0 64px", borderRadius: 24, backgroundColor: c.primary, color: c.onPrimary, ...display(32, 600) })}>Play</div>
            <div style={row({ width: 96, height: 96, justifyContent: "center", borderRadius: 48, backgroundColor: c.secondaryContainer })}>
              <Glyph name="triangle" size={36} color={c.onSecondaryContainer} rotate={90} />
            </div>
          </div>
        </div>
      );
    }
    case "split-button":
      return (
        <div style={col({ gap: 14, alignItems: "flex-end" })}>
          <div style={row({ gap: 4 })}>
            <div style={row({ height: 112, padding: "0 44px 0 56px", borderRadius: "56px 10px 10px 56px", backgroundColor: c.primary, color: c.onPrimary, ...display(40, 600) })}>Send</div>
            <div style={row({ justifyContent: "center", width: 112, height: 112, borderRadius: 56, backgroundColor: c.primary })}>
              <Glyph name="triangle" size={34} color={c.onPrimary} rotate={180} />
            </div>
          </div>
          <div style={col({ width: 330, padding: 10, gap: 4, borderRadius: 24, backgroundColor: c.surfaceContainer, boxShadow: "0 12px 30px rgba(0,0,0,0.14)" })}>
            {["Schedule send", "Save draft"].map((label, i) => (
              <div key={label} style={row({ height: 64, padding: "0 22px", borderRadius: i === 0 ? 18 : 10, backgroundColor: i === 0 ? c.tertiaryContainer : "transparent", color: i === 0 ? c.onTertiaryContainer : c.onSurface, ...body(28) })}>
                {label}
              </div>
            ))}
          </div>
        </div>
      );
    case "fab-menu":
      return (
        <div style={col({ gap: 12, alignItems: "flex-end" })}>
          {["Document", "Folder", "Scan"].map((label, i) => (
            <div key={label} style={row({ gap: 16, height: 84, padding: "0 36px 0 28px", borderRadius: 42, backgroundColor: c.tertiaryContainer, color: c.onTertiaryContainer, boxShadow: "0 8px 20px rgba(0,0,0,0.14)", ...display(30, 600) })}>
              <Glyph name={(["square", "cookie-4", "sunny"] as const)[i]!} size={34} color={c.onTertiaryContainer} />
              {label}
            </div>
          ))}
          <div style={row({ justifyContent: "center", width: 96, height: 96, marginTop: 8, borderRadius: 48, backgroundColor: c.tertiary, boxShadow: "0 8px 20px rgba(0,0,0,0.18)" })}>
            <svg width={40} height={40} viewBox="0 0 24 24">
              <path d="M6.4 19 5 17.6l5.6-5.6L5 6.4 6.4 5l5.6 5.6L17.6 5 19 6.4 13.4 12l5.6 5.6-1.4 1.4-5.6-5.6Z" fill={c.onTertiary} />
            </svg>
          </div>
        </div>
      );
    case "toolbar": {
      const slot = (shape: MaterialShapeName, active = false) => (
        <div key={shape} style={row({ justifyContent: "center", width: 84, height: 84, borderRadius: active ? 24 : 42, backgroundColor: active ? c.surfaceContainer : "transparent" })}>
          <Glyph name={shape} size={38} color={active ? c.onSurface : c.onPrimaryContainer} />
        </div>
      );
      return (
        <div style={col({ gap: 36, alignItems: "center" })}>
          <div style={row({ gap: 8, height: 120, padding: "0 18px", borderRadius: 60, backgroundColor: c.primaryContainer, boxShadow: "0 12px 30px rgba(0,0,0,0.16)" })}>
            {slot("circle")}
            {slot("heart", true)}
            {slot("cookie-4")}
            <div style={row({ justifyContent: "center", width: 124, height: 84, borderRadius: 42, backgroundColor: c.primary })}>
              <Glyph name="flower" size={38} color={c.onPrimary} />
            </div>
          </div>
          <div style={row({ width: 520, height: 110, justifyContent: "space-around", borderRadius: 28, backgroundColor: c.surfaceContainer })}>
            {(["pill", "gem", "sunny", "clover-4"] as const).map((shape) => (
              <Glyph key={shape} name={shape} size={38} color={c.onSurfaceVariant} />
            ))}
          </div>
        </div>
      );
    }
    case "menu":
      return (
        <div style={col({ width: 420, padding: 12, gap: 4, borderRadius: 28, backgroundColor: c.surfaceContainer, boxShadow: "0 14px 34px rgba(0,0,0,0.16)" })}>
          {["Rename", "Duplicate", "Show grid", "Move to"].map((label, i) => (
            <div key={label} style={row({ gap: 20, height: 76, padding: "0 24px", borderRadius: i === 2 ? 22 : 10, backgroundColor: i === 2 ? c.tertiaryContainer : "transparent", color: i === 2 ? c.onTertiaryContainer : c.onSurface, ...body(30) })}>
              {i === 2 ? <Icon name="mark" size={32} color={c.onTertiaryContainer} /> : <Glyph name={(["pill", "gem", "circle", "cookie-4"] as const)[i]!} size={30} color={c.onSurfaceVariant} />}
              <span style={{ display: "flex", flex: 1 }}>{label}</span>
              {i === 0 && <span style={{ ...mono(22), color: c.onSurfaceVariant }}>⌘E</span>}
            </div>
          ))}
        </div>
      );
    case "tabs": {
      const tabs: Array<[MaterialShapeName, string]> = [["sunny", "Photos"], ["cookie-4", "Albums"], ["clover-4", "Shared"]];
      return (
        <div style={col({ width: 540, borderRadius: 32, backgroundColor: c.surfaceContainerLow, paddingTop: 16 })}>
          <div style={row({ borderBottom: `2px solid ${c.outlineVariant}` })}>
            {tabs.map(([shape, label], i) => (
              <div key={label} style={col({ flex: 1, alignItems: "center", gap: 10, paddingTop: 16 })}>
                <Glyph name={shape} size={40} color={i === 0 ? c.primary : c.onSurfaceVariant} />
                <span style={{ ...display(26, 600), color: i === 0 ? c.primary : c.onSurfaceVariant }}>{label}</span>
                <div style={{ display: "flex", width: 104, height: 7, marginTop: 12, borderRadius: "7px 7px 0 0", backgroundColor: i === 0 ? c.primary : "transparent" }} />
              </div>
            ))}
          </div>
          <div style={col({ gap: 16, padding: 32 })}>
            <div style={{ display: "flex", width: 380, height: 18, borderRadius: 9, backgroundColor: c.surfaceContainerHighest }} />
            <div style={{ display: "flex", width: 260, height: 18, borderRadius: 9, backgroundColor: c.surfaceContainerHighest }} />
          </div>
        </div>
      );
    }
    case "list":
      return (
        <div style={col({ width: 480, gap: 4 })}>
          {["Inbox", "Drafts", "Archive", "Starred"].map((label, i) => (
            <div
              key={label}
              style={row({
                gap: 24,
                height: 96,
                padding: "0 32px",
                borderRadius: i === 0 ? 28 : i === 3 ? "8px 8px 28px 28px" : 8,
                backgroundColor: i === 0 ? c.secondaryContainer : c.surfaceContainer,
                color: i === 0 ? c.onSecondaryContainer : c.onSurface,
                ...body(30),
              })}
            >
              <Glyph name={(["circle", "gem", "pill", "sunny"] as const)[i]!} size={36} color={i === 0 ? c.onSecondaryContainer : c.onSurfaceVariant} />
              <span style={{ display: "flex", flex: 1 }}>{label}</span>
              {i < 2 && <span style={{ ...display(26, 600), color: c.onSurfaceVariant }}>{i === 0 ? "24" : "3"}</span>}
            </div>
          ))}
        </div>
      );
    case "badge": {
      const anchored = (shape: MaterialShapeName, count?: string) => (
        <div key={shape} style={row({ justifyContent: "center", position: "relative", width: 150, height: 150, borderRadius: 48, backgroundColor: c.surfaceContainer })}>
          <Glyph name={shape} size={70} color={c.onSurfaceVariant} />
          <div
            style={row({
              justifyContent: "center",
              position: "absolute",
              left: count ? 84 : 98,
              top: count ? 26 : 36,
              minWidth: count ? 44 : 18,
              height: count ? 44 : 18,
              padding: count ? "0 10px" : 0,
              borderRadius: 22,
              backgroundColor: c.error,
              color: c.onError,
              ...display(24, 600),
            })}
          >
            {count}
          </div>
        </div>
      );
      return <div style={row({ gap: 30 })}>{[anchored("circle"), anchored("cookie-4", "3"), anchored("sunny", "999+")]}</div>;
    }
    case "divider":
      return (
        <div style={col({ width: 480, padding: "12px 0", borderRadius: 32, backgroundColor: c.surfaceContainerLow })}>
          {["Full width", "Inset", "Middle inset", "End"].map((label, i) => (
            <div key={label} style={col({})}>
              <div style={row({ height: 92, padding: "0 36px", ...body(32), color: c.onSurface })}>{label}</div>
              {i < 3 && <div style={{ display: "flex", height: 3, marginLeft: i === 0 ? 0 : 36, marginRight: i === 2 ? 36 : 0, backgroundColor: c.outlineVariant }} />}
            </div>
          ))}
        </div>
      );
    case "bottom-sheet":
      return (
        <div style={col({ width: 520, height: 470, justifyContent: "flex-end", borderRadius: 40, overflow: "hidden", backgroundColor: c.surfaceDim })}>
          <div style={col({ alignItems: "center", gap: 26, padding: "18px 36px 40px", borderRadius: "40px 40px 0 0", backgroundColor: c.surfaceContainerLow })}>
            <div style={{ display: "flex", width: 56, height: 8, borderRadius: 4, backgroundColor: c.onSurfaceVariant, opacity: 0.4 }} />
            <span style={{ ...display(32, 600), color: c.onSurface, alignSelf: "flex-start" }}>Share to</span>
            <div style={row({ gap: 26 })}>
              {(["circle", "cookie-4", "clover-4", "sunny"] as const).map((shape) => (
                <div key={shape} style={row({ justifyContent: "center", width: 92, height: 92, borderRadius: 46, backgroundColor: c.secondaryContainer })}>
                  <Glyph name={shape} size={40} color={c.onSecondaryContainer} />
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    case "side-sheet":
      return (
        <div style={row({ width: 540, height: 470, justifyContent: "flex-end", borderRadius: 40, overflow: "hidden", backgroundColor: c.surfaceDim })}>
          <div style={col({ width: 330, height: 470, gap: 22, padding: "40px 32px", borderRadius: "32px 0 0 32px", backgroundColor: c.surfaceContainerLow })}>
            <span style={{ ...display(34, 600), color: c.onSurfaceVariant }}>Filters</span>
            {["Documents", "Photos", "Shared"].map((label, i) => (
              <div key={label} style={row({ gap: 18, ...body(28), color: c.onSurface })}>
                <div style={row({ justifyContent: "center", width: 36, height: 36, borderRadius: 6, backgroundColor: i < 2 ? c.primary : "transparent", border: i < 2 ? undefined : `4px solid ${c.onSurfaceVariant}` })}>
                  {i < 2 && <Icon name="mark" size={28} color={c.onPrimary} />}
                </div>
                {label}
              </div>
            ))}
            <div style={row({ alignSelf: "flex-start", height: 72, marginTop: 30, padding: "0 36px", borderRadius: 36, backgroundColor: c.primary, color: c.onPrimary, ...display(28, 600) })}>Apply</div>
          </div>
        </div>
      );
    case "navigation-drawer":
      return (
        <div style={col({ width: 470, gap: 6, padding: 24, borderRadius: "0 40px 40px 0", backgroundColor: c.surfaceContainerLow })}>
          <span style={{ ...display(24, 600), color: c.onSurfaceVariant, padding: "8px 28px 12px" }}>Mail</span>
          {["Inbox", "Starred", "Sent", "Drafts"].map((label, i) => (
            <div key={label} style={row({ gap: 22, height: 88, padding: "0 32px 0 28px", borderRadius: 44, backgroundColor: i === 0 ? c.secondaryContainer : "transparent", color: i === 0 ? c.onSecondaryContainer : c.onSurfaceVariant, ...display(28, 600) })}>
              <Glyph name={(["circle", "sunny", "triangle", "gem"] as const)[i]!} size={34} color={i === 0 ? c.onSecondaryContainer : c.onSurfaceVariant} />
              <span style={{ display: "flex", flex: 1 }}>{label}</span>
              {i === 0 && <span>24</span>}
            </div>
          ))}
        </div>
      );
    case "table": {
      const rows: Array<[string, string, boolean]> = [["Northwind", "$1,280", false], ["Contoso", "$940", true], ["Fabrikam", "$3,120", false], ["Tailspin", "$415", false]];
      return (
        <div style={col({ width: 520, borderRadius: 28, border: `3px solid ${c.outlineVariant}`, backgroundColor: c.surface, overflow: "hidden" })}>
          <div style={row({ height: 84, padding: "0 32px", borderBottom: `3px solid ${c.outlineVariant}`, ...display(26, 600), color: c.onSurfaceVariant })}>
            <span style={{ display: "flex", flex: 1 }}>Client</span>
            <span style={{ display: "flex", color: c.onSurface }}>Amount ↑</span>
          </div>
          {rows.map(([client, amount, selected], i) => (
            <div key={client} style={row({ height: 80, padding: "0 32px", gap: 22, borderBottom: i < rows.length - 1 ? `2px solid ${c.outlineVariant}` : undefined, backgroundColor: selected ? c.secondaryContainer : "transparent", color: selected ? c.onSecondaryContainer : c.onSurface, ...body(28) })}>
              <div style={row({ justifyContent: "center", width: 30, height: 30, borderRadius: 6, backgroundColor: selected ? c.primary : "transparent", border: selected ? undefined : `3px solid ${c.onSurfaceVariant}` })}>
                {selected && <Icon name="mark" size={24} color={c.onPrimary} />}
              </div>
              <span style={{ display: "flex", flex: 1 }}>{client}</span>
              <span style={{ display: "flex" }}>{amount}</span>
            </div>
          ))}
        </div>
      );
    }
    case "toast": {
      const toast = (title: string, text: string, bubble: string, glyph: string, shape: MaterialShapeName, i: number) => (
        <div key={title} style={row({ gap: 22, width: 470 - i * 28, padding: "24px 28px", borderRadius: 24, backgroundColor: c.surfaceContainerHigh, boxShadow: "0 12px 30px rgba(0,0,0,0.16)", opacity: 1 - i * 0.22 })}>
          <div style={row({ justifyContent: "center", width: 60, height: 60, borderRadius: 30, backgroundColor: bubble })}>
            <Glyph name={shape} size={28} color={glyph} />
          </div>
          <div style={col({ gap: 4 })}>
            <span style={{ ...display(28, 600), color: c.onSurface }}>{title}</span>
            <span style={{ ...body(22), color: c.onSurfaceVariant }}>{text}</span>
          </div>
        </div>
      );
      return (
        <div style={col({ gap: 14, alignItems: "center" })}>
          {toast("Upload failed", "Check your connection.", c.errorContainer, c.onErrorContainer, "triangle", 2)}
          {toast("New version", "Reload to update.", c.secondaryContainer, c.onSecondaryContainer, "circle", 1)}
          {toast("Changes saved", "Synced across devices.", c.primaryContainer, c.onPrimaryContainer, "cookie-4", 0)}
        </div>
      );
    }
    case "accordion":
      return (
        <div style={col({ width: 480, gap: 4 })}>
          {["Shipping", "Returns", "Warranty"].map((label, i) => (
            <div key={label} style={col({ padding: "26px 30px", gap: 14, borderRadius: i === 0 ? 28 : i === 2 ? "8px 8px 28px 28px" : 8, backgroundColor: c.surfaceContainer })}>
              <div style={row({ justifyContent: "space-between", ...display(30, 600), color: c.onSurface })}>
                <span>{label}</span>
                <div style={row({ justifyContent: "center", width: 48, height: 48, borderRadius: 24, backgroundColor: i === 0 ? c.secondaryContainer : "transparent" })}>
                  <Glyph name="triangle" size={22} color={i === 0 ? c.onSecondaryContainer : c.onSurfaceVariant} rotate={i === 0 ? 0 : 180} />
                </div>
              </div>
              {i === 0 && <span style={{ ...body(24), color: c.onSurfaceVariant }}>Orders ship within two working days.</span>}
            </div>
          ))}
        </div>
      );
    case "alert": {
      const alert = (title: string, text: string, bg: string, fg: string, shape: MaterialShapeName) => (
        <div key={title} style={row({ gap: 20, width: 500, padding: "24px 28px", borderRadius: 24, backgroundColor: bg, alignItems: "flex-start" })}>
          <Glyph name={shape} size={36} color={fg} />
          <div style={col({ gap: 6 })}>
            <span style={{ ...display(28, 600), color: fg }}>{title}</span>
            <span style={{ ...body(22), color: fg }}>{text}</span>
          </div>
        </div>
      );
      return (
        <div style={col({ gap: 14 })}>
          {alert("Sync failed", "Changes haven't been saved yet.", c.errorContainer, c.onErrorContainer, "triangle")}
          {alert("Storage almost full", "You've used 92% of 15 GB.", c.tertiaryContainer, c.onTertiaryContainer, "sunny")}
          {alert("Payment received", "Your receipt is on its way.", c.primaryContainer, c.onPrimaryContainer, "cookie-4")}
        </div>
      );
    }
    case "alert-dialog":
      return (
        <div style={col({ width: 460, padding: 36, gap: 18, borderRadius: 32, backgroundColor: c.surfaceContainerHigh, boxShadow: "0 18px 50px rgba(0,0,0,0.18)" })}>
          <span style={{ ...display(36, 600), color: c.onSurface }}>Delete 3 files?</span>
          <span style={{ ...body(24), color: c.onSurfaceVariant }}>They'll be removed from all your devices and can't be recovered.</span>
          <div style={row({ gap: 30, alignSelf: "flex-end", marginTop: 12, ...display(26, 600), color: c.primary })}>
            <span>Cancel</span>
            <span>Delete</span>
          </div>
        </div>
      );
    case "avatar": {
      const face = (letters: string, shape: MaterialShapeName, bg: string, fg: string, size: number) => (
        <div key={letters} style={{ display: "flex", position: "relative", width: size, height: size }}>
          <Glyph name={shape} size={size} color={bg} />
          <div style={row({ justifyContent: "center", position: "absolute", inset: 0, ...display(size * 0.32, 600), color: fg })}>{letters}</div>
        </div>
      );
      return (
        <div style={col({ gap: 34, alignItems: "center" })}>
          <div style={row({ gap: 22 })}>
            {face("AL", "circle", c.primaryContainer, c.onPrimaryContainer, 150)}
            {face("GH", "cookie-9", c.tertiaryContainer, c.onTertiaryContainer, 150)}
            {face("AT", "clover-4", c.secondaryContainer, c.onSecondaryContainer, 150)}
          </div>
          <div style={row({ gap: 18 })}>
            {face("KJ", "flower", c.primary, c.onPrimary, 96)}
            {face("MH", "sunny", c.secondaryContainer, c.onSecondaryContainer, 96)}
            {face("+3", "circle", c.surfaceContainerHighest, c.onSurfaceVariant, 96)}
          </div>
        </div>
      );
    }
    case "breadcrumb":
      return (
        <div style={row({ gap: 10, padding: "28px 34px", borderRadius: 30, backgroundColor: c.surfaceContainerLow, ...display(30, 600) })}>
          {["Home", "Docs", "Components", "Breadcrumb"].map((label, i) => (
            <div key={label} style={row({ gap: 10 })}>
              {i > 0 && <Glyph name="triangle" size={20} color={c.outline} rotate={90} />}
              <span style={{ color: i === 3 ? c.onSurface : c.onSurfaceVariant }}>{label}</span>
            </div>
          ))}
        </div>
      );
    case "calendar":
    case "date-picker": {
      const days = Array.from({ length: 35 }, (_, i) => i - 2);
      return (
        <div style={col({ gap: 16, width: 470, padding: 28, borderRadius: 36, backgroundColor: c.surfaceContainerHigh, boxShadow: "0 18px 50px rgba(0,0,0,0.14)" })}>
          {name === "date-picker" && (
            <div style={row({ height: 76, padding: "0 22px", borderRadius: "10px 10px 0 0", backgroundColor: c.surfaceContainerHighest, borderBottom: `4px solid ${c.primary}`, justifyContent: "space-between", ...body(26), color: c.onSurface })}>
              <span>Oct 20 – 24, 2026</span>
              <Glyph name="square" size={30} color={c.onSurfaceVariant} />
            </div>
          )}
          <span style={{ ...display(24, 600), color: c.onSurfaceVariant }}>October 2026</span>
          <div style={{ display: "flex", flexWrap: "wrap", width: 414 }}>
            {days.map((d) => {
              const inRange = d >= 20 && d <= 24;
              const end = d === 20 || d === 24;
              return (
                <div key={d} style={row({ justifyContent: "center", width: 59, height: 52, backgroundColor: inRange && !end ? c.secondaryContainer : "transparent" })}>
                  <div style={row({ justifyContent: "center", width: 44, height: 44, borderRadius: 22, backgroundColor: end ? c.primary : "transparent", border: d === 14 ? `2px solid ${c.primary}` : undefined, ...body(20), color: end ? c.onPrimary : d < 1 ? c.outline : c.onSurface })}>
                    {d < 1 ? 30 + d : d}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }
    case "carousel":
      return (
        <div style={row({ gap: 12, width: 540, height: 300 })}>
          {[p.primary[70], p.tertiary[70], p.secondary[70]].map((tone, i) => (
            <div key={i} style={row({ justifyContent: "center", width: [300, 160, 56][i], height: 300, borderRadius: 32, backgroundColor: tone })}>
              <Glyph name={(["sunny", "flower", "clover-4"] as const)[i]!} size={[140, 90, 36][i]!} color={c.surface} />
            </div>
          ))}
        </div>
      );
    case "code-block":
      return (
        <div style={col({ width: 520, borderRadius: 26, backgroundColor: c.surfaceContainerHigh, overflow: "hidden" })}>
          <div style={row({ height: 72, padding: "0 14px", gap: 8, borderBottom: `2px solid ${c.outlineVariant}` })}>
            {["save.tsx", "globals.css", "expressive.json"].map((tab, i) => (
              <div key={tab} style={row({ gap: 8, height: 46, padding: "0 16px", borderRadius: 23, backgroundColor: i === 0 ? c.secondaryContainer : "transparent", ...mono(19), color: i === 0 ? c.onSecondaryContainer : c.onSurfaceVariant })}>
                <Glyph name={(["square", "circle", "pill"] as const)[i]!} size={18} color={i === 0 ? c.onSecondaryContainer : c.onSurfaceVariant} />
                {tab}
              </div>
            ))}
          </div>
          <div style={col({ padding: "22px 26px", gap: 10, ...mono(22) })}>
            {[
              ["1", "<Button onClick={save}>", c.primary],
              ["2", "  Save changes", c.onSurface],
              ["3", "</Button>", c.primary],
            ].map(([n, text, color]) => (
              <div key={n} style={row({ gap: 22 })}>
                <span style={{ color: c.outline }}>{n}</span>
                <span style={{ color, whiteSpace: "pre" }}>{text}</span>
              </div>
            ))}
          </div>
        </div>
      );
    case "select":
      return (
        <div style={col({ width: 440, gap: 10 })}>
          <div style={col({ height: 96, padding: "14px 24px", justifyContent: "center", borderRadius: "12px 12px 0 0", backgroundColor: c.surfaceContainerHighest, borderBottom: `4px solid ${c.primary}` })}>
            <span style={{ ...body(20), color: c.primary }}>Country</span>
            <span style={{ ...body(30), color: c.onSurface }}>Portugal</span>
          </div>
          <div style={col({ padding: 10, gap: 4, borderRadius: 24, backgroundColor: c.surfaceContainer, boxShadow: "0 12px 30px rgba(0,0,0,0.14)" })}>
            {["Nepal", "Portugal", "Japan"].map((label, i) => (
              <div key={label} style={row({ height: 66, padding: "0 22px", justifyContent: "space-between", borderRadius: i === 1 ? 18 : 10, backgroundColor: i === 1 ? c.tertiaryContainer : "transparent", ...body(28), color: i === 1 ? c.onTertiaryContainer : c.onSurface })}>
                <span>{label}</span>
                {i === 1 && <Icon name="mark" size={30} color={c.onTertiaryContainer} />}
              </div>
            ))}
          </div>
        </div>
      );
    case "pagination":
      return (
        <div style={row({ gap: 8 })}>
          {["‹", "1", "…", "5", "6", "7", "…", "20", "›"].map((label, i) => (
            <div key={i} style={row({ justifyContent: "center", minWidth: 58, height: 64, padding: "0 10px", borderRadius: 32, backgroundColor: label === "6" ? c.secondaryContainer : "transparent", ...display(28, 600), color: label === "6" ? c.onSecondaryContainer : c.onSurfaceVariant })}>
              {label}
            </div>
          ))}
        </div>
      );
    case "sidebar":
      return (
        <div style={row({ width: 540, height: 400, alignItems: "stretch", borderRadius: 36, overflow: "hidden", border: `3px solid ${c.outlineVariant}`, backgroundColor: c.surface })}>
          <div style={col({ width: 220, padding: 18, gap: 6, backgroundColor: c.surfaceContainerLow })}>
            <div style={row({ gap: 12, padding: "6px 10px 16px" })}>
              <Glyph name="cookie-9" size={34} color={c.primary} />
              <span style={{ ...display(24, 600), color: c.onSurface }}>Mail</span>
            </div>
            {["Inbox", "Starred", "Sent", "Drafts"].map((label, i) => (
              <div key={label} style={row({ gap: 14, height: 56, padding: "0 18px", borderRadius: 28, backgroundColor: i === 0 ? c.secondaryContainer : "transparent", ...display(22, 600), color: i === 0 ? c.onSecondaryContainer : c.onSurfaceVariant })}>
                <Glyph name={(["circle", "sunny", "triangle", "gem"] as const)[i]!} size={24} color={i === 0 ? c.onSecondaryContainer : c.onSurfaceVariant} />
                {label}
              </div>
            ))}
          </div>
          <div style={col({ width: 84, padding: "18px 0", gap: 10, alignItems: "center", backgroundColor: c.surfaceContainer })}>
            {(["cookie-9", "circle", "sunny", "triangle", "gem"] as const).map((shape, i) => (
              <div key={shape} style={row({ justifyContent: "center", width: 56, height: i === 0 ? 50 : 40, borderRadius: 20, backgroundColor: i === 1 ? c.secondaryContainer : "transparent" })}>
                <Glyph name={shape} size={i === 0 ? 30 : 24} color={i === 0 ? c.primary : i === 1 ? c.onSecondaryContainer : c.onSurfaceVariant} />
              </div>
            ))}
          </div>
          <div style={col({ flex: 1, padding: 22, gap: 12 })}>
            {[0, 1, 2, 3].map((i) => (
              <div key={i} style={{ display: "flex", height: 52, borderRadius: 16, backgroundColor: c.surfaceContainerLow }} />
            ))}
          </div>
        </div>
      );
    default:
      return <Glyph name="flower" size={320} color={c.primary} />;
  }
}

export function Art({ art, c, p, seed }: ArtProps) {
  if (typeof art === "object") return component(art.component, { c, p });
  switch (art) {
    case "home":
      return (
        <div style={{ display: "flex", position: "relative", width: 540, height: 560 }}>
          <Shape name="flower" size={350} color={c.primary} x={100} y={110} rotate={15} />
          <Shape name="cookie-9" size={120} color={p.primary[80]} x={10} y={40} rotate={-12} />
          <Shape name="clover-4" size={104} color={p.tertiary[70]} x={400} y={60} rotate={20} />
          <Shape name="pill" size={96} color={p.secondary[80]} x={420} y={410} rotate={-30} />
          <Shape name="sunny" size={110} color={p.tertiary[80]} x={30} y={420} rotate={10} />
          <Shape name="gem" size={72} color={p.primary[60]} x={290} y={14} />
          <Shape name="heart" size={64} color={p.error[70]} x={250} y={478} rotate={-8} />
        </div>
      );
    case "intro":
      return (
        <div style={{ display: "flex", position: "relative", width: 500, height: 520 }}>
          <Shape name="cookie-12" size={300} color={c.primary} x={40} y={60} rotate={8} />
          <Shape name="flower" size={230} color={p.tertiary[70]} x={250} y={230} rotate={-14} />
          <Shape name="clover-8" size={170} color={p.secondary[70]} x={280} y={20} rotate={20} />
          <Shape name="circle" size={80} color={p.primary[80]} x={60} y={400} />
        </div>
      );
    case "install":
      return (
        <Terminal
          c={c}
          lines={[{ cmd: "npx @grenishrai/expressive init" }, { out: "Detected Next.js · Tailwind v4" }, { out: "Tokens → lib/expressive/" }, { out: "Theme written to globals.css" }, { cmd: "npx … add button dialog" }, { out: "components/expressive/button.tsx" }]}
        />
      );
    case "cli":
      return (
        <Terminal
          c={c}
          lines={[{ cmd: "expressive init" }, { out: "Tokens, motion and theme ready" }, { cmd: "expressive add slider switch" }, { out: "2 components copied" }, { cmd: 'expressive theme --seed "#0B57D0"' }, { cmd: "expressive diff button" }]}
        />
      );
    case "theming":
      return (
        <div style={col({ width: 470, padding: 32, gap: 16, borderRadius: 40, backgroundColor: c.surfaceContainerLowest, boxShadow: "0 18px 50px rgba(0,0,0,0.14)" })}>
          {(
            [
              ["--ex-color-primary", <div key="a" style={{ display: "flex", width: 40, height: 40, borderRadius: 12, backgroundColor: c.primary }} />],
              ["--ex-color-tertiary", <div key="b" style={{ display: "flex", width: 40, height: 40, borderRadius: 12, backgroundColor: c.tertiary }} />],
              ["--ex-shape-large", <div key="c" style={{ display: "flex", width: 40, height: 40, borderRadius: 16, border: `4px solid ${c.primary}` }} />],
              ["--ex-font-brand", <span key="d" style={{ ...display(34), color: c.primary }}>Aa</span>],
              ["--ex-spring-spatial", <Glyph key="e" name="sunny" size={40} color={c.secondary} />],
            ] as const
          ).map(([token, swatch]) => (
            <div key={token} style={row({ gap: 18, padding: "14px 18px", borderRadius: 18, backgroundColor: c.surfaceContainer })}>
              {swatch}
              <span style={{ ...mono(22), color: c.onSurface }}>{token}</span>
            </div>
          ))}
        </div>
      );
    case "color":
      return <ColorWheel c={c} p={p} seed={seed} />;
    case "typography":
      return (
        <div style={col({ gap: 6, alignItems: "flex-start" })}>
          <div style={row({ gap: 26, alignItems: "flex-end" })}>
            <span style={{ ...display(230), lineHeight: 1, color: c.primary, letterSpacing: "-0.05em" }}>Aa</span>
            <span style={{ ...body(130), lineHeight: 1.1, color: c.onSurfaceVariant }}>Aa</span>
          </div>
          {(
            [
              ["Display", 52],
              ["Headline", 40],
              ["Title", 32],
              ["Body", 26],
              ["Label", 20],
            ] as const
          ).map(([label, size]) => (
            <span key={label} style={{ ...(size > 30 ? display(size, 600) : body(size)), color: c.onSurface }}>
              {label}
            </span>
          ))}
        </div>
      );
    case "shape": {
      const names: MaterialShapeName[] = ["cookie-9", "flower", "clover-4", "sunny", "pill", "soft-burst", "heart", "gem", "cookie-4"];
      const colors = [c.primary, p.tertiary[60], p.secondary[70], p.primary[80], c.tertiary, p.primary[60], p.error[70], p.secondary[60], p.tertiary[70]];
      return (
        <div style={{ display: "flex", flexWrap: "wrap", width: 444, gap: 24 }}>
          {names.map((name, i) => (
            <Glyph key={name} name={name} size={132} color={colors[i]!} rotate={(i % 3) * 12} />
          ))}
        </div>
      );
    }
    case "motion":
      return <SpringGraph c={c} />;
    case "elevation":
      // Cards climb up and to the right; each label sits bottom-left, clear of the card above it.
      return (
        <div style={{ display: "flex", position: "relative", width: 470, height: 480 }}>
          {(
            [
              [1, c.surfaceContainerLow, "0 2px 6px rgba(0,0,0,0.12)"],
              [2, c.surfaceContainer, "0 6px 16px rgba(0,0,0,0.14)"],
              [3, c.surfaceContainerHigh, "0 12px 28px rgba(0,0,0,0.16)"],
              [5, c.surfaceContainerHighest, "0 22px 46px rgba(0,0,0,0.2)"],
            ] as const
          ).map(([level, bg, shadow], i) => (
            <div key={level} style={row({ position: "absolute", left: i * 64, top: 318 - i * 104, width: 280, height: 160, padding: "0 26px 22px", alignItems: "flex-end", gap: 14, borderRadius: 36, backgroundColor: bg, boxShadow: shadow })}>
              <span style={{ ...display(60), lineHeight: 1, color: c.primary }}>{String(level)}</span>
              <span style={{ ...display(24, 600), color: c.onSurfaceVariant, paddingBottom: 6 }}>Level {level}</span>
            </div>
          ))}
        </div>
      );
    case "interaction":
      return (
        <div style={col({ gap: 36, alignItems: "center" })}>
          <div style={row({ padding: 10, borderRadius: 80, border: `7px solid ${c.secondary}` })}>
            <div style={row({ position: "relative", justifyContent: "center", width: 400, height: 132, borderRadius: 66, overflow: "hidden", backgroundColor: c.primary })}>
              <div style={{ display: "flex", position: "absolute", left: 150, top: -70, width: 280, height: 280, borderRadius: 140, backgroundColor: c.onPrimary, opacity: 0.16 }} />
              <span style={{ ...display(46), color: c.onPrimary }}>Press me</span>
            </div>
          </div>
          <div style={row({ gap: 14 })}>
            {["hover 8%", "pressed 10%", "focus 3px"].map((label) => (
              <div key={label} style={row({ padding: "12px 20px", borderRadius: 99, backgroundColor: c.surfaceContainerHighest, ...mono(20), color: c.onSurfaceVariant })}>{label}</div>
            ))}
          </div>
        </div>
      );
    case "accessibility":
      return (
        <div style={col({ gap: 40, alignItems: "center" })}>
          <div style={row({ gap: 20 })}>
            {["Tab", "Enter", "Esc"].map((key) => (
              <div key={key} style={row({ justifyContent: "center", minWidth: 128, height: 112, padding: "0 26px", borderRadius: 26, backgroundColor: c.surfaceContainerHighest, borderBottom: `8px solid ${c.outlineVariant}`, ...display(36, 600), color: c.onSurface })}>{key}</div>
            ))}
          </div>
          <div style={row({ padding: 10, borderRadius: 60, border: `7px solid ${c.secondary}` })}>
            <Pill label="Focused" bg={c.primary} fg={c.onPrimary} />
          </div>
          <div style={row({ gap: 12, padding: "12px 22px", borderRadius: 99, backgroundColor: c.secondaryContainer, color: c.onSecondaryContainer, ...display(24, 600) })}>
            <Icon name="check" size={30} color={c.onSecondaryContainer} />
            <span>Reduced motion respected</span>
          </div>
        </div>
      );
    case "why": {
      const point = (label: string, shape: MaterialShapeName, bg: string, fg: string) => (
        <div key={label} style={row({ gap: 20, height: 96, padding: "0 32px 0 22px", borderRadius: 48, backgroundColor: bg, color: fg, ...display(30, 600) })}>
          <Glyph name={shape} size={48} color={fg} />
          {label}
        </div>
      );
      return (
        <div style={col({ gap: 16, alignItems: "flex-start" })}>
          {point("M3 Expressive", "flower", c.primary, c.onPrimary)}
          {point("Tailwind-native tokens", "cookie-4", c.secondaryContainer, c.onSecondaryContainer)}
          {point("Code you own", "clover-4", c.tertiaryContainer, c.onTertiaryContainer)}
          {point("Springs, not durations", "sunny", c.surfaceContainerHighest, c.onSurface)}
        </div>
      );
    }
    case "agents":
      return (
        <Terminal
          c={c}
          lines={[{ cmd: "npx skills add Grenish/expressive" }, { out: "Found 2 skills" }, { out: "expressive" }, { out: "expressive-contributor" }, { out: "Installed for Claude Code, Codex" }]}
        />
      );
  }
}
