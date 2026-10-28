var K="personal_v1",S={view:"agenda",q:""},db,D=document.getElementById("dlg"),M=document.getElementById("main");
function p(n){return String(n).padStart(2,"0")}
function iso(d){return d.getFullYear()+"-"+p(d.getMonth()+1)+"-"+p(d.getDate())}
function addD(s,n){var d=new Date(s+"T12:00:00");d.setDate(d.getDate()+n);return iso(d)}
function uid(){return Math.random().toString(36).slice(2,9)}
function esc(s){return String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/"/g,"&quot;")}
var today=iso(new Date());S.sel=today;S.month=today.slice(0,7);
function seed(){
 return {biz:"Personal Carla Nunes",
 services:[{id:"s1",name:"Treino individual",price:90},{id:"s2",name:"Treino em dupla",price:60},{id:"s3",name:"Avaliação física",price:120},{id:"s4",name:"Aula experimental",price:0}],
 hours:{start:"06:00",end:"21:00",step:60,open:[1,2,3,4,5,6]},
 clients:[{id:"c1",name:"Marina Costa",phone:"61999990001",goal:"Emagrecimento",credits:6,notes:"Joelho direito sensível, evitar impacto"},{id:"c2",name:"Pedro Rocha",phone:"61999990002",goal:"Ganho de massa",credits:2,notes:""},{id:"c3",name:"Ana Beatriz",phone:"61999990003",goal:"Condicionamento para corrida",credits:8,notes:"Treina em jejum, levar uma fruta"}],
 appts:[{id:"a1",clientId:"c1",serviceId:"s1",date:today,time:"07:00",status:"agendado"},{id:"a2",clientId:"c2",serviceId:"s1",date:today,time:"18:00",status:"agendado"},{id:"a3",clientId:"c3",serviceId:"s1",date:addD(today,1),time:"06:00",status:"agendado"},{id:"a4",clientId:"c1",serviceId:"s1",date:addD(today,1),time:"19:00",status:"agendado"}],
 msg:"Oi, {nome}! Lembrete do seu treino: {servico}, {data} às {hora}. Traga água e toalha. Se precisar remarcar, me avise com antecedência."}
}
function load(){try{var r=localStorage.getItem(K);if(r){db=JSON.parse(r);return}}catch(e){}db=seed()}
function save(){try{localStorage.setItem(K,JSON.stringify(db))}catch(e){}}
load();
function pk(c){return typeof c.credits=="number"?'<span class="pill'+(c.credits<=2?" low":"")+'">'+c.credits+" aula(s) no pacote</span>":""}
function cl(id){return db.clients.find(function(c){return c.id==id})||{name:"(removido)",phone:""}}
function sv(id){return db.services.find(function(s){return s.id==id})||{name:"(serviço removido)",price:0}}
function dayList(s){return db.appts.filter(function(a){return a.date==s}).sort(function(a,b){return a.time<b.time?-1:1})}
function fmtDay(s){return new Date(s+"T12:00:00").toLocaleDateString("pt-BR",{weekday:"long",day:"numeric",month:"long"})}
function fmtShort(s){return new Date(s+"T12:00:00").toLocaleDateString("pt-BR",{day:"numeric",month:"long"})}
function norm(ph){var d=String(ph).replace(/\D/g,"");return d.length<=11?"55"+d:d}
function msgFor(a){var c=cl(a.clientId);return db.msg.replace(/\{nome\}/g,c.name.split(" ")[0]).replace(/\{servico\}/g,sv(a.serviceId).name).replace(/\{data\}/g,a.date==today?"hoje":a.date==addD(today,1)?"amanhã":fmtShort(a.date)).replace(/\{hora\}/g,a.time).replace(/\{negocio\}/g,db.biz)}
function wa(ph,t){return "https://wa.me/"+norm(ph)+"?text="+encodeURIComponent(t)}
function slots(){var o=[],a=db.hours.start.split(":"),b=db.hours.end.split(":"),m=+a[0]*60+ +a[1],e=+b[0]*60+ +b[1];for(;m<e;m+=+db.hours.step)o.push(p(Math.floor(m/60))+":"+p(m%60));return o}

var V={};
V.agenda=function(){
 var y=+S.month.slice(0,4),m=+S.month.slice(5)-1,first=new Date(y,m,1),n=new Date(y,m+1,0).getDate(),h="";
 for(var i=0;i<first.getDay();i++)h+="<i></i>";
 for(var d=1;d<=n;d++){var s=y+"-"+p(m+1)+"-"+p(d),c=dayList(s).filter(function(a){return a.status!="cancelado"}).length;
  h+='<button class="day'+(s==today?" td":"")+(s==S.sel?" sel":"")+'" data-a="sel" data-d="'+s+'">'+d+(c?"<u>"+c+"</u>":"")+"</button>"}
 var mt=first.toLocaleDateString("pt-BR",{month:"long",year:"numeric"});
 var L=dayList(S.sel);
 var list=L.length?L.map(apHTML).join(""):'<div class="empty">Nenhum horário marcado neste dia.</div>';
 return '<h1>Agenda</h1><div class="ag"><div class="card"><div class="mh"><button class="b" data-a="mm" data-n="-1" aria-label="Mês anterior">‹</button><b>'+mt+'</b><button class="b" data-a="mm" data-n="1" aria-label="Próximo mês">›</button></div><div class="cal"><small>D</small><small>S</small><small>T</small><small>Q</small><small>Q</small><small>S</small><small>S</small>'+h+'</div></div>'+
 '<div class="card"><div class="top"><h3 style="margin:0;text-transform:capitalize">'+fmtDay(S.sel)+'</h3><button class="b pri" data-a="newap">+ Agendar</button></div>'+list+"</div></div>"
};
function apHTML(a){
 var c=cl(a.clientId),x=a.status=="cancelado";
 return '<div class="ap'+(x?" x":"")+'"><div class="t">'+a.time+'</div><div class="i"><b>'+esc(c.name)+'</b><span class="pill '+a.status+'">'+a.status+'</span><small>'+esc(sv(a.serviceId).name)+" · R$ "+sv(a.serviceId).price+'</small><div class="row">'+
 (a.status=="agendado"?'<button class="b" data-a="st" data-id="'+a.id+'" data-s="concluido">Concluir</button><button class="b bad" data-a="st" data-id="'+a.id+'" data-s="cancelado">Cancelar</button>':'<button class="b" data-a="st" data-id="'+a.id+'" data-s="agendado">Reabrir</button>')+
 '<button class="b" data-a="edap" data-id="'+a.id+'">Editar</button></div></div></div>'
}
V.clientes=function(){
 return '<div class="top"><h1 style="margin:0">Clientes</h1><button class="b pri" data-a="newcl">+ Novo cliente</button></div><input id="q" placeholder="Buscar por nome ou telefone" value="'+esc(S.q)+'" oninput="S.q=this.value;document.getElementById(\'cl\').innerHTML=clHTML()" style="width:100%;padding:11px;border:1px solid var(--line);border-radius:10px;background:var(--card);margin-bottom:12px"><div class="card" id="cl">'+clHTML()+"</div>"
};
function clHTML(){
 var q=S.q.toLowerCase(),L=db.clients.filter(function(c){return (c.name+c.phone).toLowerCase().indexOf(q)>-1});
 if(!L.length)return '<div class="empty">Nenhum cliente encontrado.</div>';
 return L.map(function(c){
  var v=db.appts.filter(function(a){return a.clientId==c.id&&a.status=="concluido"}),last=v.map(function(a){return a.date}).sort().pop();
  return '<div class="ap"><div class="i"><b>'+esc(c.name)+'</b>'+pk(c)+'<small>'+esc(c.phone)+(c.goal?" · "+esc(c.goal):"")+" · "+v.length+" treino(s) feito(s)"+(last?" · último em "+fmtShort(last):"")+"</small>"+(c.notes?"<small>"+esc(c.notes)+"</small>":"")+
  '<div class="row"><button class="b pri" data-a="newap" data-c="'+c.id+'">Agendar</button><button class="b" data-a="edcl" data-id="'+c.id+'">Editar</button><button class="b" data-a="cred" data-id="'+c.id+'">+ Aulas</button><a class="b" target="_blank" rel="noopener" href="'+wa(c.phone,"")+'">WhatsApp</a></div></div></div>'}).join("")
}
V.lembretes=function(){
 var h='<h1>Lembretes</h1><p style="color:var(--mut);margin-top:-8px">Toque em “Enviar” para abrir o WhatsApp com a mensagem pronta. Você só confirma o envio.</p>';
 [[today,"Hoje"],[addD(today,1),"Amanhã"],[addD(today,2),"Depois de amanhã"]].forEach(function(g){
  var L=dayList(g[0]).filter(function(a){return a.status=="agendado"});
  h+="<h2>"+g[1]+"</h2><div class=\"card\">"+(L.length?L.map(function(a){var c=cl(a.clientId);
   return '<div class="ap"><div class="t">'+a.time+'</div><div class="i"><b>'+esc(c.name)+'</b><small>'+esc(sv(a.serviceId).name)+'</small><div class="row">'+
   (a.sent?'<span class="sent">✓ Lembrete enviado</span>':"")+'<a class="b'+(a.sent?"":" pri")+'" target="_blank" rel="noopener" data-a="sent" data-id="'+a.id+'" href="'+wa(c.phone,msgFor(a))+'">'+(a.sent?"Enviar de novo":"Enviar lembrete")+"</a></div></div></div>"}).join(""):'<div class="empty">Sem horários marcados.</div>')+"</div>"});
 var lo=db.clients.filter(function(c){return typeof c.credits=="number"&&c.credits<=2});
 h+="<h2>Pacotes acabando</h2><div class=\"card\">"+(lo.length?lo.map(function(c){return '<div class="ap"><div class="i"><b>'+esc(c.name)+'</b>'+pk(c)+'<div class="row"><a class="b pri" target="_blank" rel="noopener" href="'+wa(c.phone,"Oi, "+c.name.split(" ")[0]+"! Seu pacote está acabando ("+c.credits+" aula(s) restante(s)). Vamos renovar para manter o ritmo?")+'">Oferecer renovação</a></div></div></div>'}).join(""):'<div class="empty">Nenhum pacote acabando.</div>')+"</div>";
 return h
};
V.ajustes=function(){
 var days=["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"];
 return '<h1>Ajustes</h1><div class="card"><label>Nome do negócio<input value="'+esc(db.biz)+'" onchange="db.biz=this.value;save();render()"></label>'+
 '<div class="g2"><label>Abre às<input type="time" value="'+db.hours.start+'" onchange="db.hours.start=this.value;save()"></label><label>Fecha às<input type="time" value="'+db.hours.end+'" onchange="db.hours.end=this.value;save()"></label></div>'+
 '<label>Intervalo entre horários<select onchange="db.hours.step=+this.value;save()">'+[15,20,30,45,60].map(function(n){return '<option value="'+n+'"'+(n==db.hours.step?" selected":"")+">"+n+" minutos</option>"}).join("")+"</select></label>"+
 '<div style="font-size:14px;font-weight:600;margin-bottom:6px">Dias de atendimento</div><div class="chk">'+days.map(function(d,i){return '<label><input type="checkbox" '+(db.hours.open.indexOf(i)>-1?"checked":"")+' onchange="tgOpen('+i+',this.checked)">'+d+"</label>"}).join("")+"</div></div>"+
 '<h2>Serviços</h2><div class="card">'+db.services.map(function(s){return '<div class="sv"><span>'+esc(s.name)+" · R$ "+s.price+'</span><button class="b bad" data-a="rmsv" data-id="'+s.id+'">Remover</button></div>'}).join("")+
 '<div class="g2" style="margin-top:12px"><label>Novo serviço<input id="sn"></label><label>Preço (R$)<input id="sp" type="number" min="0"></label></div><button class="b pri" data-a="addsv">Adicionar serviço</button></div>'+
 '<h2>Mensagem do lembrete</h2><div class="card"><label>Use {nome}, {servico}, {data}, {hora} e {negocio}<textarea rows="4" onchange="db.msg=this.value;save()">'+esc(db.msg)+'</textarea></label></div>'+
 '<h2>Backup dos dados</h2><div class="card"><p style="margin-top:0;color:var(--mut)">Os dados ficam salvos neste navegador. Copie o texto abaixo para guardar uma cópia ou cole um backup para restaurar.</p><textarea id="bk" rows="4" style="width:100%;padding:10px;border:1px solid var(--line);border-radius:10px;background:var(--bg)"></textarea><div class="row end"><button class="b" data-a="bkshow">Mostrar backup</button><button class="b" data-a="bkrest">Restaurar</button><button class="b bad" data-a="reset">Voltar ao exemplo</button></div></div>'
};
function tgOpen(i,on){var o=db.hours.open;o=o.filter(function(x){return x!=i});if(on)o.push(i);db.hours.open=o;save()}
function render(){
 Array.prototype.forEach.call(document.querySelectorAll("nav button"),function(b){b.classList.toggle("on",b.dataset.v==S.view)});
 document.getElementById("brand").textContent=db.biz;document.title=db.biz+" · Agenda";
 M.innerHTML=V[S.view]()
}
function dlg(title,body,fn,label){
 D.innerHTML="<h3>"+title+"</h3>"+body+'<div class="err" id="err"></div><div class="row end"><button class="b" data-a="x">Fechar</button><button class="b pri" data-a="ok">'+(label||"Salvar")+"</button></div>";
 D.fn=fn;D.showModal()
}
function apDlg(id,cid){
 var a=id?db.appts.find(function(x){return x.id==id}):{date:S.sel,clientId:cid||"",serviceId:(db.services[0]||{}).id,time:"",status:"agendado"};
 window.EID=id;window.CT=a.time;
 dlg(id?"Editar agendamento":"Novo agendamento",
 '<label>Cliente<select id="fc" onchange="tgl()">'+db.clients.map(function(c){return '<option value="'+c.id+'"'+(c.id==a.clientId?" selected":"")+">"+esc(c.name)+"</option>"}).join("")+'<option value="new"'+(db.clients.length?"":" selected")+'>+ Novo cliente</option></select></label>'+
 '<div id="nc" hidden><label>Nome<input id="fn"></label><label>WhatsApp<input id="fp" inputmode="tel" placeholder="61 99999-9999"></label></div>'+
 '<label>Serviço<select id="fs">'+db.services.map(function(s){return '<option value="'+s.id+'"'+(s.id==a.serviceId?" selected":"")+">"+esc(s.name)+" · R$ "+s.price+"</option>"}).join("")+"</select></label>"+
 '<div class="g2"><label>Data<input type="date" id="fd" value="'+a.date+'" onchange="fillT()"></label><label>Horário<select id="ft"></select></label></div>',
 function(){
  var v=function(i){return document.getElementById(i).value},cid=v("fc");
  if(!v("ft"))return "Escolha um horário livre.";
  if(cid=="new"){if(!v("fn").trim())return "Informe o nome do cliente.";cid=uid();db.clients.push({id:cid,name:v("fn").trim(),phone:v("fp"),notes:""})}
  var o={clientId:cid,serviceId:v("fs"),date:v("fd"),time:v("ft")};
  if(EID){var t=db.appts.find(function(x){return x.id==EID});Object.assign(t,o);t.sent=false}else{o.id=uid();o.status="agendado";db.appts.push(o)}
  S.sel=o.date;S.month=o.date.slice(0,7);S.view="agenda"
 });
 tgl();fillT()
}
function tgl(){document.getElementById("nc").hidden=document.getElementById("fc").value!="new"}
function fillT(){
 var d=document.getElementById("fd").value,dow=new Date(d+"T12:00:00").getDay(),sel=document.getElementById("ft"),h="";
 if(db.hours.open.indexOf(dow)<0){sel.innerHTML='<option value="">Fechado neste dia</option>';return}
 var busy=dayList(d).filter(function(a){return a.status!="cancelado"&&a.id!=EID}).map(function(a){return a.time});
 slots().forEach(function(t){var b=busy.indexOf(t)>-1;h+='<option value="'+t+'"'+(b?" disabled":"")+(t==CT&&!b?" selected":"")+">"+t+(b?" (ocupado)":"")+"</option>"});
 sel.innerHTML=h;if(!sel.value){var f=sel.querySelector("option:not([disabled])");if(f)f.selected=true}
}
function clDlg(id){
 var c=id?cl(id):{name:"",phone:"",notes:""};
 dlg(id?"Editar cliente":"Novo cliente",'<label>Nome<input id="cn" value="'+esc(c.name)+'"></label><label>WhatsApp<input id="cp" inputmode="tel" value="'+esc(c.phone)+'" placeholder="61 99999-9999"></label><label>Objetivo<input id="cg" value="'+esc(c.goal||"")+'" placeholder="Ex.: emagrecimento"></label><label>Aulas restantes no pacote (vazio se não tiver pacote)<input id="cr" type="number" min="0" value="'+(typeof c.credits=="number"?c.credits:"")+'"></label><label>Observações<textarea id="co" rows="3">'+esc(c.notes)+"</textarea></label>",function(){
  var n=document.getElementById("cn").value.trim();if(!n)return "Informe o nome.";
  var cr=document.getElementById("cr").value,o={name:n,phone:document.getElementById("cp").value,notes:document.getElementById("co").value,goal:document.getElementById("cg").value,credits:cr===""?null:+cr};
  if(id)Object.assign(db.clients.find(function(x){return x.id==id}),o);else{o.id=uid();db.clients.push(o)}
 })
}
var A={
 go:function(d){S.view=d.v;render()},
 sel:function(d){S.sel=d.d;render()},
 mm:function(d){var y=+S.month.slice(0,4),m=+S.month.slice(5)-1+ +d.n,dt=new Date(y,m,1);S.month=dt.getFullYear()+"-"+p(dt.getMonth()+1);render()},
 newap:function(d){apDlg(null,d.c)},edap:function(d){apDlg(d.id)},
 st:function(d){var a=db.appts.find(function(x){return x.id==d.id}),c=db.clients.find(function(x){return x.id==a.clientId});
  if(c&&typeof c.credits=="number"){if(d.s=="concluido"&&!a.used){c.credits=Math.max(0,c.credits-1);a.used=true}else if(d.s!="concluido"&&a.used){c.credits++;a.used=false}}
  a.status=d.s;save();render()},
 cred:function(d){var c=cl(d.id),n=prompt("Quantas aulas adicionar ao pacote?","8");if(n===null)return;n=parseInt(n);if(!n)return;c.credits=(typeof c.credits=="number"?c.credits:0)+n;save();render()},
 newcl:function(){clDlg()},edcl:function(d){clDlg(d.id)},
 x:function(){D.close()},
 ok:function(){var r=D.fn();if(r){document.getElementById("err").textContent=r;return}D.close();save();render()},
 sent:function(d){var a=db.appts.find(function(x){return x.id==d.id});a.sent=true;save();setTimeout(render,400)},
 addsv:function(){var n=document.getElementById("sn").value.trim();if(!n)return;db.services.push({id:uid(),name:n,price:+document.getElementById("sp").value||0});save();render()},
 rmsv:function(d){db.services=db.services.filter(function(s){return s.id!=d.id});save();render()},
 bkshow:function(){document.getElementById("bk").value=JSON.stringify(db)},
 bkrest:function(){try{var o=JSON.parse(document.getElementById("bk").value);if(!o.appts||!o.clients)throw 1;db=o;save();render()}catch(e){alert("Backup inválido. Cole o texto completo copiado antes.")}},
 reset:function(){if(confirm("Apagar tudo e voltar aos dados de exemplo?")){db=seed();save();render()}}
};
document.addEventListener("click",function(e){var b=e.target.closest("[data-a]");if(b&&A[b.dataset.a])A[b.dataset.a](b.dataset)});
render();

var installButton=document.getElementById("install-app"),installPrompt;
window.addEventListener("beforeinstallprompt",function(e){
 e.preventDefault();installPrompt=e;installButton.hidden=false
});
installButton.addEventListener("click",async function(){
 if(!installPrompt)return;
 installPrompt.prompt();
 await installPrompt.userChoice;
 installPrompt=null;installButton.hidden=true
});
window.addEventListener("appinstalled",function(){installPrompt=null;installButton.hidden=true});
if("serviceWorker" in navigator){
 window.addEventListener("load",function(){
  navigator.serviceWorker.register("./service-worker.js").catch(function(error){console.error("Não foi possível ativar o modo offline:",error)})
 })
}
