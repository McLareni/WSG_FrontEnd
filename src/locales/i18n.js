import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Імпорт перекладів
import adminUserEN from "./en/adminUser.json";
import tabProfileEN from "./en/tabProfile.json";
import adminUserPL from "./pl/adminUser.json";
import tabProfilePL from "./pl/tabProfile.json";
import adminUserUK from "./ua/adminUser.json";
import tabProfileUK from "./ua/tabProfile.json";

import validationEN from "./en/validation.json";
import validationUK from "./ua/validation.json";
import validationPL from "./pl/validation.json";

import createRoomEN from "./en/createRoom.json";
import createRoomPL from "./pl/createRoom.json";
import createRoomUK from "./ua/createRoom.json";

import reservationRoomEN from "./en/reservationRoom.json";
import reservationRoomPL from "./pl/reservationRoom.json";
import reservationRoomUK from "./ua/reservationRoom.json";

import validationNewPasswordEN from "./en/validationNewPasword.json";
import validationNewPasswordPL from "./pl/validationNewPasword.json";
import validationNewPasswordUK from "./ua/validationNewPasword.json";

import homePageUK from "./ua/homePage.json";
import homePagePL from "./pl/homePage.json";
import homePageEN from "./en/homePage.json";

import reservationTableEN from "./en/reservationTable.json";
import reservationTablePL from "./pl/reservationTable.json";
import reservationTableUK from "./ua/reservationTable.json";

import addNoteEN from "./en/addNote.json";
import addNotePL from "./pl/addNote.json";
import addNoteUK from "./ua/addNote.json";

import notePageEN from "./en/notePage.json";
import notePagePL from "./pl/notePage.json";
import notePageUK from "./ua/notePage.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        adminUser: adminUserEN,
        tabProfile: tabProfileEN,
        validation: validationEN,
        createRoom: createRoomEN,
        reservationRoom: reservationRoomEN,
        validationNewPassword: validationNewPasswordEN,
        homePage: homePageEN,
        reservationTable: reservationTableEN,
        addNote: addNoteEN,
        notePage: notePageEN,
      },
      pl: {
        adminUser: adminUserPL,
        tabProfile: tabProfilePL,
        validation: validationPL,
        createRoom: createRoomPL,
        reservationRoom: reservationRoomPL,
        validationNewPassword: validationNewPasswordPL,
        homePage: homePagePL,
        reservationTable: reservationTablePL,
        addNote: addNotePL,
        notePage: notePagePL,
      },
      uk: {
        adminUser: adminUserUK,
        tabProfile: tabProfileUK,
        validation: validationUK,
        createRoom: createRoomUK,
        reservationRoom: reservationRoomUK,
        validationNewPassword: validationNewPasswordUK,
        homePage: homePageUK,
        reservationTable: reservationTableUK,
        addNote: addNoteUK,
        notePage: notePageUK,
      },
    },
    fallbackLng: "en",
    ns: [
      "adminUser",
      "tabProfile",
      "validation",
      "createRoom",
      "homePage",
      "reservationTable",
    ],
    defaultNS: "adminUser",
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: [
        "querystring",
        "cookie",
        "localStorage",
        "sessionStorage",
        "navigator",
        "htmlTag",
      ],
      caches: ["cookie"],
    },
  });

export default i18n;
