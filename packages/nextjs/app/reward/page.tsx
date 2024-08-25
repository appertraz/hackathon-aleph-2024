"use client";

import type { NextPage } from "next";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

const Home: NextPage = () => {
  const { writeContractAsync: writeControllerAsync } = useScaffoldWriteContract("Controller");

  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center">
            <span className="block text-6xl mb-3 font-bold">Incentivo</span>
            <span className="block text-2xl mb-3">Si cumpliste tus objetivos reclamá aquí tus incentivos</span>
          </h1>
        </div>

        <div className="flex flex-col justify-center items-center flex-grow w-3/5 mt-6 mb-32 px-16">
          <button
            className="btn btn-primary mt-8 w-100"
            onClick={async () => {
              try {
                await writeControllerAsync({
                  functionName: "withdraw",
                });
              } catch (e) {
                console.error(e);
              }
            }}
          >
            Enviar a la billetera el incentivo
          </button>
        </div>
      </div>
    </>
  );
};

export default Home;
