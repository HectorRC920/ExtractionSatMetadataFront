import React,{useRef, useState} from 'react'
import { UseSAT } from '../../customHook/useSAT';
import './index.css'
import JSZip from "jszip"
export default function Form() {

  const [typeFile, settypeFile] = useState<string | null>(null);
  const [name , setName] = useState<string | null>(null);

  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {   
    settypeFile(event.target.value);
  }
  const fileInput = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e:any) => {
    e.preventDefault()
    const file: any = fileInput.current?.files?.[0]
    
    const zip = new JSZip()
    let unzippedFiles = await zip.loadAsync(file)
    const contentFiles = []
    for (const [key, value] of  Object.entries(unzippedFiles.files)) {
      contentFiles.push(await value.async('string')) 
    }
    const contentFile = contentFiles[0]

    UseSAT(contentFile,typeFile, name )
  }
  return (
    <div className='form-wrapper'>
      <label htmlFor="">Ingresa info</label>
      <form action="" onSubmit={handleSubmit}>
        <div className='inputs-wrapper'>

        <input name='file' type={'file'} ref={fileInput}></input>
   

        <label>
        <input
          type="radio"
          value="gastos"
          name='fileType'
          checked={typeFile === 'gastos'}
          onChange={handleOptionChange}
          />
        gastos
      </label>
      <br />
      <label>
        <input
          type="radio"
          value="ingresos"
          name='fileType'
          checked={typeFile === 'ingresos'}
          onChange={handleOptionChange}
        />
        ingresos
      </label>
      <label>
        <input
          type="text"
          name='nombre'
          onChange={(event) => setName(event.target.value)}
        />
        nombre
      </label>
        </div>
        <button type='submit'>Convertir archivo</button>
      </form>
    </div>
  )
}
