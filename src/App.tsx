import React, { ChangeEvent, useState } from "react";
import DataTable from "react-data-table-component";
import { Table } from "reactstrap";
import * as XLSX from "xlsx";
import "./App.css";

interface IData {
  name: string;
  selector: string;
}

interface IObj {
  name: string;
  selector: string;
  checked: boolean;
}

function App() {
  const [data, setData] = useState<IObj[]>([]);
  const [columns, setColumns] = useState<IData[]>([]);
  const [dataCheck, setDataCheck] = useState<Boolean>(false);
  const [selectCheck, setSelectCheck] = useState<boolean>(false);

  const processData = (dataString: string) => {
    const dataStringLines = dataString.split(/\r\n|\n/);
    const headers = dataStringLines[0].split(
      /,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/
    );

    const list = [];
    for (let i = 1; i < dataStringLines.length; i++) {
      const row = dataStringLines[i].split(
        /,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/
      );
      if (headers && row.length == headers.length) {
        let obj: IObj = {
          name: "",
          selector: "",
          checked: false,
        };
        let nameCheck = false,
          emailCheck = false;
        for (let j = 0; j < headers.length; j++) {
          let d = row[j];
          if (d.length > 0) {
            if (d[0] == '"') d = d.substring(1, d.length - 1);
            if (d[d.length - 1] == '"') d = d.substring(d.length - 2, 1);
          }

          if (headers[j].toLowerCase() === "name") {
            obj.name = d;
            nameCheck = true;
          } else if (headers[j].toLowerCase() === "email") {
            obj.selector = d;
            emailCheck = true;
          }
        }
        if (Object.values(obj).filter((x) => x).length > 0) list.push(obj);
        if (!nameCheck || !emailCheck) setDataCheck(false);
      }
    }

    const columns = headers.map((c) => ({
      name: c,
      selector: c,
    }));

    setData(list);
    setColumns(columns);
  };

  const handleFileUpload = (event: ChangeEvent): void => {
    setDataCheck(true);
    const target = event.target as HTMLInputElement;
    const file: File = (target.files as FileList)[0];

    if (file) {
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
    } else setDataCheck(false);
  };

  const changeCheckedValue = (i: number) => {
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

  const sendToMail = () => {
    alert("Mail'ler Gönderilcektir.");
    let newData = data.filter((item) => item.checked === true);
    /* mail gönderilevek kişiler = data */
    console.log(newData);
    setData([]);
    setColumns([]);
    setDataCheck(false);
    setSelectCheck(false);
  };
  return (
    <div className="jfSign_multi_modal-container">
      <input
        type="file"
        id="jfSign_multi_modal-input"
        className="jfSign_multi_modal-input"
        accept=".csv,.xlsx,.xls"
        onChange={handleFileUpload}
      />

      <button className="jfSign_multi_modal-button">
        <span className="jfSign_multi_modal-button-text">Choose</span>
        <span className="jfSign_multi_modal-button-icon">
          <label
            htmlFor="jfSign_multi_modal-input"
            className="jfSign_multi_modal-button-label"
          >
            <i className="bi bi-file-earmark-arrow-up-fill"></i>
          </label>
        </span>
      </button>

      {dataCheck && data.length ? (
        <div>
          <Table dark>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>
                  Select All &nbsp;
                  <input
                    type="checkbox"
                    checked={selectCheck}
                    onChange={(e) => {
                      changeAllValue();
                      setSelectCheck(e.target.checked);
                    }}
                  />
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, i) => {
                return (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>{item.name}</td>
                    <td>{item.selector}</td>
                    <td>
                      <input
                        type="checkbox"
                        checked={item.checked}
                        onChange={() => changeCheckedValue(i)}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot></tfoot>
          </Table>

          <div className="text-end">
            <button className="btn btn-info" onClick={sendToMail}>
              Send Message
            </button>
          </div>
        </div>
      ) : (
        <div>
          {columns.length ? (
            <p>
              Name and mail values ​​could not be found in the file you
              selected. please try a different file
            </p>
          ) : (
            <p>Please Choose File...</p>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
