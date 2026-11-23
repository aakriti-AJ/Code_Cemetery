const fs=require('fs'),ts=require('typescript'),vm=require('vm');
const src=fs.readFileSync('src/lib/badges.ts','utf8');const js=ts.transpileModule(src,{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText;
const sandbox={exports:{},require};vm.runInNewContext(js,sandbox);
const badge=sandbox.exports.deriveStars;const cases=[[0,'WHITE','NONE'],[4,'WHITE','PURPLE_SILVER'],[5,'BLUE','PURPLE_SILVER'],[14,'BLUE','PURPLE_SILVER'],[15,'BLUE','PURPLE_GOLD'],[24,'BLUE','PURPLE_GOLD'],[25,'GREEN','PURPLE_GOLD']];
for(const [projects,reputation,owner] of cases){const actual=badge(projects);if(actual.reputation!==reputation||actual.owner!==owner)throw Error('Wrong star assignment for '+projects)}
if(badge(27,'GOLD',true).reputation!=='RED'||badge(27,'GOLD',true).subscription!=='GOLD')throw Error('Independent stars failed');
console.log('Badge boundary tests passed ('+cases.length+' cases + moderation).');
