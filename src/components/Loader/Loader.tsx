import React from "react"
import { ColorRing } from "react-loader-spinner"

interface LoaderProps {
  height?: string
  width?: string
}

const Loader: React.FC<LoaderProps> = ({ height, width }) => (
  <ColorRing
    visible={true}
    height={height || "80"}
    width={width || "80"}
    ariaLabel="color-ring-loading"
    wrapperStyle={{}}
    wrapperClass="color-ring-wrapper"
    colors={["#e15b64", "#f47e60", "#f8b26a", "#abbd81", "#849b87"]}
  />
)

export default Loader
