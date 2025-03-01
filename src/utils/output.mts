import {
  existsSync,
  rmSync,
  mkdirSync
} from 'fs'
import { getConfig } from './yaml.mts';

/**
 * @desc: 递归判断路径
 * @return {*}
 * @param {string} path
 * @param {string} outputDir
 */
function searchDir (path: string, outputDir: string) {
  const defaultName = outputDir
  let dirIndex = 0
  function searchDirPath (dirName: string) {
    const destPath = path + `/${dirName}`;
    if (!existsSync(destPath)) return destPath
    return searchDirPath(`${defaultName}-${++dirIndex}`)
  }
  return searchDirPath(defaultName)
}

function getOutputPath (path: string) {
  const currentDir = path || process.cwd();
  const { out_dir, clean } = getConfig() || {}
  let destPath = currentDir + `/${out_dir || 'tiny'}`;
  // 判断当前目录是否存在，不存在创建后返回目录
  if (!existsSync(destPath)) {
    mkdirSync(destPath)
    return destPath
  }

  if (clean) {
    rmSync(destPath, { recursive: true, force: true });
    mkdirSync(destPath)
  } else {
    const output = searchDir(currentDir, out_dir)
    destPath = output
    mkdirSync(output)
  }

  return destPath;
}

export default getOutputPath