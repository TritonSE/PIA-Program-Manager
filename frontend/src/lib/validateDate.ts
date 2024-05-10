// Validates date in the form of MM/DD/YYYY
export function validateDate(date: string) {
  const dateArray = date.split("/");
  if (dateArray.length !== 3) {
    return false;
  }

  const [month, day, year] = dateArray.map((d) => parseInt(d, 10));

  if (isNaN(day) || isNaN(month) || isNaN(year)) {
    return false;
  }

  const checkDate = new Date(year, month - 1, day);

  return (
    checkDate.getFullYear() === year &&
    checkDate.getMonth() === month - 1 &&
    checkDate.getDate() === day
  );
}
