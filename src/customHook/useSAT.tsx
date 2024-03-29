import * as XLSX from "xlsx"
export const UseSAT = ( file : any, type: any, name: string | null ) => {
  let lines = file.split(/\r?\n|\r|\n/)
  let headers = lines[0].split('~')

  let arrayOfObjects = []
  for (let j = 1; j < lines.length; j++) {
    const object : any = {}
    let splittedLine = lines[j].split('~')
    for (let s = 0; s < splittedLine.length; s++) {
      if( type === 'gastos'){
        if(headers[s] == 'Uuid' || headers[s] == 'RfcReceptor' || headers[s] == 'NombreReceptor' || headers[s] == 'FechaCertificacionSat'){
          continue
        }
      } else if( type === 'ingresos'){
        if(headers[s] == 'Uuid' || headers[s] == 'RfcEmisor' || headers[s] == 'NombreEmisor'){
          continue
        }
      }
      if(headers[s] == 'EfectoComprobante'){
        switch (splittedLine[s]) {
          case 'I':
            splittedLine[s] = 'Ingreso'
            break;
          case 'P':
            splittedLine[s] = 'Pago'
          break;
          case 'N':
            splittedLine[s] = 'Nomina'
          break;
          default:
            splittedLine[s] = 'Sepa'
            break;
        }
      }
      if(headers[s] == 'Estatus'){
        switch (splittedLine[s]) {
          case '1':
            splittedLine[s] = 'Vigente'
            break;
          case '0':
            splittedLine[s] = 'Cancelado'
          break;
          default:
            splittedLine[s] = 'Sepa'
            break;
        }
      }
      if(headers[s] == 'Monto'){
        splittedLine[s] = parseInt(splittedLine[s])
      }
        object[`${headers[s]}`] = splittedLine[s]
    }
    arrayOfObjects.push(object)  
  }
  arrayOfObjects.pop()
  let total = 0;
  arrayOfObjects.forEach((element: any) => {
    if(typeof element.Monto === 'number' && element.Estatus === 'Vigente'){
      total += element.Monto
    }
  });
  arrayOfObjects.push({
    'Monto': total
  })
  
  const worksheet = XLSX.utils.json_to_sheet(arrayOfObjects);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, `${type}`);
  return XLSX.writeFile(workbook, `${type}${name}.xlsx`);
}