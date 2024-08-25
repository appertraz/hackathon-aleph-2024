"use client";

import { useState } from "react";
import type { NextPage } from "next";
import Select from "react-select";
import { AddressInput } from "~~/components/scaffold-eth";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

// TODO: This should have an interface to be added,
//       is hardcoded in the deploy of the smart contract
const options = [
  { value: "0", label: "Capacitación 1" },
  { value: "1", label: "Capacitación 2" },
  { value: "2", label: "Capacitación 3" },
  { value: "3", label: "Capacitación 4" },
  { value: "4", label: "Capacitación 5" },
];

const Page: NextPage = () => {
  const { writeContractAsync: writeControllerAsync } = useScaffoldWriteContract("Controller");

  const [training, setTraining] = useState("0");
  const [address, setAddress] = useState("");

  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center">
            <span className="block text-6xl mb-3 font-bold">Aprobar</span>
            <span className="block text-2xl mb-3">Una vez realizada una capacitación debe aprobarse</span>
          </h1>
        </div>

        <div className="flex flex-col justify-center items-center flex-grow w-3/5 mt-6 mb-6 px-16">
          <p className="block tracking-wide text-grey-darker font-bold mb-2">Seleccione la capacitación</p>
          <Select
            className="w-60"
            options={options}
            defaultValue={options[0]}
            onChange={e => setTraining(e?.value || "0")}
          />

          <p className="block tracking-wide text-grey-darker font-bold mb-2">Ingrese la billetera de la madre</p>
          <AddressInput onChange={setAddress} value={address} placeholder="Dirección" />

          <button
            className="btn btn-primary mt-8 w-40"
            onClick={async () => {
              try {
                await writeControllerAsync({
                  functionName: "approvedTraining",
                  args: [address, BigInt(training)],
                });
              } catch (e) {
                console.error(e);
              }
            }}
          >
            Guardar
          </button>
        </div>
      </div>
    </>
  );
};

export default Page;
