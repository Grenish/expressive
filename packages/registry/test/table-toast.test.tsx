import * as React from "react";
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axe from "axe-core";
import { Checkbox } from "@/registry/components/checkbox";
import {
  type SortDirection,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/registry/components/table";
import { ToastProvider, useToast } from "@/registry/components/toast";

async function expectNoAxeViolations(container: Element) {
  const result = await axe.run(container, { rules: { "color-contrast": { enabled: false } } });
  expect(result.violations.map((v) => `${v.id}: ${v.help}`)).toEqual([]);
}

function Orders() {
  const [sort, setSort] = React.useState<SortDirection>("none");
  const rows = [
    { id: "a", item: "Lamp", total: 40 },
    { id: "b", item: "Chair", total: 120 },
  ];
  const sorted = sort === "none" ? rows : [...rows].sort((x, y) => (sort === "ascending" ? x.total - y.total : y.total - x.total));
  return (
    <Table>
      <TableCaption>Recent orders</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Item</TableHead>
          <TableHead numeric sort={sort} onSort={() => setSort(sort === "ascending" ? "descending" : "ascending")}>
            Total
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sorted.map((row) => (
          <TableRow key={row.id} selected={row.id === "b"}>
            <TableCell>{row.item}</TableCell>
            <TableCell numeric>{row.total}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

describe("Table", () => {
  it("is a captioned table with a sortable column", async () => {
    const { container } = render(<Orders />);
    expect(screen.getByRole("table", { name: "Recent orders" })).toBeInTheDocument();
    const header = screen.getByRole("columnheader", { name: "Total" });
    expect(header).not.toHaveAttribute("aria-sort");
    await userEvent.click(screen.getByRole("button", { name: "Total" }));
    expect(header).toHaveAttribute("aria-sort", "ascending");
    expect(screen.getAllByRole("row")[1]).toHaveTextContent("Lamp");
    await userEvent.click(screen.getByRole("button", { name: "Total" }));
    expect(header).toHaveAttribute("aria-sort", "descending");
    expect(screen.getAllByRole("row")[1]).toHaveTextContent("Chair");
    await expectNoAxeViolations(container);
  });

  it("marks selected rows", () => {
    render(
      <Table aria-label="Files">
        <TableBody>
          <TableRow selected>
            <TableCell>
              <Checkbox checked aria-label="Select notes.txt" />
            </TableCell>
            <TableCell>notes.txt</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );
    expect(screen.getByRole("row")).toHaveAttribute("aria-selected", "true");
  });
});

function Notify({ run }: { run: (toast: ReturnType<typeof useToast>) => void }) {
  const toast = useToast();
  return (
    <button type="button" onClick={() => run(toast)}>
      Notify
    </button>
  );
}

describe("Toast", () => {
  it("shows several toasts with titles, types and actions", async () => {
    const onUndo = vi.fn();
    render(
      <ToastProvider>
        <Notify
          run={(toast) => {
            toast.success("Saved", { description: "All changes synced." });
            toast.show({ title: "Archived", action: { label: "Undo", onClick: onUndo } });
          }}
        />
      </ToastProvider>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Notify" }));
    expect(await screen.findByText("Saved")).toBeInTheDocument();
    expect(screen.getByText("All changes synced.")).toBeInTheDocument();
    expect(screen.getByText("Saved").closest("[data-slot=toast]")).toHaveAttribute("data-type", "success");
    await userEvent.click(screen.getByRole("button", { name: "Undo" }));
    expect(onUndo).toHaveBeenCalledOnce();
    await waitFor(() => expect(screen.queryByText("Archived")).not.toBeInTheDocument());
    expect(screen.getByText("Saved")).toBeInTheDocument();
  });

  it("turns a loading toast into a result when the promise settles", async () => {
    let resolve!: (value: string) => void;
    render(
      <ToastProvider>
        <Notify
          run={(toast) => {
            toast.promise(new Promise<string>((r) => (resolve = r)), {
              loading: "Uploading…",
              success: (name) => `Uploaded ${name}`,
              error: "Upload failed",
            });
          }}
        />
      </ToastProvider>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Notify" }));
    const loading = await screen.findByText("Uploading…");
    expect(loading.closest("[data-slot=toast]")).toHaveAttribute("data-type", "loading");
    await act(async () => resolve("photo.jpg"));
    expect(await screen.findByText("Uploaded photo.jpg")).toBeInTheDocument();
  });

  it("dismisses with the close button", async () => {
    render(
      <ToastProvider>
        <Notify run={(toast) => toast.info("Heads up")} />
      </ToastProvider>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Notify" }));
    await screen.findByText("Heads up");
    // Base UI hides the close button from assistive tech; keyboard users focus the toast and press Escape.
    await userEvent.click(screen.getByLabelText("Dismiss"));
    await waitFor(() => expect(screen.queryByText("Heads up")).not.toBeInTheDocument());
  });
});
