export const pruneUnwantedFields = <T extends Record<string, unknown>>(object: T, unwantedFields: (keyof T)[]) => {
  const safeObject = { ...object };

  unwantedFields.forEach((fieldName) => {
    delete safeObject[fieldName];
  });

  return safeObject;
};
