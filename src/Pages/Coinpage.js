import React, { useEffect, useState } from "react";
import { CryptoState } from "../CryptoContext";
import { SingleCoin } from "../config/api";
import { useParams } from "react-router-dom";
import { LinearProgress, Typography, makeStyles } from "@material-ui/core";
import axios from "axios";
import Coininfo from "../components/Coininfo";
import ReactHtmlParser from "react-html-parser";
import numberWithComamas from "../components/Banner/Carosule";

const Coinpage = () => {
  const { id } = useParams();
  const [coin, setcoin] = useState({});

  const { currency, symbol } = CryptoState();

  const fetchsinglecoin = async () => {
    const { data } = await axios.get(SingleCoin(id));
    console.log(data);
    setcoin(data);
  };

  useEffect(() => {
    fetchsinglecoin();
  }, [coin]);

  const useStyles = makeStyles((theme) => ({
    container: {
      display: "flex",
      [theme.breakpoints.down("md")]: {
        flexDirection: "column",
        alignItems: "center",
      },
    },
    sidebar: {
      width: "30%",
      [theme.breakpoints.down("md")]: {
        width: "100%",
      },
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      marginTop: 25,
      borderRight: "2px solid grey",
    },
    heading: {
      fontWeight: "bold",
      marginBottom: 20,
      fontFamily: "Montserrat",
    },
    description: {
      width: "100%",
      fontFamily: "Montserrat",
      padding: 25,
      paddingBottom: 15,
      paddingTop: 0,
      textAlign: "justify",
    },
    marketData: {
      alignSelf: "start",
      padding: 25,
      paddingTop: 10,
      width: "100%",
      [theme.breakpoints.down("md")]: {
        display: "flex",
        justifyContent: "space-around",
      },
      [theme.breakpoints.down("sm")]: {
        flexDirection: "column",
        alignItems: "center",
      },
      [theme.breakpoints.down("xs")]: {
        alignItems: "start",
      },
    },
  }));
  const classes = useStyles();

  if (!coin) return <LinearProgress style={{ backgroundColor: "gold" }} />;

  return (
    <div className={classes.container}>
      <div className={classes.sidebar}>
        <img
          src={coin?.image?.large}
          alt={coin?.name}
          height="200"
          style={{ marginBottom: 20 }}
        />
        <Typography variant="h3" className={classes.heading}>
          {coin?.name}
        </Typography>
        <Typography variant="subtitle1" className={classes.description}>
          {ReactHtmlParser(coin?.description?.en.split(".")[0])}.
        </Typography>
        <div className={classes.marketData}>
          <span style={{ display: "flex" }}>
            <Typography variant="h5" className={classes.heading}>
              Rank:
            </Typography>
            &nbsp; &nbsp;
            <Typography variant="h5" style={{ fontFamily: "Montserrat" }}>
              {coin?.market_cap_rank}
            </Typography>
          </span>
          <span style={{ display: "flex" }}>
            <Typography variant="h5" className={classes.heading}>
              Current Price:{" "}
            </Typography>
            &nbsp; &nbsp;
            <Typography variant="h5" style={{ fontFamily: "Montserrat" }}>
              {symbol}
              {numberWithComamas(coin?.market_data?.current_price[currency])}
            </Typography>
          </span>
          <span style={{ display: "flex" }}>
            <Typography variant="h5" className={classes.heading}>
              Market Cap:{" "}
            </Typography>
            &nbsp; &nbsp;
            <Typography variant="h5" style={{ fontFamily: "Montserrat" }}>
              {symbol}
              {""}
              {numberWithComamas(
                coin?.market_data?.market_cap[currency]
                  ?.tostring()
                  ?.slice(0, -6)
              )}
            </Typography>
          </span>
        </div>
      </div>

      <Coininfo coin={coin} />
    </div>
  );
};

export default Coinpage;
