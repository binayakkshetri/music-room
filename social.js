/* Music Room social v6 — persistent data in Supabase; no server-side secrets in browser. */
(()=>{'use strict';
const el=id=>document.getElementById(id);
const cfg=window.MUSIC_ROOM_CONFIG||{};
const valid=cfg.url?.startsWith('https://') && cfg.anonKey && !cfg.anonKey.startsWith('PASTE_');
if(!valid || !window.supabase){el('authError').textContent='Setup required: configure social-config.js and Supabase first. See README.md.';return;}
const db=window.supabase.createClient(cfg.url,cfg.anonKey,{auth:{persistSession:true,autoRefreshToken:true}});
let me=null, selected=null, friends=[], channel=null, lastHistoryId='',lastHistoryAt=0,activeRoom='';
const safe=s=>String(s||'').slice(0,2000);
const err=e=>{console.error(e);el('authError').textContent=e?.message||String(e)};
const username=u=>u.trim().toLowerCase();
const synthetic=u=>`${u}@users.music-room.invalid`;
const roomId=()=>new URLSearchParams(location.hash.replace(/^#/, '')).get('room')||'';
const roomLink=()=>location.origin+location.pathname+'#room='+encodeURIComponent(roomId());
const show=(id,value)=>el(id).hidden=!value;
async function auth(mode){const u=username(el('authUser').value),password=el('authPass').value;el('authError').textContent='';
if(!/^[a-z0-9_]{3,24}$/.test(u)){el('authError').textContent='Use 3–24 letters, numbers or underscores.';return;}
if(password.length<6){el('authError').textContent='Password must have at least 6 characters.';return;}
try{let result;
if(mode==='signup'){
  const exists=await db.rpc('find_username',{target:u});if(exists.data?.length){el('authError').textContent='Username is already taken.';return;}
  result=await db.auth.signUp({email:synthetic(u),password});
  if(result.error)throw result.error;
  if(!result.data.session){el('authError').textContent='Disable email confirmation in Supabase Auth settings for username-only registration.';return;}
  const add=await db.from('profiles').insert({id:result.data.user.id,username:u,display_name:u});if(add.error)throw add.error;
}else{result=await db.auth.signInWithPassword({email:synthetic(u),password});if(result.error)throw result.error;}
await start();
}catch(e){err(e);}}
async function start(){const {data:{user}}=await db.auth.getUser();if(!user){show('loginScreen',true);return;}
const {data,error}=await db.from('profiles').select('*').eq('id',user.id).maybeSingle();if(error){err(error);return;}
if(!data){el('authError').textContent='Account profile missing. Contact the room owner.';show('loginScreen',true);return;}
me=data;show('loginScreen',false);el('accountName').textContent='@'+me.username;
const nick=el('nickname');if(nick){nick.value=me.display_name||me.username;localStorage.setItem('mr-name',me.display_name||me.username);}
await Promise.all([loadFriends(),loadHistory()]);await heartbeat();
if(channel)await db.removeChannel(channel);
channel=db.channel('messages-'+me.id).on('postgres_changes',{event:'INSERT',schema:'public',table:'messages',filter:'recipient=eq.'+me.id},()=>{loadMessages();loadFriends()}).on('postgres_changes',{event:'*',schema:'public',table:'friendships'},()=>loadFriends()).subscribe();
}
async function heartbeat(){if(!me)return;activeRoom=roomId();await db.from('profiles').update({last_seen:new Date().toISOString(),active_room:activeRoom}).eq('id',me.id);}
async function loadFriends(){if(!me)return;
const {data,error}=await db.from('friendships').select('id,requester,recipient,status').or(`requester.eq.${me.id},recipient.eq.${me.id}`);if(error){console.error(error);return;}
const ids=[...new Set((data||[]).map(f=>f.requester===me.id?f.recipient:f.requester))];
const profiles=ids.length?(await db.from('profiles').select('id,username,display_name,active_room,last_seen').in('id',ids)).data||[]:[];
friends=(data||[]).map(f=>({...f,person:profiles.find(p=>p.id===(f.requester===me.id?f.recipient:f.requester))})).filter(f=>f.person);
const root=el('socialFriends');root.replaceChildren();if(!friends.length){const d=document.createElement('div');d.className='muted';d.textContent='No friends yet. Add someone by username.';root.append(d);return;}
for(const f of friends){const p=f.person;const online=p.last_seen && Date.now()-Date.parse(p.last_seen)<65000;const box=document.createElement('div');box.className='social-card';const info=document.createElement('div');const title=document.createElement('strong');title.textContent='@'+p.username;const sub=document.createElement('small');sub.style.display='block';sub.className=online?'online-dot':'offline-dot';sub.textContent=online?'● Online'+(p.active_room?' · In a room':''):'○ Offline';info.append(title,sub);box.append(info);
if(f.status==='pending'){const pending=document.createElement('button');pending.className='mini-btn';pending.textContent=f.recipient===me.id?'Accept':'Requested';pending.disabled=f.recipient!==me.id;pending.onclick=async()=>{const r=await db.from('friendships').update({status:'accepted'}).eq('id',f.id);if(r.error)alert(r.error.message);await loadFriends()};box.append(pending)}
else{const actions=document.createElement('div');actions.className='social-line';const chat=document.createElement('button');chat.className='mini-btn';chat.textContent='Chat';chat.onclick=()=>{selected=p;el('chatTitle').textContent='💌 @'+p.username;loadMessages()};actions.append(chat);if(online&&p.active_room){const join=document.createElement('button');join.className='mini-btn';join.textContent='Join ♫';join.onclick=()=>joinRoom(p.active_room);actions.append(join)}box.append(actions)}root.append(box)}
}
async function addFriend(){if(!me)return;const u=username(el('findUsername').value);if(!/^[a-z0-9_]{3,24}$/.test(u)){alert('Enter a valid username');return;}
const {data:matches,error}=await db.rpc('find_username',{target:u});const p=matches?.[0];if(error||!p){alert('Username not found');return;}if(p.id===me.id){alert('That is you 💗');return;}
if(friends.some(f=>f.person.id===p.id)){alert('Friend request already exists');return;}
const r=await db.from('friendships').insert({requester:me.id,recipient:p.id});if(r.error)alert(r.error.message);else{el('findUsername').value='';await loadFriends();}}
async function loadMessages(){const root=el('chatMessages');root.replaceChildren();if(!me||!selected){root.textContent='Choose a friend to chat.';return;}
const {data,error}=await db.from('messages').select('id,sender,recipient,body,created_at').or(`and(sender.eq.${me.id},recipient.eq.${selected.id}),and(sender.eq.${selected.id},recipient.eq.${me.id})`).order('created_at',{ascending:false}).limit(100);
if(error){root.textContent=error.message;return;}
for(const m of (data||[]).reverse()){const b=document.createElement('div');b.className='bubble'+(m.sender===me.id?' mine':'');const label=document.createElement('small');label.textContent=(m.sender===me.id?'You':selected.username)+' · '+new Date(m.created_at).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});b.append(label);
const match=safe(m.body).match(/https:\/\/[^\s]+/g);let rest=safe(m.body);for(const link of match||[]){const at=rest.indexOf(link);if(at<0)continue;b.append(document.createTextNode(rest.slice(0,at)));let u;try{u=new URL(link)}catch{};if(u&&u.origin===location.origin&&u.pathname===location.pathname&&u.hash.includes('room=')){const a=document.createElement('a');a.href=link;a.textContent='🎵 Join listening room';b.append(a)}else b.append(document.createTextNode(link));rest=rest.slice(at+link.length)}b.append(document.createTextNode(rest));root.append(b)}root.scrollTop=root.scrollHeight;
}
async function sendMessage(body){if(!me||!selected)return;body=safe(body).trim();if(!body)return;const r=await db.from('messages').insert({sender:me.id,recipient:selected.id,body});if(r.error){alert(r.error.message);return;}el('chatInput').value='';await loadMessages()}
async function loadHistory(){if(!me)return;const {data,error}=await db.from('play_history').select('video_id,title,played_at').eq('user_id',me.id).order('played_at',{ascending:false}).limit(100);if(error){console.error(error);return;}
const seen=new Set(),items=[];for(const row of data||[]){if(seen.has(row.video_id))continue;seen.add(row.video_id);items.push(row);if(items.length===15)break;}
const root=el('historyList');root.replaceChildren();if(!items.length){root.textContent='No songs played yet.';return;}
for(const item of items){const d=document.createElement('div');d.className='history-item';const name=document.createElement('span');name.textContent=item.title;const add=document.createElement('button');add.className='mini-btn';add.textContent='+ Queue';add.onclick=()=>{const url=`https://www.youtube.com/watch?v=${item.video_id}`;el('url').value=url;el('add').click()};d.append(name,add);root.append(d)}
}
async function captureSong(){if(!me)return;const title=el('trackName')?.textContent||'';const isEmpty=title==='Your listening room';if(isEmpty)return;
let id='';try{const player=window.__musicRoomPlayer;const v=player?.getVideoData?.();if(v?.video_id)id=v.video_id}catch{}
// The existing player is scoped inside its controller; fall back to the visible queue title / YouTube URL where possible.
if(!id){const active=document.querySelector('.track.active');const img=active?.querySelector('img[src*="i.ytimg.com"]');id=img?.src.match(/\/vi\/([\w-]{11})\//)?.[1]||'';}
if(!/^[\w-]{11}$/.test(id))return;
if(id===lastHistoryId&&Date.now()-lastHistoryAt<300000)return;lastHistoryId=id;lastHistoryAt=Date.now();
const r=await db.from('play_history').insert({user_id:me.id,video_id:id,title:title.slice(0,250)});if(!r.error)loadHistory();}
function joinRoom(id){if(!/^[a-zA-Z0-9-]{8,100}$/.test(id))return;location.href=location.pathname+location.search+'#room='+encodeURIComponent(id);location.reload()}
async function logout(){if(me)await db.from('profiles').update({active_room:null,last_seen:new Date(0).toISOString()}).eq('id',me.id);await db.auth.signOut();location.reload()}
el('loginBtn').onclick=()=>auth('login');el('signupBtn').onclick=()=>auth('signup');el('authPass').onkeydown=e=>{if(e.key==='Enter')auth('login')};el('sendRequest').onclick=addFriend;el('sendChat').onclick=()=>sendMessage(el('chatInput').value);el('chatInput').onkeydown=e=>{if(e.key==='Enter')sendMessage(el('chatInput').value)};
el('shareRoomChat').onclick=()=>sendMessage('Come listen with me 💋 '+roomLink());el('refreshHistory').onclick=loadHistory;el('logoutBtn').onclick=logout;
setInterval(()=>{if(me){heartbeat();loadFriends();if(selected)loadMessages()}},20000);
setInterval(captureSong,5000);
start();
})();
