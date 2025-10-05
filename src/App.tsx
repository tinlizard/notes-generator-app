import { useState } from 'react'
import { useRef } from 'react'
import { useEffect } from 'react'
import './App.css'
import pdfToText from "react-pdftotext";

function App() {
  const [file,setFile]: any = useState("")
  const [fileText,setFileText] = useState("")
  const inputFile: any = useRef(null)

  const onButtonClick = (): void => {
    inputFile.current.click();
    setFile(inputFile.current.value)
  };

  const convertToText = (e : React.ChangeEvent<HTMLElement>): void => {
    try {
      const file = e.target.files?.[0]

      //use react-pdftotext to convert the pdf to text
      pdfToText(file)
        .then((text)=>{setFileText(text);console.log(`this is the pdf text: ${text}`)})
        .catch((error)=>console.error(`Failed to extract text from pdf: ${error}`))
    } catch(e: any) {
      console.log(e)
    }
  }

  return (
    <>
     <div className='main'>
       <input type='file' ref={inputFile} style={{display: 'none'}} accept="application/pdf" onChange={convertToText}></input>
       <button onClick={onButtonClick}  className='file-uploader'>Choose PDF file</button>
       <textarea className='text-input' readOnly={true} value={fileText}></textarea>
     </div>
    </>
  )
}


export default App
