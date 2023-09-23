import React, { useRef, useState } from 'react';
import { UseSAT } from '../../customHook/useSAT';
import './index.css';
import JSZip from 'jszip';
export default function Form() {
  const [typeFile, settypeFile] = useState<string | null>('gastos');
  const [name, setName] = useState<string | null>(null);

  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    settypeFile(event.target.value);
  };
  const fileInput = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const file: any = fileInput.current?.files?.[0];
    
    const zip = new JSZip();
    let unzippedFiles = await zip.loadAsync(file);
    const contentFiles = [];
    for (const [key, value] of Object.entries(unzippedFiles.files)) {
      contentFiles.push(await value.async('string'));
    }
    const contentFile = contentFiles[0];
    
    UseSAT(contentFile, typeFile, name);
  };
  return (
    <div className='form-wrapper'>
      <label htmlFor=''>Ingresa info</label>
      <form action='' onSubmit={handleSubmit}>
        <div className='inputs-wrapper'>
          <input name='file' type={'file'} accept='.zip,.rar' ref={fileInput}></input>

          <label>
            <input
              type='radio'
              value='gastos'
              name='fileType'
              checked={typeFile === 'gastos'}
              onChange={handleOptionChange}
            />
            gastos
          </label>
          <br />
          <label>
            <input
              type='radio'
              value='ingresos'
              name='fileType'
              checked={typeFile === 'ingresos'}
              onChange={handleOptionChange}
            />
            ingresos
          </label>
          <div className='input-wrapper' >
            <p className='input-text'>{typeFile}</p>
            <label>
              <select name="month" id="monthSelect" onChange={(event) => setName(event.target.value)}>
                <option value="Enero">Enero</option>
                <option value="Febrero">Febrero</option>
                <option value="Marzo">Marzo</option>
                <option value="Abril">Abril</option>
                <option value="Mayo">Mayo</option>
                <option value="Junio">Junio</option>
                <option value="Julio">Julio</option>
                <option value="Agosto">Agosto</option>
                <option value="Septiembre">Septiembre</option>
                <option value="Octubre">Octubre</option>
                <option value="Noviembre">Noviembre</option>
                <option value="Diciembre">Diciembre</option>
              </select>
              {/* <input
                type='text'
                name='nombre'
                placeholder='mes'
                onChange={(event) => setName(event.target.value)}
              /> */}
            </label>
          </div>
        </div>
        <button type='submit'>Convertir archivo</button>
      </form>
    </div>
  );
}
