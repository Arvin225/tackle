import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Loading, Skeleton, SkeletonList, SkeletonCard } from "./Loading";

describe("Loading", () => {
  it("renders with default props", () => {
    const { container } = render(<Loading />);
    const svg = container.querySelector("svg");
    expect(svg).toBeTruthy();
    expect(svg?.getAttribute("class")).toContain("w-6 h-6"); // md size
    expect(svg?.getAttribute("class")).toContain("animate-spin");
  });

  it("renders with different sizes", () => {
    const { container, rerender } = render(<Loading size="sm" />);
    expect(container.querySelector("svg")?.getAttribute("class")).toContain("w-4 h-4");

    rerender(<Loading size="md" />);
    expect(container.querySelector("svg")?.getAttribute("class")).toContain("w-6 h-6");

    rerender(<Loading size="lg" />);
    expect(container.querySelector("svg")?.getAttribute("class")).toContain("w-10 h-10");

    rerender(<Loading size="xl" />);
    expect(container.querySelector("svg")?.getAttribute("class")).toContain("w-16 h-16");
  });

  it("renders with text", () => {
    const { getByText } = render(<Loading text="Loading..." />);
    expect(getByText("Loading...")).toBeTruthy();
  });

  it("renders full screen", () => {
    const { container } = render(<Loading fullScreen />);
    const div = container.firstChild as HTMLElement;
    expect(div.className).toContain("fixed inset-0");
    expect(div.className).toContain("z-50");
  });
});

describe("Skeleton", () => {
  it("renders with default props", () => {
    const { container } = render(<Skeleton />);
    const div = container.firstChild as HTMLElement;
    expect(div).toBeTruthy();
    expect(div.className).toContain("animate-pulse");
    expect(div.className).toContain("rounded");
  });

  it("renders with custom dimensions", () => {
    const { container } = render(<Skeleton width="50%" height="40px" />);
    const div = container.firstChild as HTMLElement;
    expect(div.style.width).toBe("50%");
    expect(div.style.height).toBe("40px");
  });
});

describe("SkeletonList", () => {
  it("renders with default count", () => {
    const { container } = render(<SkeletonList />);
    const skeletons = container.querySelectorAll('[class*="animate-pulse"]');
    expect(skeletons.length).toBe(5); // default count
  });

  it("renders with custom count", () => {
    const { container } = render(<SkeletonList count={3} />);
    const skeletons = container.querySelectorAll('[class*="animate-pulse"]');
    expect(skeletons.length).toBe(3);
  });
});

describe("SkeletonCard", () => {
  it("renders with default props", () => {
    const { container } = render(<SkeletonCard />);
    const skeletons = container.querySelectorAll('[class*="animate-pulse"]');
    expect(skeletons.length).toBeGreaterThan(0);
    expect((container.firstChild as HTMLElement)?.className).toContain("glass-card");
  });

  it("renders with custom image height", () => {
    const { container } = render(<SkeletonCard imageHeight="150px" />);
    const skeletons = container.querySelectorAll('[class*="animate-pulse"]');
    expect(skeletons.length).toBeGreaterThan(0);
  });
});
