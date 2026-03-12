import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import { Button } from "./Button";

describe("Button", () => {
  it("renders with default props", () => {
    const { getByText } = render(<Button>Click me</Button>);
    const button = getByText("Click me");
    expect(button).toBeTruthy();
    expect(button.className).toContain("bg-[#007aff]"); // primary variant
    expect(button.className).toContain("px-4 py-2"); // md size
  });

  it("renders with different variants", () => {
    const { getByText, rerender } = render(<Button variant="primary">Primary</Button>);
    expect(getByText("Primary").className).toContain("bg-[#007aff]");

    rerender(<Button variant="secondary">Secondary</Button>);
    expect(getByText("Secondary").className).toContain("bg-[#5856d6]");

    rerender(<Button variant="ghost">Ghost</Button>);
    expect(getByText("Ghost").className).toContain("bg-transparent");

    rerender(<Button variant="danger">Danger</Button>);
    expect(getByText("Danger").className).toContain("bg-[#ff3b30]");
  });

  it("renders with different sizes", () => {
    const { getByText, rerender } = render(<Button size="sm">Small</Button>);
    expect(getByText("Small").className).toContain("px-3 py-1.5");

    rerender(<Button size="md">Medium</Button>);
    expect(getByText("Medium").className).toContain("px-4 py-2");

    rerender(<Button size="lg">Large</Button>);
    expect(getByText("Large").className).toContain("px-6 py-3");
  });

  it("shows loading state", () => {
    const { getByText } = render(<Button isLoading>Loading</Button>);
    const button = getByText("Loading") as HTMLButtonElement;
    expect(button.disabled).toBe(true);
    expect(button.querySelector("svg")).toBeTruthy();
    expect(button.querySelector("svg")?.getAttribute("class")).toContain("animate-spin");
  });

  it("handles click events", () => {
    const handleClick = vi.fn();
    const { getByText } = render(<Button onClick={handleClick}>Click me</Button>);

    getByText("Click me").click();
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("can be disabled", () => {
    const { getByText } = render(<Button disabled>Disabled</Button>);
    const button = getByText("Disabled") as HTMLButtonElement;
    expect(button.disabled).toBe(true);
    expect(button.className).toContain("disabled:opacity-50");
  });

  it("supports full width", () => {
    const { getByText } = render(<Button fullWidth>Full Width</Button>);
    expect(getByText("Full Width").className).toContain("w-full");
  });
});
