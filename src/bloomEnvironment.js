const vertex = `
attribute vec2 a_position;
varying vec2 v_uv;
void main() {
  v_uv = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const fragment = `
precision highp float;
uniform vec2 u_resolution;
uniform vec2 u_pointer;
uniform vec2 u_lag;
uniform vec2 u_velocity;
uniform float u_time;
uniform float u_energy;
uniform vec2 u_rotation;
uniform sampler2D u_earth;
uniform sampler2D u_clouds;
uniform sampler2D u_night;
uniform sampler2D u_galaxy;
varying vec2 v_uv;

float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453123);}
float noise(vec2 p){
  vec2 i=floor(p);
  vec2 f=fract(p);
  vec2 u=f*f*(3.0-2.0*f);
  return mix(mix(hash(i),hash(i+vec2(1.0,0.0)),u.x),mix(hash(i+vec2(0.0,1.0)),hash(i+vec2(1.0,1.0)),u.x),u.y);
}
float fbm(vec2 p){
  float v=0.0;
  float a=0.5;
  for(int i=0;i<6;i++){
    v+=noise(p)*a;
    p*=2.03;
    a*=0.5;
  }
  return v;
}
vec3 rotateY(vec3 p,float a){
  float c=cos(a),s=sin(a);
  return vec3(c*p.x+s*p.z,p.y,-s*p.x+c*p.z);
}
vec3 rotateX(vec3 p,float a){
  float c=cos(a),s=sin(a);
  return vec3(p.x,c*p.y-s*p.z,s*p.y+c*p.z);
}
vec2 sphereUv(vec3 n){
  float lon=atan(n.z,n.x);
  float lat=asin(clamp(n.y,-1.0,1.0));
  return vec2(fract(lon/6.28318530718+0.5),clamp(0.5-lat/3.14159265359,0.0,1.0));
}
float sampleCloud(vec2 uv){
  uv.x=fract(uv.x);
  vec3 c=texture2D(u_clouds,uv).rgb;
  return smoothstep(.18,.88,dot(c,vec3(.333)));
}
float luminance(vec3 c){return dot(c,vec3(0.2126,0.7152,0.0722));}
vec3 filmic(vec3 x){
  x=max(vec3(0.0),x-0.004);
  return (x*(6.2*x+0.5))/(x*(6.2*x+1.7)+0.06);
}
vec3 desaturate(vec3 c,float amount){
  return mix(c,vec3(luminance(c)),amount);
}
vec3 blackbodyGrade(vec3 c,float day){
  vec3 cool=vec3(.82,.9,1.03);
  vec3 warm=vec3(1.03,.98,.91);
  return c*mix(cool,warm,smoothstep(.18,1.0,day));
}
vec2 flowWarp(vec2 uv,float t,float scale,float strength){
  vec2 q=uv*scale;
  float a=fbm(q+vec2(t*.011,-t*.007));
  float b=fbm(q*1.37+vec2(-t*.008,t*.009)+4.7);
  return uv+(vec2(a,b)-.5)*strength;
}
float starField(vec2 p,float t){
  float stars=0.0;
  for(int j=0;j<190;j++){
    float fj=float(j);
    vec2 seed=vec2(hash(vec2(fj,1.3)),hash(vec2(7.4,fj)));
    vec2 pos=seed*2.0-1.0;
    pos.x*=u_resolution.x/max(u_resolution.y,1.0);
    pos+=vec2(sin(t*(.0012+seed.x*.0025)+fj),cos(t*(.001+seed.y*.0022)+fj))*.004;
    float d=length(p-pos);
    float tiny=exp(-d*(260.0+seed.x*460.0))*(.08+seed.y*.45);
    float bright=exp(-d*(95.0+seed.x*180.0))*step(.965,seed.y)*(.3+seed.x*.7);
    stars+=tiny+bright;
  }
  return stars;
}
float cellularStars(vec2 p,float scale,float t){
  vec2 q=p*scale;
  vec2 id=floor(q);
  vec2 f=fract(q);
  float stars=0.0;
  for(int y=-1;y<=1;y++){
    for(int x=-1;x<=1;x++){
      vec2 cell=vec2(float(x),float(y));
      vec2 seed=id+cell;
      float h=hash(seed);
      vec2 star=vec2(hash(seed+3.7),hash(seed+9.1));
      vec2 d=f-cell-star;
      float rarity=step(.86,h);
      float twinkle=.82+.18*sin(t*(.08+h*.11)+h*18.0);
      stars+=exp(-dot(d,d)*(620.0+h*1400.0))*rarity*(.15+h*.36)*twinkle;
    }
  }
  return stars;
}
vec3 galaxyLayer(vec2 uv,float t){
  vec2 guv=uv;
  guv.x+=t*.00008;
  vec3 g=texture2D(u_galaxy,guv).rgb;
  float l=luminance(g);
  g=desaturate(g,.5);
  g*=smoothstep(.09,.5,l);
  return g;
}
void main(){
  vec2 uv=v_uv;
  vec2 p=uv*2.0-1.0;
  p.x*=u_resolution.x/max(u_resolution.y,1.0);
  vec2 lag=u_lag*2.0-1.0;
  lag.x*=u_resolution.x/max(u_resolution.y,1.0);
  float speed=clamp(length(u_velocity)/900.0,0.0,1.0);
  float t=u_time;

  vec3 color=vec3(.0,.0,.00045);
  vec2 drift=vec2(sin(t*.035)*.006,cos(t*.027)*.004);
  vec3 galaxy=galaxyLayer(fract(uv+vec2(.08,.02)+drift*.22),t);
  float spaceQuiet=mix(.38,1.0,smoothstep(.44,.85,uv.x));
  color+=galaxy*vec3(.12,.115,.125)*.074*spaceQuiet;
  float stars=starField(p,t);
  float distantStars=cellularStars(p+drift*.04,58.0,t)+cellularStars(p*1.17-vec2(.37,.11),96.0,t)*.65+cellularStars(p*.82+vec2(.18,-.31),34.0,t)*.42;
  float rightSpace=smoothstep(.34,.7,uv.x);
  color+=vec3(.62,.68,.8)*stars*.092;
  color+=vec3(.72,.76,.86)*distantStars*.048*mix(.5,1.0,rightSpace);

  // Restored Bloom composition: the planet sits under the original split UI layout.
  vec2 center=vec2(.48,-.02);
  center+=vec2((u_lag.x-.5)*.01,(u_lag.y-.5)*.008)+drift;
  float radius=.7;
  float cloudRadius=radius*1.018;
  vec2 sp=p-center;
  float r2=dot(sp,sp);
  float r=sqrt(r2);

  if(r2<radius*radius){
    float z=sqrt(radius*radius-r2);
    vec3 viewNormal=normalize(vec3(sp/radius,z/radius));
    float shellZ=sqrt(max(cloudRadius*cloudRadius-r2,0.0));
    vec3 cloudViewNormal=normalize(vec3(sp/cloudRadius,shellZ/cloudRadius));
    float planetaryRotation=t*.024+u_rotation.x;
    vec3 axisNormal=rotateX(viewNormal,.24+u_rotation.y);
    vec3 surfaceNormal=rotateY(axisNormal,.76+planetaryRotation);
    vec3 cloudNormalA=rotateY(rotateX(cloudViewNormal,.252+u_rotation.y*.92),.79+u_rotation.x+t*.043);
    vec3 cloudNormalB=rotateY(rotateX(cloudViewNormal,.246+u_rotation.y*.9),.805+u_rotation.x+t*.026);
    vec2 euv=sphereUv(surfaceNormal);
    vec2 cuvA=sphereUv(cloudNormalA);
    vec2 cuvB=sphereUv(cloudNormalB);
    vec2 cloudFlowA=flowWarp(cuvA,t,7.5,.011);
    vec2 cloudFlowB=flowWarp(cuvB,t,13.0,.007);

    vec3 earth=texture2D(u_earth,euv).rgb;
    earth=pow(earth,vec3(1.08));
    float baseLum=luminance(earth);
    float waterMask=smoothstep(.06,.33,earth.b-earth.r+.04)*(1.0-smoothstep(.31,.62,earth.r));
    float desertMask=smoothstep(.48,.86,earth.r+earth.g-earth.b*.45)*(1.0-waterMask);
    float vegetationMask=smoothstep(.02,.2,earth.g-earth.r)*(1.0-waterMask)*(1.0-desertMask*.45);
    vec3 naturalEarth=earth;
    float viewDepth=1.0-smoothstep(.15,.95,viewNormal.z);
    vec3 ocean=vec3(.0,.002,.01)+desaturate(earth,.7)*vec3(.006,.018,.044);
    ocean*=1.0-viewDepth*.32;
    vec3 desert=desaturate(earth,.48)*vec3(.78,.7,.59)+vec3(.011,.008,.003);
    vec3 vegetation=desaturate(earth,.62)*vec3(.42,.5,.42);
    naturalEarth=mix(naturalEarth,ocean,waterMask*.88);
    naturalEarth=mix(naturalEarth,desert,desertMask*.34);
    naturalEarth=mix(naturalEarth,vegetation,vegetationMask*.28);
    naturalEarth=desaturate(naturalEarth,.25);
    vec3 surface=naturalEarth;

    vec3 lightDir=normalize(vec3(-.82,.18,.54));
    vec3 lightingNormal=normalize(mix(axisNormal,viewNormal,.16));
    float rawLight=dot(lightingNormal,lightDir);
    float day=smoothstep(-.18,.48,rawLight);
    float night=1.0-smoothstep(-.22,.22,rawLight);
    float terminator=1.0-smoothstep(.035,.36,abs(rawLight));
    float shade=.045+day*.66+terminator*.16;

    float cloudA=sampleCloud(cloudFlowA+vec2(t*.0065,.003*sin(t*.041)));
    float cloudB=sampleCloud(cloudFlowB+vec2(-t*.0042,.002*cos(t*.033)));
    float cloudFine=fbm(cloudFlowA*vec2(160.0,80.0)+vec2(t*.018,-t*.011));
    float cloudMedium=fbm(cloudFlowA*vec2(56.0,28.0)+vec2(-t*.012,t*.009));
    float cloudMicro=fbm(cloudFlowB*vec2(340.0,170.0)+vec2(t*.014,t*.017));
    float evolvingDensity=.88+.24*(fbm(cuvA*vec2(18.0,9.0)+vec2(t*.018,-t*.015))-.5);
    float polarFade=smoothstep(.02,.14,cuvA.y)*(1.0-smoothstep(.86,.98,cuvA.y));
    float cloudBase=smoothstep(.25,.88,cloudA*.74+cloudB*.26);
    float edgeBreakup=smoothstep(.18,.84,cloudFine*.42+cloudMedium*.44+cloudMicro*.14);
    float oceanWeather=smoothstep(.56,.88,cloudMedium*.48+cloudFine*.52)*waterMask;
    float filament=smoothstep(.62,.92,fbm(cuvB*vec2(230.0,115.0)+vec2(-t*.004,t*.003)));
    float cloudMask=cloudBase*mix(.68,1.08,edgeBreakup)*polarFade*evolvingDensity;
    cloudMask+=oceanWeather*filament*.18*polarFade;
    cloudMask+=smoothstep(.64,.9,cloudMedium*.55+cloudMicro*.45)*.055*polarFade*(.35+waterMask*.65);
    cloudMask*=1.0-smoothstep(.82,1.0,r/radius)*.28;
    cloudMask=clamp(cloudMask,0.0,.62);
    float cloudRawLight=dot(normalize(mix(cloudNormalA,cloudViewNormal,.2)),lightDir);
    float cloudDay=smoothstep(-.2,.48,cloudRawLight);
    vec3 cloud=vec3(.7,.725,.735)*(0.1+cloudDay*.66+terminator*.26);

    float rim=pow(1.0-max(viewNormal.z,0.0),2.85);
    float fresnel=pow(1.0-max(viewNormal.z,0.0),5.9);
    float edge=1.0-smoothstep(radius-.08,radius,r);
    float spec=pow(max(dot(reflect(-lightDir,viewNormal),vec3(0.0,0.0,1.0)),0.0),120.0)*waterMask*day*.08*(1.0-cloudMask*.8);
    vec3 nightMap=texture2D(u_night,euv).rgb;
    float city=pow(max(max(nightMap.r,nightMap.g),nightMap.b),1.35);
    float nightOnly=smoothstep(.55,1.0,night);
    float cityClusters=smoothstep(.045,.62,city);
    vec3 cityGlow=vec3(1.0,.62,.3)*cityClusters*nightOnly*(1.0-waterMask*.94)*(.16+.38*terminator)*(1.0-cloudMask*.72);
    vec3 rayleigh=vec3(.08,.38,.92);
    float sunwardRim=pow(1.0-max(viewNormal.z,0.0),3.6)*smoothstep(-.18,.5,rawLight);
    vec3 atmosphere=rayleigh*(rim*.006+fresnel*.028+edge*.034+sunwardRim*.045)*(0.02+day*.1+terminator*.66);
    vec3 lowLightSurface=desaturate(naturalEarth,.72)*vec3(.03,.036,.05);
    vec3 dayHaze=vec3(.4,.52,.62)*rim*.02*day;
    vec3 aerialPerspective=vec3(.006,.016,.04)*rim*.22*night+lowLightSurface*night*.3+dayHaze;
    vec3 pointerGlow=vec3(.13,.38,.8)*exp(-length((p-lag)*vec2(1.0,.8))*3.5)*(.004+speed*.018+u_energy*.012);

    float cloudOpacity=cloudMask*(.28+.17*day+.2*terminator);
    surface*=1.0-cloudMask*(.035+.035*day)*(1.0-waterMask*.25);
    surface=mix(surface,cloud,cloudOpacity);
    surface+=vec3(.18,.22,.24)*cloudMask*rim*.035*(.35+cloudDay);
    surface=mix(surface,vec3(.52,.58,.6),rim*.04*day);
    surface=mix(surface,vec3(luminance(surface)),smoothstep(.72,.94,luminance(surface))*.08);
    surface=mix(vec3(luminance(surface)),surface,.82);
    float exposure=mix(.7,1.0,day)*(1.0+terminator*.1);
    color=blackbodyGrade(surface*shade*exposure,day*.58)+cityGlow+atmosphere+aerialPerspective+pointerGlow+vec3(.58,.7,.82)*spec;
    color+=vec3(.0007,.002,.005);
  } else if(r2<cloudRadius*cloudRadius){
    float shellZ=sqrt(max(cloudRadius*cloudRadius-r2,0.0));
    vec3 cloudViewNormal=normalize(vec3(sp/cloudRadius,shellZ/cloudRadius));
    vec3 cloudNormalA=rotateY(rotateX(cloudViewNormal,.252+u_rotation.y*.92),.79+u_rotation.x+t*.043);
    vec3 cloudNormalB=rotateY(rotateX(cloudViewNormal,.246+u_rotation.y*.9),.805+u_rotation.x+t*.026);
    vec2 cuvA=flowWarp(sphereUv(cloudNormalA),t,7.5,.011);
    vec2 cuvB=flowWarp(sphereUv(cloudNormalB),t,13.0,.007);
    float light=dot(normalize(mix(cloudNormalA,cloudViewNormal,.2)),normalize(vec3(-.82,.18,.54)));
    float cloudDay=smoothstep(-.2,.48,light);
    float cloudA=sampleCloud(cuvA+vec2(t*.0065,.003*sin(t*.041)));
    float cloudB=sampleCloud(cuvB+vec2(-t*.0042,.002*cos(t*.033)));
    float fine=fbm(cuvA*vec2(140.0,70.0)+vec2(t*.016,-t*.01));
    float shellFade=smoothstep(radius*.992,cloudRadius,r)*(1.0-smoothstep(cloudRadius*.996,cloudRadius,r));
    float shellCloud=smoothstep(.28,.88,cloudA*.78+cloudB*.22)*smoothstep(.18,.82,fine)*shellFade;
    color+=vec3(.24,.35,.52)*shellFade*.035;
    color+=vec3(.58,.62,.64)*shellCloud*(.08+cloudDay*.22);
  } else {
    float halo=exp(-(r-radius)*16.0)*(1.0-smoothstep(radius,radius+.22,r));
    float outer=exp(-(r-radius)*3.4)*(1.0-smoothstep(radius,radius+.75,r));
    float bottomAtmosphere=smoothstep(-.85,-.2,p.y);
    color+=vec3(.018,.11,.4)*halo*(.013+.012*bottomAtmosphere);
    color+=vec3(.001,.003,.011)*outer*.004;
  }

  color*=1.0-smoothstep(.82,1.95,length(p))*0.18;
  color=filmic(color*1.08);
  color=pow(color,vec3(.98));
  gl_FragColor=vec4(color,1.0);
}
`;

export function setupBloomEnvironment(canvas) {
  const gl = canvas?.getContext('webgl', { alpha: false, antialias: false, depth: false, stencil: false });
  if (!gl) return;

  const program = createProgram(gl, vertex, fragment);
  if (!program) return;
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

  const earthTexture = createTexture(gl);
  const cloudTexture = createTexture(gl);
  const nightTexture = createTexture(gl);
  const galaxyTexture = createTexture(gl);
  loadTexture(gl, earthTexture, '/assets/nasa-blue-marble.jpg');
  loadTexture(gl, cloudTexture, '/assets/nasa-clouds-4096.jpg');
  loadTexture(gl, nightTexture, '/assets/nasa-night-lights-2012.jpg');
  loadTexture(gl, galaxyTexture, '/assets/galaxy.jpg');

  const shared = {
    pointer: { x: 0.5, y: 0.5 },
    lag: { x: 0.5, y: 0.5 },
    velocity: { x: 0, y: 0 },
    last: { x: 0.5, y: 0.5 },
    dragLast: { x: 0.5, y: 0.5 },
    rotation: { x: 0, y: 0 },
    targetRotation: { x: 0, y: 0 },
    dragging: false,
    energy: 0
  };

  let active = false;
  let frameId = 0;

  const onPointerDown = (event) => {
    const target = event.target;
    if (target?.closest?.('button, a, input, textarea, select')) return;
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    shared.dragging = true;
    shared.dragLast.x = (event.clientX - rect.left) / rect.width;
    shared.dragLast.y = 1 - (event.clientY - rect.top) / rect.height;
    shared.pointer.x = shared.dragLast.x;
    shared.pointer.y = shared.dragLast.y;
    canvas.setPointerCapture?.(event.pointerId);
  };

  const onPointerMove = (event) => {
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const x = (event.clientX - rect.left) / rect.width;
    const y = 1 - (event.clientY - rect.top) / rect.height;
    shared.velocity.x = (x - shared.last.x) * rect.width;
    shared.velocity.y = (y - shared.last.y) * rect.height;
    shared.pointer.x = x;
    shared.pointer.y = y;
    shared.last.x = x;
    shared.last.y = y;
    if (shared.dragging) {
      const dx = x - shared.dragLast.x;
      const dy = y - shared.dragLast.y;
      shared.targetRotation.x += dx * 3.8;
      shared.targetRotation.y = Math.max(-0.8, Math.min(0.8, shared.targetRotation.y + dy * 2.4));
      shared.dragLast.x = x;
      shared.dragLast.y = y;
    }
    shared.energy = Math.min(1, shared.energy + Math.hypot(shared.velocity.x, shared.velocity.y) / 540);
  };

  const onPointerUp = () => {
    shared.dragging = false;
  };

  const onPointerCancel = () => {
    shared.dragging = false;
  };

  const resize = () => {
    if (!canvas.clientWidth || !canvas.clientHeight) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const width = Math.floor(canvas.clientWidth * dpr);
    const height = Math.floor(canvas.clientHeight * dpr);
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
    }
  };

  const start = performance.now();
  const draw = (now) => {
    if (!active) return;
    resize();
    shared.lag.x += (shared.pointer.x - shared.lag.x) * 0.045;
    shared.lag.y += (shared.pointer.y - shared.lag.y) * 0.045;
    shared.velocity.x *= 0.92;
    shared.velocity.y *= 0.92;
    shared.rotation.x += (shared.targetRotation.x - shared.rotation.x) * 0.08;
    shared.rotation.y += (shared.targetRotation.y - shared.rotation.y) * 0.08;
    shared.energy += (0 - shared.energy) * 0.018;

    gl.useProgram(program);
    bind(gl, program, buffer);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, earthTexture);
    gl.uniform1i(gl.getUniformLocation(program, 'u_earth'), 0);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, cloudTexture);
    gl.uniform1i(gl.getUniformLocation(program, 'u_clouds'), 1);
    gl.activeTexture(gl.TEXTURE2);
    gl.bindTexture(gl.TEXTURE_2D, nightTexture);
    gl.uniform1i(gl.getUniformLocation(program, 'u_night'), 2);
    gl.activeTexture(gl.TEXTURE3);
    gl.bindTexture(gl.TEXTURE_2D, galaxyTexture);
    gl.uniform1i(gl.getUniformLocation(program, 'u_galaxy'), 3);
    gl.uniform2f(gl.getUniformLocation(program, 'u_resolution'), canvas.width, canvas.height);
    gl.uniform2f(gl.getUniformLocation(program, 'u_pointer'), shared.pointer.x, shared.pointer.y);
    gl.uniform2f(gl.getUniformLocation(program, 'u_lag'), shared.lag.x, shared.lag.y);
    gl.uniform2f(gl.getUniformLocation(program, 'u_velocity'), shared.velocity.x, shared.velocity.y);
    gl.uniform2f(gl.getUniformLocation(program, 'u_rotation'), shared.rotation.x, shared.rotation.y);
    gl.uniform1f(gl.getUniformLocation(program, 'u_time'), (now - start) / 1000);
    gl.uniform1f(gl.getUniformLocation(program, 'u_energy'), shared.energy);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    frameId = requestAnimationFrame(draw);
  };

  const resume = () => {
    if (active) return;
    active = true;
    window.addEventListener('pointerdown', onPointerDown, { passive: true, capture: true });
    window.addEventListener('pointermove', onPointerMove, { passive: true, capture: true });
    window.addEventListener('pointerup', onPointerUp, { passive: true, capture: true });
    window.addEventListener('pointercancel', onPointerCancel, { passive: true, capture: true });
    frameId = requestAnimationFrame(draw);
  };

  const pause = () => {
    if (!active) return;
    active = false;
    if (frameId) cancelAnimationFrame(frameId);
    frameId = 0;
    shared.dragging = false;
    window.removeEventListener('pointerdown', onPointerDown, { capture: true });
    window.removeEventListener('pointermove', onPointerMove, { capture: true });
    window.removeEventListener('pointerup', onPointerUp, { capture: true });
    window.removeEventListener('pointercancel', onPointerCancel, { capture: true });
  };

  const destroy = () => {
    pause();
    gl.deleteBuffer(buffer);
    gl.deleteTexture(earthTexture);
    gl.deleteTexture(cloudTexture);
    gl.deleteTexture(nightTexture);
    gl.deleteTexture(galaxyTexture);
    gl.deleteProgram(program);
  };

  return { pause, resume, destroy };
}

function createTexture(gl) {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([8, 12, 20, 255]));
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  return texture;
}

function loadTexture(gl, texture, src) {
  const image = new Image();
  image.onload = () => {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  };
  image.src = src;
}

function bind(gl, program, buffer) {
  const loc = gl.getAttribLocation(program, 'a_position');
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
}

function createProgram(gl, vsSource, fsSource) {
  const vs = shader(gl, gl.VERTEX_SHADER, vsSource);
  const fs = shader(gl, gl.FRAGMENT_SHADER, fsSource);
  if (!vs || !fs) return null;
  const program = gl.createProgram();
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('Bloom environment shader link failed:', gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }
  return program;
}

function shader(gl, type, source) {
  const s = gl.createShader(type);
  gl.shaderSource(s, source);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    console.error('Bloom environment shader compile failed:', gl.getShaderInfoLog(s));
    gl.deleteShader(s);
    return null;
  }
  return s;
}
