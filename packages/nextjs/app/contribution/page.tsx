"use client";

import { useState } from "react";
import type { NextPage } from "next";
import { parseEther } from "viem";
import { EtherInput } from "~~/components/scaffold-eth";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

const Home: NextPage = () => {
  const { writeContractAsync: writeControllerAsync } = useScaffoldWriteContract("Controller");
  const [amount, setAmount] = useState("");

  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center">
            <span className="block text-6xl mb-3 font-bold">Aporte</span>
            <p className="block text-2xl mb-3">
              Con tu donación, no solamente recibís un NFT con beneficios,
              <br />
              sino que te también se convertís en un agente de cambio para las nuevas generaciones
            </p>
          </h1>
        </div>

        <div className="flex flex-col justify-center items-center flex-grow w-3/5 mt-6 mb-32 px-16">
          <p className="block tracking-wide text-grey-darker font-bold mb-2">Ingrese la cantidad de Matic a donar</p>
          <EtherInput value={amount} onChange={amount => setAmount(amount)} />
          <button
            className="btn btn-primary mt-4 w-40"
            onClick={async () => {
              try {
                await writeControllerAsync({
                  functionName: "deposit",
                  value: parseEther(amount),
                });
              } catch (e) {
                console.error(e);
              }
            }}
          >
            Donar
          </button>
        </div>
      </div>
    </>
  );
};

export default Home;
