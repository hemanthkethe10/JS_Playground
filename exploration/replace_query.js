const basePath = "20th-may-2025Share_Point-S3Aws/Documents/`Backflipt=_2-.!@#$%^&()[]{};''-Rename";
const escapedPath = basePath
  .replace(/\\/g, '\\\\')  // Escape backslashes
  .replace(/\./g, '\\.')   // Escape dots
  .replace(/\^/g, '\\^')   // Escape caret
  .replace(/\$/g, '\\$')   // Escape dollar sign
  .replace(/\(/g, '\\(')   // Escape opening parenthesis
  .replace(/\)/g, '\\)')   // Escape closing parenthesis
  .replace(/\[/g, '\\[')   // Escape opening square bracket
  .replace(/\]/g, '\\]')   // Escape closing square bracket
  .replace(/\{/g, '\\{')   // Escape opening curly brace
  .replace(/\}/g, '\\}')   // Escape closing curly brace
  .replace(/\|/g, '\\|');  // Escape pipe

const query = `
  SELECT *
  FROM public.cust_synced_files
  WHERE source_path ~ ('^' || '${escapedPath}');
`;

console.log(query);
