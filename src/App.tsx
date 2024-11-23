import React from "react"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import SearchPage from "./components/SearchPage/SearchPage"
import BookDetails from "./components/BookDetails/BookDetail"

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<SearchPage />} />
      <Route path="/:selectedBookId" element={<BookDetails />} />
    </Routes>
  )
}

export default App
