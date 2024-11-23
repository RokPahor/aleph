import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import Loader from "./Loader"

vi.mock("react-loader-spinner", () => ({
  ColorRing: ({ visible, height, width, ariaLabel }: any) => {
    if (!visible) return null
    return (
      <div
        data-testid="color-ring"
        aria-label={ariaLabel}
        style={{ height, width }}
      >
        ColorRing Mock
      </div>
    )
  },
}))

describe("Loader Component", () => {
  it("renders the loader with default height and width", () => {
    render(<Loader />)
    const loader = screen.getByTestId("color-ring")

    expect(loader).toBeInTheDocument()
    expect(loader).toHaveStyle({ height: "80", width: "80" })
    expect(loader).toHaveAttribute("aria-label", "color-ring-loading")
  })

  it("renders the loader with custom height and width", () => {
    render(<Loader height="100" width="100" />)
    const loader = screen.getByTestId("color-ring")

    expect(loader).toBeInTheDocument()
    expect(loader).toHaveStyle({ height: "100", width: "100" })
  })
})
