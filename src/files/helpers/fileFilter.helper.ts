const allowedExtensions = ['jpg', 'jpeg', 'png'];

export const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  callback: (error: Error, acceptFile: boolean) => void,
) => {
  if (!file) return callback(new Error('No file provided'), false);

  const fileExtension = file.mimetype.split('/')[1];

  if (!allowedExtensions.includes(fileExtension))
    return callback(new Error('Invalid file type'), false);
};
