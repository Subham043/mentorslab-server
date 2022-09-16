import { HttpException, HttpStatus } from '@nestjs/common';

export const imageFileFilter = (
  req: any,
  file: { originalname: string },
  callback: (arg0: Error, arg1: boolean) => void,
) => {
  if (req.type == 'PDF' && !file) {
    return callback(
      new HttpException('PDF file is required', HttpStatus.BAD_REQUEST),
      false,
    );
  }
  // if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
  if (!file.originalname.match(/\.(pdf)$/)) {
    return callback(
      new HttpException(
        'Only pdf files are allowed!',
        HttpStatus.UNSUPPORTED_MEDIA_TYPE,
      ),
      false,
    );
  }
  callback(null, true);
};
