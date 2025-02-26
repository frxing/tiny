import { homedir } from 'os'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

// 获取用户的根目录
export const userHomeDir = homedir();
// 获取配置文件路径
export const rootConfigPath = `${userHomeDir}/.tinyrc`;

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);

/**
 * @desc: 是否是图片
 * @return {*}boolean
 */
export const isImage = (file: string) => /\.(jpg|jpeg|png|gif|webp)$/i.test(file)

