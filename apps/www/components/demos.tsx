"use client";

import * as React from "react";
import { Button, ToggleButton } from "@/registry/components/button";
import {
  IconButton,
  ToggleIconButton,
} from "@/registry/components/icon-button";
import {
  Card,
  CardActions,
  CardContent,
  CardDescription,
  CardHeader,
  CardMedia,
  CardTitle,
} from "@/registry/components/card";
import {
  Dialog,
  DialogActions,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogIcon,
  DialogTitle,
  DialogTrigger,
} from "@/registry/components/dialog";
import { Switch } from "@/registry/components/switch";
import { Icon } from "@/components/icons";
import {
  CheckboxDemo,
  ChipDemo,
  FabDemo,
  NavigationBarDemo,
  NavigationRailDemo,
  ProgressDemo,
  RadioGroupDemo,
  SliderDemo,
  SnackbarDemo,
  TextFieldDemo,
  TooltipDemo,
  TopAppBarDemo,
  ShapeDemo,
  LoadingDemo,
} from "@/components/demos-more";
import {
  BadgeDemo,
  BottomSheetDemo,
  ButtonGroupDemo,
  DividerDemo,
  FabMenuDemo,
  ListDemo,
  MenuDemo,
  NavigationDrawerDemo,
  SideSheetDemo,
  SplitButtonDemo,
  TableDemo,
  TabsDemo,
  ToastDemo,
  ToolbarDemo,
} from "@/components/demos-expressive";
import {
  AccordionDemo,
  AlertDemo,
  AlertDialogDemo,
  AvatarDemo,
  BreadcrumbDemo,
  CalendarDemo,
  CarouselDemo,
  CodeBlockDemo,
  DatePickerDemo,
  PaginationDemo,
  SelectDemo,
  SidebarDemo,
} from "@/components/demos-essentials";

export function ButtonDemo() {
  return (
    <div className="flex flex-col items-start gap-6">
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="filled">Filled</Button>
        <Button variant="tonal">Tonal</Button>
        <Button variant="outlined">Outlined</Button>
        <Button variant="elevated">Elevated</Button>
        <Button variant="text">Text</Button>
        <Button disabled>Disabled</Button>
      </div>
      <div className="flex flex-wrap items-end gap-3">
        <Button size="xs" icon={<Icon name="add" />}>
          XS
        </Button>
        <Button size="sm" icon={<Icon name="add" />}>
          Small
        </Button>
        <Button size="md" icon={<Icon name="add" />}>
          Medium
        </Button>
        <Button size="lg" shape="square" icon={<Icon name="bolt" />}>
          Large
        </Button>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <ToggleButton defaultPressed>Selected</ToggleButton>
        <ToggleButton variant="tonal">Tonal toggle</ToggleButton>
        <ToggleButton variant="outlined" shape="square">
          Outlined toggle
        </ToggleButton>
      </div>
    </div>
  );
}

export function IconButtonDemo() {
  return (
    <div className="flex flex-col items-start gap-6">
      <div className="flex flex-wrap items-center gap-3">
        <IconButton aria-label="Edit">
          <Icon name="edit" />
        </IconButton>
        <IconButton aria-label="Edit" variant="filled">
          <Icon name="edit" />
        </IconButton>
        <IconButton aria-label="Edit" variant="tonal">
          <Icon name="edit" />
        </IconButton>
        <IconButton aria-label="Edit" variant="outlined">
          <Icon name="edit" />
        </IconButton>
        <IconButton aria-label="Edit" variant="filled" disabled>
          <Icon name="edit" />
        </IconButton>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <IconButton aria-label="Add" variant="tonal" width="narrow">
          <Icon name="add" />
        </IconButton>
        <IconButton aria-label="Add" variant="tonal">
          <Icon name="add" />
        </IconButton>
        <IconButton aria-label="Add" variant="tonal" width="wide">
          <Icon name="add" />
        </IconButton>
        <IconButton aria-label="Add" variant="filled" size="md" shape="square">
          <Icon name="add" />
        </IconButton>
        <IconButton aria-label="Add" variant="filled" size="lg">
          <Icon name="add" />
        </IconButton>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <ToggleIconButton aria-label="Favorite">
          <Icon name="favorite" />
        </ToggleIconButton>
        <ToggleIconButton aria-label="Favorite" variant="filled" defaultPressed>
          <Icon name="favorite" />
        </ToggleIconButton>
        <ToggleIconButton aria-label="Favorite" variant="tonal">
          <Icon name="favorite" />
        </ToggleIconButton>
        <ToggleIconButton aria-label="Favorite" variant="outlined">
          <Icon name="favorite" />
        </ToggleIconButton>
      </div>
    </div>
  );
}

export function CardDemo() {
  return (
    <div className="grid w-full gap-4 sm:grid-cols-3">
      {(["elevated", "filled", "outlined"] as const).map((variant) => (
        <Card key={variant} variant={variant}>
          <CardHeader>
            <CardTitle className="capitalize">{variant}</CardTitle>
            <CardDescription>
              Surface container roles create depth.
            </CardDescription>
          </CardHeader>
          <CardActions className="pt-4">
            <Button variant="text" size="sm">
              Action
            </Button>
          </CardActions>
        </Card>
      ))}
      <Card
        interactive
        shape="extra-large"
        render={<a href="#card" />}
        className="sm:col-span-3"
      >
        <CardMedia className="h-28 bg-linear-to-br from-primary-container via-tertiary-container to-secondary-container" />
        <CardHeader className="pb-4">
          <CardTitle>Interactive card</CardTitle>
          <CardDescription>
            Rendered as a link; corners morph while pressed.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}

export function DialogDemo() {
  return (
    <div className="flex flex-wrap gap-3">
      <Dialog>
        <DialogTrigger render={<Button variant="tonal" />}>
          Open dialog
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Reset settings?</DialogTitle>
          <DialogDescription>
            This will reset your app preferences back to their default settings.
          </DialogDescription>
          <DialogActions>
            <DialogClose render={<Button variant="text" />}>Cancel</DialogClose>
            <DialogClose render={<Button variant="text" />}>Accept</DialogClose>
          </DialogActions>
        </DialogContent>
      </Dialog>
      <Dialog>
        <DialogTrigger
          render={<Button variant="outlined" icon={<Icon name="delete" />} />}
        >
          With icon
        </DialogTrigger>
        <DialogContent>
          <DialogIcon>
            <Icon name="delete" />
          </DialogIcon>
          <DialogTitle>Permanently delete?</DialogTitle>
          <DialogDescription>
            Deleting the selected messages will also remove them from synced
            devices.
          </DialogDescription>
          <DialogActions>
            <DialogClose render={<Button variant="text" />}>Cancel</DialogClose>
            <DialogClose render={<Button variant="filled" />}>
              Delete
            </DialogClose>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function SwitchDemo() {
  const [wifi, setWifi] = React.useState(true);
  return (
    <div className="flex flex-col gap-4">
      <label className="flex items-center gap-4 text-body-large">
        <Switch checked={wifi} onCheckedChange={setWifi} /> Wi-Fi{" "}
        {wifi ? "on" : "off"}
      </label>
      <label className="flex items-center gap-4 text-body-large">
        <Switch icons defaultChecked /> With icons
      </label>
      <label className="flex items-center gap-4 text-body-large text-on-surface/(--ex-disabled-content)">
        <Switch disabled /> Disabled
      </label>
    </div>
  );
}

export const demos = {
  button: ButtonDemo,
  "icon-button": IconButtonDemo,
  card: CardDemo,
  dialog: DialogDemo,
  switch: SwitchDemo,
  checkbox: CheckboxDemo,
  "radio-group": RadioGroupDemo,
  slider: SliderDemo,
  "text-field": TextFieldDemo,
  fab: FabDemo,
  chip: ChipDemo,
  "navigation-bar": NavigationBarDemo,
  "navigation-rail": NavigationRailDemo,
  "top-app-bar": TopAppBarDemo,
  progress: ProgressDemo,
  snackbar: SnackbarDemo,
  tooltip: TooltipDemo,
  shape: ShapeDemo,
  loading: LoadingDemo,
  "button-group": ButtonGroupDemo,
  "split-button": SplitButtonDemo,
  "fab-menu": FabMenuDemo,
  toolbar: ToolbarDemo,
  menu: MenuDemo,
  tabs: TabsDemo,
  list: ListDemo,
  badge: BadgeDemo,
  divider: DividerDemo,
  "bottom-sheet": BottomSheetDemo,
  "side-sheet": SideSheetDemo,
  "navigation-drawer": NavigationDrawerDemo,
  table: TableDemo,
  toast: ToastDemo,
  accordion: AccordionDemo,
  alert: AlertDemo,
  "alert-dialog": AlertDialogDemo,
  avatar: AvatarDemo,
  breadcrumb: BreadcrumbDemo,
  calendar: CalendarDemo,
  "date-picker": DatePickerDemo,
  carousel: CarouselDemo,
  "code-block": CodeBlockDemo,
  select: SelectDemo,
  pagination: PaginationDemo,
  sidebar: SidebarDemo,
} as const;

export type DemoName = keyof typeof demos;

export function Demo({ name }: { name: DemoName }) {
  const Component = demos[name];
  return <Component />;
}
