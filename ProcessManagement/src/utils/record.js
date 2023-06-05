export const isRecordValid = record => {
  const regex = /^\d{20}$/;
  return regex.test(record);
};

export const recordFilter = record => {
  const regex = /[^\d]/g;
  return record.replace(regex, '');
};

export const validateRecord = record => {
  const filtered = recordFilter(record);
  return {
    filtered,
    valid: isRecordValid(filtered),
  };
};
