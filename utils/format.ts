export const getDbTimestamp = (ms?: number) =>
  new Date(ms || Date.now()).toISOString().replace("Z", "").replace("T", " ");

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

export const hexToRgb = (hex: string) => {
  let r: number = 0;
  let g: number = 0;
  let b: number = 0;

  if (hex.length === 4) {
    r = Number(`0x${hex[1]}${hex[1]}`);
    g = Number(`0x${hex[2]}${hex[2]}`);
    b = Number(`0x${hex[3]}${hex[3]}`);
  } else if (hex.length === 7) {
    r = Number(`0x${hex[1]}${hex[2]}`);
    g = Number(`0x${hex[3]}${hex[4]}`);
    b = Number(`0x${hex[5]}${hex[6]}`);
  }

  return [r, g, b];
};
export const blackOrWhiteFromBackground = (color: string, version: "hex" | "rgb") => {
  const [r, g, b] = version === "hex" ? hexToRgb(color) : color.split(/\D+/).slice(1, 4);

  const sum = Math.round((Number(r) * 299 + Number(g) * 587 + Number(b) * 114) / 1000);

  return sum > 128 ? "var(--darkBlack)" : "var(--white)";
};
