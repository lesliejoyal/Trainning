const HOLIDAYS_2026 = [
  { id: 'h1',  date: '2026-01-01', name: "New Year's Day",      type: 'national' },
  { id: 'h2',  date: '2026-01-19', name: 'MLK Jr. Day',         type: 'national' },
  { id: 'h3',  date: '2026-02-16', name: "Presidents' Day",     type: 'national' },
  { id: 'h4',  date: '2026-05-25', name: 'Memorial Day',        type: 'national' },
  { id: 'h5',  date: '2026-07-04', name: 'Independence Day',    type: 'national' },
  { id: 'h6',  date: '2026-09-07', name: 'Labor Day',           type: 'national' },
  { id: 'h7',  date: '2026-10-12', name: 'Columbus Day',        type: 'national' },
  { id: 'h8',  date: '2026-11-11', name: 'Veterans Day',        type: 'national' },
  { id: 'h9',  date: '2026-11-26', name: 'Thanksgiving',        type: 'national' },
  { id: 'h10', date: '2026-12-25', name: 'Christmas Day',       type: 'national' },
  { id: 'h11', date: '2026-03-20', name: 'Company Foundation Day', type: 'company' },
  { id: 'h12', date: '2026-06-26', name: 'Annual Team Day',     type: 'company' },
  { id: 'h13', date: '2026-12-24', name: 'Christmas Eve (Half)', type: 'company' },
];

export const useHolidays = () => {
  const today = new Date();
  const upcoming = HOLIDAYS_2026.filter((h) => new Date(h.date) >= today)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  return { holidays: HOLIDAYS_2026, upcoming };
};
