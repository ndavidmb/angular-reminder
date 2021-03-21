export const cityName = [
  { name: 'Bogotá, Colombia.', id: '3688689' },
  { name: 'Medellín, Colombia.', id: '3674962' },
  { name: 'New York, United States', id: '5128581' },
  { name: 'London, United States', id: '4517009' },
];
export const monthsName = [
  { name: 'January', value: 0 },
  { name: 'February', value: 1 },
  { name: 'March', value: 2 },
  { name: 'April', value: 3 },
  { name: 'May', value: 4 },
  { name: 'June', value: 5 },
  { name: 'July', value: 6 },
  { name: 'August', value: 7 },
  { name: 'September', value: 8 },
  { name: 'October', value: 9 },
  { name: 'November', value: 10 },
  { name: 'December', value: 11 },
];

export const absoluteDate = (
  month: number = new Date().getMonth(),
  dayOfMonth: number = new Date().getDate()
) => {
  const date = new Date(2021, month, dayOfMonth);
  date.setHours(0);
  date.setMinutes(0);
  date.setSeconds(0);
  return date;
};
