import { useState, useEffect } from "react";
import "./App.css";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import axios from "axios";
import RoughLocations from "./RoughLocations";
import { FormControl, InputLabel, MenuItem } from "@mui/material";
import { SubscribeResponse } from "./models/subscribe.response";
import { LOCAL_STORAGE } from "./constants";

const baseUrl = import.meta.env.VITE_BASE_URL;

function App() {
  const [isExactLocationPermitted, setIsExactLocationPermitted] =
    useState(false);
  const [exactLocation, setExactLocation] = useState({} as Object);
  const [isErrorGetExactLocation, setIsErrorGetExactLocation] = useState(false);
  const [hasUserSubscribed, setHasUserSubscribed] = useState(false);
  const [isGridDirty, setIsGridDirty] = useState(false);

  const getStorage = () => {
    const userSubscribed = window.localStorage.getItem(LOCAL_STORAGE.SUBSCRIBED);
    if (userSubscribed) setHasUserSubscribed(JSON.parse(userSubscribed));

    const gridStatus = window.localStorage.getItem(LOCAL_STORAGE.GRID_STATUS);
    if (gridStatus) setIsGridDirty(JSON.parse(gridStatus));

  };

  const setStorage = (userSubscribed: boolean, gridStatus: boolean) => {
    window.localStorage.setItem(LOCAL_STORAGE.SUBSCRIBED, JSON.stringify(userSubscribed));
    window.localStorage.setItem(LOCAL_STORAGE.GRID_STATUS, JSON.stringify(gridStatus));
  };

  useEffect(() => {
    getStorage();
  }, []);

  useEffect(() => {
    setStorage(hasUserSubscribed, isGridDirty);
  }, [hasUserSubscribed, isGridDirty]);

  const handleChange = (event: any) => {
    setExactLocation({});
    setIsExactLocationPermitted(event.target.checked);
    if (event.target.checked) getExactLocation();
    else setExactLocation({});
  };

  const handleDropdownChange = (event: any) => {
    const selectedRoughLocation = RoughLocations.locations.find((location) => {
      return location.RegionName == event.target.value;
    });
    setExactLocation({
      latitude: Number(selectedRoughLocation?.latitude),
      longitude: Number(selectedRoughLocation?.longitude),
    });
  };

  const getExactLocation = () => {
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
  };

  const onSuccess = (position: any) => {
    const { latitude, longitude } = position.coords;
    setExactLocation({ latitude, longitude });
  };

  const onError = () => {
    setIsExactLocationPermitted(false);
    setIsErrorGetExactLocation(true);
  };

  const postSubscribe = async () => {
    if ("serviceWorker" in navigator) {
      console.log("yes");
      let sw = await navigator.serviceWorker.register("/sw.js");
      console.log(sw);
    }

    console.log("posting..");

    let sw = await navigator.serviceWorker.ready;
    console.log("ready sw");
    console.log(sw);

    let push = await sw.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: import.meta.env.VITE_APPLICATION_SERVER_KEY,
    });
    console.log(JSON.stringify(push));

    const postBody = {
      ...exactLocation,
      subscription: push,
    };
    axios
      .post(`${baseUrl}/api/v1/subscribe`, postBody)
      .then((response) => {
        const data = response.data as SubscribeResponse;
        setIsGridDirty(data?.isGridDirty);
        setHasUserSubscribed(true);
      })
      .catch((error) => console.log);
  };

  const unsubscribe = async () => {
    let sw = await navigator.serviceWorker.ready;
    let push = await sw.pushManager.getSubscription();

    if (push) await push.unsubscribe().then(() => {
      window.localStorage.removeItem(LOCAL_STORAGE.SUBSCRIBED);
      window.localStorage.removeItem(LOCAL_STORAGE.GRID_STATUS);
      window.location.reload();
    }).catch((error) => console.error("Failed to Unsubcribe", error))
  };

  const triggerTestNotification = () => {
    axios.get(`${baseUrl}/notification`);
  }


  return (
    <div className="App">
      <div className="split left">
        <div className="centered">
          <h1>Reduce Your Carbon Emissions by clicking Subscribe!</h1>
          <p>
            Based on your location, we can notify you when to switch to battery
            in order to lower the carbon emissions of your laptop usage!
          </p>
        </div>
      </div>
      <div className="split right">
        {(!hasUserSubscribed && (
          <div className="centered">
            For best results, share your location and wait for notifications!
            <br />
            <br />
            <FormControlLabel
              control={
                <Checkbox
                  checked={isExactLocationPermitted}
                  color="primary"
                  onChange={handleChange}
                />
              }
              disabled={isErrorGetExactLocation}
              label="Share my exact location"
            />
            <br />
            {!isExactLocationPermitted && (
              <div>
                <p>Otherwise, kindly provide the location nearest to you:</p>
                <FormControl fullWidth>
                  <InputLabel>Select Region</InputLabel>
                  <Select
                    autoWidth
                    onChange={handleDropdownChange}
                    label="Select Region"
                  >
                    {RoughLocations.locations
                      .sort((locationA, locationB) => {
                        if (locationA.RegionName > locationB.RegionName)
                          return 1;
                        else if (locationA.RegionName < locationB.RegionName)
                          return -1;
                        else return 0;
                      })
                      .map((location) => (
                        <MenuItem value={location.RegionName}>
                          {location.RegionName}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </div>
            )}
            <br />
            {
              <Button
                disabled={!!!Object.entries(exactLocation).length}
                onClick={postSubscribe}
              >
                Subscribe
              </Button>
            }
          </div>
        )) || (
          <div className="centered">
            <p>You've subscribed successfully!</p>
            <a className="test-notification" onClick={triggerTestNotification}>Click here to test your notification</a>
            <p>Grid Status Upon Subscription:</p>
            {(isGridDirty && (
              <div>
                <h2>&#128738; DIRTY</h2>
                <p>
                  Switch to battery mode to reduce your carbon emissions and
                  watch for our notification to know when the grid is clean
                  enough to use power
                </p>
              </div>
            )) || (
              <div>
                <h2>
                  <span className="globe">&#127758;</span> CLEAN
                </h2>
                <p>
                  <p>
                    You can continue using your power adapter but watch for our
                    notification to know if the grid is dirty so that you can
                    switch to battery mode
                  </p>
                </p>
              </div>
            )}
            <div>
                  <p>
                    <p>
                      If you no longer wish to receive notications, click unsubscribe below.
                      Though we could surely use your help in reducing carbon emissions &#128557;. 
                    </p>
                  </p>
                  <Button onClick={unsubscribe}>Unsubscribe</Button>
                </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
