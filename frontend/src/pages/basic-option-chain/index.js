import { useEffect, useMemo, useState } from "react";

const indexes = ["NIFTY", "BANKNIFTY", "FINNIFTY", "MIDCPNIFTY"];

function BasicOptionChain() {
  const [optionChain, setOptionChain] = useState({});
  const [spot, setSpot] = useState(0);

  const [totOI, setTotOI] = useState({});

  const [expiryDates, setExpiryDates] = useState([]);
  const [selectedExpiry, setSelectedExpiry] = useState("");

  const [index, setIndex] = useState(indexes[0]);

  const [reload, setReload] = useState(false);

  const handleReload = () => {
    setReload((re) => setReload(!re));
  };

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/option-chain/list?index=${index}`)
      .then(async (res) => {
        const response = await res.json();

        setOptionChain(response);
        setTotOI({
          CE: response.filtered.CE.totOI,
          PE: response.filtered.PE.totOI,
          PCR: (
            response.filtered.PE.totOI / response.filtered.CE.totOI
          ).toFixed(2),
        });
        setExpiryDates(response.records.expiryDates);
        setSelectedExpiry(response.records.expiryDates[0]);
        setSpot(response.records.underlyingValue);
      })
      .catch((err) => {
        console.log("Error ", err.message);
        // reloadPage();
      });
  }, [reload, index]);

  const selectedExpiryCH = useMemo(() => {
    return (
      optionChain?.records?.data?.filter(
        (stk) => stk.expiryDate === selectedExpiry
      ) ?? []
    );
  }, [optionChain?.records?.data, selectedExpiry]);

  console.log("option chain data ", optionChain);
  console.log("tot OI ", totOI);
  console.log("Selected Expiry Date ", selectedExpiry);
  console.log("selectedExpiryCH ", selectedExpiryCH);

  return (
    <div className="App">
      Total PCR: {totOI?.PCR} <br />
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
      <select
        onChange={(e) => {
          console.log(e.target);
          setIndex(e.target.value);
        }}
      >
        {indexes.map((ind) => (
          <option key={ind}>{ind}</option>
        ))}
      </select>
      <button onClick={handleReload}>refresh</button>
      <table border={1} cellPadding={5}>
        <thead
          style={{
            position: "sticky",
            top: "0px",
            backgroundColor: "rgb(58, 45, 125)",
          }}
        >
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

            <th></th>

            <th>LTP Diff</th>
            <th>Adjustment</th>
            <th>CHNG In OI Diff</th>
            <th>CHNG IN OI PCR</th>
            <th>PCR</th>
          </tr>
        </thead>
        <tbody>
          {selectedExpiryCH.map((stk) => {
            const diff = stk.strikePrice < spot;
            const adjustment = (
              stk.strikePrice -
              (spot - ((stk.CE?.lastPrice ?? 0) - (stk.PE?.lastPrice ?? 0)).toFixed(2))
            ).toFixed(2);

            const ceColor = diff ? { background: "rgb(241, 238, 217)" } : {};
            const peColor = !diff ? { background: "rgb(241, 238, 217)" } : {};

            const ceCHNGColor =
              (stk.CE?.changeinOpenInterest ?? 0) > 0
                ? { color: "green" }
                : { color: "red" };

            const peCHNGColor =
              (stk.PE?.changeinOpenInterest ?? 0) > 0
                ? { color: "green" }
                : { color: "red" };

            return (
              <tr key={stk.strikePrice}>
                <td style={ceColor}>{stk.CE?.openInterest}</td>
                <td style={{ ...ceColor, ...ceCHNGColor }}>
                  {stk.CE?.changeinOpenInterest}
                </td>
                <td style={ceColor}>{stk.CE?.lastPrice}</td>

                <td>{stk.strikePrice}</td>

                <td style={peColor}>{stk.PE?.lastPrice}</td>
                <td style={{ ...peColor, ...peCHNGColor }}>
                  {stk.PE?.changeinOpenInterest}
                </td>
                <td style={peColor}>{stk.PE?.openInterest}</td>

                <td></td>

                <td>{((stk.CE?.lastPrice ?? 0) - (stk?.PE?.lastPrice ?? 0)).toFixed(2)}</td>
                <td>{adjustment}</td>
                <td>
                  {(
                    (stk.CE?.changeinOpenInterest ?? 0) - (stk.PE?.changeinOpenInterest ?? 0)
                  ).toFixed(2)}
                </td>
                <td>
                  {(
                    (stk.PE?.changeinOpenInterest ?? 0) / (stk.CE?.changeinOpenInterest ?? 0)
                  ).toFixed(2)}
                </td>
                <td>
                  {((stk.PE?.openInterest ?? 0) / (stk.CE?.openInterest ?? 0)).toFixed(2)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default BasicOptionChain;
