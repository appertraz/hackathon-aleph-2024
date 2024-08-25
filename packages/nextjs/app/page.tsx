"use client";

import type { NextPage } from "next";

const Home: NextPage = () => {
  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center">
            <span className="block text-2xl mb-3 mt-9">Bienvenido a</span>
            <img src="/logo.png" className="h-50" />
            <span className="block text-2xl mb-3">La incubadora web3 de proyectos de vida</span>
            <span className="block text-1xl mb-3">enfocado en madres con hijos en la primera infancia</span>
          </h1>
        </div>
      </div>
    </>
  );
};

export default Home;
