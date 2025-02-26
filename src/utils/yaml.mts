import { readFileSync, writeFileSync, existsSync } from 'fs';
import {parseDocument, stringify} from 'yaml';
import {rootConfigPath} from './index.mts';
import configTemplate from './config.yaml?raw';

export const writeYamlFile = (data: string) => {
  const doc = parseDocument(data);
  writeFileSync(rootConfigPath, doc.toString(), 'utf-8');
}

export const createYamlFile = () => {
  if (existsSync(rootConfigPath)) return;
  writeYamlFile(configTemplate);
}

export const getConfig = () => {
  if (!existsSync(rootConfigPath)) {
    createYamlFile();
  }
  const configContent = readFileSync(rootConfigPath, 'utf-8');
  const doc = parseDocument(configContent);
  return doc.toJSON();
}

export const addKey = (key: string) => {
  const configContent = getConfig();
  configContent.api_keys.push(key)
  writeYamlFile(stringify(configContent));
}

export const removeKey = (key: string) => {
  const configContent = getConfig();
  configContent.api_keys = configContent.api_keys.filter((k: string) => k !== key);
  writeYamlFile(stringify(configContent));
}

export const updateKey = () => {
  const configContent = getConfig();
  const keyLength = configContent.api_keys.length;
  if (keyLength === 0) return;
  configContent.key_index = (configContent.key_index + 1) % keyLength;
  writeYamlFile(stringify(configContent));
}