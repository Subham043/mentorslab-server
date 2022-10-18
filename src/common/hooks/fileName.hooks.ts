export const fileName = (originalName: string): string => {
  const name = originalName.split('.')[0];
  const fileExtName = originalName.split('.')[1];
  const randomName = Array(16)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join('');
  return `${name}-${randomName}.${fileExtName}`;
};
