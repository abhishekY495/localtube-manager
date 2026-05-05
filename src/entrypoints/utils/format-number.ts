export const formatNumber = (number: number) => {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 0,
  }).format(number);
};
