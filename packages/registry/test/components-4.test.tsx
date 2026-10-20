import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axe from "axe-core";
import { Accordion, AccordionItem, AccordionPanel, AccordionTrigger } from "@/registry/components/accordion";
import { Alert } from "@/registry/components/alert";
import {
  AlertDialog,
  AlertDialogActions,
  AlertDialogClose,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/registry/components/alert-dialog";
import { Avatar, AvatarGroup } from "@/registry/components/avatar";
import { Breadcrumb, BreadcrumbItem } from "@/registry/components/breadcrumb";
import { Calendar } from "@/registry/components/calendar";
import { DatePicker, DateRangePicker } from "@/registry/components/date-picker";
import { Carousel, CarouselItem } from "@/registry/components/carousel";
import { CodeBlock, CodeTabs } from "@/registry/components/code-block";
import { Select } from "@/registry/components/select";
import { Pagination, paginationRange } from "@/registry/components/pagination";

async function expectNoAxeViolations(container: Element) {
  const result = await axe.run(container, { rules: { "color-contrast": { enabled: false } } });
  expect(result.violations.map((v) => `${v.id}: ${v.help}`)).toEqual([]);
}

describe("Accordion", () => {
  it("toggles sections with the keyboard", async () => {
    const { container } = render(
      <Accordion>
        <AccordionItem value="a">
          <AccordionTrigger>Shipping</AccordionTrigger>
          <AccordionPanel>Ships in two days.</AccordionPanel>
        </AccordionItem>
        <AccordionItem value="b">
          <AccordionTrigger>Returns</AccordionTrigger>
          <AccordionPanel>Free for 30 days.</AccordionPanel>
        </AccordionItem>
      </Accordion>,
    );
    const shipping = screen.getByRole("button", { name: "Shipping" });
    expect(shipping).toHaveAttribute("aria-expanded", "false");
    shipping.focus();
    await userEvent.keyboard("{Enter}");
    expect(shipping).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("Ships in two days.")).toBeVisible();
    // Headers are ordinary tab stops (the APG dropped arrow-key roving for accordions).
    await userEvent.tab();
    expect(screen.getByRole("button", { name: "Returns" })).toHaveFocus();
    await expectNoAxeViolations(container);
  });
});

describe("Alert", () => {
  it("announces errors urgently and others politely, and can be dismissed", async () => {
    const onDismiss = vi.fn();
    const { container } = render(
      <>
        <Alert type="error" title="Sync failed" onDismiss={onDismiss}>
          Check your connection.
        </Alert>
        <Alert title="Update available" />
      </>,
    );
    expect(screen.getByRole("alert")).toHaveTextContent("Sync failed");
    expect(screen.getByRole("status")).toHaveTextContent("Update available");
    await userEvent.click(screen.getByRole("button", { name: "Dismiss" }));
    expect(onDismiss).toHaveBeenCalledOnce();
    await expectNoAxeViolations(container);
  });
});

describe("AlertDialog", () => {
  it("opens as a labelled alertdialog and closes from its buttons", async () => {
    const onDelete = vi.fn();
    render(
      <AlertDialog>
        <AlertDialogTrigger>Delete</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogTitle>Delete 3 files?</AlertDialogTitle>
          <AlertDialogDescription>They can't be recovered.</AlertDialogDescription>
          <AlertDialogActions>
            <AlertDialogClose>Cancel</AlertDialogClose>
            <AlertDialogClose onClick={onDelete}>Delete files</AlertDialogClose>
          </AlertDialogActions>
        </AlertDialogContent>
      </AlertDialog>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Delete" }));
    const dialog = await screen.findByRole("alertdialog", { name: "Delete 3 files?" });
    expect(dialog).toHaveAccessibleDescription("They can't be recovered.");
    await userEvent.click(within(dialog).getByRole("button", { name: "Delete files" }));
    expect(onDelete).toHaveBeenCalledOnce();
    await waitFor(() => expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument());
  });
});

describe("Avatar", () => {
  it("falls back to initials named by alt, and groups extras into +N", () => {
    render(
      <AvatarGroup max={2} aria-label="Team">
        <Avatar alt="Ada Lovelace" />
        <Avatar alt="Grace Hopper" shape="cookie-9" />
        <Avatar alt="Alan Turing" />
      </AvatarGroup>,
    );
    expect(screen.getByRole("img", { name: "Ada Lovelace" })).toHaveTextContent("AL");
    expect(screen.getByRole("img", { name: "Grace Hopper" })).toHaveTextContent("GH");
    expect(screen.queryByRole("img", { name: "Alan Turing" })).not.toBeInTheDocument();
    expect(screen.getByRole("img", { name: "1 more" })).toHaveTextContent("+1");
  });
});

describe("Breadcrumb", () => {
  it("is a navigation trail ending at the current page", async () => {
    const { container } = render(
      <Breadcrumb>
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
        <BreadcrumbItem href="/docs">Docs</BreadcrumbItem>
        <BreadcrumbItem current>Button</BreadcrumbItem>
      </Breadcrumb>,
    );
    const nav = screen.getByRole("navigation", { name: "Breadcrumb" });
    expect(within(nav).getAllByRole("link").map((link) => link.textContent)).toEqual(["Home", "Docs"]);
    expect(within(nav).getByText("Button")).toHaveAttribute("aria-current", "page");
    await expectNoAxeViolations(container);
  });
});

describe("Calendar", () => {
  it("selects a day", async () => {
    const onSelect = vi.fn();
    render(<Calendar mode="single" defaultMonth={new Date(2026, 9, 1)} onSelect={onSelect} />);
    expect(screen.getByRole("grid")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: /October 20th, 2026/ }));
    expect(onSelect).toHaveBeenCalled();
    expect((onSelect.mock.calls[0]![0] as Date).getDate()).toBe(20);
  });
});

describe("DatePicker", () => {
  it("picks a date, shows it in the field and submits it", async () => {
    const onValueChange = vi.fn();
    render(
      <form aria-label="Trip">
        <DatePicker label="Departure" name="departure" locale="en-US" defaultValue={new Date(2026, 9, 1)} onValueChange={onValueChange} />
      </form>,
    );
    const field = screen.getByRole("button", { name: /Departure/ });
    expect(field).toHaveAccessibleName("Departure Oct 1, 2026");
    await userEvent.click(field);
    await userEvent.click(await screen.findByRole("button", { name: /October 20th, 2026/ }));
    expect((onValueChange.mock.calls[0]![0] as Date).getDate()).toBe(20);
    await waitFor(() => expect(screen.queryByRole("grid")).not.toBeInTheDocument());
    expect(field).toHaveAccessibleName("Departure Oct 20, 2026");
    expect(document.querySelector('input[name="departure"]')).toHaveValue("2026-10-20");
  });

  it("picks a range and closes once both ends are chosen", async () => {
    render(<DateRangePicker label="Stay" name="stay" locale="en-US" calendarProps={{ defaultMonth: new Date(2026, 9, 1) }} />);
    await userEvent.click(screen.getByRole("button", { name: /Stay/ }));
    await userEvent.click(await screen.findByRole("button", { name: /October 20th, 2026/ }));
    expect(screen.getByRole("grid")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: /October 24th, 2026/ }));
    await waitFor(() => expect(screen.queryByRole("grid")).not.toBeInTheDocument());
    expect(document.querySelector('input[name="stay"]')).toHaveValue("2026-10-20/2026-10-24");
  });
});

describe("Carousel", () => {
  it("labels the carousel and its slides", async () => {
    const { container } = render(
      <Carousel aria-label="Featured">
        <CarouselItem label="Lisbon">
          <img src="lisbon.jpg" alt="Tram in Lisbon" />
        </CarouselItem>
        <CarouselItem>
          <img src="oslo.jpg" alt="Oslo harbour" />
        </CarouselItem>
      </Carousel>,
    );
    const carousel = screen.getByRole("region", { name: "Featured" });
    expect(carousel).toHaveAttribute("aria-roledescription", "carousel");
    expect(screen.getByRole("group", { name: "1 of 2" })).toHaveAttribute("aria-roledescription", "slide");
    expect(screen.getByRole("button", { name: "Previous" })).toBeDisabled();
    await expectNoAxeViolations(container);
  });
});

describe("CodeBlock", () => {
  it("copies its code", async () => {
    const user = userEvent.setup();
    const writeText = vi.spyOn(navigator.clipboard, "writeText").mockResolvedValue();
    render(<CodeBlock code={'npx @grenishrai/expressive add button\n'} title="Terminal" language="bash" lineNumbers />);
    expect(screen.getByText("npx @grenishrai/expressive add button")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Copy code" }));
    expect(writeText).toHaveBeenCalledWith("npx @grenishrai/expressive add button\n");
    expect(await screen.findByRole("button", { name: "Copied" })).toBeInTheDocument();
  });
});

describe("CodeTabs", () => {
  const install = (pm: string) => ({ value: pm, label: pm, language: "bash", code: `${pm === "npm" ? "npx" : `${pm} dlx`} @grenishrai/expressive init` });

  it("switches tabs and copies the active one", async () => {
    const user = userEvent.setup();
    const writeText = vi.spyOn(navigator.clipboard, "writeText").mockResolvedValue();
    const { container } = render(<CodeTabs aria-label="Package manager" items={[install("npm"), install("pnpm")]} />);
    const tabs = screen.getByRole("tablist", { name: "Package manager" });
    expect(within(tabs).getByRole("tab", { name: "npm" })).toHaveAttribute("aria-selected", "true");
    await user.click(within(tabs).getByRole("tab", { name: "pnpm" }));
    expect(screen.getByRole("tabpanel")).toHaveTextContent("pnpm dlx @grenishrai/expressive init");
    await user.click(screen.getByRole("button", { name: "Copy code" }));
    expect(writeText).toHaveBeenCalledWith("pnpm dlx @grenishrai/expressive init");
    await expectNoAxeViolations(container);
  });

  it("keeps blocks with the same syncKey in step and remembers the choice", async () => {
    // jsdom here has no origin, so no localStorage; provide one.
    const store = new Map<string, string>();
    vi.stubGlobal("localStorage", {
      getItem: (key: string) => store.get(key) ?? null,
      setItem: (key: string, value: string) => void store.set(key, value),
    });
    render(
      <>
        <CodeTabs aria-label="First" syncKey="pm-test" items={[install("npm"), install("bun")]} />
        <CodeTabs aria-label="Second" syncKey="pm-test" items={[install("npm"), install("bun")]} />
      </>,
    );
    await userEvent.click(within(screen.getByRole("tablist", { name: "First" })).getByRole("tab", { name: "bun" }));
    expect(within(screen.getByRole("tablist", { name: "Second" })).getByRole("tab", { name: "bun" })).toHaveAttribute("aria-selected", "true");
    expect(store.get("expressive:code-tabs:pm-test")).toBe("bun");
    vi.unstubAllGlobals();
  });
});

describe("Select", () => {
  it("chooses an option and shows its label", async () => {
    const onValueChange = vi.fn();
    render(
      <Select
        label="Fruit"
        onValueChange={onValueChange}
        items={[
          { value: "apple", label: "Apple" },
          { value: "pear", label: "Pear" },
        ]}
      />,
    );
    const trigger = screen.getByRole("combobox", { name: "Fruit" });
    await userEvent.click(trigger);
    await userEvent.click(await screen.findByRole("option", { name: "Pear" }));
    expect(onValueChange).toHaveBeenCalledWith("pear", expect.anything());
    await waitFor(() => expect(trigger).toHaveTextContent("Pear"));
  });
});

describe("Pagination", () => {
  it("collapses long ranges around the current page", () => {
    expect(paginationRange(1, 5)).toEqual([1, 2, 3, 4, 5]);
    expect(paginationRange(1, 20)).toEqual([1, 2, 3, 4, 5, "end-ellipsis", 20]);
    expect(paginationRange(10, 20)).toEqual([1, "start-ellipsis", 9, 10, 11, "end-ellipsis", 20]);
    expect(paginationRange(20, 20)).toEqual([1, "start-ellipsis", 16, 17, 18, 19, 20]);
  });

  it("marks the current page and moves between pages", async () => {
    const onPageChange = vi.fn();
    const { container } = render(<Pagination page={1} pageCount={10} onPageChange={onPageChange} />);
    expect(screen.getByRole("button", { name: "Page 1" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("button", { name: "Previous page" })).toBeDisabled();
    await userEvent.click(screen.getByRole("button", { name: "Next page" }));
    expect(onPageChange).toHaveBeenCalledWith(2);
    await expectNoAxeViolations(container);
  });

  it("renders links with getHref", () => {
    render(<Pagination page={2} pageCount={3} getHref={(page) => `?page=${page}`} />);
    expect(screen.getByRole("link", { name: "Page 3" })).toHaveAttribute("href", "?page=3");
  });
});
