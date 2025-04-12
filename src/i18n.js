import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          // Загальні тексти
          welcome: "Welcome to WorkRoom",
          loginPrompt: "Enter your email and password to log in",
          pleaseFillOutForm: "Please fill out the form",
          
          // Поля форми
          email: "Email",
          password: "Password",
          firstName: "First Name",
          lastName: "Last Name",
          albumNumber: "Album Number",
          confirmPassword: "Confirm Password",
          
          // Кнопки та посилання
          submit: "Submit",
          login: "Login",
          registration: "Register",
          iAmTeacher: "I am teacher",
          uploadFile: "Upload File",
          
          // Повідомлення
          noAccount: "Don't have an account?",
          alreadyHaveAccount: "Already have an account?",
          passwordsNotMatch: "Passwords do not match",
          
          // Валідація
          passwordRequired: "Password is required",
          emailRequired: "Email is required",
          invalidEmail: "Please enter a valid email",
          passwordTooShort: "Password must be at least 6 characters",
          firstNameTooShort: "First name must be at least 2 characters",
          lastNameTooShort: "Last name must be at least 2 characters",
          albumNumberTooShort: "Album number must be at least 5 digits",
          firstNameInvalidChars: "First name cannot contain special characters",
          lastNameInvalidChars: "Last name cannot contain special characters",
          albumNumberOnlyDigits: "Album number must contain only digits"
        }
      },
      pl: {
        translation: {
          // Загальні тексти
          welcome: "Witamy w WorkRoom",
          loginPrompt: "Wpisz swój adres e-mail i hasło, aby się zalogować",
          pleaseFillOutForm: "Proszę wypełnić formularz",
          
          // Поля форми
          email: "E-mail",
          password: "Hasło",
          firstName: "Imię",
          lastName: "Nazwisko",
          albumNumber: "Numer albumu",
          confirmPassword: "Powtórz hasło",
          
          // Кнопки та посилання
          submit: "Zatwierdź",
          login: "Zaloguj się",
          registration: "Zarejestruj się",
          iAmTeacher: "Jestem nauczycielem",
          uploadFile: "Załaduj plik",
          
          // Повідомлення
          noAccount: "Nie masz konta?",
          alreadyHaveAccount: "Masz już konto?",
          passwordsNotMatch: "Hasła nie są identyczne",
          
          // Валідація
          passwordRequired: "Hasło jest wymagane",
          emailRequired: "Email jest wymagany",
          invalidEmail: "Wprowadź poprawny email",
          passwordTooShort: "Hasło musi zawierać co najmniej 6 znaków",
          firstNameTooShort: "Imię musi mieć co najmniej 2 znaki",
          lastNameTooShort: "Nazwisko musi mieć co najmniej 2 znaki",
          albumNumberTooShort: "Numer albumu musi mieć co najmniej 5 cyfr",
          firstNameInvalidChars: "Imię nie może zawierać znaków specjalnych",
          lastNameInvalidChars: "Nazwisko nie może zawierać znaków specjalnych",
          albumNumberOnlyDigits: "Numer albumu może zawierać tylko cyfry"
        }
      },
      uk: {
        translation: {
          // Загальні тексти
          welcome: "Ласкаво просимо до WorkRoom",
          loginPrompt: "Введіть ваш email та пароль для входу",
          pleaseFillOutForm: "Будь ласка, заповніть форму",
          
          // Поля форми
          email: "Email",
          password: "Пароль",
          firstName: "Ім'я",
          lastName: "Прізвище",
          albumNumber: "Номер альбому",
          confirmPassword: "Підтвердіть пароль",
          
          // Кнопки та посилання
          submit: "Підтвердити",
          login: "Увійти",
          registration: "Зареєструватися",
          iAmTeacher: "Я є викладач",
          uploadFile: "Завантажити файл",
          
          // Повідомлення
          noAccount: "Немає акаунту?",
          alreadyHaveAccount: "Маєте акаунт?",
          passwordsNotMatch: "Паролі не співпадають",
          
          // Валідація
          passwordRequired: "Пароль обов'язковий",
          emailRequired: "Email обов'язковий",
          invalidEmail: "Будь ласка, введіть коректний email",
          passwordTooShort: "Пароль повинен містити не менше 6 символів",
          firstNameTooShort: "Ім'я має містити щонайменше 2 символи",
          lastNameTooShort: "Прізвище має містити щонайменше 2 символи",
          albumNumberTooShort: "Номер альбому має містити щонайменше 5 цифр",
          firstNameInvalidChars: "Ім'я не може містити спеціальних символів",
          lastNameInvalidChars: "Прізвище не може містити спеціальних символів",
          albumNumberOnlyDigits: "Номер альбому повинен містити лише цифри"
        }
      }
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['querystring', 'cookie', 'localStorage', 'sessionStorage', 'navigator', 'htmlTag'],
      caches: ['cookie']
    }
  });

export default i18n;