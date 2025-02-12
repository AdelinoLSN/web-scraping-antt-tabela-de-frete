const AXIS_ARRAY = [2, 3, 4, 5, 6, 7, 9];

class AnttLoadTable {
  #tables;

  constructor() {
    this.#tables = this.#getTables();
  }

  execute() {
    let data = {};
    for (let i = 0; i < this.#tables.length; i++) {
      const table = this.#tables[i];
      const identifier = this.#getIdentifier(table);
      data[identifier] = this.#getDataFromTable(table);
    }
    
    this.#outputDataFormatted(data);
  }

  #getTables() {
    const tables = document.querySelectorAll("table");
    return tables;
  }

  #getIdentifier(table) {
    const identifier = table.rows[0].cells[0].textContent?.split(' - ')?.[0].trim();
    return identifier;
  }

  #getDataFromTable(table) {
    const filteredRows = this.#getFilteredRows(table);

    const data = [];
    for (let i = 0; i < filteredRows.length; i+=2) {
      const rowOdd = filteredRows[i];
      const rowEven = filteredRows[i+1];

      if (rowOdd.cells.length != rowEven.cells.length) {
        throw new Error("Os números de colunas não são iguais nas linhas com dados");
      }

      const loadType = this.#getLoadType(rowOdd);
      const ccd = this.#getData(rowOdd);
      const cc = this.#getData(rowEven);

      data.push({
        loadType,
        ccd,
        cc
      });
    }

    return data;
  }

  #getFilteredRows(table) {
    const filteredRows = [];
    for (let i = 0; i < table.rows.length; i++) {
      const row = table.rows[i];
      if (i <= 2) {
        continue;
      } else {
        filteredRows.push(row);
      }
    }
    return filteredRows;
  }

  #getLoadType(row) {
    const loadType = row.cells[1].textContent?.trim();
    return this.#formatLoadType(loadType);
  }

  #formatLoadType(loadType) {
    loadType = loadType.toLowerCase();
    loadType = loadType.replace(/\s/g, "_");
    loadType = loadType.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    return loadType;
  }

  #getData(row) {
    const data = {};

    for (let i = 4; i < row.cells.length; i++) {
      const value = row.cells[i].textContent.trim();

      if (!value) {
        continue;
      }

      const valueAsNumber = Number(value.replace(".", "").replace(",", "."));

      if (isNaN(valueAsNumber)) {
        debugger;
        throw new Error("O valor não é um número");
      }

      data[AXIS_ARRAY[i-4]] = valueAsNumber;
    }

    return data;
  }

  #outputDataFormatted(data) {
    const outputData = this.#formatToOutput(data);

    const outputDataString = Object.keys(outputData).map((key) => {
      return JSON.stringify(outputData[key]);
    });

    console.log(outputDataString);
  }

  #formatToOutput(data) {
    let outputData = {};
    
    const tableIdentifiers = Object.keys(data);

    for (const tableIdentifier of tableIdentifiers) {
      const tableData = data[tableIdentifier];
      outputData[tableIdentifier] = this.#formatTableToObject(tableData);
    }

    return outputData;
  }

  #formatTableToObject(tableData) {
    let formatted = {};

    tableData.forEach((tableObject) => {
      const loadType = tableObject.loadType;
      const ccd = tableObject.ccd;
      const cc = tableObject.cc;
    
      formatted[loadType] = {
        cc,
        ccd,
      };
    });

    return formatted;
  }
}

(new AnttLoadTable()).execute();
