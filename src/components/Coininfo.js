import React, { useEffect, useState } from "react";
import { CryptoState } from "../CryptoContext";
import { HistoricalChart } from "../config/api";
import axios from "axios";
import {
  CircularProgress,
  ThemeProvider,
  createTheme,
  makeStyles,
} from "@material-ui/core";
import { Line } from "react-chartjs-2";

import { chartDays } from "../config/data";
import Selectbutton from "./Selectbutton";

const Coininfo = (coin) => {
  const [historicdata, sethistoricdata] = useState();
  const { days, setdays } = useState(1);

  const { currency } = CryptoState();

  const fetchhistoricdata = async () => {
    const { data } = await axios.get(HistoricalChart(coin.id, days, currency));
    sethistoricdata(data.prices);
  };

  useEffect(() => {
    fetchhistoricdata();
  }, [currency, days]);

  const darktheme = createTheme({
    palette: {
      primary: {
        main: "#fff",
      },
      type: "dark",
    },
  });

  const useStyles = makeStyles((theme) => ({
    container: {
      width: "75%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      marginTop: 25,
      padding: 40,
      [theme.breakpoints.down("md")]: {
        width: "100%",
        marginTop: 0,
        padding: 20,
        paddingTop: 0,
      },
    },
  }));

  const classes = useStyles();

  return (
    <ThemeProvider theme={darktheme}>
      <div className={classes.container}>
        {!historicdata ? (
          <CircularProgress
            style={{ color: "gold" }}
            size={250}
            thickness={1}
          />
        ) : (
          <>
            <Line
              data={{
                labels: historicdata.map((coin) => {
                  let date = new Date(coin[0]);
                  let time =
                    date.getHours() > 12
                      ? `${date.getHours() - 12}:${date.getMinutes()}PM`
                      : `${date.getHours()}:${date.getMinutes()}A M`;

                  return days === 1 ? time : date.toLocaleDateString();
                }),

                datasets: [
                  {
                    data: historicdata.map((coin) => coin[1]),
                    label: `Price(Past${days}Days) in ${currency} `,
                    borderColor: "#EEBC1D",
                  },
                ],
              }}
              options={{
                elements: {
                  point: {
                    radius: 1,
                  },
                },
              }}
            />
            <div
              style={{
                display: "flex",
                marginTop: 20,
                justifyContent: "space-around",
                width: "100%",
              }}
            >
              {chartDays.map((day) => (
                <Selectbutton
                  key={day.value}
                  onClick={() => setdays(day.value)}
                  selected={day.value === days}
                >
                  {day.label}
                </Selectbutton>
              ))}
            </div>
          </>
        )}
      </div>
    </ThemeProvider>
  );
};

export default Coininfo;
