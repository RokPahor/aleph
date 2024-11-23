import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import ErrorMsg from "./Error"

describe("ErrorMsg Component", () => {
  it("renders the default error message when no message prop is provided", () => {
    render(<ErrorMsg />)
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
  })

  it("renders the provided error message if provided", () => {
    const customMessage = "Custom error message"
    render(<ErrorMsg message={customMessage} />)
    expect(screen.getByText(customMessage)).toBeInTheDocument()
  })
})
