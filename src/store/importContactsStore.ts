import type { DevicePhoneNumber } from "@/src/services/contacts";

type ImportedContactSelection = {
  name: string;
  phone: string;
};

type PendingPhoneChoice = {
  contactName: string;
  numbers: DevicePhoneNumber[];
};

let importedSelection: ImportedContactSelection | null = null;
let pendingPhoneChoice: PendingPhoneChoice | null = null;

export const importContactsStore = {
  setImportedSelection(selection: ImportedContactSelection) {
    importedSelection = selection;
  },
  consumeImportedSelection(): ImportedContactSelection | null {
    const value = importedSelection;
    importedSelection = null;
    return value;
  },
  setPendingPhoneChoice(choice: PendingPhoneChoice) {
    pendingPhoneChoice = choice;
  },
  getPendingPhoneChoice(): PendingPhoneChoice | null {
    return pendingPhoneChoice;
  },
  clearPendingPhoneChoice() {
    pendingPhoneChoice = null;
  },
};
