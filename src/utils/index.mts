import { homedir } from 'os'
import {
  readFileSync,
  writeFileSync,
  existsSync
} from 'fs'
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import log from './log.mts'

// 获取用户的根目录
export const userHomeDir = homedir();
// 获取配置文件路径
export const rootConfigPath = `${userHomeDir}/.tyrc`;

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);

/**
 * @desc: 是否是图片
 * @return {*}boolean
 */
export const isImage = (file: string) => /\.(jpg|jpeg|png|gif|webp)$/i.test(file)

/**
 * @desc: 获取配置文件
 * @return {*}
 */
export const getConfig = () => {
  try {
    if (!existsSync(rootConfigPath)) {
      createConfig()
    }
    const config = JSON.parse(readFileSync(rootConfigPath, 'utf-8'));
    return config;
    return null
  } catch (e) {
    console.log('e', e)
  }
}

/**
 * @desc: 创建配置文件
 * @return {*}
 */
export const createConfig = () => {
  if (existsSync(rootConfigPath)) return;
  writeFileSync(rootConfigPath, JSON.stringify({
    "apiKeys": [],
    "outputDir": "dest",
    "currKeyIndex": 0,
    "clean": true,
    "fileName": 'fileName'
  }), 'utf-8');
}

/**
 * @desc: 增加apiKey
 * @param {string} key
 */
export const addKey = (key: string) => {
  const config = getConfig();
  if (config) {
    config.apiKeys.push(key);
    writeFileSync(rootConfigPath, JSON.stringify(config), 'utf-8');
  } else {
    writeFileSync(rootConfigPath, JSON.stringify({
      "apiKeys": [key],
      "outputDir": "dest",
      "currKeyIndex": 0,
      "clean": true,
      "fileName": 'fileName'
    }), 'utf-8');
  }
}

/**
 * @desc: 删除apiKey
 * @param {string} key
 */
export const removeKey = (key: string) => {
  const config = getConfig();
  if (config) {
    const apiKeys = config.apiKeys.filter((item:string) => item !== key);
    config.apiKeys = apiKeys;
    config.currKeyIndex = 0;
    writeFileSync(rootConfigPath, JSON.stringify(config), 'utf-8');
  } else {
    createConfig()
  }
}

/**
 * @desc: 更新apiKey
 * @return {*}
 */
export const updateKey = () => {
  const config = getConfig();
  if (config) {
    const { currKeyIndex, apiKeys } = config
    writeFileSync(
      rootConfigPath,
      JSON.stringify({
        ...config,
        currKeyIndex: +currKeyIndex >= apiKeys.length -1 ? 0 : +currKeyIndex + 1
    }), 'utf-8');
  } else {
    log.error('未找到apiKey');
  }
}

