import { render, screen, waitFor } from "@testing-library/react"
import { describe, it, vi, expect } from "vitest"
import { MemoryRouter, Route, Routes } from "react-router-dom"
import BookDetails from "./BookDetail"

vi.mock("../Loader/Loader", () => ({
  default: () => <div data-testid="mock-loader">Loading...</div>,
}))

vi.mock("../Error/Error", () => ({
  default: () => <div data-testid="mock-error">Error occurred</div>,
}))

describe("BookDetails Component", () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  const renderWithRouter = (initialRoute: string) => {
    render(
      <MemoryRouter initialEntries={[initialRoute]}>
        <Routes>
          <Route path="/book/:selectedBookId" element={<BookDetails />} />
        </Routes>
      </MemoryRouter>
    )
  }

  it("shows the Loader when loading book details", async () => {
    vi.spyOn(global, "fetch").mockResolvedValueOnce({
      json: async () => ({}),
    } as Response)

    renderWithRouter("/book/test-book-id")

    expect(screen.getByTestId("mock-loader")).toBeInTheDocument()
  })

  it("renders error message on fetch failure", async () => {
    vi.spyOn(global, "fetch").mockRejectedValueOnce(new Error("Fetch error"))

    renderWithRouter("/book/test-book-id")

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
        },
      },
    }

    vi.spyOn(global, "fetch").mockResolvedValueOnce({
      json: async () => mockBookDetails,
    } as Response)

    renderWithRouter("/book/test-book-id")

    await waitFor(() => {
      expect(screen.getByText("Test Book")).toBeInTheDocument()
      expect(screen.getByText("Rok")).toBeInTheDocument()
      expect(screen.getByText("2020")).toBeInTheDocument()
      expect(screen.getByText("Hardcover")).toBeInTheDocument()
    })
  })

  it("renders a default message when no book data is available", async () => {
    const mockBookDetails = {
      "test-book-id": {
        details: {
          title: "",
          covers: [],
          authors: [],
          publish_date: "",
          physical_format: "",
        },
      },
    }

    vi.spyOn(global, "fetch").mockResolvedValueOnce({
      json: async () => mockBookDetails,
    } as Response)

    renderWithRouter("/book/test-book-id")

    await waitFor(() => {
      expect(screen.getByText("No title provided")).toBeInTheDocument()
      expect(screen.getAllByText("Unknown")).toHaveLength(2)
    })
  })

  it("renders an empty message when no book is found", async () => {
    vi.spyOn(global, "fetch").mockResolvedValueOnce({
      json: async () => ({}),
    } as Response)

    renderWithRouter("/book/non-existent-book-id")

    await waitFor(() => {
      expect(screen.getByText("No book data was found.")).toBeInTheDocument()
    })
  })
})
