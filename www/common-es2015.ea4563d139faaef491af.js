(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{"0/6H":function(t,e,i){"use strict";i.d(e,"a",(function(){return o}));var n=i("A36C"),r=i("iWo5"),s=i("qULd");const o=(t,e)=>{let i,o;const a=(t,n,r)=>{if("undefined"==typeof document)return;const s=document.elementFromPoint(t,n);s&&e(s)?s!==i&&(l(),c(s,r)):l()},c=(t,e)=>{i=t,o||(o=i);const r=i;Object(n.f)(()=>r.classList.add("ion-activated")),e()},l=(t=!1)=>{if(!i)return;const e=i;Object(n.f)(()=>e.classList.remove("ion-activated")),t&&o!==i&&i.click(),i=void 0};return Object(r.createGesture)({el:t,gestureName:"buttonActiveDrag",threshold:0,onStart:t=>a(t.currentX,t.currentY,s.a),onMove:t=>a(t.currentX,t.currentY,s.b),onEnd:()=>{l(!0),Object(s.e)(),o=void 0}})}},"74mu":function(t,e,i){"use strict";i.d(e,"a",(function(){return r})),i.d(e,"b",(function(){return s})),i.d(e,"c",(function(){return n})),i.d(e,"d",(function(){return a}));const n=(t,e)=>null!==e.closest(t),r=(t,e)=>"string"==typeof t&&t.length>0?Object.assign({"ion-color":!0,["ion-color-"+t]:!0},e):e,s=t=>{const e={};return(t=>void 0!==t?(Array.isArray(t)?t:t.split(" ")).filter(t=>null!=t).map(t=>t.trim()).filter(t=>""!==t):[])(t).forEach(t=>e[t]=!0),e},o=/^[a-z][a-z0-9+\-.]*:/,a=async(t,e,i,n)=>{if(null!=t&&"#"!==t[0]&&!o.test(t)){const r=document.querySelector("ion-router");if(r)return null!=e&&e.preventDefault(),r.push(t,i,n)}return!1}},EahQ:function(t,e,i){"use strict";i.d(e,"a",(function(){return r}));var n=i("8Y7J");let r=(()=>{class t{constructor(){this.key="readAds"}saveItem(t){let e=localStorage.getItem(this.key);e=e?JSON.parse(e):[],e.push(t);let i=Array.from(new Set(e));localStorage.setItem(this.key,JSON.stringify(i))}getItem(t){let e=localStorage.getItem(this.key);return e=e?JSON.parse(e):[],0!=e.length&&-1!==e.indexOf(t)}}return t.ngInjectableDef=n.Qb({factory:function(){return new t},token:t,providedIn:"root"}),t})()},ZaV5:function(t,e,i){"use strict";i.d(e,"a",(function(){return n})),i.d(e,"b",(function(){return r}));const n=async(t,e,i,n,r)=>{if(t)return t.attachViewToDom(e,i,r,n);if("string"!=typeof i&&!(i instanceof HTMLElement))throw new Error("framework delegate is missing");const s="string"==typeof i?e.ownerDocument&&e.ownerDocument.createElement(i):i;return n&&n.forEach(t=>s.classList.add(t)),r&&Object.assign(s,r),e.appendChild(s),s.componentOnReady&&await s.componentOnReady(),s},r=(t,e)=>{if(e){if(t)return t.removeViewFromDom(e.parentElement,e);e.remove()}return Promise.resolve()}},h3R7:function(t,e,i){"use strict";i.d(e,"a",(function(){return n}));const n={bubbles:{dur:1e3,circles:9,fn:(t,e,i)=>{const n=t*e/i-t+"ms",r=2*Math.PI*e/i;return{r:5,style:{top:9*Math.sin(r)+"px",left:9*Math.cos(r)+"px","animation-delay":n}}}},circles:{dur:1e3,circles:8,fn:(t,e,i)=>{const n=e/i,r=t*n-t+"ms",s=2*Math.PI*n;return{r:5,style:{top:9*Math.sin(s)+"px",left:9*Math.cos(s)+"px","animation-delay":r}}}},circular:{dur:1400,elmDuration:!0,circles:1,fn:()=>({r:20,cx:48,cy:48,fill:"none",viewBox:"24 24 48 48",transform:"translate(0,0)",style:{}})},crescent:{dur:750,circles:1,fn:()=>({r:26,style:{}})},dots:{dur:750,circles:3,fn:(t,e)=>({r:6,style:{left:9-9*e+"px","animation-delay":-110*e+"ms"}})},lines:{dur:1e3,lines:12,fn:(t,e,i)=>({y1:17,y2:29,style:{transform:`rotate(${30*e+(e<6?180:-180)}deg)`,"animation-delay":t*e/i-t+"ms"}})},"lines-small":{dur:1e3,lines:12,fn:(t,e,i)=>({y1:12,y2:20,style:{transform:`rotate(${30*e+(e<6?180:-180)}deg)`,"animation-delay":t*e/i-t+"ms"}})}}},mpJo:function(t,e,i){"use strict";i.d(e,"a",(function(){return h}));var n=i("mrSG"),r=i("tLCv"),s=i("lGQG"),o=i("jtHE"),a=i("DMZm"),c=i("SxV6"),l=i("kXdw"),u=i("n90K"),d=i("8Y7J");let h=(()=>{class t{constructor(t,e,i,n,r,s){this.authService=t,this.stitchService=e,this.subscriptionsService=i,this.sellersService=n,this.storageService=r,this.ngZone=s,this.myAdsSource$=new o.a(1),this.myAds$=this.myAdsSource$.asObservable(),this.allAdsSource$=new o.a(1),this.allAds$=this.allAdsSource$.asObservable(),this.init()}init(){return n.__awaiter(this,void 0,void 0,(function*(){yield this.stitchService.checkInitedDb(),this.adsCollection=this.stitchService.db.collection("ads")}))}add(t){return n.__awaiter(this,void 0,void 0,(function*(){yield this.authService.getStitchAuth(),t.dateCreate=new Date,t.user=this.authService.getLogin(),t.active=!0,t.archive=!1,t.aliasCategory=this.subscriptionsService.transliterate(`${t.category}_${t.model}`);const e=yield this.stitchService.callFunction("newAd",t);return this.getMyRefresh(),e}))}delete(t){return n.__awaiter(this,void 0,void 0,(function*(){yield this.stitchService.callFunction("deleteAd",t),this.getMyRefresh()}))}update(t,e){return n.__awaiter(this,void 0,void 0,(function*(){const i={_id:this.stitchService.bsonObject(t)},n={$set:e};yield this.adsCollection.updateOne(i,n),this.getMyRefresh()}))}getMyRefresh(){return n.__awaiter(this,void 0,void 0,(function*(){yield this.authService.getStitchAuth();const t={user:this.authService.getLogin()},e=yield this.adsCollection.find(t,{sort:{dateCreate:-1}}).toArray();this.myAdsSource$.next(e),yield this.storageService.setIonicStorage("myAds",JSON.stringify(e))}))}getMyCache(){return n.__awaiter(this,void 0,void 0,(function*(){const t=JSON.parse(yield this.storageService.getIonicStorage("myAds"));this.myAdsSource$.next(t)}))}getMy(){return this.getMyRefresh(),this.myAds$}getById(t){return n.__awaiter(this,void 0,void 0,(function*(){yield this.authService.getStitchAuth();const e={_id:this.stitchService.bsonObject(t)};return yield this.adsCollection.findOne(e)}))}watchAd(t){return this.stitchService.watch$(this.adsCollection,[this.stitchService.bsonObject(t)])}watchAllAds(t,e){let i=[{"fullDocument.region":"AllCountry"}],n={"fullDocument.archive":!1};return(t=t.map(t=>({"fullDocument.aliasCategory":t.aliasCategory}))).length&&(n.$and=[{$or:t},{operationType:"delete"}]),e.region&&t.length&&(i.push({"fullDocument.region":e.region}),n={$or:[{$and:[{$or:t},{$or:i}],"fullDocument.archive":!1},{operationType:"delete"}]}),this.stitchService.watch$(this.adsCollection,n)}getInfoSellerAds(){return n.__awaiter(this,void 0,void 0,(function*(){let t=yield this.subscriptionsService.get(),e=t.map(t=>({aliasCategory:t.category,min:t.min,max:t.max,state:t.state}));return t=e.map(t=>({aliasCategory:t.aliasCategory})),{subscriptions:t,seller:yield this.sellersService.getMy().pipe(Object(c.a)()).toPromise(),subscriptionsYears:e}}))}getAllRefresh(){return n.__awaiter(this,void 0,void 0,(function*(){yield this.authService.getStitchAuth();let{subscriptions:t,seller:e,subscriptionsYears:i}=yield this.getInfoSellerAds(),n=[{region:"AllCountry"}],r={archive:!1};t.length&&(r.$or=t),e.region&&t.length&&(n.push({region:e.region}),r={$and:[{$or:t},{$or:n}],archive:!1});let s=[];t.length&&(s=yield this.adsCollection.find(r,{sort:{dateCreate:-1}}).toArray()),this.ngZone.run(()=>{s=s.filter(t=>{const e=i.find(e=>e.aliasCategory===t.aliasCategory),n=e.min?e.min:(new Date).getFullYear()-100;return(e.max?e.max:(new Date).getFullYear())>=t.year&&n<=t.year}),s=s.filter(t=>!!i.find((function(e){return!e.state||"Any"==e.state||e.state==t.state||"Any"==t.state}))),this.allAdsSource$.next(s)}),yield this.storageService.setIonicStorage("allAds",JSON.stringify(s))}))}getAllCache(){return n.__awaiter(this,void 0,void 0,(function*(){const t=JSON.parse(yield this.storageService.getIonicStorage("allAds"));this.allAdsSource$.next(t)}))}getAll(){return this.getAllRefresh(),this.allAds$}getByIdCache(t){return n.__awaiter(this,void 0,void 0,(function*(){let e=JSON.parse(yield this.storageService.getIonicStorage("allAds"));if(e&&e.length||(e=JSON.parse(yield this.storageService.getIonicStorage("myAds"))),e&&e.length)return e.find(e=>e._id.toString()==t)}))}}return t.ngInjectableDef=d.Qb({factory:function(){return new t(d.Rb(s.a),d.Rb(r.a),d.Rb(a.a),d.Rb(l.a),d.Rb(u.a),d.Rb(d.x))},token:t,providedIn:"root"}),t})()},qULd:function(t,e,i){"use strict";i.d(e,"a",(function(){return s})),i.d(e,"b",(function(){return o})),i.d(e,"c",(function(){return r})),i.d(e,"d",(function(){return c})),i.d(e,"e",(function(){return a}));const n={getEngine(){const t=window;return t.TapticEngine||t.Capacitor&&t.Capacitor.isPluginAvailable("Haptics")&&t.Capacitor.Plugins.Haptics},available(){return!!this.getEngine()},isCordova:()=>!!window.TapticEngine,isCapacitor:()=>!!window.Capacitor,impact(t){const e=this.getEngine();if(!e)return;const i=this.isCapacitor()?t.style.toUpperCase():t.style;e.impact({style:i})},notification(t){const e=this.getEngine();if(!e)return;const i=this.isCapacitor()?t.style.toUpperCase():t.style;e.notification({style:i})},selection(){this.impact({style:"light"})},selectionStart(){const t=this.getEngine();t&&(this.isCapacitor()?t.selectionStart():t.gestureSelectionStart())},selectionChanged(){const t=this.getEngine();t&&(this.isCapacitor()?t.selectionChanged():t.gestureSelectionChanged())},selectionEnd(){const t=this.getEngine();t&&(this.isCapacitor()?t.selectionEnd():t.gestureSelectionEnd())}},r=()=>{n.selection()},s=()=>{n.selectionStart()},o=()=>{n.selectionChanged()},a=()=>{n.selectionEnd()},c=t=>{n.impact(t)}}}]);