import { HttpException, HttpStatus } from '@nestjs/common';

export const imageFileFilter = (
  req: any,
  file: { originalname: string },
  callback: (arg0: Error, arg1: boolean) => void,
) => {
  if (req.type == 'PDF' && !file) {
    return callback(
      new HttpException('Image file is required', HttpStatus.BAD_REQUEST),
      false,
    );
  }
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return callback(
      new HttpException(
        'Only image files are allowed!',
        HttpStatus.UNSUPPORTED_MEDIA_TYPE,
      ),
      false,
    );
  }
  callback(null, true);
};
