import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import styles from "./SearchPage.module.css"
import Loader from "../Loader/Loader"
import ErrorMsg from "../Error/Error"
import { debounce } from "lodash"
import BookHoverInfo from "../BookHoverInfo/BookHoverInfo"

export interface Book {
  key: string
  title: string
  cover_i?: number
  isbn?: string[]
  author_name?: string[]
  first_publish_year?: number
  format?: string[]
  number_of_pages_median: number
}

export interface ViewState {
  state: ComponentState
}
export enum ComponentState {
  DEFAULT = "DEFAULT",
  LOADING = "LOADING",
  ERROR = "ERROR",
  EMPTY = "EMPTY",
}

const SearchPage: React.FC = () => {
  const [query, setQuery] = useState<string>("")
  const [books, setBooks] = useState<Book[]>([])
  const [hoveredBook, setHoveredBook] = useState<Book | null>(null)
  const navigate = useNavigate()
  const [viewState, setViewState] = useState<ViewState>({
    state: ComponentState.EMPTY,
  })
  const handleBookHover = (hoveredBook: Book | null) => {
    setHoveredBook(hoveredBook)
  }
  const debouncedMouseOver = debounce(handleBookHover, 100)

  const handleSearch = async () => {
    setViewState({ state: ComponentState.LOADING })
    try {
      const response = await fetch(
        `http://openlibrary.org/search.json?title=${query}`
      )
      const data = await response.json()
      setViewState({
        state:
          data.docs?.length > 0 ? ComponentState.DEFAULT : ComponentState.EMPTY,
      })
      setBooks(data.docs)
    } catch (err) {
      setViewState({ state: ComponentState.ERROR })
      console.error("Failed to fetch books")
    }
  }

  const handleBookClick = (bookIsbns?: string[]) => {
    if (bookIsbns?.length) navigate(`/${bookIsbns[1]}`)
  }

  return (
    <div className={styles.container}>
      <h1>Online library</h1>
      <div className={styles.searchBar}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={styles.searchInput}
          placeholder="Search for a book..."
        />
        <button onClick={handleSearch} className={styles.searchButton}>
          Search
        </button>
      </div>

      {viewState.state === ComponentState.LOADING && <Loader />}
      {viewState.state === ComponentState.ERROR && (
        <ErrorMsg message="Error while searching for books"></ErrorMsg>
      )}
      {viewState.state === ComponentState.EMPTY && (
        <div style={{ fontSize: "1.5rem" }}>No books to display</div>
      )}
      {viewState.state === ComponentState.DEFAULT && (
        <div className={styles.booksGrid}>
          {books.map((book) => (
            <div key={book.key} className={styles.bookCard}>
              <div
                className={styles.bookCover}
                onMouseEnter={() => debouncedMouseOver(book)}
                onMouseLeave={() => debouncedMouseOver(null)}
              >
                <img
                  src={
                    book.cover_i
                      ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
                      : "https://via.placeholder.com/100"
                  }
                  alt={book.title}
                />
              </div>
              <a
                className={styles.bookTitle}
                onClick={() => handleBookClick(book.isbn)}
              >
                {book.title}
              </a>
            </div>
          ))}
          <div style={{ pointerEvents: "none" }}>
            <BookHoverInfo
              bookId={
                hoveredBook && hoveredBook.isbn
                  ? hoveredBook.isbn[0]
                  : undefined
              }
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default SearchPage
