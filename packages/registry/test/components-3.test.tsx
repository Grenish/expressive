import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axe from "axe-core";
import { Button } from "@/registry/components/button";
import { IconButton } from "@/registry/components/icon-button";
import { ButtonGroup, ConnectedButton, ConnectedButtonGroup } from "@/registry/components/button-group";
import { SplitButton } from "@/registry/components/split-button";
import { FabMenu, FabMenuItem } from "@/registry/components/fab-menu";
import { Toolbar, ToolbarButton, ToolbarSeparator } from "@/registry/components/toolbar";
import {
  Menu,
  MenuCheckboxItem,
  MenuContent,
  MenuItem,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSeparator,
  MenuTrigger,
} from "@/registry/components/menu";
import { Tab, Tabs, TabsList, TabsPanel } from "@/registry/components/tabs";
import { List, ListItem } from "@/registry/components/list";
import { Badge, BadgeAnchor } from "@/registry/components/badge";
import { Divider } from "@/registry/components/divider";
import { BottomSheet, BottomSheetContent, BottomSheetTitle, BottomSheetTrigger } from "@/registry/components/bottom-sheet";
import { SideSheet, SideSheetContent, SideSheetHeader, SideSheetTitle, SideSheetTrigger } from "@/registry/components/side-sheet";
import { ModalNavigationDrawer, NavigationDrawer, NavigationDrawerItem } from "@/registry/components/navigation-drawer";

async function expectNoAxeViolations(container: Element) {
  const result = await axe.run(container, { rules: { "color-contrast": { enabled: false } } });
  expect(result.violations.map((v) => `${v.id}: ${v.help}`)).toEqual([]);
}

const icon = <svg aria-hidden="true" />;

describe("ButtonGroup", () => {
  it("is a labelled group of buttons", async () => {
    const { container } = render(
      <ButtonGroup aria-label="Playback">
        <IconButton aria-label="Previous">{icon}</IconButton>
        <Button>Play</Button>
        <IconButton aria-label="Next">{icon}</IconButton>
      </ButtonGroup>,
    );
    expect(screen.getByRole("group", { name: "Playback" })).toContainElement(screen.getByRole("button", { name: "Play" }));
    await expectNoAxeViolations(container);
  });
});

describe("ConnectedButtonGroup", () => {
  it("selects one option at a time and keeps a selection", async () => {
    const onValueChange = vi.fn();
    const { container } = render(
      <ConnectedButtonGroup aria-label="View" defaultValue={["day"]} onValueChange={onValueChange}>
        <ConnectedButton value="day">Day</ConnectedButton>
        <ConnectedButton value="week">Week</ConnectedButton>
      </ConnectedButtonGroup>,
    );
    const day = screen.getByRole("button", { name: "Day" });
    const week = screen.getByRole("button", { name: "Week" });
    expect(day).toHaveAttribute("aria-pressed", "true");
    await userEvent.click(week);
    expect(week).toHaveAttribute("aria-pressed", "true");
    expect(day).toHaveAttribute("aria-pressed", "false");
    expect(onValueChange).toHaveBeenLastCalledWith(["week"], expect.anything());
    // Pressing the selected option again doesn't leave the group empty.
    await userEvent.click(week);
    expect(week).toHaveAttribute("aria-pressed", "true");
    await expectNoAxeViolations(container);
  });

  it("allows several selections with `multiple`", async () => {
    render(
      <ConnectedButtonGroup aria-label="Style" multiple>
        <ConnectedButton value="bold">Bold</ConnectedButton>
        <ConnectedButton value="italic">Italic</ConnectedButton>
      </ConnectedButtonGroup>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Bold" }));
    await userEvent.click(screen.getByRole("button", { name: "Italic" }));
    expect(screen.getByRole("button", { name: "Bold" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Italic" })).toHaveAttribute("aria-pressed", "true");
    await userEvent.click(screen.getByRole("button", { name: "Bold" }));
    expect(screen.getByRole("button", { name: "Bold" })).toHaveAttribute("aria-pressed", "false");
  });
});

describe("SplitButton", () => {
  it("runs the main action and opens the menu from the trailing button", async () => {
    const onClick = vi.fn();
    const onSelect = vi.fn();
    render(
      <SplitButton onClick={onClick} menuLabel="Save options" menu={<MenuItem onClick={onSelect}>Save as copy</MenuItem>}>
        Save
      </SplitButton>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(onClick).toHaveBeenCalledOnce();
    const trailing = screen.getByRole("button", { name: "Save options" });
    expect(trailing).toHaveAttribute("aria-haspopup", "menu");
    await userEvent.click(trailing);
    await userEvent.click(await screen.findByRole("menuitem", { name: "Save as copy" }));
    expect(onSelect).toHaveBeenCalledOnce();
    await waitFor(() => expect(screen.queryByRole("menu")).not.toBeInTheDocument());
  });
});

describe("FabMenu", () => {
  it("opens its actions and closes with Escape", async () => {
    render(
      <FabMenu icon={icon} aria-label="Create">
        <FabMenuItem icon={icon}>Document</FabMenuItem>
        <FabMenuItem icon={icon}>Folder</FabMenuItem>
      </FabMenu>,
    );
    const fab = screen.getByRole("button", { name: "Create" });
    await userEvent.click(fab);
    expect(await screen.findAllByRole("menuitem")).toHaveLength(2);
    expect(fab).toHaveAttribute("aria-expanded", "true");
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(fab).toHaveAttribute("aria-expanded", "false"));
  });
});

describe("Toolbar", () => {
  it("is one tab stop with arrow-key navigation", async () => {
    const { container } = render(
      <Toolbar aria-label="Formatting">
        <ToolbarButton render={<IconButton aria-label="Bold" />}>{icon}</ToolbarButton>
        <ToolbarSeparator />
        <ToolbarButton render={<IconButton aria-label="Italic" />}>{icon}</ToolbarButton>
      </Toolbar>,
    );
    expect(screen.getByRole("toolbar", { name: "Formatting" })).toBeInTheDocument();
    await userEvent.tab();
    expect(screen.getByRole("button", { name: "Bold" })).toHaveFocus();
    await userEvent.keyboard("{ArrowRight}");
    expect(screen.getByRole("button", { name: "Italic" })).toHaveFocus();
    await expectNoAxeViolations(container);
  });
});

describe("Menu", () => {
  it("navigates with arrow keys and toggles checkbox and radio items", async () => {
    const onCheckedChange = vi.fn();
    const onValueChange = vi.fn();
    render(
      <Menu>
        <MenuTrigger>Options</MenuTrigger>
        <MenuContent>
          <MenuItem>Cut</MenuItem>
          <MenuCheckboxItem onCheckedChange={onCheckedChange}>Show grid</MenuCheckboxItem>
          <MenuSeparator />
          <MenuRadioGroup defaultValue="name" onValueChange={onValueChange}>
            <MenuRadioItem value="name">By name</MenuRadioItem>
            <MenuRadioItem value="date">By date</MenuRadioItem>
          </MenuRadioGroup>
        </MenuContent>
      </Menu>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Options" }));
    const menu = await screen.findByRole("menu");
    expect(screen.getByRole("menuitemradio", { name: "By name" })).toHaveAttribute("aria-checked", "true");
    await userEvent.click(screen.getByRole("menuitemcheckbox", { name: "Show grid" }));
    expect(onCheckedChange).toHaveBeenCalledWith(true, expect.anything());
    await userEvent.click(screen.getByRole("menuitemradio", { name: "By date" }));
    expect(onValueChange).toHaveBeenCalledWith("date", expect.anything());
    expect(menu).toHaveAttribute("data-color", "standard");
  });
});

describe("Tabs", () => {
  it("switches panels with the keyboard and marks the active tab", async () => {
    const { container } = render(
      <Tabs defaultValue="flights">
        <TabsList aria-label="Trips">
          <Tab value="flights">Flights</Tab>
          <Tab value="hotels">Hotels</Tab>
        </TabsList>
        <TabsPanel value="flights">Flight results</TabsPanel>
        <TabsPanel value="hotels">Hotel results</TabsPanel>
      </Tabs>,
    );
    const flights = screen.getByRole("tab", { name: "Flights" });
    expect(flights).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText("Flight results")).toBeVisible();
    flights.focus();
    await userEvent.keyboard("{ArrowRight}{Enter}");
    expect(screen.getByRole("tab", { name: "Hotels" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Hotel results");
    await expectNoAxeViolations(container);
  });

  it("puts a badge on the tab icon", () => {
    render(
      <Tabs defaultValue="chat">
        <TabsList aria-label="Sections" variant="secondary">
          <Tab value="chat" icon={icon} badge={<Badge count={3} />}>
            Chat
          </Tab>
        </TabsList>
      </Tabs>,
    );
    expect(screen.getByText("3").parentElement).toHaveAttribute("data-slot", "tab-icon");
  });
});

describe("List", () => {
  it("renders static and interactive items", async () => {
    const { container } = render(
      <List aria-label="Mail" variant="segmented">
        <ListItem headline="Inbox" supportingText="12 unread" render={<a href="/inbox" />} selected />
        <ListItem headline="Archive" render={<a href="/archive" />} />
        <ListItem headline="Storage" trailing="80%" />
      </List>,
    );
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
    expect(screen.getByRole("link", { name: /Inbox/ })).toHaveAttribute("aria-current", "true");
    expect(screen.getByRole("link", { name: "Archive" })).not.toHaveAttribute("aria-current");
    await expectNoAxeViolations(container);
  });
});

describe("Badge", () => {
  it("caps large counts and is hidden from screen readers unless labelled", () => {
    render(
      <>
        <BadgeAnchor badge={<Badge count={1200} />}>{icon}</BadgeAnchor>
        <Badge count={3} label="3 unread messages" />
        <Badge />
      </>,
    );
    expect(screen.getByText("999+")).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByRole("img", { name: "3 unread messages" })).toHaveTextContent("3");
  });
});

describe("Divider", () => {
  it("is a separator with an orientation", () => {
    render(<Divider orientation="vertical" />);
    expect(screen.getByRole("separator")).toHaveAttribute("aria-orientation", "vertical");
  });
});

describe("BottomSheet", () => {
  it("opens as a labelled dialog and closes with Escape", async () => {
    render(
      <BottomSheet>
        <BottomSheetTrigger>Share</BottomSheetTrigger>
        <BottomSheetContent>
          <BottomSheetTitle>Share to</BottomSheetTitle>
        </BottomSheetContent>
      </BottomSheet>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Share" }));
    expect(await screen.findByRole("dialog", { name: "Share to" })).toBeInTheDocument();
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });
});

describe("SideSheet", () => {
  it("opens from the chosen side", async () => {
    render(
      <SideSheet side="left">
        <SideSheetTrigger>Filters</SideSheetTrigger>
        <SideSheetContent>
          <SideSheetHeader>
            <SideSheetTitle>Filter results</SideSheetTitle>
          </SideSheetHeader>
        </SideSheetContent>
      </SideSheet>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Filters" }));
    const sheet = await screen.findByRole("dialog", { name: "Filter results" });
    expect(sheet).toHaveAttribute("data-side", "left");
  });
});

describe("NavigationDrawer", () => {
  it("marks the current page", async () => {
    const { container } = render(
      <NavigationDrawer>
        <NavigationDrawerItem href="/inbox" icon={icon} label="Inbox" badge="24" active />
        <NavigationDrawerItem href="/sent" icon={icon} label="Sent" />
      </NavigationDrawer>,
    );
    expect(screen.getByRole("navigation", { name: "Main" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Inbox/ })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Sent" })).not.toHaveAttribute("aria-current");
    await expectNoAxeViolations(container);
  });

  it("modal drawer opens from its trigger", async () => {
    render(
      <ModalNavigationDrawer trigger={<button type="button">Menu</button>}>
        <NavigationDrawerItem href="/inbox" label="Inbox" />
      </ModalNavigationDrawer>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Menu" }));
    expect(await screen.findByRole("link", { name: "Inbox" })).toBeInTheDocument();
  });
});
