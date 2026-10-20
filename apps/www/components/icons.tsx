/*
 * The site's icons: Phosphor (MIT). They come from Phosphor's server-safe
 * entry, so the same component renders in server and client components.
 * Bold is the default: at 16–24px it sits closest to Material's 2px strokes.
 * Glyphs that read as solid shapes (heart, star, bolt) use the fill weight.
 */
import type { IconWeight } from "@phosphor-icons/react";
import {
  ArchiveIcon,
  ArrowClockwiseIcon,
  ArrowCounterClockwiseIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  BellIcon,
  CalendarBlankIcon,
  CameraIcon,
  ChatCircleIcon,
  CheckIcon,
  CopyIcon,
  DotsThreeVerticalIcon,
  FileTextIcon,
  FolderIcon,
  FunnelIcon,
  GearSixIcon,
  GithubLogoIcon,
  HeartIcon,
  HouseIcon,
  ImageIcon,
  InfoIcon,
  LightningIcon,
  LinkIcon,
  ListIcon,
  MagnifyingGlassIcon,
  MoonIcon,
  PaletteIcon,
  PaperPlaneTiltIcon,
  PencilSimpleIcon,
  PlusIcon,
  ShareNetworkIcon,
  StarIcon,
  SunIcon,
  TerminalWindowIcon,
  TextBIcon,
  TextItalicIcon,
  TextUnderlineIcon,
  TrashIcon,
  TrayIcon,
  UserIcon,
  XIcon,
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
  undo: ArrowCounterClockwiseIcon,
  redo: ArrowClockwiseIcon,
  bold: TextBIcon,
  italic: TextItalicIcon,
  underline: TextUnderlineIcon,
  share: ShareNetworkIcon,
  send: PaperPlaneTiltIcon,
  archive: ArchiveIcon,
  settings: GearSixIcon,
  close: XIcon,
  image: ImageIcon,
  link: LinkIcon,
  document: FileTextIcon,
  chat: ChatCircleIcon,
  notifications: BellIcon,
  camera: CameraIcon,
  filter: FunnelIcon,
};

const solid = new Set<IconName>(["favorite", "star", "bolt"]);

export type IconName = keyof typeof icons;

export function Icon({ name, className, weight }: { name: IconName; className?: string; weight?: IconWeight }) {
  const Glyph = icons[name];
  return <Glyph aria-hidden="true" className={className} weight={weight ?? (solid.has(name) ? "fill" : "bold")} />;
}
