"use client";

import * as React from "react";
import { Button } from "@/registry/components/button";
import { IconButton, ToggleIconButton } from "@/registry/components/icon-button";
import { Fab } from "@/registry/components/fab";
import { Switch } from "@/registry/components/switch";
import { Checkbox } from "@/registry/components/checkbox";
import { ButtonGroup, ConnectedButton, ConnectedButtonGroup } from "@/registry/components/button-group";
import { SplitButton } from "@/registry/components/split-button";
import { FabMenu, FabMenuItem } from "@/registry/components/fab-menu";
import { Toolbar, ToolbarButton, ToolbarSeparator } from "@/registry/components/toolbar";
import {
  Menu,
  MenuCheckboxItem,
  MenuContent,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSeparator,
  MenuSubmenu,
  MenuSubmenuTrigger,
  MenuTrigger,
} from "@/registry/components/menu";
import { Tab, Tabs, TabsList, TabsPanel } from "@/registry/components/tabs";
import { List, ListItem } from "@/registry/components/list";
import { Badge, BadgeAnchor } from "@/registry/components/badge";
import { Divider } from "@/registry/components/divider";
import {
  BottomSheet,
  BottomSheetClose,
  BottomSheetContent,
  BottomSheetDescription,
  BottomSheetTitle,
  BottomSheetTrigger,
} from "@/registry/components/bottom-sheet";
import {
  SideSheet,
  SideSheetActions,
  SideSheetBody,
  SideSheetClose,
  SideSheetContent,
  SideSheetHeader,
  SideSheetTitle,
  SideSheetTrigger,
} from "@/registry/components/side-sheet";
import {
  ModalNavigationDrawer,
  NavigationDrawer,
  NavigationDrawerHeadline,
  NavigationDrawerItem,
} from "@/registry/components/navigation-drawer";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/registry/components/table";
import { ToastProvider, useToast } from "@/registry/components/toast";
import { Icon, type IconName } from "@/components/icons";

/** Demo links stay on the page. */
const stay = (event: React.MouseEvent) => event.preventDefault();

export function ButtonGroupDemo() {
  const [view, setView] = React.useState(["week"]);
  return (
    <div className="flex flex-col items-start gap-6">
      <ButtonGroup aria-label="Playback">
        <IconButton aria-label="Back" variant="tonal">
          <Icon name="back" />
        </IconButton>
        <Button>Play</Button>
        <IconButton aria-label="Forward" variant="tonal">
          <Icon name="arrow" />
        </IconButton>
      </ButtonGroup>
      <ButtonGroup size="md" aria-label="Edit">
        <Button size="md" variant="tonal" icon={<Icon name="copy" />}>
          Copy
        </Button>
        <Button size="md" variant="outlined" icon={<Icon name="edit" />}>
          Edit
        </Button>
        <Button size="md" variant="outlined" icon={<Icon name="delete" />}>
          Delete
        </Button>
      </ButtonGroup>
      <ConnectedButtonGroup aria-label="Calendar view" value={view} onValueChange={setView}>
        <ConnectedButton value="day">Day</ConnectedButton>
        <ConnectedButton value="week">Week</ConnectedButton>
        <ConnectedButton value="month">Month</ConnectedButton>
      </ConnectedButtonGroup>
      <ConnectedButtonGroup aria-label="Text style" multiple variant="tonal" size="md" defaultValue={["bold"]}>
        <ConnectedButton value="bold" aria-label="Bold" icon={<Icon name="bold" />} />
        <ConnectedButton value="italic" aria-label="Italic" icon={<Icon name="italic" />} />
        <ConnectedButton value="underline" aria-label="Underline" icon={<Icon name="underline" />} />
      </ConnectedButtonGroup>
    </div>
  );
}

export function SplitButtonDemo() {
  const menu = (
    <>
      <MenuItem icon={<Icon name="send" />}>Send now</MenuItem>
      <MenuItem icon={<Icon name="event" />}>Schedule send</MenuItem>
      <MenuItem icon={<Icon name="document" />}>Save draft</MenuItem>
    </>
  );
  return (
    <div className="flex flex-wrap items-center gap-4">
      <SplitButton icon={<Icon name="send" />} menu={menu} menuLabel="More send options">
        Send
      </SplitButton>
      <SplitButton variant="tonal" menu={menu} menuLabel="More send options">
        Send
      </SplitButton>
      <SplitButton variant="outlined" size="md" menu={menu} menuLabel="More send options">
        Send
      </SplitButton>
      <SplitButton variant="elevated" size="xs" menu={menu} menuLabel="More send options">
        Send
      </SplitButton>
    </div>
  );
}

export function FabMenuDemo() {
  return (
    <div className="flex min-h-80 w-full items-end justify-end gap-6 rounded-shape-extra-large bg-surface-container-low p-6">
      <FabMenu icon={<Icon name="add" />} aria-label="Create" color="tertiary">
        <FabMenuItem icon={<Icon name="document" />}>Document</FabMenuItem>
        <FabMenuItem icon={<Icon name="folder" />}>Folder</FabMenuItem>
        <FabMenuItem icon={<Icon name="camera" />}>Scan</FabMenuItem>
      </FabMenu>
      <FabMenu icon={<Icon name="edit" />} aria-label="Compose" size="medium">
        <FabMenuItem icon={<Icon name="chat" />}>Message</FabMenuItem>
        <FabMenuItem icon={<Icon name="event" />}>Event</FabMenuItem>
        <FabMenuItem icon={<Icon name="link" />}>Link</FabMenuItem>
        <FabMenuItem icon={<Icon name="image" />}>Photo</FabMenuItem>
      </FabMenu>
    </div>
  );
}

export function ToolbarDemo() {
  return (
    <div className="flex w-full flex-col items-center gap-6">
      <div className="flex items-center gap-3">
        <Toolbar aria-label="Formatting">
          <ToolbarButton render={<IconButton aria-label="Undo" />}>
            <Icon name="undo" />
          </ToolbarButton>
          <ToolbarButton render={<IconButton aria-label="Redo" />}>
            <Icon name="redo" />
          </ToolbarButton>
          <ToolbarSeparator />
          <ToolbarButton render={<ToggleIconButton aria-label="Bold" defaultPressed />}>
            <Icon name="bold" />
          </ToolbarButton>
          <ToolbarButton render={<ToggleIconButton aria-label="Italic" />}>
            <Icon name="italic" />
          </ToolbarButton>
          <ToolbarButton render={<ToggleIconButton aria-label="Underline" />}>
            <Icon name="underline" />
          </ToolbarButton>
        </Toolbar>
        <Fab aria-label="Add" icon={<Icon name="add" />} color="secondary-container" />
      </div>
      <Toolbar aria-label="Photo" color="vibrant">
        <ToolbarButton render={<IconButton aria-label="Share" />}>
          <Icon name="share" />
        </ToolbarButton>
        <ToolbarButton render={<ToggleIconButton aria-label="Favorite" />}>
          <Icon name="favorite" />
        </ToolbarButton>
        <ToolbarButton render={<IconButton aria-label="Edit" variant="filled" width="wide" />}>
          <Icon name="edit" />
        </ToolbarButton>
        <ToolbarButton render={<IconButton aria-label="Archive" />}>
          <Icon name="archive" />
        </ToolbarButton>
        <ToolbarButton render={<IconButton aria-label="Delete" />}>
          <Icon name="delete" />
        </ToolbarButton>
      </Toolbar>
      <div className="w-full max-w-md overflow-hidden rounded-shape-large">
        <Toolbar variant="docked" aria-label="Message">
          <ToolbarButton render={<IconButton aria-label="Attach link" />}>
            <Icon name="link" />
          </ToolbarButton>
          <ToolbarButton render={<IconButton aria-label="Insert photo" />}>
            <Icon name="image" />
          </ToolbarButton>
          <ToolbarButton render={<IconButton aria-label="Schedule" />}>
            <Icon name="event" />
          </ToolbarButton>
          <ToolbarButton render={<IconButton aria-label="Send" variant="filled" />}>
            <Icon name="send" />
          </ToolbarButton>
        </Toolbar>
      </div>
    </div>
  );
}

export function MenuDemo() {
  const [sort, setSort] = React.useState("date");
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Menu>
        <MenuTrigger render={<Button variant="tonal" icon={<Icon name="more" />} />}>Options</MenuTrigger>
        <MenuContent>
          <MenuItem icon={<Icon name="edit" />} trailing="⌘E">
            Rename
          </MenuItem>
          <MenuItem icon={<Icon name="copy" />} trailing="⌘D">
            Duplicate
          </MenuItem>
          <MenuItem icon={<Icon name="share" />}>Share</MenuItem>
          <MenuSubmenu>
            <MenuSubmenuTrigger icon={<Icon name="folder" />}>Move to</MenuSubmenuTrigger>
            <MenuContent>
              <MenuItem>Projects</MenuItem>
              <MenuItem>Archive</MenuItem>
              <MenuItem>Shared with me</MenuItem>
            </MenuContent>
          </MenuSubmenu>
          <MenuSeparator />
          <MenuItem icon={<Icon name="delete" />}>Delete</MenuItem>
        </MenuContent>
      </Menu>
      <Menu>
        <MenuTrigger render={<Button variant="outlined" icon={<Icon name="filter" />} />}>View</MenuTrigger>
        <MenuContent color="vibrant">
          <MenuGroup>
            <MenuGroupLabel>Sort by</MenuGroupLabel>
            <MenuRadioGroup value={sort} onValueChange={setSort}>
              <MenuRadioItem value="name">Name</MenuRadioItem>
              <MenuRadioItem value="date">Date modified</MenuRadioItem>
              <MenuRadioItem value="size">Size</MenuRadioItem>
            </MenuRadioGroup>
          </MenuGroup>
          <MenuSeparator />
          <MenuCheckboxItem defaultChecked>Show hidden files</MenuCheckboxItem>
          <MenuCheckboxItem>Compact rows</MenuCheckboxItem>
        </MenuContent>
      </Menu>
    </div>
  );
}

export function TabsDemo() {
  return (
    <div className="flex w-full max-w-xl flex-col gap-8">
      <Tabs defaultValue="photos">
        <TabsList aria-label="Library">
          <Tab value="photos" icon={<Icon name="image" />}>
            Photos
          </Tab>
          <Tab value="albums" icon={<Icon name="folder" />}>
            Albums
          </Tab>
          <Tab value="shared" icon={<Icon name="share" />} badge={<Badge count={3} />}>
            Shared
          </Tab>
        </TabsList>
        <TabsPanel value="photos" className="p-4 text-body-medium text-on-surface-variant">
          2,417 photos, newest first.
        </TabsPanel>
        <TabsPanel value="albums" className="p-4 text-body-medium text-on-surface-variant">
          12 albums.
        </TabsPanel>
        <TabsPanel value="shared" className="p-4 text-body-medium text-on-surface-variant">
          3 new shared albums.
        </TabsPanel>
      </Tabs>
      <Tabs defaultValue="overview">
        <TabsList aria-label="Flight" variant="secondary">
          <Tab value="overview">Overview</Tab>
          <Tab value="specs">Specifications</Tab>
          <Tab value="reviews">Reviews</Tab>
        </TabsList>
      </Tabs>
      <Tabs defaultValue="all">
        <TabsList aria-label="Topics" scrollable>
          {["All", "Design", "Engineering", "Research", "Motion", "Accessibility", "Typography"].map((topic) => (
            <Tab key={topic} value={topic.toLowerCase()}>
              {topic}
            </Tab>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
}

export function ListDemo() {
  const [selected, setSelected] = React.useState("inbox");
  return (
    <div className="grid w-full gap-6 md:grid-cols-2">
      <List aria-label="Settings" className="rounded-shape-large bg-surface-container-low">
        <ListItem headline="Wi-Fi" supportingText="Home network" leading={<Icon name="settings" />} trailing={<Switch defaultChecked aria-label="Wi-Fi" />} />
        <ListItem headline="Notifications" supportingText="Badges, sounds and banners" leading={<Icon name="notifications" />} trailing={<Checkbox defaultChecked aria-label="Notifications" />} />
        <ListItem
          overline="Storage"
          headline="Photos and videos"
          supportingText="12.4 GB of 15 GB used. Free up space by backing up and removing local copies."
          leading={<Icon name="image" />}
          trailing="83%"
        />
      </List>
      <List aria-label="Mailboxes" variant="segmented">
        {(
          [
            { id: "inbox", label: "Inbox", icon: "inbox", count: "24" },
            { id: "drafts", label: "Drafts", icon: "document", count: "3" },
            { id: "archive", label: "Archive", icon: "archive" },
            { id: "starred", label: "Starred", icon: "star" },
          ] satisfies Array<{ id: string; label: string; icon: IconName; count?: string }>
        ).map((box) => (
          <ListItem
            key={box.id}
            headline={box.label}
            leading={<Icon name={box.icon} />}
            trailing={"count" in box ? box.count : undefined}
            selected={selected === box.id}
            render={<button type="button" onClick={() => setSelected(box.id)} />}
          />
        ))}
      </List>
    </div>
  );
}

export function BadgeDemo() {
  return (
    <div className="flex flex-wrap items-center gap-10 text-on-surface-variant">
      <BadgeAnchor badge={<Badge />}>
        <Icon name="notifications" className="size-6" />
      </BadgeAnchor>
      <BadgeAnchor badge={<Badge count={3} />}>
        <Icon name="chat" className="size-6" />
      </BadgeAnchor>
      <BadgeAnchor badge={<Badge count={1500} />}>
        <Icon name="inbox" className="size-6" />
      </BadgeAnchor>
      <IconButton aria-label="Notifications, 8 new" variant="tonal">
        <BadgeAnchor badge={<Badge count={8} />}>
          <Icon name="notifications" />
        </BadgeAnchor>
      </IconButton>
      <span className="inline-flex items-center gap-2 text-label-large text-on-surface">
        Updates <Badge count={12} label="12 updates" />
      </span>
    </div>
  );
}

export function DividerDemo() {
  return (
    <div className="flex w-full max-w-md flex-col gap-6">
      <div className="rounded-shape-large bg-surface-container-low py-2 text-body-large text-on-surface">
        <p className="px-4 py-3">Full width</p>
        <Divider />
        <p className="px-4 py-3">Inset start</p>
        <Divider inset="start" />
        <p className="px-4 py-3">Middle inset</p>
        <Divider inset="middle" />
        <p className="px-4 py-3">End of list</p>
      </div>
      <div className="flex h-10 items-center gap-4 text-label-large text-on-surface-variant">
        <span>Edit</span>
        <Divider orientation="vertical" />
        <span>View</span>
        <Divider orientation="vertical" inset="middle" />
        <span>Help</span>
      </div>
    </div>
  );
}

export function BottomSheetDemo() {
  const targets: Array<{ label: string; icon: "send" | "link" | "copy" | "chat" }> = [
    { label: "Send", icon: "send" },
    { label: "Copy link", icon: "link" },
    { label: "Duplicate", icon: "copy" },
    { label: "Message", icon: "chat" },
  ];
  return (
    <div className="flex flex-wrap gap-3">
      <BottomSheet>
        <BottomSheetTrigger render={<Button variant="tonal" icon={<Icon name="share" />} />}>Share</BottomSheetTrigger>
        <BottomSheetContent>
          <BottomSheetTitle>Share “Spring motion”</BottomSheetTitle>
          <div className="grid grid-cols-4 gap-2">
            {targets.map((target) => (
              <BottomSheetClose
                key={target.label}
                className="state-layer focus-ring flex cursor-pointer flex-col items-center gap-2 rounded-shape-large py-3 text-label-medium text-on-surface-variant"
              >
                <span className="flex size-14 items-center justify-center rounded-shape-full bg-secondary-container text-on-secondary-container [&_svg]:size-6">
                  <Icon name={target.icon} />
                </span>
                {target.label}
              </BottomSheetClose>
            ))}
          </div>
        </BottomSheetContent>
      </BottomSheet>
      <BottomSheet snapPoints={["16rem", 1]}>
        <BottomSheetTrigger render={<Button variant="outlined" />}>With snap points</BottomSheetTrigger>
        <BottomSheetContent>
          <BottomSheetTitle>Nearby</BottomSheetTitle>
          <BottomSheetDescription>Drag the handle up to see every result, or down to close.</BottomSheetDescription>
          <List aria-label="Places" className="-mx-6">
            {["Bakery", "Book shop", "Coffee roasters", "Florist", "Hardware store", "Library", "Park", "Pharmacy", "Post office", "Record store"].map((place, i) => (
              <ListItem key={place} headline={place} supportingText={`${(i + 2) * 120} m away`} leading={<Icon name="star" />} />
            ))}
          </List>
        </BottomSheetContent>
      </BottomSheet>
    </div>
  );
}

export function SideSheetDemo() {
  return (
    <div className="flex flex-wrap gap-3">
      {(["right", "left"] as const).map((side) => (
        <SideSheet key={side} side={side}>
          <SideSheetTrigger render={<Button variant={side === "right" ? "tonal" : "outlined"} icon={<Icon name="filter" />} />}>
            {side === "right" ? "Filters" : "Filters (left)"}
          </SideSheetTrigger>
          <SideSheetContent>
            <SideSheetHeader
              action={
                <SideSheetClose render={<IconButton aria-label="Close" />}>
                  <Icon name="close" />
                </SideSheetClose>
              }
            >
              <SideSheetTitle>Filters</SideSheetTitle>
            </SideSheetHeader>
            <SideSheetBody className="flex flex-col gap-1">
              <p className="pt-2 pb-1 text-title-small text-on-surface-variant">File type</p>
              {["Documents", "Spreadsheets", "Presentations", "Photos"].map((type, i) => (
                <label key={type} className="flex h-12 cursor-pointer items-center gap-4 text-body-large text-on-surface">
                  <Checkbox defaultChecked={i < 2} /> {type}
                </label>
              ))}
              <p className="pt-4 pb-1 text-title-small text-on-surface-variant">Shared</p>
              <label className="flex h-12 cursor-pointer items-center justify-between text-body-large text-on-surface">
                Only shared with me <Switch />
              </label>
            </SideSheetBody>
            <SideSheetActions>
              <SideSheetClose render={<Button />}>Apply</SideSheetClose>
              <SideSheetClose render={<Button variant="outlined" />}>Cancel</SideSheetClose>
            </SideSheetActions>
          </SideSheetContent>
        </SideSheet>
      ))}
    </div>
  );
}

const destinations = [
  { id: "inbox", label: "Inbox", icon: "inbox", badge: "24" },
  { id: "starred", label: "Starred", icon: "star" },
  { id: "sent", label: "Sent", icon: "send" },
  { id: "drafts", label: "Drafts", icon: "document", badge: "3" },
] as const;

function DrawerItems({ current, onNavigate }: { current: string; onNavigate: (id: string) => void }) {
  return (
    <>
      <NavigationDrawerHeadline>Mail</NavigationDrawerHeadline>
      {destinations.map((item) => (
        <NavigationDrawerItem
          key={item.id}
          href={`#${item.id}`}
          icon={<Icon name={item.icon} />}
          label={item.label}
          badge={"badge" in item ? item.badge : undefined}
          active={current === item.id}
          onClick={(event) => {
            stay(event);
            onNavigate(item.id);
          }}
        />
      ))}
      <Divider className="mx-4 my-2" />
      <NavigationDrawerHeadline>Labels</NavigationDrawerHeadline>
      {["Family", "Work", "Travel"].map((label) => (
        <NavigationDrawerItem
          key={label}
          href={`#${label.toLowerCase()}`}
          icon={<Icon name="folder" />}
          label={label}
          active={current === label}
          onClick={(event) => {
            stay(event);
            onNavigate(label);
          }}
        />
      ))}
    </>
  );
}

export function NavigationDrawerDemo() {
  const [current, setCurrent] = React.useState("inbox");
  const [open, setOpen] = React.useState(false);
  return (
    <div className="flex w-full flex-col gap-4">
      <ModalNavigationDrawer
        open={open}
        onOpenChange={setOpen}
        trigger={
          <Button variant="tonal" icon={<Icon name="menu" />} className="self-start">
            Open modal drawer
          </Button>
        }
      >
        <DrawerItems
          current={current}
          onNavigate={(id) => {
            setCurrent(id);
            setOpen(false);
          }}
        />
      </ModalNavigationDrawer>
      <div className="h-120 max-w-full overflow-hidden rounded-shape-extra-large bg-surface-container-low">
        <NavigationDrawer aria-label="Mail">
          <DrawerItems current={current} onNavigate={setCurrent} />
        </NavigationDrawer>
      </div>
    </div>
  );
}

const invoices = [
  { id: "INV-1042", client: "Northwind", status: "Paid", date: "2026-10-02", amount: 1280 },
  { id: "INV-1043", client: "Contoso", status: "Overdue", date: "2026-09-18", amount: 940.5 },
  { id: "INV-1044", client: "Fabrikam", status: "Pending", date: "2026-10-11", amount: 3120 },
  { id: "INV-1045", client: "Tailspin", status: "Paid", date: "2026-10-14", amount: 415.75 },
  { id: "INV-1046", client: "Woodgrove", status: "Pending", date: "2026-10-19", amount: 2050 },
];
type InvoiceKey = "client" | "date" | "amount";
const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

export function TableDemo() {
  const [sortKey, setSortKey] = React.useState<InvoiceKey>("date");
  const [direction, setDirection] = React.useState<"ascending" | "descending">("descending");
  const [selected, setSelected] = React.useState<Set<string>>(new Set(["INV-1043"]));
  const rows = [...invoices].sort((a, b) => {
    const order = a[sortKey] < b[sortKey] ? -1 : a[sortKey] > b[sortKey] ? 1 : 0;
    return direction === "ascending" ? order : -order;
  });
  const sortBy = (key: InvoiceKey) => () => {
    setDirection(key === sortKey && direction === "ascending" ? "descending" : "ascending");
    setSortKey(key);
  };
  const sortOf = (key: InvoiceKey) => (key === sortKey ? direction : "none");
  const toggle = (id: string) =>
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  const all = selected.size === invoices.length;
  return (
    <div className="flex w-full flex-col gap-8">
      <Table aria-label="Invoices">
        <TableHeader>
          <TableRow>
            <TableHead>
              <Checkbox
                aria-label="Select all invoices"
                checked={all}
                indeterminate={selected.size > 0 && !all}
                onCheckedChange={() => setSelected(all ? new Set() : new Set(invoices.map((row) => row.id)))}
              />
            </TableHead>
            <TableHead>Invoice</TableHead>
            <TableHead sort={sortOf("client")} onSort={sortBy("client")}>
              Client
            </TableHead>
            <TableHead>Status</TableHead>
            <TableHead sort={sortOf("date")} onSort={sortBy("date")}>
              Issued
            </TableHead>
            <TableHead numeric sort={sortOf("amount")} onSort={sortBy("amount")}>
              Amount
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id} selected={selected.has(row.id)}>
              <TableCell>
                <Checkbox aria-label={`Select ${row.id}`} checked={selected.has(row.id)} onCheckedChange={() => toggle(row.id)} />
              </TableCell>
              <TableCell className="font-mono text-body-small">{row.id}</TableCell>
              <TableCell>{row.client}</TableCell>
              <TableCell>
                <span
                  className={
                    row.status === "Overdue"
                      ? "rounded-shape-small bg-error-container px-2 py-1 text-label-medium text-on-error-container"
                      : row.status === "Paid"
                        ? "rounded-shape-small bg-primary-container px-2 py-1 text-label-medium text-on-primary-container"
                        : "rounded-shape-small bg-surface-container-highest px-2 py-1 text-label-medium text-on-surface-variant"
                  }
                >
                  {row.status}
                </span>
              </TableCell>
              <TableCell>{row.date}</TableCell>
              <TableCell numeric>{money.format(row.amount)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Table variant="filled" density="compact" stickyHeader aria-label="Weather" containerProps={{ className: "max-h-56" }}>
        <TableHeader>
          <TableRow>
            <TableHead>City</TableHead>
            <TableHead>Conditions</TableHead>
            <TableHead numeric>High °C</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[
            ["Kathmandu", "Sunny", 24],
            ["Lisbon", "Clear", 22],
            ["Oslo", "Rain", 9],
            ["Nairobi", "Cloudy", 25],
            ["Lima", "Overcast", 19],
            ["Seoul", "Clear", 18],
            ["Toronto", "Windy", 12],
            ["Cairo", "Sunny", 30],
            ["Reykjavík", "Snow", 2],
            ["Sydney", "Showers", 21],
          ].map(([city, conditions, high]) => (
            <TableRow key={city}>
              <TableCell>{city}</TableCell>
              <TableCell>{conditions}</TableCell>
              <TableCell numeric>{high}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function ToastButtons() {
  const toast = useToast();
  return (
    <div className="flex flex-wrap gap-3">
      <Button variant="tonal" onClick={() => toast.success("Changes saved", { description: "Your document is synced across devices." })}>
        Success
      </Button>
      <Button variant="tonal" onClick={() => toast.info("New version available", { description: "Reload to get the latest components." })}>
        Info
      </Button>
      <Button variant="tonal" onClick={() => toast.warning("Storage almost full", { description: "You've used 92% of your 15 GB." })}>
        Warning
      </Button>
      <Button
        variant="tonal"
        onClick={() =>
          toast.error("Couldn't send message", {
            description: "Check your connection and try again.",
            action: { label: "Retry", onClick: () => toast.success("Message sent") },
          })
        }
      >
        Error with action
      </Button>
      <Button
        variant="outlined"
        onClick={() =>
          toast.promise(new Promise<string>((resolve) => setTimeout(() => resolve("photo.jpg"), 2000)), {
            loading: "Uploading…",
            success: (name) => `Uploaded ${name}`,
            error: "Upload failed",
          })
        }
      >
        Promise
      </Button>
      <Button variant="text" onClick={() => toast.show({ title: "Plain toast", description: "No icon, just a title and a description." })}>
        Plain
      </Button>
    </div>
  );
}

export function ToastDemo() {
  return (
    <ToastProvider>
      <ToastButtons />
    </ToastProvider>
  );
}
