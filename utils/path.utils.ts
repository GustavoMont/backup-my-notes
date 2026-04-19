export function getFileFolderPath(path: string) {
  const folders = path.split('/');
  folders.pop();
  return folders.join('/');
}

export function getFileNameFromPath(path: string) {
  const splitedPath = path.split('/');
  const fileNameWithExtension = splitedPath[splitedPath.length - 1];

  return fileNameWithExtension.replace(/\..*/g, '');
}
