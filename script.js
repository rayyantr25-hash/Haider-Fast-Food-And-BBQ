const WA="923356266444",DELIVERY=150,FREE_OVER=2500;
const MENU=[
{c:"BBQ",i:[
["Chicken Tikka","Charcoal-grilled, marinated overnight in yoghurt and spices.",420,"Bestseller","https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=700&h=520&q=75"],
["Seekh Kabab","Hand-minced meat with green chilli and coriander, grilled on skewers.",520,"Popular","https://images.unsplash.com/photo-1532636875304-0c89119d9b4d?auto=format&fit=crop&w=700&h=520&q=75"],
["Malai Boti","Creamy, tender chicken cubes with a soft smoky finish.",650,"","https://images.unsplash.com/photo-1705359573325-f2006d5e459f?auto=format&fit=crop&w=700&h=520&q=75"]]},
{c:"Fast Food",i:[
["Zinger Burger","Crunchy chicken fillet, lettuce and creamy mayo in a soft bun.",420,"Bestseller","https://images.unsplash.com/photo-1615380547239-45634678986c?auto=format&fit=crop&w=700&h=520&q=75"],
["Broast","Crisp, golden fried chicken served with fries and a bun.",460,"Popular","https://images.unsplash.com/photo-1426869981800-95ebf51ce900?auto=format&fit=crop&w=700&h=520&q=75"]]},
{c:"Pasta",i:[
["Lasagna","Layers of pasta, rich meat sauce and melted cheese, baked until bubbling.",590,"","https://images.unsplash.com/photo-1709429790175-b02bb1b19207?auto=format&fit=crop&w=700&h=520&q=75"]]}
];
const items=[];MENU.forEach(m=>m.i.forEach(x=>{x.id=items.length;items.push({id:items.length,n:x[0],d:x[1],p:x[2],t:x[3]||"",img:x[4],c:m.c})}));
const $=s=>document.querySelector(s),rs=n=>"Rs "+n.toLocaleString("en-PK");
let cart={};
function card(x){return `<div class="card"><img src="${x.img}" alt="${x.n}" loading="lazy" width="700" height="520">${x.t?`<span class="tag">${x.t}</span>`:""}<h3>${x.n}</h3><p>${x.d}</p><div class="row"><span class="price">${rs(x.p)}</span><button class="add" onclick="add(${x.id})">Add to cart</button></div></div>`}
$("#fav").innerHTML=[0,1,2,3,4,5].map(i=>card(items[i])).join("");
$("#mq").innerHTML=("Fresh off the grill<i>★</i>All you can eat<i>★</i>Open till 3 am<i>★</i>Cash only<i>★</i>").repeat(6);
$("#tabs").innerHTML=MENU.map((m,i)=>`<button class="tab" data-t="c${i}" onclick="document.getElementById('c${i}').scrollIntoView({behavior:'smooth',block:'start'})">${m.c}</button>`).join("");
$("#menu").innerHTML=MENU.map((m,i)=>`<div class="cat" id="c${i}" style="scroll-margin-top:150px"><h2>${m.c}</h2><div class="grid fd">${m.i.map(x=>card(items.find(y=>y.n===x[0]))).join("")}</div></div>`).join("");
function toast(t){const e=$("#toast");e.textContent=t;e.classList.add("on");clearTimeout(toast.t);toast.t=setTimeout(()=>e.classList.remove("on"),1800)}
function add(id){cart[id]=(cart[id]||0)+1;render();toast(items[id].n+" added")}
function chg(id,d){cart[id]=(cart[id]||0)+d;if(cart[id]<=0)delete cart[id];render()}
function totals(){let s=0,n=0;for(const id in cart){s+=items[id].p*cart[id];n+=cart[id]}const d=n?(s>=FREE_OVER?0:DELIVERY):0;return{s,n,d,t:s+d}}
function render(){const T=totals();$("#cc").textContent=T.n;
$("#cb").innerHTML=T.n?Object.keys(cart).map(id=>{const x=items[id];return `<div class="it"><b>${x.n}</b><span>${rs(x.p*cart[id])}</span><div class="q"><button onclick="chg(${id},-1)" aria-label="Remove one">−</button><span>${cart[id]}</span><button onclick="chg(${id},1)" aria-label="Add one">+</button></div></div>`}).join(""):`<div class="empty"><p class="d" style="font-size:28px;color:#111">Your cart is empty</p><p>Add something hot from the menu.</p><p style="margin-top:14px"><a class="btn dk" href="#order" onclick="closeCart()">Browse menu</a></p></div>`;
$("#st").textContent=rs(T.s);$("#dl").textContent=T.n?(T.d?rs(T.d):"Free"):"-";$("#tt").textContent=rs(T.t);$("#cobtn").disabled=!T.n;$("#cobtn").style.opacity=T.n?1:.4}
function openCart(){$("#drawer").classList.add("open");$("#veil").classList.add("open")}
function closeCart(){$("#drawer").classList.remove("open");$("#veil").classList.remove("open")}
function closeModal(){$("#cm").classList.remove("open")}
function openCheckout(){if(!totals().n)return;closeCart();const T=totals();
$("#cmb").innerHTML=`<h2>Checkout</h2><form class="f" id="of" novalidate>
<div class="two" style="display:grid;grid-template-columns:1fr 1fr;gap:10px"><label><input type="radio" name="m" value="Delivery" checked> Delivery</label><label><input type="radio" name="m" value="Pickup"> Pickup</label></div>
<label>Full name<input id="on" autocomplete="name"></label><label>Phone number<input id="op" type="tel" inputmode="tel" autocomplete="tel"></label>
<label id="al">Delivery address<textarea id="oa" rows="2" autocomplete="street-address"></textarea></label>
<label>Notes (optional)<input id="ox" placeholder="Less spicy, extra raita..."></label>
<p style="font-weight:600">Payment: cash on delivery / pickup</p>
<div class="tot big"><span>Total</span><span id="ot">${rs(T.t)}</span></div><div class="err" id="oe"></div>
<button class="btn dk" type="submit">Place order</button><button type="button" class="btn" onclick="closeModal()">Back</button></form>`;
$("#cm").classList.add("open");
document.querySelectorAll('input[name=m]').forEach(r=>r.onchange=()=>{const p=r.value==="Pickup"&&r.checked;if(r.checked){$("#al").style.display=p?"none":"grid";const T=totals(),d=p?0:T.d;$("#ot").textContent=rs(T.s+d)}});
$("#of").onsubmit=e=>{e.preventDefault();const m=document.querySelector('input[name=m]:checked').value,n=$("#on").value.trim(),p=$("#op").value.trim(),a=$("#oa").value.trim();
if(!n||!/^[0-9+\s-]{10,15}$/.test(p)){$("#oe").textContent="Enter your name and a valid phone number.";return}
if(m==="Delivery"&&a.length<8){$("#oe").textContent="Enter your full delivery address.";return}
const T=totals(),d=m==="Pickup"?0:T.d,no="HF"+Math.floor(1000+Math.random()*9000);
const lines=Object.keys(cart).map(id=>`${cart[id]} x ${items[id].n} - ${rs(items[id].p*cart[id])}`).join("\n");
const msg=`New order ${no}\n${lines}\nSubtotal: ${rs(T.s)}\nDelivery: ${rs(d)}\nTotal: ${rs(T.s+d)} (cash)\nType: ${m}\nName: ${n}\nPhone: ${p}${m==="Delivery"?"\nAddress: "+a:""}${$("#ox").value?"\nNote: "+$("#ox").value:""}`;
cart={};render();
$("#cmb").innerHTML=`<h2>Order placed</h2><p style="margin-bottom:10px">Thanks ${n.split(" ")[0]}! Your order number is <b>${no}</b>. Send it to the restaurant on WhatsApp so the kitchen starts right away.</p><p style="margin-bottom:18px;font-weight:600">Total to pay in cash: ${rs(T.s+d)}</p><a class="btn dk" target="_blank" rel="noopener" href="https://wa.me/${WA}?text=${encodeURIComponent(msg)}">Send order on WhatsApp</a> <button class="btn" onclick="closeModal()" style="margin-top:8px">Close</button>`}}
// booking
$("#bg").innerHTML=Array.from({length:12},(_,i)=>`<option>${i+1} ${i?"people":"person"}</option>`).join("");
$("#bd").min=new Date().toISOString().slice(0,10);$("#bd").value=$("#bd").min;
$("#bf").onsubmit=e=>{e.preventDefault();const n=$("#bn").value.trim(),p=$("#bp").value.trim(),d=$("#bd").value,t=$("#bt").value;
if(!n||!/^[0-9+\s-]{10,15}$/.test(p)||!d||!t){$("#be").textContent="Fill in your name, a valid phone number, date and time.";return}
$("#be").textContent="";
const msg=`Table booking\nName: ${n}\nPhone: ${p}\nDate: ${d}\nTime: ${t}\nGuests: ${$("#bg").value}\nSeating: ${$("#bs").value}${$("#bx").value?"\nRequest: "+$("#bx").value:""}`;
$("#cmb").innerHTML=`<h2>Almost done</h2><p style="margin-bottom:18px">Table for ${$("#bg").value} on ${d} at ${t}. Send this on WhatsApp to confirm your booking with the restaurant.</p><a class="btn dk" target="_blank" rel="noopener" href="https://wa.me/${WA}?text=${encodeURIComponent(msg)}">Confirm on WhatsApp</a> <button class="btn" onclick="closeModal()" style="margin-top:8px">Close</button>`;$("#cm").classList.add("open");$("#bf").reset();$("#bd").value=$("#bd").min;$("#bt").value="20:00"};
// routing
function route(){const h=(location.hash||"#home").slice(1),k=["home","about","book","order"].includes(h)?h:"home";
document.querySelectorAll(".page").forEach(p=>p.classList.toggle("on",p.id==="p-"+k));
document.querySelectorAll("nav a").forEach(a=>a.classList.toggle("on",a.dataset.p===k));
document.querySelector("nav").classList.remove("open");window.scrollTo(0,0)}
addEventListener("hashchange",route);route();render();
document.addEventListener("keydown",e=>{if(e.key==="Escape"){closeCart();closeModal()}});