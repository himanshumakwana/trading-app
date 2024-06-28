import { useEffect, useState } from 'react';
import { LineChart } from '@mui/x-charts/LineChart';

const OptionChart = () => {
  const [data, setData] = useState({})

  useEffect(() => {
    const info = {
      strike_price: "23900",
      expiry_dates: "27-Jun-2024",
    }

    fetch(`${process.env.REACT_APP_API_URL}option-chain/chart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(info)
    })
      .then(res => res.json())
      .then(res => {
        const response = res[info.expiry_dates][info.strike_price]

        const ce = [];
        const pe = [];

        // TODO
        const ce_chng_oi = [];
        const pe_chng_oi = [];

        const time = [];

        for (const stk of response) {
          time.push(stk.created_at)

          ce.push(stk.ce_ltp && stk.ce_ltp > 0 ? stk.ce_ltp : 0)
          pe.push(stk.pe_ltp && stk.pe_ltp > 0 ? stk.pe_ltp : 0)

        }

        setData(e => ({ xAxisData: time, series: [{ data: ce }, { data: pe }] }))
      })
  })

  // console.log(data)

  return (
    <>
      {/* <LineChart
        series={[
          { curve: "linear", data: [0, 5, 2, 6, 3, 9.3] },
          { curve: "linear", data: [6, 3, 7, 9.5, 4, 2] },
        ]}
        xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
        height={500}
      /> */}

      {
        data.series &&
        <LineChart
          xAxis={[{ data: data.xAxisData, scaleType: "band" }]}
          series={data.series}
          // width={500}
          height={300}
        />
      }

    </>
  );
}

export default OptionChart;