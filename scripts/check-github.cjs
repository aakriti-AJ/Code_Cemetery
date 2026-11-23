// Isolated unit test of public repository discovery without live GitHub network.
const fs=require('node:fs'),ts=require('typescript'),vm=require('node:vm');
const input=fs.readFileSync('src/services/github-public.service.ts','utf8');
const output=ts.transpileModule(input,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
const scope={exports:{},encodeURIComponent,fetch:async()=>{throw Error('fetch not mocked')}};
vm.runInNewContext(output,scope,{filename:'github-public.service.js'});
const {validGithubLogin,listGithubPublicRepos}=scope.exports;
const ok=(truth,msg)=>{if(!truth)throw Error(msg)};
const response=(status,data)=>({ok:status===200,status,json:async()=>data});
(async()=>{
 ok(validGithubLogin('octocat'),'valid username rejected');
 ok(validGithubLogin('some-user'),'hyphenated username rejected');
 for(const bad of ['../etc','bad_user','-bad','bad-','hello world',''])ok(!validGithubLogin(bad),'unsafe username accepted '+bad);
 let requested='';
 scope.fetch=async url=>{requested=url;return response(200,[
  {id:1,name:'alive',owner:{login:'octocat'},private:false,fork:false},
  {id:2,name:'forked',owner:{login:'octocat'},private:false,fork:true},
  {id:3,name:'hidden',owner:{login:'octocat'},private:true,fork:false},
  {id:4,name:'other',owner:{login:'someoneelse'},private:false,fork:false},
 ]);};
 const repos=await listGithubPublicRepos('octocat');
 ok(repos.length===1&&repos[0].id===1,'repository ownership/privacy filtering failed');
 ok(requested.includes('api.github.com/users/octocat/repos?'),'incorrect GitHub REST endpoint');
 scope.fetch=async()=>response(404,{});let failed=false;try{await listGithubPublicRepos('ghost-user')}catch(e){failed=e.message.includes('not found')};ok(failed,'missing user not reported');
 scope.fetch=async()=>response(403,{});failed=false;try{await listGithubPublicRepos('octocat')}catch(e){failed=e.message.includes('rate limit')};ok(failed,'rate limit not explained');
 console.log('GitHub discovery tests passed (username, ownership/privacy, 404, rate limit).');
})().catch(e=>{console.error(e);process.exitCode=1});
