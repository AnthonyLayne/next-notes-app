// recieves an index, array and options{}
export const getCircularIndex = (index: number, array: unknown[], option: { asc: boolean }) => {
  // index + 1 mod array length: 2 + 1 = 3 % 4 = move to index 3
  if (option.asc) return (index + 1) % array.length;
  // index plus array length -1 mod array length
  // 2 + 4 -1 = 5, 5 % 4 = 1, so if at index 2 move to index 1
  return (index + array.length - 1) % array.length;
};
