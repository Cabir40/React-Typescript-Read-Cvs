import React, {
  ChangeEvent,
  ChangeEventHandler,
  MouseEventHandler,
} from "react";
import { useState } from "react";
import { Table } from "reactstrap";
import { IObj } from "./App";

interface IModalProps {
  handleFileUpload: ChangeEventHandler<HTMLInputElement>;
  data: IObj[];
  columns: string[];
  fileName: string;
  sendToMail: MouseEventHandler<HTMLButtonElement>;
  changeCheckedValue: Function;
  changeAllValue: Function;
  dataCheck: boolean;
  selectCheck: boolean;
  setSelectCheck: Function;
}

const Modal = ({
  handleFileUpload,
  data,
  columns,
  fileName,
  sendToMail,
  changeCheckedValue,
  changeAllValue,
  dataCheck,
  selectCheck,
  setSelectCheck,
}: IModalProps) => {
  const [NameIndex, setNameIndex] = useState<number>(0);
  const [MailIndex, setMailIndex] = useState<number>(1);

  const getNameIndex = (e: ChangeEvent) => {
    const target = e.target as HTMLInputElement;
    setNameIndex(Number(target.value));
  };

  const getMailIndex = (e: ChangeEvent) => {
    const target = e.target as HTMLInputElement;
    setMailIndex(Number(target.value));
  };

  return (
    <div className="modal-container">
      <input
        type="file"
        id="modal-input"
        className="modal-input"
        accept=".csv,.xlsx,.xls"
        onChange={handleFileUpload}
      />

      <button className="modal-button">
        <span className="modal-button-text">Choose</span>
        <span className="modal-button-icon">
          <label htmlFor="modal-input" className="modal-button-label">
            <i className="bi bi-file-earmark-arrow-up-fill"></i>
          </label>
        </span>
      </button>

      <span className="mb-4">{fileName ? fileName : "Not selected"}</span>

      {dataCheck && data.length ? (
        <>
          <div className="modal-table">
            <Table responsive dark hover>
              <thead>
                <tr>
                  <th>
                    #
                    <span className="badge bg-light text-dark ms-1">
                      {data.length}
                    </span>
                  </th>
                  <th>
                    <select
                      className="form-select form-select-sm"
                      onChange={getNameIndex}
                    >
                      {columns.map((item, i) => (
                        <option
                          value={i}
                          key={i}
                          style={{
                            display: item === columns[MailIndex] ? "none" : "",
                          }}
                        >
                          {item}
                        </option>
                      ))}
                    </select>
                  </th>

                  <th>
                    <select
                      className="form-select form-select-sm"
                      onChange={getMailIndex}
                      value={`${MailIndex}`}
                    >
                      {columns.map((item, i) => (
                        <option
                          value={i}
                          key={i}
                          style={{
                            display: item === columns[NameIndex] ? "none" : "",
                          }}
                        >
                          {item}
                        </option>
                      ))}
                    </select>
                  </th>

                  <th>
                    <label
                      className="form-check-label"
                      htmlFor="flexCheckDefault"
                    >
                      Select All
                    </label>
                    <input
                      className="form-check-input ms-2"
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
                      <td>{item.IObjData[NameIndex]}</td>
                      <td>{item.IObjData[MailIndex]}</td>
                      <td>
                        <input
                          className="form-check-input"
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
          </div>

          <div className="modal-button-2">
            <button className="btn btn-info" onClick={sendToMail}>
              Send Message
            </button>
          </div>
        </>
      ) : (
        <p>Please Choose File...</p>
      )}
    </div>
  );
};

export default Modal;
