import { createContext, ReactNode, useEffect, useState } from "react";
import { uid } from "uid";
import { Save } from "../models/Save";

type SaveContextData = {
  saves: Array<Save>;
  createSave: (saveName: string, saveString: string) => void;
};

export const SaveContext = createContext({} as SaveContextData);

type SaveProviderProps = {
  children: ReactNode;
};

export function SaveProvider({ children }: SaveProviderProps) {
  const [saves, setSaves] = useState<Array<Save>>([]);

  function createSave(saveName: string, saveString: string) {
    const newSave = {
      uid: uid(),
      name: saveName,
      saveString,
    };

    const updatedSaves = [...saves, newSave];

    // Update both state and localStorage with the new saves list
    setSaves(updatedSaves);
    localStorage.setItem("saves", JSON.stringify(updatedSaves));
  }

  useEffect(() => {
    const storedSaves = localStorage.getItem("saves");
    if (storedSaves) {
      const tempSaves: Array<Save> = JSON.parse(storedSaves);
      setSaves(tempSaves);
    }
  }, []);

  return (
    <SaveContext.Provider value={{ saves, createSave }}>
      {children}
    </SaveContext.Provider>
  );
}
