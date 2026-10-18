/*
 * The site's icons: Phosphor (MIT). They come from Phosphor's server-safe
 * entry, so the same component renders in server and client components.
 * Bold is the default: at 16–24px it sits closest to Material's 2px strokes.
 * Glyphs that read as solid shapes (heart, star, bolt) use the fill weight.
 */
import type { IconWeight } from "@phosphor-icons/react";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CalendarBlankIcon,
  CheckIcon,
  CopyIcon,
  DotsThreeVerticalIcon,
  FolderIcon,
  GithubLogoIcon,
  HeartIcon,
  HouseIcon,
  InfoIcon,
  LightningIcon,
  ListIcon,
  MagnifyingGlassIcon,
  MoonIcon,
  PaletteIcon,
  PencilSimpleIcon,
  PlusIcon,
  StarIcon,
  SunIcon,
  TerminalWindowIcon,
  TrashIcon,
  TrayIcon,
  UserIcon,
} from "@phosphor-icons/react/ssr";

const icons = {
  add: PlusIcon,
  favorite: HeartIcon,
  edit: PencilSimpleIcon,
  delete: TrashIcon,
  bolt: LightningIcon,
  palette: PaletteIcon,
  copy: CopyIcon,
  check: CheckIcon,
  menu: ListIcon,
  moon: MoonIcon,
  sun: SunIcon,
  github: GithubLogoIcon,
  arrow: ArrowRightIcon,
  terminal: TerminalWindowIcon,
  home: HouseIcon,
  inbox: TrayIcon,
  search: MagnifyingGlassIcon,
  star: StarIcon,
  more: DotsThreeVerticalIcon,
  back: ArrowLeftIcon,
  event: CalendarBlankIcon,
  person: UserIcon,
  folder: FolderIcon,
  info: InfoIcon,
};

const solid = new Set<IconName>(["favorite", "star", "bolt"]);

export type IconName = keyof typeof icons;

export function Icon({ name, className, weight }: { name: IconName; className?: string; weight?: IconWeight }) {
  const Glyph = icons[name];
  return <Glyph aria-hidden="true" className={className} weight={weight ?? (solid.has(name) ? "fill" : "bold")} />;
}
