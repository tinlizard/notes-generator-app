import { useState } from 'react'
import { useRef } from 'react'
import './App.css'
import pdfToText from "react-pdftotext";
import Markdown from 'react-markdown'
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY,
});

function App() {
  const [file,setFile]: any = useState("")
  const [fileText,setFileText] = useState("")
  const [loading,setLoading] = useState(false)
  const inputFile: any = useRef(null)

  const [markdownText, setMarkdownText] = useState<any>("")

  //function to handle the file input button click, gets input file via useRef
  const onButtonClick = (): void => {
    inputFile.current.click();
    setFile(inputFile.current.value)
  };

  const convertToText = (e : React.ChangeEvent<HTMLElement>): void => {
    setLoading(true)
    setMarkdownText("")
    try {
      const file = e.target.files?.[0]
      //use react-pdftotext to convert the pdf to text, setLoading to false after async operation
      pdfToText(file)
        .then((text)=>{setFileText(text);sendToGemini(text)})
        .catch((error)=>console.error(`Failed to extract text from pdf: ${error}`))
        .finally(()=>setLoading(false))

    } catch(e: any) {
      console.log(e)
    }
  }

  //function to send the extracted text to Gemini API and get a markdown summary
  const sendToGemini = async (text: string) => {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Summarize this text in markdown format. Use ## for main headings, ### for subheadings, and DO NOT MAKE ANY HEADINGS BOLD. Here is the text: ${text}`
    })
    setMarkdownText(response.text);
  }

  return (
    <>
     <div className='main'>
       <input type='file' ref={inputFile} style={{display: 'none'}} accept="application/pdf" onChange={convertToText}></input>
       <button onClick={onButtonClick}  className='file-uploader'>Choose PDF file</button>
       <textarea className='text-input' readOnly={true} value={fileText}></textarea>
       <div className='markdown-text'>
         <h1>{loading ? "" : "Markdown Summary"}</h1>
         <Markdown>{loading ? "Loading pdf summary..." : markdownText}</Markdown>
       </div>
     </div>
    </>
  )
}


export default App
