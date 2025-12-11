export const getExpiryDate = (expiryStr) => {
  if (!expiryStr) return null;

  // Clean input (VERY IMPORTANT)
  const clean = expiryStr.trim().toUpperCase();

  const now = new Date();

  switch (clean) {
    case "1H":
      now.setHours(now.getHours() + 1);
      break;
    case "1D":
      now.setDate(now.getDate() + 1);
      break;
    case "1M":
      now.setMonth(now.getMonth() + 1);
      break;
    case "1Y":
      now.setFullYear(now.getFullYear() + 1);
      break;
    default:
      throw new Error("Invalid expiry format. Use 1H, 1D, 1M, or 1Y");
  }

  return now;
};
