import React, { useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import EPFIntro from "./EPFIntro/EPFIntro";
import EPFDashboard from "./EPFDashboard/EPFDashboard";
import { fetchEpfSummary } from "../../services/apis/epf.service";
import {
  selectEpfSummary,
  selectHasEpfData,
} from "../../store/epf/epf.selectors";
import { setEpfSummary, clearEpfData } from "../../store/epf/epf.slice";

const EPFIndex = () => {
  const dispatch = useDispatch();
  const summaryData = useSelector(selectEpfSummary);
  const hasData = useSelector(selectHasEpfData);
  const [checkingApi, setCheckingApi] = useState(!hasData);

  useEffect(() => {
    // 1. If we already have cached data in Redux, DO NOT call API
    if (hasData) {
      setCheckingApi(false);
      return;
    }

    // 2. If Redux has NO data, check API in case data was uploaded from another device
    setCheckingApi(true);
    fetchEpfSummary()
      .then((res) => {
        if (
          res?.success &&
          res?.data &&
          (res.data.balance?.currentBalance != null ||
            (Array.isArray(res.data.accounts) && res.data.accounts.length > 0))
        ) {
          dispatch(setEpfSummary(res.data));
        } else {
          dispatch(clearEpfData());
        }
      })
      .catch(() => {
        dispatch(clearEpfData());
      })
      .finally(() => {
        setCheckingApi(false);
      });
  }, [hasData, dispatch]);

  // 1. Cached data present in Redux -> Instant Dashboard (No API call)
  if (hasData) {
    return <EPFDashboard />;
  }

  // 2. Checking API while no data in Redux -> Show skeleton shimmer
  if (checkingApi) {
    return <EPFDashboard />;
  }

  // 3. Checked and confirmed no data on backend -> Show Intro Screen
  return <EPFIntro />;
};

const EPFRoutes = () => {
  return (
    <Routes>
      <Route index element={<EPFIndex />} />
      <Route path="/" element={<EPFIndex />} />
      <Route path="/dashboard" element={<EPFIndex />} />
      <Route path="/intro" element={<EPFIndex />} />
      <Route path="*" element={<EPFIndex />} />
    </Routes>
  );
};

export default EPFRoutes;
