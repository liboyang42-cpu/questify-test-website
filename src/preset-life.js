// 预制人生独立页入口 —— 直接挂载并自动打开阅读器
import { scriptCases } from './features/script-reader/presetLifeData.js';
import { openScriptReader } from './features/script-reader/ScriptReader.js';

const root = document.querySelector('#preset-life-root');
if (root) {
  // scriptCases[0] = 预制人生;容器内由 openScriptReader 注入唯一 [data-script-reader] 节点
  openScriptReader(root, scriptCases[0], { autoOpen: true });
}
