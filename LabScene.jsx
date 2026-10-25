import React,{useEffect,useRef} from 'react';
import * as THREE from 'three';

export default function LabScene({stage,playing,exploded,reset,en}){
 const host=useRef(),live=useRef({stage,playing,exploded});
 useEffect(()=>{live.current={stage,playing,exploded}},[stage,playing,exploded]);
 useEffect(()=>{
  const el=host.current;let renderer,compact=matchMedia('(max-width: 767px)').matches,lastPaint=-Infinity;
  try{renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'high-performance'})}catch{el.textContent=en?'The interactive 3D view requires WebGL.':'برای نمایش سه‌بعدی، WebGL مرورگر را فعال کنید.';window.dispatchEvent(new Event('abnoos:scene-ready'));return}
  renderer.setPixelRatio(Math.min(devicePixelRatio,compact?1.25:1.6));renderer.setClearColor(0,0);renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.22;el.appendChild(renderer.domElement);
  const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(34,1,.1,70);camera.position.set(7.8,5.8,9);camera.lookAt(0,.65,0);
  scene.add(new THREE.HemisphereLight(0xd3f8ff,0x153a53,3));
  const key=new THREE.DirectionalLight(0xffffff,5);key.position.set(-3,7,5);scene.add(key);
  const cyan=new THREE.PointLight(0x49d4f7,28,15);cyan.position.set(2,3,-3);scene.add(cyan);
  const warm=new THREE.PointLight(0xe9d3af,12,12);warm.position.set(-5,2,3);scene.add(warm);
  const rig=new THREE.Group();scene.add(rig);rig.rotation.y=-.12;
  const material=(color,metalness=.2,roughness=.3)=>new THREE.MeshStandardMaterial({color,metalness,roughness});
  const white=material(0xd9e9ee,.5,.24),navy=material(0x163b51,.65,.28),steel=material(0x7fa4b5,.8,.22);
  const aqua=new THREE.MeshStandardMaterial({color:0x35c3e4,emissive:0x157ca6,emissiveIntensity:.7,metalness:.2,roughness:.22});
  const glass=new THREE.MeshPhysicalMaterial({color:0x82e3f4,transparent:true,opacity:.2,metalness:.1,roughness:.12,side:THREE.DoubleSide,depthWrite:false,clearcoat:1});
  const trace=new THREE.MeshBasicMaterial({color:0x51c9e4,transparent:true,opacity:.65});
  function mesh(geo,mat,x=0,y=0,z=0,parent=rig){const obj=new THREE.Mesh(geo,mat);obj.position.set(x,y,z);parent.add(obj);return obj}
  const cylinder=(r,h,mat,x,y,z,parent=rig)=>mesh(new THREE.CylinderGeometry(r,r,h,48),mat,x,y,z,parent);
  const box=(w,h,d,mat,x,y,z,parent=rig)=>mesh(new THREE.BoxGeometry(w,h,d),mat,x,y,z,parent);
  const ring=(r,t,mat,x,y,z,parent=rig)=>{const o=mesh(new THREE.TorusGeometry(r,t,12,90),mat,x,y,z,parent);o.rotation.x=Math.PI/2;return o};
  cylinder(3.45,.14,navy,0,-.7,0);cylinder(3.25,.07,steel,0,-.6,0);cylinder(3.2,.06,navy,0,-.54,0);
  ring(3.43,.018,trace,0,-.63,0);ring(3.05,.012,trace,0,-.49,0);ring(2.85,.008,trace,0,-.48,0);
  for(let i=0;i<48;i++){const a=i/48*Math.PI*2;const tick=box(.025,.008,i%4===0?.16:.07,trace,Math.sin(a)*3.15,-.47,Math.cos(a)*3.15);tick.rotation.y=a}
  const vessels=new THREE.Group();rig.add(vessels);vessels.position.set(-1.8,0,.25);
  for(const x of[-.38,.38]){cylinder(.31,1.65,glass,x,.43,0,vessels);cylinder(.29,1.08,aqua,x,.16,0,vessels);cylinder(.33,.12,white,x,1.29,0,vessels);cylinder(.34,.16,navy,x,-.42,0,vessels);cylinder(.09,.22,steel,x,1.45,0,vessels);for(const y of[-.15,.05,.25,.45])cylinder(.296,.018,steel,x,y,0,vessels);for(const y of[.65,.77,.89])ring(.27,.011,trace,x,y,0,vessels)}
  const membrane=new THREE.Group();rig.add(membrane);membrane.position.set(.2,.75,-.05);
  const shell=mesh(new THREE.CylinderGeometry(.49,.49,2.7,64,1,true,Math.PI*.25,Math.PI*1.48),glass,0,0,0,membrane);shell.rotation.z=Math.PI/2;
  const core=cylinder(.115,2.8,aqua,0,0,0,membrane);core.rotation.z=Math.PI/2;
  const layers=[];for(let i=0;i<26;i++){const mat=i%3===0?aqua:white;const o=mesh(new THREE.RingGeometry(.13,.415,48),mat,-1.15+i*.092,0,0,membrane);o.rotation.y=Math.PI/2;layers.push(o)}
  const caps=[];for(const side of[-1,1]){const cap=cylinder(.51,.12,navy,side*1.42,0,0,membrane);cap.rotation.z=Math.PI/2;caps.push({cap,side});const rim=cylinder(.52,.025,steel,side*1.34,0,0,membrane);rim.rotation.z=Math.PI/2}
  for(const x of[-.9,1.3]){box(.08,.65,.12,steel,x,-.1,-.3);box(.44,.08,.6,navy,x,-.45,-.05)}
  const lower=new THREE.Group();rig.add(lower);lower.position.set(.2,-.03,-.28);const lowerTube=cylinder(.21,2.5,white,0,0,0,lower);lowerTube.rotation.z=Math.PI/2;for(const x of[-1.28,1.28]){const cap=cylinder(.23,.1,navy,x,0,0,lower);cap.rotation.z=Math.PI/2}
  const output=new THREE.Group();rig.add(output);output.position.set(2.45,0,.25);cylinder(.49,.09,navy,0,-.4,0,output);ring(.45,.02,trace,0,-.33,0,output);
  const points=[[0,-.3],[.22,-.28],[.33,-.12],[.34,.08],[.26,.29],[.12,.52],[0,.8]].map(([x,y])=>new THREE.Vector2(x,y));
  const drop=mesh(new THREE.LatheGeometry(points,64),new THREE.MeshPhysicalMaterial({color:0x56d4ef,metalness:.32,roughness:.08,clearcoat:1,transparent:true,opacity:.92,emissive:0x086e91,emissiveIntensity:.25}),0,.47,0,output);
  const ripples=[.36,.52,.7].map((r,i)=>{const m=trace.clone();m.opacity=.35-i*.08;return ring(r,.009,m,0,-.25+i*.018,0,output)});
  const screen=box(.62,.55,.14,navy,-.48,1.61,-.5);box(.46,.31,.01,aqua,-.48,1.63,-.42);for(let i=0;i<3;i++)box(.28-i*.055,.018,.015,white,-.49,1.72-i*.08,-.405);
  function pipe(points,mat=trace,r=.035){const curve=new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p)));mesh(new THREE.TubeGeometry(curve,64,r,10,false),mat);return curve}
  const curves=[pipe([[-3,.05,.5],[-2.5,.05,.5],[-2.5,1.55,.25],[-1.8,1.55,.25]]),pipe([[-1.8,1.55,.25],[-1.3,1.55,.25],[-1.25,.75,0],[1.8,.75,0]]),pipe([[1.8,.75,0],[2.25,.75,0],[2.45,.3,.25],[2.9,.25,.5]])];
  const particles=[];for(let j=0;j<3;j++)for(let i=0;i<14;i++){const p=mesh(new THREE.SphereGeometry(.027,8,8),new THREE.MeshBasicMaterial({color:j===0?0xe6c798:0xb3f7ff}));particles.push({p,j,offset:i/14})}
  const halo=ring(3.7,.009,trace,0,-.25,0);halo.rotation.z=.08;
  const dustGeo=new THREE.BufferGeometry(),positions=new Float32Array(90);for(let i=0;i<90;i+=3){positions[i]=(Math.random()-.5)*7;positions[i+1]=Math.random()*2.5;positions[i+2]=(Math.random()-.5)*4}dustGeo.setAttribute('position',new THREE.BufferAttribute(positions,3));const dust=new THREE.Points(dustGeo,new THREE.PointsMaterial({color:0x9bdeef,size:.018,transparent:true,opacity:.45}));rig.add(dust);
  let target=-.12,drag=false,lastX=0,expanded=0,t=0,last=performance.now(),visible=true,frame,notified=false;
  const down=e=>{drag=true;lastX=e.clientX;el.setPointerCapture?.(e.pointerId)},move=e=>{if(drag){target+=(e.clientX-lastX)*.006;lastX=e.clientX}},up=()=>{drag=false};
  const keyboard=e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();target+=e.key==='ArrowLeft'?-.18:.18}};
  el.addEventListener('pointerdown',down);el.addEventListener('pointermove',move);el.addEventListener('pointerup',up);el.addEventListener('pointercancel',up);el.addEventListener('keydown',keyboard);
  const resize=()=>{const w=el.clientWidth,h=el.clientHeight;if(!w||!h)return;compact=matchMedia('(max-width: 767px)').matches;renderer.setPixelRatio(Math.min(devicePixelRatio,compact?1.25:1.6));renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix()};const ro=new ResizeObserver(resize);ro.observe(el);resize();
  const io=new IntersectionObserver(([e])=>{visible=e.isIntersecting});io.observe(el);
  function loop(now){frame=requestAnimationFrame(loop);if(now-lastPaint<1000/(compact?30:60))return;lastPaint=now;const dt=Math.max(0,Math.min((now-last)/1000,.04));last=now;if(!visible||document.hidden)return;const state=live.current;if(state.playing)t+=dt;expanded+=(Number(state.exploded)-expanded)*.07;
   rig.rotation.y+=(target+Math.sin(t*.18)*.045-rig.rotation.y)*.07;rig.position.y=Math.sin(t*.65)*.045;
   vessels.position.x=-1.8-expanded*.38;membrane.position.y=.75+expanded*.38;lower.position.y=-.03-expanded*.1;screen.position.y=1.61+expanded*.28;
   layers.forEach((o,i)=>{o.position.x=(-1.15+i*.092)*(1+expanded*.28);o.rotation.x=t*.12});caps.forEach(({cap,side})=>cap.position.x=side*(1.42+expanded*.48));shell.material.opacity=.2-expanded*.1;
   drop.position.y=.47+Math.sin(t*1.4)*.06;ripples.forEach((o,i)=>{const pulse=(t*.35+i/3)%1;o.scale.setScalar(.8+pulse*.6);o.material.opacity=(1-pulse)*.35});
   particles.forEach(({p,j,offset})=>{p.position.copy(curves[j].getPoint((t*.12+offset)%1));p.scale.setScalar(state.stage===j?1.6:.7)});aqua.emissiveIntensity=.45+(state.stage===1?.4:0)+Math.sin(t*1.4)*.08;dust.rotation.y=t*.025;
   renderer.render(scene,camera);if(!notified){notified=true;window.dispatchEvent(new Event('abnoos:scene-ready'))}
  }loop(last);
  return()=>{cancelAnimationFrame(frame);ro.disconnect();io.disconnect();el.removeEventListener('pointerdown',down);el.removeEventListener('pointermove',move);el.removeEventListener('pointerup',up);el.removeEventListener('pointercancel',up);el.removeEventListener('keydown',keyboard);const gs=new Set(),ms=new Set();scene.traverse(o=>{if(o.geometry)gs.add(o.geometry);if(o.material)ms.add(o.material)});gs.forEach(g=>g.dispose());ms.forEach(m=>m.dispose());renderer.dispose();el.replaceChildren()}
 },[reset]);
 return <div className="lab-canvas" ref={host} tabIndex={0} role="img" aria-label={en?'Interactive 3D filtration laboratory. Drag or use left and right arrow keys to rotate.':'آزمایشگاه سه‌بعدی تصفیه؛ برای چرخاندن بکشید یا از کلیدهای جهت استفاده کنید.'}/>;
}


