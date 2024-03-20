import { useState } from "react";
import Navbar from "./components/Navbar";
import Grid from "./components/Grid";

function App() {
  return (
    <>
      <div>
        <Navbar />
      </div>
      <div>
        <Grid />
      </div>
    </>
  );
}

export default App;
