const validationForm = (formData) => {
  const errorList = [];

  if (!formData.title || formData.title.trim() === "") {
    errorList.push("validation.title.required");
  } else if (formData.title.trim().length < 3) {
    errorList.push("validation.title.minLength");
  }

  if (!formData.location || formData.location.trim() === "") {
    errorList.push("validation.location.required");
  }

  if (!formData.description || formData.description.trim() === "") {
    errorList.push("validation.description.required");
  } else if (formData.description.trim().length < 10) {
    errorList.push("validation.description.minLength");
  }

  if (!formData.type) {
    errorList.push("validation.type.required");
  }

  if (!Array.isArray(formData.places) || formData.places.length === 0) {
    errorList.push("validation.places.required");
  } else {
    formData.places.forEach((place) => {
      if (!place.description || place.description.trim() === "") {
        errorList.push(`validation.places.desc.required`);
      }
    });
  }

  if (!Array.isArray(formData.schedule) || formData.schedule.length === 0) {
    errorList.push("validation.schedule.required");
  } else {
    formData.schedule.forEach((item) => {
      if (!item.closed) {
        if (!item.from || item.from.trim() === "") {
          errorList.push(`validation.schedule.from.requiredDay ${item.day}`);
        }
        if (!item.to || item.to.trim() === "") {
          errorList.push(`validation.schedule.to.requiredDay ${item.day}`);
        }
        if (
          item.from &&
          item.to &&
          item.from.trim() !== "" &&
          item.to.trim() !== "" &&
          item.from >= item.to
        ) {
          errorList.push(`validation.schedule.timeOrderDay ${item.day}`);
        }
      }
    });
  }

  return errorList;
};

export { validationForm };
