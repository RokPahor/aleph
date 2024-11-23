import React, { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ComponentState, ViewState } from "../SearchPage/SearchPage"
import Loader from "../Loader/Loader"
import ErrorMsg from "../Error/Error"
import styles from "./BookDetails.module.css"

export interface BookDetails {
  covers?: string[]
  title: string
  authors: { key: string; name: string }[]
  publish_date: string
  physical_format: string
  number_of_pages?: number
  weight?: string
}

const BookDetails: React.FC = () => {
  const { selectedBookId } = useParams<{ selectedBookId: string }>()
  const [book, setBook] = useState<BookDetails | null>(null)
  const [viewState, setViewState] = useState<ViewState>({
    state: ComponentState.LOADING,
  })

  const navigate = useNavigate()

  useEffect(() => {
    const fetchBookDetails = async () => {
      if (!selectedBookId) return
      setViewState({ state: ComponentState.LOADING })
      try {
        const response = await fetch(
          `https://openlibrary.org/api/books?bibkeys=${selectedBookId}&jscmd=details&format=json`
        )
        const data = await response.json()
        const bookData = data[selectedBookId]?.details
        setViewState({
          state: bookData ? ComponentState.DEFAULT : ComponentState.EMPTY,
        })
        setBook(bookData)
      } catch (err) {
        setViewState({ state: ComponentState.ERROR })
        console.error("Failed to fetch book details")
      }
    }

    fetchBookDetails()
  }, [selectedBookId])

  const handleRedirect = () => {
    navigate("/")
  }

  return (
    <>
      <div className={styles.bookContainer}>
        <div style={{ paddingLeft: "20px", paddingTop: "10px" }}>
          <button onClick={handleRedirect} className={styles.searchButton}>
            Back to list of books
          </button>
        </div>
        <div className={styles.bookDetails}>
          {viewState.state === ComponentState.LOADING && <Loader></Loader>}
          {viewState.state === ComponentState.ERROR && <ErrorMsg></ErrorMsg>}
          {viewState.state === ComponentState.EMPTY && (
            <div> No book data was found.</div>
          )}
          {viewState.state === ComponentState.DEFAULT && (
            <>
              {book && book.covers ? (
                <img
                  src={`https://covers.openlibrary.org/b/id/${book.covers[0]}-L.jpg`}
                  alt={book.title || "No title provided"}
                />
              ) : (
                <div className={styles.noCover}> No cover photo available</div>
              )}
              <div className={styles.bookInfo}>
                <h2 className={styles.title}>
                  {(book && book.title) || "No title provided"}
                </h2>
                <p className={styles.detail}>
                  <b> Authors: </b>
                  {book &&
                    book.authors
                      ?.map(
                        (author: { key: string; name: string }) => author.name
                      )
                      .join(", ")}
                </p>
                <p className={styles.detail}>
                  <b> Published:</b> {(book && book.publish_date) || "Unknown"}
                </p>
                <p className={styles.detail}>
                  <b> Format:</b> {(book && book.physical_format) || "Unknown"}
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default BookDetails
