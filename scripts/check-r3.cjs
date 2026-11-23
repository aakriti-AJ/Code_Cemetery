// Minimal release invariants. These checks do not substitute for a browser/OAuth integration test.
const fs=require('node:fs');const path=require('node:path');const ts=require('typescript');
const read=p=>fs.readFileSync(p,'utf8');
const all=[];
for(const root of ['src','api']){const visit=dir=>{for(const item of fs.readdirSync(dir,{withFileTypes:true})){const full=path.join(dir,item.name);if(item.isDirectory())visit(full);else if(/\.(tsx?|mts|cts)$/.test(full))all.push(full)}};visit(root)}
let errors=0;
for(const f of all){const src=read(f);const out=ts.transpileModule(src,{fileName:f,reportDiagnostics:true,compilerOptions:{jsx:ts.JsxEmit.ReactJSX,target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext}});for(const d of out.diagnostics||[])if(d.category===ts.DiagnosticCategory.Error){console.error(f,ts.flattenDiagnosticMessageText(d.messageText,' '));errors++}}
function check(value,label){if(!value){console.error('FAIL',label);errors++}else console.log('PASS',label)}
const routes=read('src/routes/AppRoutes.tsx'),home=read('src/pages/Home.tsx'),navbar=read('src/components/Navbar.tsx'),login=read('src/pages/Login.tsx'),reg=read('src/pages/Register.tsx'),github=read('src/pages/GithubProjects.tsx'),api=read('api/github/import.ts');
check(routes.includes('path="/stars"')&&routes.includes('path="/github"'),'Public GitHub explorer and star guide routes');
check(navbar.includes("to: '/stars'")&&navbar.includes("to: '/github'"),'Navigation to both new pages');
check(home.includes('Not all code')&&!home.includes('Every project<br/>has'),'Rebuilt, unclipped hero heading');
check(login.includes('<SocialSignIn ')&&reg.includes('<SocialSignIn '),'Social login visible on both pages');
check(github.includes('listGithubPublicRepos')&&read('src/services/github-public.service.ts').includes('api.github.com'),'Public GitHub REST integration');
check(api.includes("status:'DRAFT'")&&api.includes('ownedRepositories(token)'),'Verified imports remain private drafts');
check(read('api/community/directory.ts').includes("where('status','in'")&&read('api/community/profile.ts').includes("where('status','in'"),'Private drafts excluded from badge counts');
check(read('src/main.tsx').includes('r3.css'),'R3 layout rules imported');
for(const file of ['package.json','tsconfig.json','firebase.json','firestore.indexes.json','vercel.json']){try{JSON.parse(read(file))}catch(e){console.error('Invalid JSON',file,e.message);errors++}}
for(const file of all){const src=read(file);const re=/\bfrom\s*['"](\.[^'"]+)['"]|\bimport\s*\(\s*['"](\.[^'"]+)['"]\s*\)/g;let m;while((m=re.exec(src))!==null){const rel=m[1]||m[2];const base=path.resolve(path.dirname(file),rel);if(!['','.ts','.tsx','.mts','.cts','.js','.jsx'].some(ext=>fs.existsSync(base+ext)||fs.existsSync(path.join(base,'index'+ext)))){console.error('Unresolved import',file,rel);errors++}}}
if(errors){console.error(`R3 source checks failed: ${errors}`);process.exit(1)}console.log(`R3 checks passed. ${all.length} TypeScript files parsed; all relative imports resolved.`);
