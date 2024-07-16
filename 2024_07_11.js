const getJSONFromTable = (table) => {
  const getDataFromTable = (table) => {
    let data = [];
    for (let i = 0; i < table.rows.length; i++) {
      let row = table.rows[i];
      let rowData = [];
      for (let j = 0; j < row.cells.length; j++) {
        let cell = row.cells[j];
        rowData.push(cell.textContent);
      }
      data.push(rowData);
    }
    return data;
  };

  const convertDataToObject = (data) => {
    let result = [];
    for (let i = 0; i < data.length; i += 2) {
      let obj = {};
      let rowOdd = data[i];
      let rowEven = data[i + 1];
      obj.tipo_carga = rowOdd[1].trim();
      obj.ccd = {};
      obj.cc = {};
      const eixos = [2, 3, 4, 5, 6, 7, 9];
      for (let j = 0; j < eixos.length; j++) {
        const valor_ccd = rowOdd[j + 4].trim();
        const valor_cc = rowEven[j + 2].trim();
        if (!valor_ccd || !valor_cc) continue;
        obj.ccd[eixos[j]] = valor_ccd;
        obj.cc[eixos[j]] = valor_cc;
      }
      result.push(obj);
    }
    return result;
  };

  let tableData = getDataFromTable(table);
  tableData = tableData.slice(2);
  let tableObject = convertDataToObject(tableData);

  const formatarTipoCarga = (tipoCarga) => {
    tipoCarga = tipoCarga.toLowerCase();
    tipoCarga = tipoCarga.replace(/\s/g, "_");
    tipoCarga = tipoCarga.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    return tipoCarga;
  }

  const format_tableObject = (tableObject) => {
    let formatted = {};
    for (let i = 0; i < tableObject.length; i++) {
      let obj = tableObject[i];
      const tipoCarga = formatarTipoCarga(obj.tipo_carga);
      formatted[tipoCarga] = {
        "cc": obj.cc,
        "ccd": obj.ccd,
      };
    }
    return formatted;
  };

  const tableObjectToJSON = (object) => {
    return JSON.stringify(object, null);
  };

  console.log(tableObjectToJSON(format_tableObject(tableObject)));
};