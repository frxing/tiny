import { statSync, readdirSync } from 'fs'
import { resolve } from 'path'
import { exit } from 'process'
import getOutputPath from './output.mts'
import { isImage } from './index.mts'
import startCompress from './tiny.mts'
import log from './log.mts'

const compressDir =(dirPath?: string) => {
  const dirAllPath = resolve(
    process.cwd(),
    dirPath || './'
  );

  try {
    const dirStat = statSync(dirAllPath);
    if (dirStat.isDirectory()) {
      const dirInfos = readdirSync(dirAllPath)
      if (!dirInfos.length) return exit(1);
      const images: any = []
      dirInfos.forEach(file => {
        if (isImage(file)) {
          images.push(file)
        }
      })
      if (!images.length) return exit(1);
      let currIndex = 0;
      const destPath = getOutputPath(dirAllPath);
      const start = (filePath: string) => {
        startCompress({
          input: filePath,
          output: destPath,
          completed () {
            if (currIndex < images.length - 1) {
              currIndex++;
              start(images[currIndex]);
            } else {
              exit(1)
            }
          }
        })
      }
      start(images[currIndex]);
    } else {
      log.error('未找到该目录');
      exit(1);
    }
  } catch (e) {
    log.error('未找到该目录');
    exit(1);
  }
}

export default compressDir