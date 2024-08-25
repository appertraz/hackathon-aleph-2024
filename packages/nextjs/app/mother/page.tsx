"use client";

import { useState } from "react";
import type { NextPage } from "next";
import { AddressInput } from "~~/components/scaffold-eth";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

function getFiles(callback: (name: string, hash: string) => void) {
  const input = document.createElement("input");
  input.setAttribute("type", "file");
  input.onchange = () => {
    if (input?.files?.[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = async () => {
        //
        // TODO: This should pass a ZK proof
        //
        if (reader.result) {
          if (!crypto || !crypto.subtle || typeof crypto.subtle.digest !== "function") {
            throw new Error("Web Cryptography API no está soportada en este navegador");
          }
          const digest = await crypto.subtle.digest(
            "SHA-256",
            typeof reader.result === "string" ? new TextEncoder().encode(reader.result) : reader.result,
          );
          const hash = Buffer.from(digest).toString("hex");
          callback(file.name, hash);
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };
  input.click();
}

const Home: NextPage = () => {
  const { writeContractAsync: writeControllerAsync } = useScaffoldWriteContract("Controller");
  const [address, setAddress] = useState("");
  const [filename, setFilename] = useState("");
  const [proof, setProof] = useState("");

  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center">
            <span className="block text-6xl mb-3 font-bold">Nueva Madre</span>
            <span className="block text-2xl mb-3">Agregar una nueva madre al sistema</span>
          </h1>
        </div>

        <div className="flex flex-col justify-center items-center flex-grow w-3/5 mt-8 mb-32 px-16">
          <p className="block tracking-wide text-grey-darker font-bold mb-2">Ingrese la billetera de la madre</p>
          <AddressInput onChange={setAddress} value={address} placeholder="Dirección" />

          <p className="block tracking-wide text-grey-darker font-bold mb-2">Cargue la partida de nacimiento</p>
          <button
            className="btn btn-primary w-60 truncate"
            onClick={async () => {
              try {
                getFiles((name: string, hash: string) => {
                  setFilename(name);
                  setProof(hash);
                });
              } catch (e) {
                console.error(e);
              }
            }}
          >
            {filename ? filename : "Elejir archivo"}
          </button>

          <button
            className="btn btn-primary mt-8 w-40"
            onClick={async () => {
              try {
                await writeControllerAsync({
                  functionName: "addWoman",
                  args: [address, proof],
                });
              } catch (e) {
                console.error(e);
              }
            }}
          >
            Cargar
          </button>
        </div>
      </div>
    </>
  );
};

export default Home;
