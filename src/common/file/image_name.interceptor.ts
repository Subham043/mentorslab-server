export const editFileName = (
  req: any,
  file: { originalname: string },
  callback: (arg0: any, arg1: string) => void,
) => {
  const name = file.originalname.split('.')[0];
  const fileExtName = file.originalname.split('.')[1];
  const randomName = Array(16)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join('');
  callback(null, `${name}-${randomName}.${fileExtName}`);
};
