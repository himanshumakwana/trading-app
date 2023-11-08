import { useEffect, useMemo, useState } from "react";

function App() {
  const [optionChain, setOptionChain] = useState({});
  const [spot, setSpot] = useState(0);

  const [totOI, setTotOI] = useState({});

  const [expiryDates, setExpiryDates] = useState([]);
  const [selectedExpiry, setSelectedExpiry] = useState("");

  const [reload, setReload] = useState(false);

  const reloadPage = () => {
    setTimeout(() => {
      setReload((re) => !re);
    }, 1000);
  };

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}?index=BANKNIFTY`)
      .then(async (res) => {
        const response = await res.json();

        setOptionChain(response);
        setTotOI({
          CE: response.filtered.CE.totOI,
          PE: response.filtered.PE.totOI,
          PCR: (
            response.filtered.CE.totOI / response.filtered.PE.totOI
          ).toFixed(2),
        });
        setExpiryDates(response.records.expiryDates);
        setSelectedExpiry(response.records.expiryDates[0]);
        setSpot(response.records.underlyingValue);
      })
      .catch((err) => {
        console.log("Error ", err.message);
        reloadPage();
      });
  }, [reload]);

  const selectedExpiryCH = useMemo(() => {
    return (
      optionChain?.records?.data?.filter(
        (stk) => stk.expiryDate === selectedExpiry
      ) ?? []
    );
  }, [selectedExpiry]);

  console.log("option chain data ", optionChain);
  console.log("tot OI ", totOI);
  console.log("Selected Expiry Date ", selectedExpiry);
  console.log("selectedExpiryCH ", selectedExpiryCH);

  return (
    <div className="App">
      Call total IO: {totOI?.PCR} <br />
      Spot: {spot} <br />
      <select
        onChange={(e) => {
          console.log(e.target);
          setSelectedExpiry(e.target.value);
        }}
      >
        {expiryDates.map((exp) => (
          <option key={exp}>{exp}</option>
        ))}
      </select>
      <table border={1} cellPadding={5}>
        <thead>
          <tr>
            <th colSpan={3}>Calls</th>
            <th>StrikePrice</th>
            <th colSpan={3}>Puts</th>
          </tr>
          <tr>
            <th>OI</th>
            <th>CHNG In OI</th>
            <th>LTP</th>
            <th>StrikePrice</th>
            <th>LTP</th>
            <th>CHNG In OI</th>
            <th>OI</th>
            <th>LTP Diff</th>
            <th>Adjustment</th>
            <th>CHNG In OI Diff</th>
          </tr>
        </thead>
        <tbody>
          {selectedExpiryCH.map((stk) => {
            const diff = stk.strikePrice < spot;
            const adjustment = (
              stk.strikePrice -
              (spot - (stk.CE.lastPrice - stk.PE.lastPrice).toFixed(2))
            ).toFixed(2);

            const ceColor = diff ? { background: "yellow" } : {};
            const peColor = !diff ? { background: "yellow" } : {};

            return (
              <tr key={stk.strikePrice}>
                <td style={ceColor}>{stk.CE.openInterest}</td>
                <td style={ceColor}>{stk.CE.changeinOpenInterest}</td>
                <td style={ceColor}>{stk.CE.lastPrice}</td>
                <td>{stk.strikePrice}</td>
                <td style={peColor}>{stk.PE.lastPrice}</td>
                <td style={peColor}>{stk.PE.changeinOpenInterest}</td>
                <td style={peColor}>{stk.PE.openInterest}</td>
                <td>{(stk.CE.lastPrice - stk.PE.lastPrice).toFixed(2)}</td>
                <td>{adjustment}</td>
                <td>
                  {(
                    stk.CE.changeinOpenInterest - stk.PE.changeinOpenInterest
                  ).toFixed(2)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default App;
