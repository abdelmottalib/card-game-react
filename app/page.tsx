'use client'
import { useState } from "react";
import FetchData from "./FetchData";

export default  function Home() {
  return (
    <div className="h-screen w-screen">
      <FetchData />
    </div>
  );
}

