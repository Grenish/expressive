import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axe from "axe-core";
import { Checkbox } from "@/registry/components/checkbox";
import { Radio, RadioGroup } from "@/registry/components/radio-group";
import { Slider } from "@/registry/components/slider";
import { TextField } from "@/registry/components/text-field";
import { Fab } from "@/registry/components/fab";
import { AssistChip, FilterChip, InputChip } from "@/registry/components/chip";
import { NavigationBar, NavigationBarItem } from "@/registry/components/navigation-bar";
import { NavigationRail, NavigationRailItem } from "@/registry/components/navigation-rail";
import { TopAppBar } from "@/registry/components/top-app-bar";
import { CircularProgress, LinearProgress } from "@/registry/components/progress";
import { Tooltip } from "@/registry/components/tooltip";
import { SnackbarProvider, useSnackbar } from "@/registry/components/snackbar";

async function expectNoAxeViolations(container: Element) {
  const result = await axe.run(container, { rules: { "color-contrast": { enabled: false } } });
  expect(result.violations.map((v) => `${v.id}: ${v.help}`)).toEqual([]);
}

const icon = <svg aria-hidden="true" />;

describe("Checkbox", () => {
  it("toggles with Space and supports indeterminate", async () => {
    const { container } = render(
      <>
        <label>
          <Checkbox /> Email me
        </label>
        <label>
          <Checkbox indeterminate /> All
        </label>
      </>,
    );
    const box = screen.getByRole("checkbox", { name: "Email me" });
    box.focus();
    await userEvent.keyboard(" ");
    expect(box).toHaveAttribute("aria-checked", "true");
    expect(screen.getByRole("checkbox", { name: "All" })).toHaveAttribute("aria-checked", "mixed");
    await expectNoAxeViolations(container);
  });
});

describe("RadioGroup", () => {
  it("moves selection with arrow keys", async () => {
    const { container } = render(
      <RadioGroup aria-label="Size" defaultValue="s">
        <label>
          <Radio value="s" /> Small
        </label>
        <label>
          <Radio value="m" /> Medium
        </label>
      </RadioGroup>,
    );
    const small = screen.getByRole("radio", { name: "Small" });
    small.focus();
    await userEvent.keyboard("{ArrowDown}");
    expect(screen.getByRole("radio", { name: "Medium" })).toHaveAttribute("aria-checked", "true");
    await expectNoAxeViolations(container);
  });
});

describe("Slider", () => {
  it("renders one thumb per value and steps with arrows", async () => {
    const { container } = render(<Slider defaultValue={[20, 80]} thumbLabels={["Min", "Max"]} />);
    const [min, max] = screen.getAllByRole("slider");
    expect(min).toHaveAccessibleName("Min");
    expect(max).toHaveAccessibleName("Max");
    min!.focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(min).toHaveAttribute("aria-valuenow", "21");
    await expectNoAxeViolations(container);
  });
});

describe("TextField", () => {
  it("labels the input and announces errors", async () => {
    const { container } = render(
      <>
        <TextField label="Email" supportingText="We never share it" />
        <TextField label="Name" variant="outlined" invalid errorText="Required" />
      </>,
    );
    expect(screen.getByRole("textbox", { name: "Email" })).toHaveAccessibleDescription("We never share it");
    const name = screen.getByRole("textbox", { name: "Name" });
    expect(name).toHaveAttribute("aria-invalid", "true");
    expect(name).toHaveAccessibleDescription("Required");
    await userEvent.type(screen.getByRole("textbox", { name: "Email" }), "a@b.co");
    expect(screen.getByRole("textbox", { name: "Email" })).toHaveValue("a@b.co");
    await expectNoAxeViolations(container);
  });
});

describe("Fab", () => {
  it("is named by its label or aria-label", async () => {
    const { container } = render(
      <>
        <Fab icon={icon} aria-label="Compose" />
        <Fab icon={icon} label="New chat" size="large" />
      </>,
    );
    expect(screen.getByRole("button", { name: "Compose" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "New chat" })).toBeInTheDocument();
    await expectNoAxeViolations(container);
  });
});

describe("Chips", () => {
  it("filter chips toggle, input chips remove", async () => {
    const onRemove = vi.fn();
    const { container } = render(
      <>
        <AssistChip icon={icon}>Add to calendar</AssistChip>
        <FilterChip>Vegan</FilterChip>
        <InputChip onRemove={onRemove}>Ada</InputChip>
      </>,
    );
    const filter = screen.getByRole("button", { name: "Vegan" });
    await userEvent.click(filter);
    expect(filter).toHaveAttribute("aria-pressed", "true");
    const remove = screen.getByRole("button", { name: "Remove Ada" });
    remove.focus();
    await userEvent.keyboard("{Backspace}");
    expect(onRemove).toHaveBeenCalledTimes(1);
    await expectNoAxeViolations(container);
  });
});

describe("Navigation", () => {
  it("marks the active item as the current page", async () => {
    const { container } = render(
      <>
        <NavigationBar>
          <NavigationBarItem href="/a" icon={icon} label="Home" active badge />
          <NavigationBarItem href="/b" icon={icon} label="Inbox" badge={3} />
        </NavigationBar>
        <NavigationRail aria-label="Sections" expanded>
          <NavigationRailItem href="/c" icon={icon} label="Files" active />
        </NavigationRail>
      </>,
    );
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Inbox" })).not.toHaveAttribute("aria-current");
    expect(screen.getByRole("navigation", { name: "Sections" })).toHaveAttribute("data-expanded");
    await expectNoAxeViolations(container);
  });
});

describe("TopAppBar", () => {
  it("renders a heading and follows the scrolled prop", async () => {
    const { container } = render(<TopAppBar title="Inbox" subtitle="3 unread" variant="medium" scrolled />);
    expect(screen.getByRole("heading", { name: "Inbox" })).toBeInTheDocument();
    expect(container.querySelector("header")).toHaveAttribute("data-scrolled");
    await expectNoAxeViolations(container);
  });
});

describe("Progress", () => {
  it("exposes progressbar values, and none when indeterminate", async () => {
    const { container } = render(
      <>
        <LinearProgress aria-label="Upload" value={40} wavy />
        <CircularProgress aria-label="Loading" value={null} />
      </>,
    );
    expect(screen.getByRole("progressbar", { name: "Upload" })).toHaveAttribute("aria-valuenow", "40");
    expect(screen.getByRole("progressbar", { name: "Loading" })).not.toHaveAttribute("aria-valuenow");
    await expectNoAxeViolations(container);
  });
});

describe("Tooltip", () => {
  it("shows on keyboard focus", async () => {
    render(
      <Tooltip content="Add item">
        <button type="button" aria-label="Add">+</button>
      </Tooltip>,
    );
    await userEvent.tab();
    expect(await screen.findByText("Add item")).toBeInTheDocument();
  });
});

describe("Snackbar", () => {
  function Trigger({ onUndo }: { onUndo: () => void }) {
    const snackbar = useSnackbar();
    return (
      <button type="button" onClick={() => snackbar.show({ message: "Photo deleted", action: { label: "Undo", onClick: onUndo } })}>
        Delete
      </button>
    );
  }

  it("shows a message with a working action", async () => {
    const onUndo = vi.fn();
    render(
      <SnackbarProvider>
        <Trigger onUndo={onUndo} />
      </SnackbarProvider>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Delete" }));
    // Base UI also mirrors the message into a live region for screen readers.
    expect((await screen.findAllByText("Photo deleted")).length).toBeGreaterThan(0);
    await act(async () => {
      await userEvent.click(screen.getByRole("button", { name: "Undo" }));
    });
    expect(onUndo).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(screen.queryByRole("button", { name: "Undo" })).not.toBeInTheDocument());
  });
});
