import React, { useState, useEffect, useReducer } from "react";
import "./styles.css";
import styled from "styled-components";
import { mock } from "./mock_Files/mock.js";
import Table from "./components/Table";

const Styles = styled.div`
  padding: 1rem;

  table {
    border-spacing: 0;
    border: 1px solid black;

    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    th,
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;

      :last-child {
        border-right: 0;
      }
    }
  }
`;

const useObservable = (observable) => {
  const [state, setState] = useState([]);
  useEffect(() => {
    const sub = observable.subscribe((val) =>
      setState((oldVal) => [...oldVal, val].slice(0, 400))
    );
    return () => sub.unsubscribe();
  }, [observable]);

  return state;
};

function App() {
  const columns = React.useMemo(
    () => [
      {
        Header: "id",
        accessor: "id",
      },
      {
        Header: "assetName",
        accessor: "assetName",
      },

      {
        Header: "price",
        accessor: "price",
      },
      {
        Header: "lastUpdate",
        accessor: "lastUpdate",
      },
      {
        Header: "type",
        accessor: "type",
      },
    ],
    []
  );

  const tempserverData = useObservable(mock);
  const serverData = React.useMemo(() => tempserverData, [tempserverData]);
  //const data = React.useMemo(() => names, [names]);

  const [data, setData] = React.useState([]);

  const [loading, setLoading] = React.useState(false);
  const [pageCount, setPageCount] = React.useState(0);
  //const [pageIndex, setPageIndex] = React.useState(0);
  const fetchIdRef = React.useRef(0);

  const fetchData = React.useCallback(
    ({ pageSize, pageIndex }) => {
      // This will get called when the table needs new data
      // You could fetch your data from literally anywhere,
      // even a server. But for this example, we'll just fake it.

      // Give this fetch an ID
      const fetchId = ++fetchIdRef.current;

      // Set the loading state
      setLoading(true);

      // We'll even set a delay to simulate a server here
      //setTimeout(() => {
      // Only update the data if this is the latest fetch
      if (fetchId === fetchIdRef.current) {
        const startRow = pageSize * pageIndex;
        const endRow = startRow + pageSize;
        setData(serverData.slice(startRow, endRow));

        // Your server could send back total page count.
        // For now we'll just fake it, too
        setPageCount(Math.ceil(serverData.length / pageSize));
        //setPageIndex(pageIndex);

        setLoading(false);
      }
    },
    [serverData]
  );

  return (
    <div className="App">
      <h1>RxJS with React</h1>

      <Styles>
        <Table
          columns={columns}
          data={data}
          fetchData={fetchData}
          loading={loading}
          pageCount={pageCount}
          // getHeaderProps={(column) => ({
          //   onClick: () => alert("Header!")
          // })}
        />
      </Styles>
    </div>
  );
}

export default App;
