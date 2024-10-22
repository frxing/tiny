import { statSync } from 'fs'
import { resolve, dirname } from 'path'
import getOutputPath from './output'
import { exit } from 'process'
import startCompress from './tiny'
import { isImage } from '.'
import log from './log'

const compressFile = (file: string) => {
  const filePath = resolve(process.cwd(), file);
  try {
    const stat = statSync(filePath);
    const directoryPath = dirname(filePath)
    const outputPath = getOutputPath(directoryPath)

    if (stat.isFile() && isImage(filePath)) {
      startCompress({
        input: filePath,
        output: outputPath
      })
    } else {
      log.error('未找到该图片文件');
      exit(1);
    }
  } catch (e) {
    log.error('未找到该图片文件');
    exit(1);
  }

}

export default compressFile