export const pruneUnwantedFields = <T extends Record<string, unknown>>(object: T, unwantedFields: (keyof T)[]) => {
  const safeObject = { ...object };

  unwantedFields.forEach((fieldName) => {
    delete safeObject[fieldName];
  });

  return safeObject;
};

export const validateFields = <T extends Record<string, unknown>>(
  object: T,
  validationFields: (keyof T)[],
  opts: { allowEmptyString: boolean; allowPartial: boolean }
) => {
  const missingFields = validationFields.filter(
    (fieldName) =>
      object[fieldName] === undefined ||
      object[fieldName] === null ||
      (opts.allowEmptyString ? false : object[fieldName] === "")
  );

  return {
    valid: opts.allowPartial ? missingFields.length < validationFields.length : !missingFields.length,
    missingFields,
  };
};
