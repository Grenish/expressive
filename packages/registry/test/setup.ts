import "@testing-library/jest-dom/vitest";

// jsdom has no PointerEvent; Base UI dispatches one for keyboard activation.
if (typeof window !== "undefined" && !window.PointerEvent) {
  class PointerEvent extends MouseEvent {
    pointerId: number;
    pointerType: string;
    constructor(type: string, init: PointerEventInit = {}) {
      super(type, init);
      this.pointerId = init.pointerId ?? 0;
      this.pointerType = init.pointerType ?? "";
    }
  }
  window.PointerEvent = PointerEvent as typeof window.PointerEvent;
}
