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

import homePageUK from "./ua/homePage.json";
import homePagePL from "./pl/homePage.json";
import homePageEN from "./en/homePage.json";

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
        homePage: homePageEN,
      },
      pl: {
        adminUser: adminUserPL,
        tabProfile: tabProfilePL,
        validation: validationPL,
        createRoom: createRoomPL,
        homePage: homePagePL,
      },
      uk: {
        adminUser: adminUserUK,
        tabProfile: tabProfileUK,
        validation: validationUK,
        createRoom: createRoomUK,
        homePage: homePageUK,
      },
    },
    fallbackLng: "en",
    ns: ["adminUser", "tabProfile", "validation", "createRoom", "homePage"],
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
