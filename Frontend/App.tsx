import React from "react";
import * as eva from "@eva-design/eva";
import { ApplicationProvider, Layout, Text } from "@ui-kitten/components";
import Login from "./src/views/login";
import { default as theme } from './custom-theme.json';// <-- Import app theme



export default () => (
  <ApplicationProvider {...eva} theme={{...eva.light, ...theme}}>
        <Layout style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>

    <Login />
    </Layout>
  </ApplicationProvider>
);
