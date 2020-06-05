import { GoogleApiWrapper } from "google-maps-react";
import HomeContainer from "./HomeContainer";

export default GoogleApiWrapper({
  apiKey: process.env.REACT_APP_MAPS_API_KEY || "",
})(HomeContainer);
