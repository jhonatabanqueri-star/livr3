import { useState, useEffect, useRef } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from "recharts";

const RED="#ef4444", RED_DIM="#b91c1c", BG="#0d0d0d", BG2="#141414", BG3="#1a1a1a", BDR="rgba(255,255,255,0.07)";
const GREEN="#22c55e", GREEN_DIM="#16a34a";
const CATEGORIAS=["Profissional","Intelectual","Físico","Emocional/Espiritual"];
const CAT_REC=["Salário","Comissão","Outros"];
const CAT_DESP_VAR=["Alimentação","Restaurante","Compras","Lazer","Transporte","Saúde","Outros"];
const CAT_INV=["Aporte","Reserva de Emergência","Renda Fixa","Renda Variável","Cripto","Outros"];
const CAT_FIXAS_SUGESTOES=["Aluguel","Internet","Energia","Água","Academia","Plano de Saúde","Assinatura Netflix","Assinatura Spotify","Seguro","Outros"];
const DEFAULT_HABITS=[
  {id:"agua",label:"Água",color:RED},{id:"exercicio",label:"Exercício",color:RED},
  {id:"leitura",label:"Leitura",color:RED},{id:"meditacao",label:"Meditação",color:RED},
  {id:"sono",label:"Sono",color:RED},{id:"alimentacao",label:"Alimentação",color:RED},
];
const today=new Date(), Y=today.getFullYear(), M=today.getMonth(), DAY=today.getDate();
function mkKeyM(m,d){return `${Y}-${String(m+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;}
function genId(){return Math.random().toString(36).slice(2,8);}
function getDIM(m){return new Date(Y,m+1,0).getDate();}
const fmtBRL=v=>"R$"+Math.abs(v).toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2});

function EditCell({value,color,onSave}){
  const [editing,setEditing]=useState(false);
  const [val,setVal]=useState("");
  const commit=v=>{onSave(parseFloat(String(v).replace(",","."))||0);setEditing(false);};
  const startEdit=()=>{setVal(value>0?String(value):"");setEditing(true);};
  return(
    <div
      onClick={!editing?startEdit:undefined}
      style={{
        position:"relative",width:"100%",minHeight:32,cursor:editing?"default":"pointer",
        display:"flex",alignItems:"center",justifyContent:"center",
        borderRadius:6,
        background:editing?`${color}22`:value>0?`${color}0d`:"transparent",
        border:editing?`2px solid ${color}`:`2px solid ${value>0?color+"33":"transparent"}`,
        transition:"all 0.12s",boxSizing:"border-box",
      }}
      onMouseEnter={e=>{if(!editing)e.currentTarget.style.background=`${color}22`;}}
      onMouseLeave={e=>{if(!editing)e.currentTarget.style.background=value>0?`${color}0d`:"transparent";}}
    >
      {editing?(
        <input autoFocus type="number" value={val}
          onChange={e=>setVal(e.target.value)}
          onBlur={()=>commit(val)}
          onKeyDown={e=>{if(e.key==="Enter")commit(val);if(e.key==="Escape")setEditing(false);}}
          onClick={e=>e.stopPropagation()}
          style={{position:"absolute",inset:0,width:"100%",height:"100%",background:"transparent",border:"none",
            color:"#fff",fontSize:12,fontWeight:800,padding:"0 6px",outline:"none",textAlign:"center",
            MozAppearance:"textfield",WebkitAppearance:"none",boxSizing:"border-box"}}
        />
      ):(
        <span style={{color:value>0?color:"#2d2d2d",fontWeight:value>0?700:500,fontSize:value>0?11:14,userSelect:"none",pointerEvents:"none"}}>
          {value>0?fmtBRL(value):"·"}
        </span>
      )}
    </div>
  );
}

function AddExercicio({fichaId,onAdd}){
  const [open,setOpen]=useState(false);
  const [d,setD]=useState({nome:"",series:3,reps:"10",peso:"",descanso:60});
  if(!open)return(
    <button onClick={()=>setOpen(true)} style={{width:"100%",padding:"7px",borderRadius:8,border:"1px dashed rgba(251,146,60,0.3)",background:"transparent",color:"rgba(251,146,60,0.6)",fontSize:12,fontWeight:600,cursor:"pointer"}}>+ Adicionar exercício</button>
  );
  return(
    <div style={{background:"rgba(251,146,60,0.06)",border:"1px solid rgba(251,146,60,0.2)",borderRadius:10,padding:"12px"}}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
        <input value={d.nome} onChange={e=>setD(p=>({...p,nome:e.target.value}))} placeholder="Nome do exercício"
          style={{gridColumn:"1/-1",background:"#0d0d0d",border:`1px solid rgba(255,255,255,0.1)`,borderRadius:8,color:"#e5e5e5",fontSize:12,padding:"8px 10px",outline:"none"}}/>
        <input type="number" value={d.series} onChange={e=>setD(p=>({...p,series:e.target.value}))} placeholder="Séries"
          style={{background:"#0d0d0d",border:`1px solid rgba(255,255,255,0.1)`,borderRadius:8,color:"#e5e5e5",fontSize:12,padding:"8px 10px",outline:"none",MozAppearance:"textfield"}}/>
        <input value={d.reps} onChange={e=>setD(p=>({...p,reps:e.target.value}))} placeholder="Reps (ex: 10 ou 8-12)"
          style={{background:"#0d0d0d",border:`1px solid rgba(255,255,255,0.1)`,borderRadius:8,color:"#e5e5e5",fontSize:12,padding:"8px 10px",outline:"none"}}/>
        <input type="number" value={d.peso} onChange={e=>setD(p=>({...p,peso:e.target.value}))} placeholder="Peso (kg)"
          style={{background:"#0d0d0d",border:`1px solid rgba(255,255,255,0.1)`,borderRadius:8,color:"#e5e5e5",fontSize:12,padding:"8px 10px",outline:"none",MozAppearance:"textfield"}}/>
        <input type="number" value={d.descanso} onChange={e=>setD(p=>({...p,descanso:e.target.value}))} placeholder="Descanso (s)"
          style={{background:"#0d0d0d",border:`1px solid rgba(255,255,255,0.1)`,borderRadius:8,color:"#e5e5e5",fontSize:12,padding:"8px 10px",outline:"none",MozAppearance:"textfield"}}/>
      </div>
      <div style={{display:"flex",gap:6}}>
        <button onClick={()=>{if(!d.nome.trim())return;onAdd(fichaId,d);setD({nome:"",series:3,reps:"10",peso:"",descanso:60});setOpen(false);}}
          style={{flex:1,padding:"7px",borderRadius:8,border:"none",background:"linear-gradient(90deg,#ea580c,#fb923c)",color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer"}}>Salvar</button>
        <button onClick={()=>setOpen(false)} style={{padding:"7px 14px",borderRadius:8,border:`1px solid ${BDR}`,background:"transparent",color:"#6b7280",fontSize:12,cursor:"pointer"}}>Cancelar</button>
      </div>
    </div>
  );
}

export default function App(){
  // ── Hábitos ──
  const [habits,setHabits]=useState([]);
  const [checks,setChecks]=useState({});
  // ── Metas ──
  const [metas,setMetas]=useState([]);
  // ── Finanças ──
  const [receitas,setReceitas]=useState([]);
  const [despesasFixas,setDespesasFixas]=useState([]);
  const [despesasVar,setDespesasVar]=useState([]);
  const [investimentos,setInvestimentos]=useState([]);
  const [contas,setContas]=useState([]);
  const [fixasModal,setFixasModal]=useState(false);
  const [fixaData,setFixaData]=useState({id:"",nome:"",valor:"",dia:1});
  const [recModal,setRecModal]=useState(false);
  const [recData,setRecData]=useState({id:"",tipo:"Salário",valor:"",data:mkKeyM(M,DAY)});
  const [varModal,setVarModal]=useState(false);
  const [varData,setVarData]=useState({id:"",valor:"",categoria:"Alimentação",data:mkKeyM(M,DAY)});
  const [invModal,setInvModal]=useState(false);
  const [invData,setInvData]=useState({id:"",tipo:"Aporte",valor:"",data:mkKeyM(M,DAY),observacao:""});
  const [contaModal,setContaModal]=useState(false);
  const [contaData,setContaData]=useState({id:"",nome:"",saldo:"",tipo:"corrente"});
  const [metaData,setMetaData]=useState({id:"",categoria:"Profissional",descricao:"",meta:"",realizado:""});
  const [metaModal,setMetaModal]=useState(false);
  const [habitsModal,setHabitsModal]=useState(false);
  const [habitData,setHabitData]=useState({id:"",label:"",color:RED});

  // ── Init localStorage ──
  useEffect(()=>{
    const saved=localStorage.getItem("app_state");
    if(saved){
      const s=JSON.parse(saved);
      setHabits(s.habits||[]);
      setChecks(s.checks||{});
      setMetas(s.metas||[]);
      setReceitas(s.receitas||[]);
      setDespesasFixas(s.despesasFixas||[]);
      setDespesasVar(s.despesasVar||[]);
      setInvestimentos(s.investimentos||[]);
      setContas(s.contas||[]);
    }else{
      setHabits(DEFAULT_HABITS);
    }
  },[]);

  // ── Save to localStorage ──
  useEffect(()=>{
    localStorage.setItem("app_state",JSON.stringify({habits,checks,metas,receitas,despesasFixas,despesasVar,investimentos,contas}));
  },[habits,checks,metas,receitas,despesasFixas,despesasVar,investimentos,contas]);

  const saveFixa=()=>{
    if(!fixaData.nome.trim()||!fixaData.valor)return;
    if(fixaData.id){
      setDespesasFixas(p=>p.map(x=>x.id===fixaData.id?{...fixaData,valor:parseFloat(fixaData.valor)}:x));
    }else{
      setDespesasFixas(p=>[...p,{id:genId(),nome:fixaData.nome,valor:parseFloat(fixaData.valor),dia:parseInt(fixaData.dia)}]);
    }
    setFixaData({id:"",nome:"",valor:"",dia:1});
    setFixasModal(false);
  };

  const saveRec=()=>{
    if(!recData.valor||!recData.tipo)return;
    if(recData.id){
      setReceitas(p=>p.map(x=>x.id===recData.id?{...recData,valor:parseFloat(recData.valor)}:x));
    }else{
      setReceitas(p=>[...p,{id:genId(),tipo:recData.tipo,valor:parseFloat(recData.valor),data:recData.data}]);
    }
    setRecData({id:"",tipo:"Salário",valor:"",data:mkKeyM(M,DAY)});
    setRecModal(false);
  };

  const saveVar=()=>{
    if(!varData.valor||!varData.categoria)return;
    if(varData.id){
      setDespesasVar(p=>p.map(x=>x.id===varData.id?{...varData,valor:parseFloat(varData.valor)}:x));
    }else{
      setDespesasVar(p=>[...p,{id:genId(),valor:parseFloat(varData.valor),categoria:varData.categoria,data:varData.data}]);
    }
    setVarData({id:"",valor:"",categoria:"Alimentação",data:mkKeyM(M,DAY)});
    setVarModal(false);
  };

  const saveInv=()=>{
    if(!invData.valor||!invData.tipo)return;
    if(invData.id){
      setInvestimentos(p=>p.map(x=>x.id===invData.id?{...invData,valor:parseFloat(invData.valor)}:x));
    }else{
      setInvestimentos(p=>[...p,{id:genId(),tipo:invData.tipo,valor:parseFloat(invData.valor),data:invData.data,observacao:invData.observacao}]);
    }
    setInvData({id:"",tipo:"Aporte",valor:"",data:mkKeyM(M,DAY),observacao:""});
    setInvModal(false);
  };

  const saveConta=()=>{
    if(!contaData.nome||!contaData.saldo)return;
    if(contaData.id){
      setContas(p=>p.map(x=>x.id===contaData.id?{...contaData,saldo:parseFloat(contaData.saldo)}:x));
    }else{
      setContas(p=>[...p,{id:genId(),nome:contaData.nome,saldo:parseFloat(contaData.saldo),tipo:contaData.tipo}]);
    }
    setContaData({id:"",nome:"",saldo:"",tipo:"corrente"});
    setContaModal(false);
  };

  const saveMeta=()=>{
    if(!metaData.descricao||!metaData.meta)return;
    if(metaData.id){
      setMetas(p=>p.map(x=>x.id===metaData.id?{...metaData,meta:parseFloat(metaData.meta),realizado:parseFloat(metaData.realizado)||0}:x));
    }else{
      setMetas(p=>[...p,{id:genId(),categoria:metaData.categoria,descricao:metaData.descricao,meta:parseFloat(metaData.meta),realizado:parseFloat(metaData.realizado)||0}]);
    }
    setMetaData({id:"",categoria:"Profissional",descricao:"",meta:"",realizado:""});
    setMetaModal(false);
  };

  const toggleHabit=(h,d)=>{
    const k=mkKeyM(M,d);
    setChecks(p=>({...p,[h.id+k]:!p[h.id+k]}));
  };

  const addHabit=()=>{
    if(!habitData.label.trim())return;
    if(habitData.id){
      setHabits(p=>p.map(x=>x.id===habitData.id?habitData:x));
    }else{
      setHabits(p=>[...p,{id:genId(),label:habitData.label,color:habitData.color}]);
    }
    setHabitData({id:"",label:"",color:RED});
    setHabitsModal(false);
  };

  const delHabit=id=>{setHabits(p=>p.filter(x=>x.id!==id));};
  const delFixa=id=>{setDespesasFixas(p=>p.filter(x=>x.id!==id));};
  const delRec=id=>{setReceitas(p=>p.filter(x=>x.id!==id));};
  const delVar=id=>{setDespesasVar(p=>p.filter(x=>x.id!==id));};
  const delInv=id=>{setInvestimentos(p=>p.filter(x=>x.id!==id));};
  const delConta=id=>{setContas(p=>p.filter(x=>x.id!==id));};
  const delMeta=id=>{setMetas(p=>p.filter(x=>x.id!==id));};

  const getCheckCount=(d)=>habits.filter(h=>checks[h.id+mkKeyM(M,d)]).length;
  const getMesReceita=()=>receitas.filter(r=>r.data.startsWith(`${Y}-${String(M+1).padStart(2,"0")}`)).reduce((s,r)=>s+r.valor,0);
  const getMesDespesaFixa=()=>despesasFixas.reduce((s,d)=>s+d.valor,0);
  const getMesDespesaVar=()=>despesasVar.filter(d=>d.data.startsWith(`${Y}-${String(M+1).padStart(2,"0")}`)).reduce((s,d)=>s+d.valor,0);
  const getTotalInvestido=()=>investimentos.reduce((s,i)=>s+i.valor,0);
  const getTotalSaldoContas=()=>contas.reduce((s,c)=>s+c.saldo,0);

  const mesReceita=getMesReceita();
  const mesDespesaF=getMesDespesaFixa();
  const mesDespesaV=getMesDespesaVar();
  const saldoMes=mesReceita-mesDespesaF-mesDespesaV;

  const chartData=[];
  for(let d=1;d<=getDIM(M);d++){
    chartData.push({d,habits:getCheckCount(d)});
  }

  return(
    <div style={{minHeight:"100vh",background:BG,color:"#e5e5e5",fontFamily:"system-ui,-apple-system,sans-serif",paddingBottom:40}}>
      {/* ── HEADER ── */}
      <div style={{background:`linear-gradient(135deg,${BG2},${BG3})`,borderBottom:`1px solid ${BDR}`,padding:"24px 20px",position:"sticky",top:0,zIndex:100}}>
        <div style={{maxWidth:1200,margin:"0 auto"}}>
          <div style={{fontSize:28,fontWeight:900,letterSpacing:3,background:"linear-gradient(90deg,#22c55e,#06b6d4)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",marginBottom:4}}>LIVR3</div>
          <div style={{fontSize:12,color:"#6b7280",letterSpacing:1,textTransform:"uppercase"}}>Rastreie Hábitos • Metas • Finanças • Investimentos</div>
        </div>
      </div>

      <div style={{maxWidth:1200,margin:"0 auto",padding:"0 20px"}}>
        {/* ── NAV TABS ── */}
        <div style={{display:"flex",gap:8,borderBottom:`1px solid ${BDR}`,marginTop:24,marginBottom:24,overflowX:"auto",paddingBottom:12}}>
          {[{id:"h",icon:"✓",label:"Hábitos"},{id:"m",icon:"🎯",label:"Metas"},{id:"f",icon:"💰",label:"Finanças"},{id:"c",icon:"📊",label:"Investimentos"}].map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)} style={{padding:"8px 16px",borderRadius:8,border:"none",background:tab===t.id?`linear-gradient(90deg,${GREEN_DIM},${GREEN})`:"transparent",color:tab===t.id?"#000":"#6b7280",fontSize:12,fontWeight:tab===t.id?700:500,cursor:"pointer",whiteSpace:"nowrap",transition:"all 0.2s"}}>{t.icon} {t.label}</button>
          ))}
        </div>

        {/* ── SECTION HÁBITOS ── */}
        <div style={{marginBottom:40}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
            <div style={{fontSize:18,fontWeight:900,letterSpacing:2,textTransform:"uppercase"}}>✓ Hábitos Diários</div>
            <button onClick={()=>{setHabitData({id:"",label:"",color:RED});setHabitsModal(true);}} style={{padding:"8px 16px",borderRadius:8,border:"none",background:`linear-gradient(90deg,${GREEN_DIM},${GREEN})`,color:"#000",fontSize:12,fontWeight:700,cursor:"pointer"}}>+ Novo Hábito</button>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:16}}>
            {habits.map(h=>(
              <div key={h.id} style={{background:BG2,border:`1px solid ${BDR}`,borderRadius:14,padding:16,display:"flex",flexDirection:"column",gap:12}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div style={{fontSize:13,fontWeight:700,letterSpacing:1,color:h.color}}>{h.label}</div>
                  <button onClick={()=>delHabit(h.id)} style={{background:"none",border:"none",color:"#ef4444",fontSize:16,cursor:"pointer"}}>✕</button>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:6}}>
                  {Array.from({length:7}).map((_,i)=>{
                    const d=DAY-3+i;
                    const checked=checks[h.id+mkKeyM(M,d)];
                    return(
                      <button key={i} onClick={()=>toggleHabit(h,d)} style={{padding:"8px",borderRadius:8,border:"none",background:checked?h.color:"rgba(255,255,255,0.05)",color:checked?"#000":"#9ca3af",fontSize:11,fontWeight:700,cursor:"pointer",transition:"all 0.2s"}}>
                        {String(d).padStart(2,"0")}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          {chartData.length>0&&(
            <div style={{marginTop:28,background:BG2,border:`1px solid ${BDR}`,borderRadius:14,padding:16}}>
              <div style={{fontSize:13,fontWeight:900,letterSpacing:1,marginBottom:16,textTransform:"uppercase",color:"#6b7280"}}>Progresso do Mês</div>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={chartData}>
                  <defs><linearGradient id="colorHabits" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={GREEN} stopOpacity={0.4}/><stop offset="95%" stopColor={GREEN} stopOpacity={0}/>
                  </linearGradient></defs>
                  <CartesianGrid stroke="rgba(255,255,255,0.05)" strokeDasharray="0"/>
                  <XAxis dataKey="d" stroke="#6b7280" style={{fontSize:10}}/>
                  <YAxis stroke="#6b7280" style={{fontSize:10}}/>
                  <Tooltip contentStyle={{background:"#111",border:`1px solid ${BDR}`,borderRadius:8}}/>
                  <ReferenceLine y={habits.length} stroke={RED} strokeDasharray="3" opacity={0.3}/>
                  <Area type="monotone" dataKey="habits" stroke={GREEN} fill="url(#colorHabits)" isAnimationActive/>
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* ── SECTION METAS ── */}
        <div style={{marginBottom:40}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
            <div style={{fontSize:18,fontWeight:900,letterSpacing:2,textTransform:"uppercase"}}>🎯 Metas de Crescimento</div>
            <button onClick={()=>{setMetaData({id:"",categoria:"Profissional",descricao:"",meta:"",realizado:""});setMetaModal(true);}} style={{padding:"8px 16px",borderRadius:8,border:"none",background:`linear-gradient(90deg,${GREEN_DIM},${GREEN})`,color:"#000",fontSize:12,fontWeight:700,cursor:"pointer"}}>+ Nova Meta</button>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:16}}>
            {metas.length===0&&<div style={{gridColumn:"1/-1",textAlign:"center",color:"#6b7280",padding:"40px 20px"}}>Nenhuma meta registrada. Comece a sonhar grande!</div>}
            {metas.map(m=>{
              const pct=Math.min(100,Math.round((m.realizado/m.meta)*100));
              const catColor=m.categoria==="Profissional"?"#3b82f6":m.categoria==="Intelectual"?"#a855f7":m.categoria==="Físico"?"#ef4444":"#06b6d4";
              return(
                <div key={m.id} style={{background:BG2,border:`1px solid ${BDR}`,borderRadius:14,padding:16,display:"flex",flexDirection:"column",gap:12}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"start"}}>
                    <div>
                      <div style={{fontSize:10,color:catColor,fontWeight:700,letterSpacing:1,textTransform:"uppercase",marginBottom:4}}>{m.categoria}</div>
                      <div style={{fontSize:13,fontWeight:700}}>{m.descricao}</div>
                    </div>
                    <button onClick={()=>delMeta(m.id)} style={{background:"none",border:"none",color:"#ef4444",fontSize:16,cursor:"pointer"}}>✕</button>
                  </div>
                  <div style={{display:"flex",gap:8,alignItems:"center"}}>
                    <div style={{flex:1,height:6,background:"rgba(255,255,255,0.1)",borderRadius:3,overflow:"hidden"}}>
                      <div style={{height:"100%",width:`${pct}%`,background:catColor,transition:"width 0.3s"}}/>
                    </div>
                    <div style={{fontSize:11,fontWeight:700,color:"#6b7280",minWidth:40}}>{pct}%</div>
                  </div>
                  <div style={{fontSize:11,color:"#9ca3af"}}>{fmtBRL(m.realizado)} de {fmtBRL(m.meta)}</div>
                  <div style={{display:"flex",gap:8}}>
                    <button onClick={()=>{setMetaData(m);setMetaModal(true);}} style={{flex:1,padding:"6px",borderRadius:6,border:`1px solid ${BDR}`,background:"transparent",color:"#6b7280",fontSize:10,cursor:"pointer"}}>Editar</button>
                    <button onClick={()=>{setMetaData({...m,realizado:m.realizado+100});saveMeta();}} style={{flex:1,padding:"6px",borderRadius:6,border:"none",background:catColor,color:"#fff",fontSize:10,fontWeight:700,cursor:"pointer"}}>+R$100</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── SECTION FINANÇAS ── */}
        <div style={{marginBottom:40}}>
          <div style={{fontSize:18,fontWeight:900,letterSpacing:2,textTransform:"uppercase",marginBottom:20}}>💰 Finanças</div>
          
          {/* Resumo */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:12,marginBottom:24}}>
            <div style={{background:`linear-gradient(135deg,#22c55e33,#22c55e11)`,border:`1px solid #22c55e44`,borderRadius:14,padding:16}}>
              <div style={{fontSize:10,color:"#6b7280",fontWeight:700,letterSpacing:1,textTransform:"uppercase",marginBottom:8}}>Receita do Mês</div>
              <div style={{fontSize:20,fontWeight:900,color:GREEN}}>{fmtBRL(mesReceita)}</div>
            </div>
            <div style={{background:`linear-gradient(135deg,#ef444433,#ef444411)`,border:`1px solid #ef444444`,borderRadius:14,padding:16}}>
              <div style={{fontSize:10,color:"#6b7280",fontWeight:700,letterSpacing:1,textTransform:"uppercase",marginBottom:8}}>Despesas Fixas</div>
              <div style={{fontSize:20,fontWeight:900,color:RED}}>{fmtBRL(mesDespesaF)}</div>
            </div>
            <div style={{background:`linear-gradient(135deg,#f97316bb,#f9731611)`,border:`1px solid #f97316aa`,borderRadius:14,padding:16}}>
              <div style={{fontSize:10,color:"#6b7280",fontWeight:700,letterSpacing:1,textTransform:"uppercase",marginBottom:8}}>Despesas Variáveis</div>
              <div style={{fontSize:20,fontWeight:900,color:"#fb923c"}}>{fmtBRL(mesDespesaV)}</div>
            </div>
            <div style={{background:saldoMes>=0?"linear-gradient(135deg,#22c55e33,#22c55e11)":"linear-gradient(135deg,#ef444433,#ef444411)",border:saldoMes>=0?`1px solid #22c55e44`:`1px solid #ef444444`,borderRadius:14,padding:16}}>
              <div style={{fontSize:10,color:"#6b7280",fontWeight:700,letterSpacing:1,textTransform:"uppercase",marginBottom:8}}>Saldo do Mês</div>
              <div style={{fontSize:20,fontWeight:900,color:saldoMes>=0?GREEN:RED}}>{fmtBRL(saldoMes)}</div>
            </div>
          </div>

          {/* Abas de Finanças */}
          <div style={{display:"flex",gap:8,borderBottom:`1px solid ${BDR}`,marginBottom:20,overflowX:"auto",paddingBottom:12}}>
            {[{id:"fixas",label:"Despesas Fixas"},{id:"receitas",label:"Receitas"},{id:"variaveis",label:"Variáveis"},{id:"contas",label:"Contas"}].map(tab=>(
              <button key={tab.id} onClick={()=>setFinTab(tab.id)} style={{padding:"8px 16px",borderRadius:8,border:"none",background:finTab===tab.id?"rgba(255,255,255,0.1)":"transparent",color:"#e5e5e5",fontSize:12,fontWeight:finTab===tab.id?700:500,cursor:"pointer",whiteSpace:"nowrap"}}>{tab.label}</button>
            ))}
          </div>

          {finTab==="fixas"&&(
            <>
              <div style={{marginBottom:16}}>
                <button onClick={()=>{setFixaData({id:"",nome:"",valor:"",dia:1});setFixasModal(true);}} style={{padding:"8px 16px",borderRadius:8,border:"none",background:`linear-gradient(90deg,${GREEN_DIM},${GREEN})`,color:"#000",fontSize:12,fontWeight:700,cursor:"pointer"}}>+ Nova Despesa Fixa</button>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:12}}>
                {despesasFixas.map(d=>(
                  <div key={d.id} style={{background:BG2,border:`1px solid ${BDR}`,borderRadius:12,padding:14,display:"flex",justifyContent:"space-between",alignItems:"start"}}>
                    <div>
                      <div style={{fontSize:12,fontWeight:700}}>{d.nome}</div>
                      <div style={{fontSize:11,color:"#6b7280",marginTop:4}}>Dia {d.dia} do mês</div>
                      <div style={{fontSize:13,fontWeight:900,color:RED,marginTop:8}}>{fmtBRL(d.valor)}</div>
                    </div>
                    <button onClick={()=>delFixa(d.id)} style={{background:"none",border:"none",color:"#ef4444",fontSize:16,cursor:"pointer"}}>✕</button>
                  </div>
                ))}
              </div>
            </>
          )}

          {finTab==="receitas"&&(
            <>
              <div style={{marginBottom:16}}>
                <button onClick={()=>{setRecData({id:"",tipo:"Salário",valor:"",data:mkKeyM(M,DAY)});setRecModal(true);}} style={{padding:"8px 16px",borderRadius:8,border:"none",background:`linear-gradient(90deg,${GREEN_DIM},${GREEN})`,color:"#000",fontSize:12,fontWeight:700,cursor:"pointer"}}>+ Nova Receita</button>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:12}}>
                {receitas.map(r=>(
                  <div key={r.id} style={{background:BG2,border:`1px solid ${BDR}`,borderRadius:12,padding:14,display:"flex",justifyContent:"space-between",alignItems:"start"}}>
                    <div>
                      <div style={{fontSize:12,fontWeight:700}}>{r.tipo}</div>
                      <div style={{fontSize:11,color:"#6b7280",marginTop:4}}>{r.data}</div>
                      <div style={{fontSize:13,fontWeight:900,color:GREEN,marginTop:8}}>{fmtBRL(r.valor)}</div>
                    </div>
                    <button onClick={()=>delRec(r.id)} style={{background:"none",border:"none",color:"#ef4444",fontSize:16,cursor:"pointer"}}>✕</button>
                  </div>
                ))}
              </div>
            </>
          )}

          {finTab==="variaveis"&&(
            <>
              <div style={{marginBottom:16}}>
                <button onClick={()=>{setVarData({id:"",valor:"",categoria:"Alimentação",data:mkKeyM(M,DAY)});setVarModal(true);}} style={{padding:"8px 16px",borderRadius:8,border:"none",background:`linear-gradient(90deg,${GREEN_DIM},${GREEN})`,color:"#000",fontSize:12,fontWeight:700,cursor:"pointer"}}>+ Novo Gasto</button>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:12}}>
                {despesasVar.map(d=>(
                  <div key={d.id} style={{background:BG2,border:`1px solid ${BDR}`,borderRadius:12,padding:14,display:"flex",justifyContent:"space-between",alignItems:"start"}}>
                    <div>
                      <div style={{fontSize:12,fontWeight:700}}>{d.categoria}</div>
                      <div style={{fontSize:11,color:"#6b7280",marginTop:4}}>{d.data}</div>
                      <div style={{fontSize:13,fontWeight:900,color:"#fb923c",marginTop:8}}>{fmtBRL(d.valor)}</div>
                    </div>
                    <button onClick={()=>delVar(d.id)} style={{background:"none",border:"none",color:"#ef4444",fontSize:16,cursor:"pointer"}}>✕</button>
                  </div>
                ))}
              </div>
            </>
          )}

          {finTab==="contas"&&(
            <>
              <div style={{marginBottom:16}}>
                <button onClick={()=>{setContaData({id:"",nome:"",saldo:"",tipo:"corrente"});setContaModal(true);}} style={{padding:"8px 16px",borderRadius:8,border:"none",background:`linear-gradient(90deg,${GREEN_DIM},${GREEN})`,color:"#000",fontSize:12,fontWeight:700,cursor:"pointer"}}>+ Nova Conta</button>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:12}}>
                {contas.map(c=>(
                  <div key={c.id} style={{background:BG2,border:`1px solid ${BDR}`,borderRadius:12,padding:14,display:"flex",justifyContent:"space-between",alignItems:"start"}}>
                    <div>
                      <div style={{fontSize:12,fontWeight:700}}>{c.nome}</div>
                      <div style={{fontSize:11,color:"#6b7280",marginTop:4,textTransform:"capitalize"}}>{c.tipo}</div>
                      <div style={{fontSize:13,fontWeight:900,color:GREEN,marginTop:8}}>{fmtBRL(c.saldo)}</div>
                    </div>
                    <button onClick={()=>delConta(c.id)} style={{background:"none",border:"none",color:"#ef4444",fontSize:16,cursor:"pointer"}}>✕</button>
                  </div>
                ))}
              </div>
              {contas.length>0&&<div style={{marginTop:20,padding:16,background:BG2,border:`1px solid ${BDR}`,borderRadius:12,textAlign:"center"}}>
                <div style={{fontSize:10,color:"#6b7280",fontWeight:700,letterSpacing:1,textTransform:"uppercase",marginBottom:8}}>Total em Contas</div>
                <div style={{fontSize:24,fontWeight:900,color:GREEN}}>{fmtBRL(getTotalSaldoContas())}</div>
              </div>}
            </>
          )}
        </div>

        {/* ── SECTION INVESTIMENTOS ── */}
        <div style={{marginBottom:40}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
            <div style={{fontSize:18,fontWeight:900,letterSpacing:2,textTransform:"uppercase"}}>📈 Investimentos</div>
            <button onClick={()=>{setInvData({id:"",tipo:"Aporte",valor:"",data:mkKeyM(M,DAY),observacao:""});setInvModal(true);}} style={{padding:"8px 16px",borderRadius:8,border:"none",background:"linear-gradient(90deg,#7c3aed,#a855f7)",color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer"}}>+ Novo Aporte</button>
          </div>

          {investimentos.length===0&&<div style={{textAlign:"center",color:"#6b7280",padding:"40px 20px"}}>Nenhum aporte registrado. Comece a construir seu patrimônio!</div>}

          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:12,marginBottom:20}}>
            {investimentos.map(i=>(
              <div key={i.id} style={{background:BG2,border:`1px solid ${BDR}`,borderRadius:12,padding:14,display:"flex",justifyContent:"space-between",alignItems:"start"}}>
                <div>
                  <div style={{fontSize:12,fontWeight:700}}>{i.tipo}</div>
                  {i.observacao&&<div style={{fontSize:10,color:"#6b7280",marginTop:4,fontStyle:"italic"}}>"{i.observacao}"</div>}
                  <div style={{fontSize:11,color:"#6b7280",marginTop:4}}>{i.data}</div>
                  <div style={{fontSize:13,fontWeight:900,color:"#a855f7",marginTop:8}}>{fmtBRL(i.valor)}</div>
                </div>
                <button onClick={()=>delInv(i.id)} style={{background:"none",border:"none",color:"#ef4444",fontSize:16,cursor:"pointer"}}>✕</button>
              </div>
            ))}
          </div>

          {investimentos.length>0&&<div style={{padding:16,background:BG2,border:`1px solid ${BDR}`,borderRadius:12,textAlign:"center"}}>
            <div style={{fontSize:10,color:"#6b7280",fontWeight:700,letterSpacing:1,textTransform:"uppercase",marginBottom:8}}>Total Investido</div>
            <div style={{fontSize:24,fontWeight:900,color:"#a855f7"}}>{fmtBRL(getTotalInvestido())}</div>
          </div>}
        </div>
      </div>

      {/* ── MODALS ── */}

      {/* MODAL HÁBITOS */}
      {habitsModal&&(
        <div onClick={()=>setHabitsModal(false)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.82)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,padding:"16px"}}>
          <div onClick={e=>e.stopPropagation()} style={{background:"#111",border:`1px solid ${BDR}`,borderRadius:18,width:"100%",maxWidth:400,boxShadow:"0 32px 80px rgba(0,0,0,0.8)"}}>
            <div style={{padding:"22px 24px 18px",borderBottom:`1px solid ${BDR}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div style={{fontSize:15,fontWeight:900,letterSpacing:2,textTransform:"uppercase"}}>{habitData.id?"Editar":"Novo"} Hábito</div>
              <button onClick={()=>setHabitsModal(false)} style={{background:"none",border:"none",color:"#4b5563",fontSize:22,cursor:"pointer"}}>×</button>
            </div>
            <div style={{padding:"22px 24px",display:"flex",flexDirection:"column",gap:16}}>
              <div>
                <div style={{fontSize:10,letterSpacing:2,color:"#6b7280",fontWeight:700,textTransform:"uppercase",marginBottom:8}}>Nome do Hábito</div>
                <input value={habitData.label} onChange={e=>setHabitData(p=>({...p,label:e.target.value}))} placeholder="Ex: Meditação..." autoFocus
                  style={{width:"100%",boxSizing:"border-box",background:"#0d0d0d",border:`1px solid rgba(255,255,255,0.1)`,borderRadius:12,color:"#e5e5e5",fontSize:14,fontWeight:600,padding:"12px 14px",outline:"none"}}/>
              </div>
              <div>
                <div style={{fontSize:10,letterSpacing:2,color:"#6b7280",fontWeight:700,textTransform:"uppercase",marginBottom:8}}>Cor</div>
                <div style={{display:"flex",gap:8}}>
                  {[RED,"#3b82f6","#a855f7","#06b6d4","#f59e0b"].map(c=>(
                    <button key={c} onClick={()=>setHabitData(p=>({...p,color:c}))} style={{width:40,height:40,borderRadius:8,border:habitData.color===c?`3px solid ${c}`:"none",background:c,cursor:"pointer"}}/>
                  ))}
                </div>
              </div>
            </div>
            <div style={{padding:"16px 24px",borderTop:`1px solid ${BDR}`}}>
              <button onClick={addHabit} style={{width:"100%",padding:"14px",borderRadius:12,border:"none",background:`linear-gradient(90deg,${GREEN_DIM},${GREEN})`,color:"#000",fontSize:13,fontWeight:900,cursor:"pointer",letterSpacing:1,textTransform:"uppercase"}}>{habitData.id?"Salvar":"Adicionar Hábito"}</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL METAS */}
      {metaModal&&(
        <div onClick={()=>setMetaModal(false)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.82)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,padding:"16px"}}>
          <div onClick={e=>e.stopPropagation()} style={{background:"#111",border:`1px solid ${BDR}`,borderRadius:18,width:"100%",maxWidth:440,boxShadow:"0 32px 80px rgba(0,0,0,0.8)"}}>
            <div style={{padding:"22px 24px 18px",borderBottom:`1px solid ${BDR}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div style={{fontSize:15,fontWeight:900,letterSpacing:2,textTransform:"uppercase"}}>{metaData.id?"Editar":"Nova"} Meta</div>
              <button onClick={()=>setMetaModal(false)} style={{background:"none",border:"none",color:"#4b5563",fontSize:22,cursor:"pointer"}}>×</button>
            </div>
            <div style={{padding:"22px 24px",display:"flex",flexDirection:"column",gap:16}}>
              <div>
                <div style={{fontSize:10,letterSpacing:2,color:"#6b7280",fontWeight:700,textTransform:"uppercase",marginBottom:8}}>Categoria</div>
                <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                  {CATEGORIAS.map(c=><button key={c} onClick={()=>setMetaData(p=>({...p,categoria:c}))}
                    style={{padding:"6px 12px",borderRadius:8,border:metaData.categoria===c?"none":`1px solid ${BDR}`,cursor:"pointer",fontSize:11,fontWeight:metaData.categoria===c?700:400,background:metaData.categoria===c?"linear-gradient(90deg,#3b82f6,#60a5fa)":"rgba(255,255,255,0.04)",color:metaData.categoria===c?"#fff":"#6b7280"}}>{c}</button>)}
                </div></div>
              <div><div style={{fontSize:10,letterSpacing:2,color:"#6b7280",fontWeight:700,textTransform:"uppercase",marginBottom:8}}>Descrição</div>
                <input value={metaData.descricao} onChange={e=>setMetaData(p=>({...p,descricao:e.target.value}))} placeholder="Ex: Aprender React..."
                  style={{width:"100%",boxSizing:"border-box",background:"#0d0d0d",border:`1px solid rgba(255,255,255,0.1)`,borderRadius:12,color:"#e5e5e5",fontSize:13,padding:"12px 14px",outline:"none"}}/></div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
                <div><div style={{fontSize:10,letterSpacing:2,color:"#6b7280",fontWeight:700,textTransform:"uppercase",marginBottom:8}}>Meta</div>
                  <div style={{display:"flex",alignItems:"center",background:"#0d0d0d",border:`1px solid rgba(255,255,255,0.1)`,borderRadius:12,overflow:"hidden"}}>
                    <span style={{padding:"0 12px",color:"#4b5563",fontSize:12,borderRight:`1px solid rgba(255,255,255,0.07)`}}>R$</span>
                    <input type="number" value={metaData.meta} onChange={e=>setMetaData(p=>({...p,meta:e.target.value}))} placeholder="0,00"
                      style={{flex:1,background:"transparent",border:"none",color:"#e5e5e5",fontSize:14,padding:"12px",outline:"none",MozAppearance:"textfield"}}/></div></div>
                <div><div style={{fontSize:10,letterSpacing:2,color:"#6b7280",fontWeight:700,textTransform:"uppercase",marginBottom:8}}>Realizado</div>
                  <div style={{display:"flex",alignItems:"center",background:"#0d0d0d",border:`1px solid rgba(255,255,255,0.1)`,borderRadius:12,overflow:"hidden"}}>
                    <span style={{padding:"0 12px",color:"#4b5563",fontSize:12,borderRight:`1px solid rgba(255,255,255,0.07)`}}>R$</span>
                    <input type="number" value={metaData.realizado} onChange={e=>setMetaData(p=>({...p,realizado:e.target.value}))} placeholder="0,00"
                      style={{flex:1,background:"transparent",border:"none",color:"#e5e5e5",fontSize:14,padding:"12px",outline:"none",MozAppearance:"textfield"}}/></div></div>
              </div>
            </div>
            <div style={{padding:"16px 24px",borderTop:`1px solid ${BDR}`}}>
              <button onClick={saveMeta} style={{width:"100%",padding:"14px",borderRadius:12,border:"none",cursor:"pointer",fontWeight:900,fontSize:13,textTransform:"uppercase",letterSpacing:1,background:`linear-gradient(90deg,#3b82f6,#60a5fa)`,color:"#fff"}}>{metaData.id?"Salvar":"Adicionar Meta"}</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DESPESA FIXA */}
      {fixasModal&&(
        <div onClick={()=>setFixasModal(false)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.82)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,padding:"16px"}}>
          <div onClick={e=>e.stopPropagation()} style={{background:"#111",border:`1px solid ${BDR}`,borderRadius:18,width:"100%",maxWidth:440,boxShadow:"0 32px 80px rgba(0,0,0,0.8)"}}>
            <div style={{padding:"22px 24px 18px",borderBottom:`1px solid ${BDR}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div style={{fontSize:15,fontWeight:900,letterSpacing:2,textTransform:"uppercase"}}>{fixaData.id?"Editar":"Nova"} Despesa Fixa</div>
              <button onClick={()=>setFixasModal(false)} style={{background:"none",border:"none",color:"#4b5563",fontSize:22,cursor:"pointer"}}>×</button>
            </div>
            <div style={{padding:"22px 24px",display:"flex",flexDirection:"column",gap:16}}>
              <div><div style={{fontSize:10,letterSpacing:2,color:"#6b7280",fontWeight:700,textTransform:"uppercase",marginBottom:8}}>Nome</div>
                <input value={fixaData.nome} onChange={e=>setFixaData(p=>({...p,nome:e.target.value}))} placeholder="Ex: Aluguel, Internet..."
                  style={{width:"100%",boxSizing:"border-box",background:"#0d0d0d",border:`1px solid rgba(255,255,255,0.1)`,borderRadius:12,color:"#e5e5e5",fontSize:13,padding:"12px 14px",outline:"none"}}/></div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
                <div><div style={{fontSize:10,letterSpacing:2,color:"#6b7280",fontWeight:700,textTransform:"uppercase",marginBottom:8}}>Valor</div>
                  <div style={{display:"flex",alignItems:"center",background:"#0d0d0d",border:`1px solid rgba(255,255,255,0.1)`,borderRadius:12,overflow:"hidden"}}>
                    <span style={{padding:"0 12px",color:"#4b5563",fontSize:12,borderRight:`1px solid rgba(255,255,255,0.07)`}}>R$</span>
                    <input type="number" value={fixaData.valor} onChange={e=>setFixaData(p=>({...p,valor:e.target.value}))} placeholder="0,00"
                      style={{flex:1,background:"transparent",border:"none",color:"#e5e5e5",fontSize:14,padding:"12px",outline:"none",MozAppearance:"textfield"}}/></div></div>
                <div><div style={{fontSize:10,letterSpacing:2,color:"#6b7280",fontWeight:700,textTransform:"uppercase",marginBottom:8}}>Dia do Mês</div>
                  <input type="number" min="1" max="31" value={fixaData.dia} onChange={e=>setFixaData(p=>({...p,dia:e.target.value}))}
                    style={{width:"100%",boxSizing:"border-box",background:"#0d0d0d",border:`1px solid rgba(255,255,255,0.1)`,borderRadius:12,color:"#e5e5e5",fontSize:13,padding:"12px 14px",outline:"none",MozAppearance:"textfield"}}/></div>
              </div>
            </div>
            <div style={{padding:"16px 24px",borderTop:`1px solid ${BDR}`}}>
              <button onClick={saveFixa} style={{width:"100%",padding:"14px",borderRadius:12,border:"none",cursor:"pointer",fontWeight:900,fontSize:13,textTransform:"uppercase",letterSpacing:1,background:`linear-gradient(90deg,${RED_DIM},${RED})`,color:"#fff"}}>{fixaData.id?"Salvar":"Adicionar Despesa"}</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL RECEITA */}
      {recModal&&(
        <div onClick={()=>setRecModal(false)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.82)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,padding:"16px"}}>
          <div onClick={e=>e.stopPropagation()} style={{background:"#111",border:`1px solid ${BDR}`,borderRadius:18,width:"100%",maxWidth:440,boxShadow:"0 32px 80px rgba(0,0,0,0.8)"}}>
            <div style={{padding:"22px 24px 18px",borderBottom:`1px solid ${BDR}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div style={{fontSize:15,fontWeight:900,letterSpacing:2,textTransform:"uppercase"}}>💵 {recData.id?"Editar":"Nova"} Receita</div>
              <button onClick={()=>setRecModal(false)} style={{background:"none",border:"none",color:"#4b5563",fontSize:22,cursor:"pointer"}}>×</button>
            </div>
            <div style={{padding:"22px 24px",display:"flex",flexDirection:"column",gap:16}}>
              <div><div style={{fontSize:10,letterSpacing:2,color:"#6b7280",fontWeight:700,textTransform:"uppercase",marginBottom:8}}>Tipo de Receita</div>
                <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                  {CAT_REC.map(c=><button key={c} onClick={()=>setRecData(p=>({...p,tipo:c}))}
                    style={{padding:"6px 12px",borderRadius:8,border:recData.tipo===c?"none":`1px solid ${BDR}`,cursor:"pointer",fontSize:11,fontWeight:recData.tipo===c?700:400,background:recData.tipo===c?`linear-gradient(90deg,${GREEN_DIM},${GREEN})`:"rgba(255,255,255,0.04)",color:recData.tipo===c?"#fff":"#6b7280"}}>{c}</button>)}
                </div></div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
                <div><div style={{fontSize:10,letterSpacing:2,color:"#6b7280",fontWeight:700,textTransform:"uppercase",marginBottom:8}}>Valor</div>
                  <div style={{display:"flex",alignItems:"center",background:"#0d0d0d",border:`1px solid rgba(255,255,255,0.1)`,borderRadius:12,overflow:"hidden"}}>
                    <span style={{padding:"0 12px",color:"#4b5563",fontSize:12,borderRight:`1px solid rgba(255,255,255,0.07)`}}>R$</span>
                    <input type="number" value={recData.valor} onChange={e=>setRecData(p=>({...p,valor:e.target.value}))} placeholder="0,00"
                      style={{flex:1,background:"transparent",border:"none",color:"#e5e5e5",fontSize:14,padding:"12px",outline:"none",MozAppearance:"textfield"}}/></div></div>
                <div><div style={{fontSize:10,letterSpacing:2,color:"#6b7280",fontWeight:700,textTransform:"uppercase",marginBottom:8}}>Data</div>
                  <input type="date" value={recData.data} onChange={e=>setRecData(p=>({...p,data:e.target.value}))}
                    style={{width:"100%",boxSizing:"border-box",background:"#0d0d0d",border:`1px solid rgba(255,255,255,0.1)`,borderRadius:12,color:"#e5e5e5",fontSize:13,padding:"12px 14px",outline:"none"}}/></div>
              </div>
            </div>
            <div style={{padding:"16px 24px",borderTop:`1px solid ${BDR}`}}>
              <button onClick={saveRec} style={{width:"100%",padding:"14px",borderRadius:12,border:"none",cursor:"pointer",fontWeight:900,fontSize:13,textTransform:"uppercase",letterSpacing:1,background:`linear-gradient(90deg,${GREEN_DIM},${GREEN})`,color:"#fff"}}>{recData.id?"Salvar":"Adicionar Receita"}</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DESPESA VARIÁVEL */}
      {varModal&&(
        <div onClick={()=>setVarModal(false)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.82)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,padding:"16px"}}>
          <div onClick={e=>e.stopPropagation()} style={{background:"#111",border:`1px solid ${BDR}`,borderRadius:18,width:"100%",maxWidth:440,boxShadow:"0 32px 80px rgba(0,0,0,0.8)"}}>
            <div style={{padding:"22px 24px 18px",borderBottom:`1px solid ${BDR}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div style={{fontSize:15,fontWeight:900,letterSpacing:2,textTransform:"uppercase"}}>💸 {varData.id?"Editar":"Novo"} Gasto</div>
              <button onClick={()=>setVarModal(false)} style={{background:"none",border:"none",color:"#4b5563",fontSize:22,cursor:"pointer"}}>×</button>
            </div>
            <div style={{padding:"22px 24px",display:"flex",flexDirection:"column",gap:16}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
                <div><div style={{fontSize:10,letterSpacing:2,color:"#6b7280",fontWeight:700,textTransform:"uppercase",marginBottom:8}}>Valor</div>
                  <div style={{display:"flex",alignItems:"center",background:"#0d0d0d",border:`1px solid rgba(255,255,255,0.1)`,borderRadius:12,overflow:"hidden"}}>
                    <span style={{padding:"0 12px",color:"#4b5563",fontSize:12,borderRight:`1px solid rgba(255,255,255,0.07)`}}>R$</span>
                    <input type="number" value={varData.valor} onChange={e=>setVarData(p=>({...p,valor:e.target.value}))} placeholder="0,00"
                      style={{flex:1,background:"transparent",border:"none",color:"#e5e5e5",fontSize:14,padding:"12px",outline:"none",MozAppearance:"textfield"}}/></div></div>
                <div><div style={{fontSize:10,letterSpacing:2,color:"#6b7280",fontWeight:700,textTransform:"uppercase",marginBottom:8}}>Data</div>
                  <input type="date" value={varData.data} onChange={e=>setVarData(p=>({...p,data:e.target.value}))}
                    style={{width:"100%",boxSizing:"border-box",background:"#0d0d0d",border:`1px solid rgba(255,255,255,0.1)`,borderRadius:12,color:"#e5e5e5",fontSize:13,padding:"12px 14px",outline:"none"}}/></div>
              </div>
              <div><div style={{fontSize:10,letterSpacing:2,color:"#6b7280",fontWeight:700,textTransform:"uppercase",marginBottom:8}}>Categoria</div>
                <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                  {CAT_DESP_VAR.map(c=><button key={c} onClick={()=>setVarData(p=>({...p,categoria:c}))}
                    style={{padding:"6px 12px",borderRadius:8,border:varData.categoria===c?"none":`1px solid ${BDR}`,cursor:"pointer",fontSize:11,fontWeight:varData.categoria===c?700:400,background:varData.categoria===c?`linear-gradient(90deg,${RED_DIM},${RED})`:"rgba(255,255,255,0.04)",color:varData.categoria===c?"#fff":"#6b7280"}}>{c}</button>)}
                </div></div>
            </div>
            <div style={{padding:"16px 24px",borderTop:`1px solid ${BDR}`}}>
              <button onClick={saveVar} style={{width:"100%",padding:"14px",borderRadius:12,border:"none",cursor:"pointer",fontWeight:900,fontSize:13,textTransform:"uppercase",letterSpacing:1,background:`linear-gradient(90deg,${RED_DIM},${RED})`,color:"#fff"}}>{varData.id?"Salvar":"Adicionar Gasto"}</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL INVESTIMENTO */}
      {invModal&&(
        <div onClick={()=>setInvModal(false)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.82)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,padding:"16px"}}>
          <div onClick={e=>e.stopPropagation()} style={{background:"#111",border:`1px solid ${BDR}`,borderRadius:18,width:"100%",maxWidth:440,boxShadow:"0 32px 80px rgba(0,0,0,0.8)"}}>
            <div style={{padding:"22px 24px 18px",borderBottom:`1px solid ${BDR}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div style={{fontSize:15,fontWeight:900,letterSpacing:2,textTransform:"uppercase"}}>📈 {invData.id?"Editar":"Novo"} Aporte</div>
              <button onClick={()=>setInvModal(false)} style={{background:"none",border:"none",color:"#4b5563",fontSize:22,cursor:"pointer"}}>×</button>
            </div>
            <div style={{padding:"22px 24px",display:"flex",flexDirection:"column",gap:16}}>
              <div><div style={{fontSize:10,letterSpacing:2,color:"#6b7280",fontWeight:700,textTransform:"uppercase",marginBottom:8}}>Tipo de Investimento</div>
                <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                  {CAT_INV.map(c=><button key={c} onClick={()=>setInvData(p=>({...p,tipo:c}))}
                    style={{padding:"6px 12px",borderRadius:8,border:invData.tipo===c?"none":`1px solid ${BDR}`,cursor:"pointer",fontSize:11,fontWeight:invData.tipo===c?700:400,background:invData.tipo===c?"linear-gradient(90deg,#7c3aed,#a855f7)":"rgba(255,255,255,0.04)",color:invData.tipo===c?"#fff":"#6b7280"}}>{c}</button>)}
                </div></div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
                <div><div style={{fontSize:10,letterSpacing:2,color:"#6b7280",fontWeight:700,textTransform:"uppercase",marginBottom:8}}>Valor</div>
                  <div style={{display:"flex",alignItems:"center",background:"#0d0d0d",border:`1px solid rgba(255,255,255,0.1)`,borderRadius:12,overflow:"hidden"}}>
                    <span style={{padding:"0 12px",color:"#4b5563",fontSize:12,borderRight:`1px solid rgba(255,255,255,0.07)`}}>R$</span>
                    <input type="number" value={invData.valor} onChange={e=>setInvData(p=>({...p,valor:e.target.value}))} placeholder="0,00"
                      style={{flex:1,background:"transparent",border:"none",color:"#e5e5e5",fontSize:14,padding:"12px",outline:"none",MozAppearance:"textfield"}}/></div></div>
                <div><div style={{fontSize:10,letterSpacing:2,color:"#6b7280",fontWeight:700,textTransform:"uppercase",marginBottom:8}}>Data</div>
                  <input type="date" value={invData.data} onChange={e=>setInvData(p=>({...p,data:e.target.value}))}
                    style={{width:"100%",boxSizing:"border-box",background:"#0d0d0d",border:`1px solid rgba(255,255,255,0.1)`,borderRadius:12,color:"#e5e5e5",fontSize:13,padding:"12px 14px",outline:"none"}}/></div>
              </div>
              <div><div style={{fontSize:10,letterSpacing:2,color:"#6b7280",fontWeight:700,textTransform:"uppercase",marginBottom:8}}>Observação <span style={{color:"#374151"}}>(opcional)</span></div>
                <input value={invData.observacao||""} onChange={e=>setInvData(p=>({...p,observacao:e.target.value}))} placeholder="Ex: IVVB11, Tesouro Selic..."
                  style={{width:"100%",boxSizing:"border-box",background:"#0d0d0d",border:`1px solid rgba(255,255,255,0.1)`,borderRadius:12,color:"#e5e5e5",fontSize:13,padding:"12px 14px",outline:"none"}}/></div>
            </div>
            <div style={{padding:"16px 24px",borderTop:`1px solid ${BDR}`}}>
              <button onClick={saveInv} style={{width:"100%",padding:"14px",borderRadius:12,border:"none",cursor:"pointer",fontWeight:900,fontSize:13,textTransform:"uppercase",letterSpacing:1,background:"linear-gradient(90deg,#7c3aed,#a855f7)",color:"#fff"}}>{invData.id?"Salvar":"Registrar Aporte"}</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CONTA */}
      {contaModal&&(
        <div onClick={()=>setContaModal(false)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.82)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,padding:"16px"}}>
          <div onClick={e=>e.stopPropagation()} style={{background:"#111",border:`1px solid ${BDR}`,borderRadius:18,width:"100%",maxWidth:400,boxShadow:"0 32px 80px rgba(0,0,0,0.8)"}}>
            <div style={{padding:"22px 24px 18px",borderBottom:`1px solid ${BDR}`,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <div style={{fontSize:15,fontWeight:900,letterSpacing:2,textTransform:"uppercase"}}>{contaData.id?"Editar Conta":"Nova Conta"}</div>
              <button onClick={()=>setContaModal(false)} style={{background:"none",border:"none",color:"#4b5563",fontSize:22,cursor:"pointer"}}>×</button>
            </div>
            <div style={{padding:"22px 24px",display:"flex",flexDirection:"column",gap:18}}>
              <div>
                <div style={{fontSize:10,letterSpacing:2,color:"#6b7280",fontWeight:700,textTransform:"uppercase",marginBottom:8}}>Nome da Conta</div>
                <input value={contaData.nome} onChange={e=>setContaData(p=>({...p,nome:e.target.value}))} placeholder="Ex: Nubank, Itaú..." autoFocus
                  style={{width:"100%",boxSizing:"border-box",background:"#0d0d0d",border:`1px solid rgba(255,255,255,0.1)`,borderRadius:12,color:"#e5e5e5",fontSize:14,fontWeight:600,padding:"12px 14px",outline:"none"}}/>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
                <div>
                  <div style={{fontSize:10,letterSpacing:2,color:"#6b7280",fontWeight:700,textTransform:"uppercase",marginBottom:8}}>Saldo Atual</div>
                  <div style={{display:"flex",alignItems:"center",background:"#0d0d0d",border:`1px solid rgba(255,255,255,0.1)`,borderRadius:12,overflow:"hidden"}}>
                    <span style={{padding:"0 12px",color:"#4b5563",fontSize:12,fontWeight:700,borderRight:`1px solid rgba(255,255,255,0.07)`}}>R$</span>
                    <input type="number" value={contaData.saldo} onChange={e=>setContaData(p=>({...p,saldo:e.target.value}))} placeholder="0,00"
                      style={{flex:1,background:"transparent",border:"none",color:"#e5e5e5",fontSize:14,padding:"12px",outline:"none",MozAppearance:"textfield",WebkitAppearance:"none"}}/>
                  </div>
                </div>
                <div>
                  <div style={{fontSize:10,letterSpacing:2,color:"#6b7280",fontWeight:700,textTransform:"uppercase",marginBottom:8}}>Tipo</div>
                  <select value={contaData.tipo} onChange={e=>setContaData(p=>({...p,tipo:e.target.value}))}
                    style={{width:"100%",background:"#0d0d0d",border:`1px solid rgba(255,255,255,0.1)`,borderRadius:12,color:"#e5e5e5",fontSize:13,padding:"12px 14px",outline:"none",cursor:"pointer"}}>
                    {["corrente","poupanca","investimento","carteira"].map(t=><option key={t} value={t}>{t.charAt(0).toUpperCase()+t.slice(1)}</option>)}
                  </select>
                </div>
              </div>
            </div>
            <div style={{padding:"16px 24px",borderTop:`1px solid ${BDR}`}}>
              <button onClick={saveConta} style={{width:"100%",padding:"14px",borderRadius:12,border:"none",background:`linear-gradient(90deg,${GREEN_DIM},${GREEN})`,color:"#fff",fontSize:13,fontWeight:900,cursor:"pointer",letterSpacing:1,textTransform:"uppercase"}}>{contaData.id?"Salvar Alterações":"Adicionar Conta"}</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
