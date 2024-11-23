import { render, screen, waitFor } from "@testing-library/react"
import { describe, it, vi, expect } from "vitest"
import BookHoverInfo from "./BookHoverInfo"

vi.mock("../Loader/Loader", () => ({
  default: () => <div data-testid="mock-loader">Loading...</div>,
}))

vi.mock("../Error/Error", () => ({
  default: () => <div data-testid="mock-error">Error occurred</div>,
}))

describe("BookHoverInfo Component", () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it("does not render anything when no bookId is provided", () => {
    const { container } = render(<BookHoverInfo bookId={undefined} />)
    expect(container.firstChild).toBeNull()
  })

  it("shows the Loader when loading book details", async () => {
    vi.spyOn(global, "fetch").mockResolvedValueOnce({
      json: async () => ({}),
    } as Response)

    render(<BookHoverInfo bookId="test-book-id" />)
    expect(screen.getByTestId("mock-loader")).toBeInTheDocument()
  })

  it("renders error message on fetch failure", async () => {
    vi.spyOn(global, "fetch").mockRejectedValueOnce(new Error("Fetch error"))

    render(<BookHoverInfo bookId="test-book-id" />)

    await waitFor(() => {
      expect(screen.getByTestId("mock-error")).toBeInTheDocument()
    })
  })

  it("renders book details when data is successfully fetched", async () => {
    const mockBookDetails = {
      "test-book-id": {
        details: {
          title: "Test Book",
          covers: [12345],
          authors: [{ key: "author1", name: "Rok" }],
          publish_date: "2020",
          physical_format: "Hardcover",
          number_of_pages: 300,
          weight: "1.5 kg",
        },
      },
    }

    vi.spyOn(global, "fetch").mockResolvedValueOnce({
      json: async () => mockBookDetails,
    } as Response)

    render(<BookHoverInfo bookId="test-book-id" />)

    await waitFor(() => {
      expect(screen.getByText("Test Book")).toBeInTheDocument()
      expect(screen.getByText("Authors: Rok")).toBeInTheDocument()
      expect(screen.getByText("Published: 2020")).toBeInTheDocument()
      expect(screen.getByText("Format: Hardcover")).toBeInTheDocument()
      expect(screen.getByText("Number of pages: 300")).toBeInTheDocument()
      expect(screen.getByText("Weight: 1.5 kg")).toBeInTheDocument()
    })
  })
})
