import React, { useEffect, useState } from "react"
import { ComponentState, ViewState } from "../SearchPage/SearchPage"
import Loader from "../Loader/Loader"
import { BookDetails } from "../BookDetails/BookDetail"
import ErrorMsg from "../Error/Error"

interface BookHoverInfoProps {
  bookId: string | undefined
}

const BookHoverInfo: React.FC<BookHoverInfoProps> = ({ bookId }) => {
  const [viewState, setViewState] = useState<ViewState>({
    state: ComponentState.LOADING,
  })
  const [book, setBook] = useState<BookDetails | null>(null)
  const [cachedBookInfos, setCachedBookInfos] = useState<{
    [id: string]: BookDetails
  }>({})

  useEffect(() => {
    const fetchBookDetails = async () => {
      if (!bookId) return
      if (cachedBookInfos[bookId]) {
        //if cached -> use cached data
        setBook(cachedBookInfos[bookId])
        setViewState({ state: ComponentState.DEFAULT })
        return
      }
      setViewState({ state: ComponentState.LOADING })
      try {
        const response = await fetch(
          `https://openlibrary.org/api/books?bibkeys=${bookId}&jscmd=details&format=json`
        )
        const data = await response.json()
        const bookData = data[bookId]?.details
        setViewState({
          state: bookData ? ComponentState.DEFAULT : ComponentState.EMPTY,
        })
        setCachedBookInfos((prev) => {
          //cache data
          const copy = { ...prev }
          return { ...copy, [bookId]: bookData }
        })
        setBook(bookData)
      } catch (err) {
        setViewState({ state: ComponentState.ERROR })
        console.error("Failed to fetch book details")
      }
    }

    fetchBookDetails()
  }, [bookId])

  if (!bookId) return null

  return (
    <div
      style={{
        position: "fixed",
        left: "20%",
        top: "10%",
        background: "rgba(0, 0, 0, 0.9)",
        color: "#fff",
        padding: "20px",
        width: "600px",
        minHeight: "700px",
        maxHeight: "1000px",
        borderRadius: "30px",
      }}
    >
      {viewState.state === ComponentState.LOADING && (
        <div style={{ marginTop: "40%", marginLeft: "45%" }}>
          <Loader></Loader>
        </div>
      )}
      {viewState.state === ComponentState.ERROR && <ErrorMsg></ErrorMsg>}
      {viewState.state === ComponentState.DEFAULT && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {book && book?.covers ? (
            <img
              src={`https://covers.openlibrary.org/b/id/${book.covers[0]}-L.jpg`}
              alt={book.title || "No title provided"}
            />
          ) : (
            "No cover photo available"
          )}
          <h2>{(book && book.title) || "No title provided"}</h2>
          <p>
            Authors:{" "}
            {book &&
              book.authors
                ?.map((author: { key: string; name: string }) => author.name)
                .join(", ")}
          </p>
          <p>Published: {(book && book.publish_date) || "Unknown"}</p>
          <p>Format: {(book && book.physical_format) || "Unknown"}</p>
          <p>Number of pages: {(book && book.number_of_pages) || "Unknown"}</p>
          <p> Weight: {(book && book.weight) || "Unknown"} </p>
        </div>
      )}
    </div>
  )
}

export default BookHoverInfo
