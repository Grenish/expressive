import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axe from "axe-core";
import { Button, ToggleButton } from "@/registry/components/button";
import { IconButton } from "@/registry/components/icon-button";
import { Card, CardContent, CardTitle } from "@/registry/components/card";
import {
  Dialog,
  DialogActions,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/registry/components/dialog";
import { Switch } from "@/registry/components/switch";

async function expectNoAxeViolations(container: Element) {
  const result = await axe.run(container, { rules: { "color-contrast": { enabled: false } } });
  expect(result.violations.map((v) => `${v.id}: ${v.help}`)).toEqual([]);
}

describe("Button", () => {
  it("activates with keyboard and has no a11y violations", async () => {
    const onClick = vi.fn();
    const { container } = render(<Button onClick={onClick}>Save</Button>);
    const button = screen.getByRole("button", { name: "Save" });
    button.focus();
    await userEvent.keyboard("{Enter}");
    await userEvent.keyboard(" ");
    expect(onClick).toHaveBeenCalledTimes(2);
    await expectNoAxeViolations(container);
  });

  it("forwards motion to data-motion", () => {
    render(<Button motion="standard">Go</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("data-motion", "standard");
  });

  it("toggle exposes aria-pressed", async () => {
    render(<ToggleButton>Bold</ToggleButton>);
    const button = screen.getByRole("button", { name: "Bold" });
    expect(button).toHaveAttribute("aria-pressed", "false");
    await userEvent.click(button);
    expect(button).toHaveAttribute("aria-pressed", "true");
  });

  it("disabled buttons do not fire", async () => {
    const onClick = vi.fn();
    render(<Button disabled onClick={onClick}>Nope</Button>);
    await userEvent.click(screen.getByRole("button"));
    expect(onClick).not.toHaveBeenCalled();
  });
});

describe("IconButton", () => {
  it("is named by aria-label", async () => {
    const { container } = render(
      <IconButton aria-label="Favorite">
        <svg aria-hidden="true" />
      </IconButton>,
    );
    expect(screen.getByRole("button", { name: "Favorite" })).toBeInTheDocument();
    await expectNoAxeViolations(container);
  });
});

describe("Card", () => {
  it("renders as a link when interactive", async () => {
    const { container } = render(
      <Card interactive render={<a href="/post" />}>
        <CardTitle>Post</CardTitle>
        <CardContent>Body</CardContent>
      </Card>,
    );
    expect(screen.getByRole("link")).toHaveAttribute("href", "/post");
    await expectNoAxeViolations(container);
  });
});

describe("Switch", () => {
  it("toggles with keyboard and exposes role=switch", async () => {
    const { container } = render(
      <label>
        <Switch /> Wi-Fi
      </label>,
    );
    const toggle = screen.getByRole("switch", { name: "Wi-Fi" });
    expect(toggle).toHaveAttribute("aria-checked", "false");
    toggle.focus();
    await userEvent.keyboard(" ");
    expect(toggle).toHaveAttribute("aria-checked", "true");
    await expectNoAxeViolations(container);
  });
});

describe("Dialog", () => {
  it("opens, is labelled, traps focus and closes on Escape", async () => {
    render(
      <Dialog>
        <DialogTrigger render={<Button />}>Delete</DialogTrigger>
        <DialogContent>
          <DialogTitle>Delete file?</DialogTitle>
          <DialogDescription>This cannot be undone.</DialogDescription>
          <DialogActions>
            <DialogClose render={<Button variant="text" />}>Cancel</DialogClose>
          </DialogActions>
        </DialogContent>
      </Dialog>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Delete" }));
    const dialog = await screen.findByRole("dialog", { name: "Delete file?" });
    expect(dialog).toHaveAccessibleDescription("This cannot be undone.");
    await waitFor(() => expect(dialog.contains(document.activeElement)).toBe(true));
    await expectNoAxeViolations(document.body);
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });
});
