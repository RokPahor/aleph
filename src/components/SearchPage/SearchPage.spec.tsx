import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { describe, it, vi, expect } from "vitest"
import { MemoryRouter } from "react-router-dom"
import SearchPage from "./SearchPage"

vi.mock("../Loader/Loader", () => ({
  default: () => <div data-testid="mock-loader">Loading...</div>,
}))

vi.mock("../Error/Error", () => ({
  default: ({ message }: { message?: string }) => (
    <div data-testid="mock-error">{message || "Error occurred"}</div>
  ),
}))

vi.mock("../BookHoverInfo/BookHoverInfo", () => ({
  default: ({ bookId }: { bookId?: string }) => (
    <div data-testid="mock-book-hover-info">{bookId}</div>
  ),
}))

describe("SearchPage Component", () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it("renders the search page correctly", () => {
    render(
      <MemoryRouter>
        <SearchPage />
      </MemoryRouter>
    )

    expect(screen.getByText("Online library")).toBeInTheDocument()
    expect(
      screen.getByPlaceholderText("Search for a book...")
    ).toBeInTheDocument()
    expect(screen.getByText("Search")).toBeInTheDocument()
  })

  it("displays a loader while fetching books", async () => {
    vi.spyOn(global, "fetch").mockResolvedValueOnce({
      json: async () => ({ docs: [] }),
    } as Response)

    render(
      <MemoryRouter>
        <SearchPage />
      </MemoryRouter>
    )

    fireEvent.change(screen.getByPlaceholderText("Search for a book..."), {
      target: { value: "Test" },
    })
    fireEvent.click(screen.getByText("Search"))

    expect(screen.getByTestId("mock-loader")).toBeInTheDocument()
  })

  it("displays an error message when the fetch fails", async () => {
    vi.spyOn(global, "fetch").mockRejectedValueOnce(new Error("Fetch error"))

    render(
      <MemoryRouter>
        <SearchPage />
      </MemoryRouter>
    )

    fireEvent.change(screen.getByPlaceholderText("Search for a book..."), {
      target: { value: "Test" },
    })
    fireEvent.click(screen.getByText("Search"))

    await waitFor(() => {
      expect(screen.getByTestId("mock-error")).toBeInTheDocument()
      expect(
        screen.getByText("Error while searching for books")
      ).toBeInTheDocument()
    })
  })

  it("displays a no-books message if no books are found", async () => {
    vi.spyOn(global, "fetch").mockResolvedValueOnce({
      json: async () => ({ docs: [] }),
    } as Response)

    render(
      <MemoryRouter>
        <SearchPage />
      </MemoryRouter>
    )

    fireEvent.change(screen.getByPlaceholderText("Search for a book..."), {
      target: { value: "Test" },
    })
    fireEvent.click(screen.getByText("Search"))

    await waitFor(() => {
      expect(screen.getByText("No books to display")).toBeInTheDocument()
    })
  })

  it("renders books when data is successfully fetched", async () => {
    const mockBooks = [
      {
        key: "1",
        title: "Test title",
        cover_i: 12345,
        isbn: ["1234567890", "0987654321"],
        author_name: ["Rok"],
        first_publish_year: 2020,
        number_of_pages_median: 200,
      },
    ]

    vi.spyOn(global, "fetch").mockResolvedValueOnce({
      json: async () => ({ docs: mockBooks }),
    } as Response)

    render(
      <MemoryRouter>
        <SearchPage />
      </MemoryRouter>
    )

    fireEvent.change(screen.getByPlaceholderText("Search for a book..."), {
      target: { value: "Test" },
    })
    fireEvent.click(screen.getByText("Search"))

    await waitFor(() => {
      expect(screen.getByText("Test title")).toBeInTheDocument()
      expect(screen.getByAltText("Test title")).toBeInTheDocument()
    })
  })
})
