module.exports=[98188,e=>{"use strict";var t=e.i(89171),r=e.i(43839),a=e.i(29823),n=e.i(95943),i=e.i(35907),i=i;e.i(89228);var s=e.i(91601);let o=null,l=r.z.object({studentName:a.z.string().trim().min(1).max(60),stream:a.z.string().max(30),interests:n.z.array(a.z.string().max(60)).min(1).max(5),experience:a.z.string().max(60),favoriteSubject:a.z.string().max(60),careerGoal:a.z.string().max(100),language:i.enum(["English","Telugu","Hindi","Tamil","Kannada","Malayalam"])});async function u(e){try{if(!process.env.OPENAI_API_KEY)return t.NextResponse.json({error:"AI service is not configured"},{status:503});let r=l.safeParse(await e.json());if(!r.success)return t.NextResponse.json({error:"Please provide valid assessment details."},{status:400});let a=r.data,n=function(){let e=process.env.OPENAI_API_KEY;if(!e)throw Error("OPENAI_API_KEY is missing");return o||(o=new s.f({apiKey:e})),o}(),i=await n.chat.completions.create({model:process.env.OPENAI_MODEL||"gpt-4o-mini",temperature:.5,response_format:{type:"json_object"},messages:[{role:"system",content:`
You are PathFinder AI, a responsible career discovery assistant
for Indian Class 12 students.

Generate practical career exploration guidance based on the
student's interests, academic stream and experience.

Return valid JSON with exactly these fields:
{
  "introduction": "string",
  "careerPaths": [
    {
      "title": "string",
      "description": "string",
      "skills": ["string"],
      "suitability": "string"
    }
  ],
  "recommendedSkills": ["string"],
  "beginnerProject": "string",
  "projectDescription": "string",
  "roadmap": [
    {
      "period": "Month 1",
      "goal": "string",
      "activities": ["string"]
    }
  ],
  "nextSteps": ["string"],
  "realityCheck": "string"
}

Rules:
- Return 3 relevant career paths.
- Return 5 recommended skills.
- Return 3 roadmap stages covering 90 days.
- Keep projects achievable for beginners.
- Translate the entire response into the requested language.
- Be encouraging but realistic.
- Never guarantee employment, salary, admission or placement.
- Do not claim that NIAT guarantees any particular outcome.
- Explain that recommendations are exploratory, not an aptitude test.
- Do not assume that every career is suitable for every stream.
- Mention prerequisites where relevant.
- Do not fabricate NIAT student achievements or statistics.
`},{role:"user",content:JSON.stringify({student:a.studentName,academicStream:a.stream,interests:a.interests,experience:a.experience,favoriteSubject:a.favoriteSubject,careerGoal:a.careerGoal,responseLanguage:a.language})}]}),u=i.choices[0]?.message?.content;if(!u)throw Error("Empty AI response");let c=JSON.parse(u);return t.NextResponse.json({success:!0,report:c})}catch(e){return console.error("Career generation error:",e),t.NextResponse.json({error:"Unable to generate your report. Please try again."},{status:500})}}e.s(["POST",0,u,"runtime",0,"nodejs"],98188)},6713,e=>{"use strict";var t=e.i(47909),r=e.i(74017),a=e.i(96250),n=e.i(59756),i=e.i(61916),s=e.i(74677),o=e.i(69741),l=e.i(16795),u=e.i(87718),c=e.i(95169),d=e.i(47587),p=e.i(66012),h=e.i(70101),m=e.i(26937),g=e.i(10372),f=e.i(93695),v=e.i(9580);e.i(52474);var x=e.i(220);let w=new t.AppRouteRouteModule({definition:{kind:r.f.APP_ROUTE,page:"/api/generate/route",pathname:"/api/generate",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/app/api/generate/route.ts",nextConfigOutput:"",userland:()=>e.r(98188),...{}}),{workAsyncStorage:y,workUnitAsyncStorage:R,serverHooks:E}=w;async function b(e,t,r){r.requestMeta&&(0,n.R)(e,r.requestMeta),w.isDev&&(0,n.i)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let a="/api/generate/route";a=a.replace(/\/index$/,"")||"/";let{instrumentation:s}=await w.ensureInstrumentation(e,{deferSpans:!0});return w.traceRequest(e,{tracer:(0,i.v)(),spanName:`${e.method||"GET"} ${a}`,httpTarget:e.url,instrumentation:s},(n,i)=>P(e,t,r,a,!1,n,i))}async function P(e,t,a,y,R,E,b){let P=await w.prepare(e,t,{srcPage:y,multiZoneDraftMode:R});if(!P)return t.statusCode=400,t.end("Bad Request"),null==a.waitUntil||a.waitUntil.call(a,Promise.resolve()),null;let{buildId:A,deploymentId:C,params:T,nextConfig:O,parsedUrl:S,isDraftMode:N,prerenderManifest:I,routerServerContext:j,isOnDemandRevalidate:U,revalidateOnlyGenerated:_,resolvedPathname:k,clientReferenceManifest:M,serverActionsManifest:D,previewProps:q}=P,G=(0,o.f)(y),H=!!I.routes[k]&&(w.isDev||(0,v.f)(k,w.cacheOwner,I.routes[k])),L=!!(I.dynamicRoutes[G]||H),z=async()=>((null==j?void 0:j.render404)?await j.render404(e,t,S,!1):t.end("This page could not be found"),null);if(L&&!N){let e=I.dynamicRoutes[G];if(e&&!1===e.fallback&&!H){if(O.adapterPath)return await z();throw new f.NoFallbackError}}let K=null;!L||w.isDev||N||(K="/index"===(K=k)?"/":K),D&&M&&(0,s.f)({page:y,clientReferenceManifest:M,serverActionsManifest:D});let $=e.method||"GET",B=(0,i.v)(),F=!!(null==j?void 0:j.isWrappedByNextServer),J=!!(0,n.w)(e,"minimalMode"),Y=(0,n.w)(e,"incrementalCache")||await w.getIncrementalCache(e,O,q,I,J);null==Y||Y.resetRequestCache(),globalThis.__incrementalCache=Y;let Q={params:T,previewProps:q,renderOpts:{experimental:{authInterrupts:!!O.experimental.authInterrupts,useCacheTimeout:O.experimental.useCacheTimeout,durableUseCacheEntries:!!O.experimental.durableUseCacheEntries},cacheComponents:!!O.cacheComponents,validationLevel:O.experimental.instantInsights.validationLevel,isDraftMode:N,incrementalCache:Y,hmrRefreshHash:(0,n.w)(e,"hmrRefreshHash"),cacheLifeProfiles:O.cacheLife,staticPageGenerationTimeout:O.staticPageGenerationTimeout,waitUntil:a.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0},sharedContext:{buildId:A,deploymentId:C}},V=new l.x(e),W=new l.e(t),X=u.k.fromNodeNextRequest(V,(0,u.t)(t)),Z=async({previousCacheEntry:r})=>{try{if(!J&&U&&_&&!r)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let n=null===K?await w.handle(X,Q):await w.prerender(X,Q);e.fetchMetrics=Q.renderOpts.fetchMetrics;let i=Q.renderOpts.pendingWaitUntil;i&&a.waitUntil&&(a.waitUntil(i),i=void 0);let s=Q.renderOpts.collectedTags;if(!L)return await (0,p.f)(V,W,n,i),null;{let e=await n.blob(),t=(0,h.S)(n.headers);s&&(t[g.M]=s),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let r=void 0!==Q.renderOpts.collectedRevalidate&&!(Q.renderOpts.collectedRevalidate>=g.Q)&&Q.renderOpts.collectedRevalidate,a=void 0===Q.renderOpts.collectedExpire||Q.renderOpts.collectedExpire>=g.Q?!1!==r&&r>0?O.expireTime:void 0:Q.renderOpts.collectedExpire;return{value:{kind:x.x.APP_ROUTE,status:n.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:r,expire:a}}}}catch(t){throw(null==r?void 0:r.isStale)&&await w.onRequestError(e,t,{routerKind:"App Router",routePath:y,routeType:"route",revalidateReason:(0,d.f)({isStaticGeneration:null!==K,isOnDemandRevalidate:U})},!1,j),t}},ee=async n=>{try{var s,o;let n=await w.handleResponse({req:e,nextConfig:O,cacheKey:K,routeKind:r.f.APP_ROUTE,isFallback:!1,previewProps:q,prerenderManifest:I,isRoutePPREnabled:!1,isOnDemandRevalidate:U,revalidateOnlyGenerated:_,responseGenerator:Z,waitUntil:a.waitUntil,isMinimalMode:J});if(null!==n&&"error"in n)throw n.error;if(!L)return;if((null==n||null==(s=n.value)?void 0:s.kind)!==x.x.APP_ROUTE)throw Error(`Invariant: app-route received invalid cache entry ${null==n||null==(o=n.value)?void 0:o.kind}`);J||t.setHeader("x-nextjs-cache",U?"REVALIDATED":n.isMiss?"MISS":n.isStale?"STALE":"HIT"),N&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let i=(0,h.G)(n.value.headers);J&&L||i.delete(g.M),!n.cacheControl||t.getHeader("Cache-Control")||i.get("Cache-Control")||i.set("Cache-Control",(0,m.f)(n.cacheControl)),await (0,p.f)(V,W,new Response(n.value.body,{headers:i,status:n.value.status||200}));return}catch(r){if(r instanceof f.NoFallbackError||await w.onRequestError(e,r,{routerKind:"App Router",routePath:G,routeType:"route",revalidateReason:(0,d.f)({isStaticGeneration:null!==K,isOnDemandRevalidate:U})},!1,j),L)throw r;if(t.headersSent){if(n){let e=r instanceof Error?r:Error("Unknown app route error");n.recordException(e),n.setStatus({code:i.J.ERROR,message:e.message}),n.setAttribute("error.type",e.name)}t.writableEnded||t.destroyed||t.end()}else await (0,p.f)(V,W,new Response(null,{status:500}));return}finally{(()=>{if(!n)return;let e=t.statusCode;n.setAttributes({"http.status_code":e,"next.rsc":!1}),e&&e>=500&&(n.setStatus({code:i.J.ERROR}),n.setAttribute("error.type",e.toString()));let r=B.getRootSpanAttributes();if(!r)return;if(r.get("next.span_type")!==c.q.handleRequest)return console.warn(`Unexpected root span type '${r.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let a=r.get("next.route")||G,s=`${$} ${a}`;n.setAttributes({"next.route":a,"http.route":a,"next.span_name":s}),n.updateName(s),b&&b!==n&&(b.setAttribute("http.route",a),b.updateName(s))})()}};F||void 0===e.url||null==E||E.setAttribute("http.target",e.url),await ee(E)}e.s(["handler",0,b,"patchFetch",0,function(){return(0,a.f)({workAsyncStorage:y,workUnitAsyncStorage:R})},"routeModule",0,w,"serverHooks",0,E,"workAsyncStorage",0,y,"workUnitAsyncStorage",0,R])}];

//# sourceMappingURL=_1xczu6qwqiklr._.js.map