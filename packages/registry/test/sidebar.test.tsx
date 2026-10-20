import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axe from "axe-core";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarProvider,
  SidebarTrigger,
} from "@/registry/components/sidebar";

async function expectNoAxeViolations(container: Element) {
  const result = await axe.run(container, { rules: { "color-contrast": { enabled: false } } });
  expect(result.violations.map((v) => `${v.id}: ${v.help}`)).toEqual([]);
}

const icon = <svg aria-hidden="true" />;

function App(props: { collapsible?: "icon" | "offcanvas" | "none"; variant?: "standard" | "floating" | "inset"; onOpenChange?: (open: boolean) => void; storageKey?: string | null }) {
  return (
    <SidebarProvider storageKey={props.storageKey ?? null} onOpenChange={props.onOpenChange}>
      <Sidebar collapsible={props.collapsible} variant={props.variant}>
        <SidebarContent>
          <SidebarGroup label="Mail">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton href="/inbox" icon={icon} badge="24" active>
                  Inbox
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton href="/sent" icon={icon}>
                  Sent
                </SidebarMenuButton>
                <SidebarMenuSub>
                  <li>
                    <SidebarMenuSubButton href="/sent/today">Today</SidebarMenuSubButton>
                  </li>
                </SidebarMenuSub>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
          <SidebarGroup label="Labels" collapsible defaultOpen={false}>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton href="/work" icon={icon}>
                  Work
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <SidebarTrigger />
        <input aria-label="Notes" />
      </SidebarInset>
    </SidebarProvider>
  );
}

const sidebar = () => document.querySelector('[data-slot="sidebar"]')!;

describe("Sidebar", () => {
  it("renders navigation with the current page marked", async () => {
    const { container } = render(<App />);
    expect(screen.getByRole("navigation", { name: "Main" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Inbox/ })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("main")).toBeInTheDocument();
    await expectNoAxeViolations(container);
  });

  it("collapses to the icon rail, keeping labels as accessible names", async () => {
    const onOpenChange = vi.fn();
    render(<App onOpenChange={onOpenChange} />);
    const trigger = screen.getByRole("button", { name: "Toggle sidebar" });
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    await userEvent.click(trigger);
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(sidebar()).toHaveAttribute("data-collapsible", "icon");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    // Labels fade but stay in the name; sub-menus and group titles fold away and go inert.
    expect(screen.getByRole("link", { name: /Inbox/ })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Today" }).closest("[inert]")).not.toBeNull();
    expect(screen.getByText("Mail").closest("[inert]")).not.toBeNull();
    // A collapsed group's items stay reachable in the rail.
    expect(screen.getByRole("link", { name: "Work" })).toBeInTheDocument();
  });

  it("marks the inset variant for the layout to style", () => {
    render(<App variant="inset" />);
    expect(sidebar()).toHaveAttribute("data-variant", "inset");
    expect(screen.getByRole("main")).toHaveAttribute("data-slot", "sidebar-inset");
  });

  it("toggles with Ctrl+B, but not while typing", async () => {
    render(<App />);
    await userEvent.keyboard("{Control>}b{/Control}");
    expect(sidebar()).toHaveAttribute("data-state", "collapsed");
    screen.getByRole("textbox", { name: "Notes" }).focus();
    await userEvent.keyboard("{Control>}b{/Control}");
    expect(sidebar()).toHaveAttribute("data-state", "collapsed");
  });

  it("makes an off-canvas sidebar inert once hidden", async () => {
    render(<App collapsible="offcanvas" />);
    await userEvent.click(screen.getByRole("button", { name: "Toggle sidebar" }));
    expect(sidebar()).toHaveAttribute("data-collapsible", "offcanvas");
    expect(sidebar()).toHaveAttribute("inert");
  });

  it("opens and closes collapsible groups", async () => {
    render(<App />);
    const labels = screen.getByRole("button", { name: "Labels" });
    expect(labels).toHaveAttribute("aria-expanded", "false");
    await userEvent.click(labels);
    expect(labels).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("link", { name: "Work" })).toBeVisible();
  });

  it("remembers the state", async () => {
    const store = new Map<string, string>([["sidebar-test", "false"]]);
    vi.stubGlobal("localStorage", {
      getItem: (key: string) => store.get(key) ?? null,
      setItem: (key: string, value: string) => void store.set(key, value),
    });
    render(<App storageKey="sidebar-test" />);
    await waitFor(() => expect(sidebar()).toHaveAttribute("data-state", "collapsed"));
    await userEvent.click(screen.getByRole("button", { name: "Toggle sidebar" }));
    expect(store.get("sidebar-test")).toBe("true");
    vi.unstubAllGlobals();
  });

  it("opens as a drawer on narrow screens", async () => {
    vi.stubGlobal("matchMedia", (query: string) => ({ matches: query.includes("max-width"), media: query, addEventListener() {}, removeEventListener() {} }));
    render(<App />);
    await userEvent.click(screen.getByRole("button", { name: "Toggle sidebar" }));
    const drawer = await screen.findByRole("dialog", { name: "Sidebar" });
    expect(drawer).toHaveTextContent("Inbox");
    // The desktop sidebar didn't collapse.
    expect(sidebar()).toHaveAttribute("data-state", "expanded");
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    vi.unstubAllGlobals();
  });
});
