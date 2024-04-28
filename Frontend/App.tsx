import React, { useEffect } from "react";
import * as eva from "@eva-design/eva";
import { AppNavigator } from "./src/components/navigation";
import {
  ApplicationProvider,
  Layout,
  IconRegistry,
} from "@ui-kitten/components";
import Login from "./src/views/login";
import { default as theme } from "./custom-theme.json"; // <-- Import app theme
import { EvaIconsPack } from "@ui-kitten/eva-icons";
import { GoogleSignin } from '@react-native-google-signin/google-signin';




export default () => (
  
  <>
    <IconRegistry icons={EvaIconsPack} />
    <ApplicationProvider {...eva} theme={{ ...eva.light, ...theme }}>
      <AppNavigator />
    </ApplicationProvider>
  </>
);
