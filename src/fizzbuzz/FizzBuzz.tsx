import React, { useState } from "react"

const FizzBuzz: React.FC = () => {
  const [fizzBuzzOutput, setFizzBuzzOutput] = useState<string>("")

  const printFizzBuzz = () => {
    let result = ""
    for (let i = 1; i <= 100; i++) {
      if (i % 15 === 0) {
        result += "FizzBuzz\n"
      } else if (i % 3 === 0) {
        result += "Fizz\n"
      } else if (i % 5 === 0) {
        result += "Buzz\n"
      } else {
        result += `${i}\n`
      }
    }
    setFizzBuzzOutput(result)
  }

  return (
    <div>
      <h1>FizzBuzz</h1>
      <p>
        <b>
          Pressing the button will print numbers divisible by 3(Fizz), 5(Buzz)
          and (3 and 5 at the same time)(FizzBuzz) in the range from 1 to 100
        </b>
      </p>

      <button
        onClick={printFizzBuzz}
        title="Print fizzbuzz numbers"
        style={{
          marginBottom: "25px",
          padding: "10px 30px",
          cursor: "pointer",
        }}
      >
        Print FizzBuzz
      </button>
      <pre
        style={{
          whiteSpace: "pre-wrap",
          border: "3px solid silver",
          padding: "15px",
          margin: "0",
        }}
      >
        {fizzBuzzOutput || "No output yet"}
      </pre>
    </div>
  )
}

export default FizzBuzz
