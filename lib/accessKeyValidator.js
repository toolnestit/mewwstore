export const accessKeyValidate = (key) => {
  return key === process.env.ACCESS_KEY ? true : false;
};
