import React, { ChangeEvent, useState } from "react";
import * as XLSX from "xlsx";
import "./App.css";
import Modal from "./Modal";

export interface IObj {
  IObjData: string[];
  checked: boolean;
}

function App() {
  const [data, setData] = useState<IObj[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [fileName, setFileName] = useState<string>("");
  const [dataCheck, setDataCheck] = useState<boolean>(false);
  const [selectCheck, setSelectCheck] = useState<boolean>(false);

  const processData = (dataString: string): void => {
    const dataStringLines = dataString.split(/\r\n|\n/);
    const headers = dataStringLines[0].split(
      /,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/
    );

    const list = [];

    for (let i = 1; i < dataStringLines.length; i++) {
      const row = dataStringLines[i].split(
        /,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/
      );
      if (row.length && row.length == headers.length) {
        let obj: IObj = {
          IObjData: [],
          checked: false,
        };

        for (let j = 0; j < headers.length; j++) {
          let cell = row[j];
          if (cell.length > 0) {
            if (cell[0] == '"') cell = cell.substring(1, cell.length - 1);
            if (cell[cell.length - 1] == '"')
              cell = cell.substring(cell.length - 2, 1);
            obj.IObjData.push(cell);
          }
        }
        if (Object.values(obj).filter((x) => x).length > 0) list.push(obj);
      }
    }

    setData(list);
    setColumns(headers);
    setDataCheck(true);
  };

  const handleFileUpload = (event: ChangeEvent): void => {
    setDataCheck(true);
    const target = event.target as HTMLInputElement;
    const file: File = (target.files as FileList)[0];

    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (evt: ProgressEvent<FileReader>) => {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: "binary" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_csv(ws);
        processData(data);
      };
      reader.readAsBinaryString(file);
    } else {
      resetState();
    }
  };

  const resetState = (): void => {
    setData([]);
    setColumns([]);
    setFileName("");
    setDataCheck(false);
    setSelectCheck(false);
  };

  const changeCheckedValue = (i: number): void => {
    let newData = [...data];
    newData[i].checked = !newData[i].checked;
    setData(newData);
  };

  const changeAllValue = (): void => {
    let newData = [...data];
    for (let i = 0; i < data.length; i++) {
      newData[i].checked = !selectCheck;
    }
    setData(newData);
  };

  const sendToMail = (): void => {
    let newData = data.filter((item) => item.checked === true);

    if (newData.length) {
      console.log(newData);
      alert("Data is printed to console.");

      /* Reset */
      resetState();
    } else {
      alert("No data selected please select data.");
    }
  };

  return (
    <Modal
      handleFileUpload={handleFileUpload}
      data={data}
      columns={columns}
      fileName={fileName}
      sendToMail={sendToMail}
      changeCheckedValue={changeCheckedValue}
      changeAllValue={changeAllValue}
      dataCheck={dataCheck}
      selectCheck={selectCheck}
      setSelectCheck={setSelectCheck}
    />
  );
}

export default App;
