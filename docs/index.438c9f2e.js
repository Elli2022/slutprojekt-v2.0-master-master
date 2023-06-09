const e=document.getElementById("image-selection"),t=document.getElementById("logged-in-users"),n=document.getElementById("create-account-button"),o=document.getElementById("submit-button"),s=document.getElementById("username"),a=document.getElementById("password"),r=document.getElementById("form"),l=document.createElement("p"),d=document.createElement("h1"),c=document.createElement("h1"),i=document.createElement("input"),u=document.createElement("li"),y=document.getElementById("body"),m=document.createElement("h1"),p=document.createElement("div");const h="https://social-media-68d76-default-rtdb.europe-west1.firebasedatabase.app/";async function E(){try{const e=await fetch(`${h}users.json`);if(!e.ok)throw new Error(`Error: ${e.status} ${e.statusText}`);const t=await e.json();if(!t)return[];return Object.values(t)}catch(e){throw new Error("Failed to fetch users")}}async function w(e){await E();const t=`${h}users/${e.userName}.json`,n={method:"PUT",body:JSON.stringify(e),headers:{"Content-type":"application/json; charset=UTF-8"}};try{const e=await fetch(t,n);if(!e.ok)throw new Error(`Error: ${e.status} ${e.statusText}`)}catch(e){throw console.log(e),new Error("Failed to save user information.")}}function f(e){if(t){t.innerHTML="";for(const n of e)if(!n.newUser){const e=document.createElement("li");e.textContent=`${n.userName} - Status: ${n.status}`;const o=document.createElement("img");o.src=n.imageurl,o.style.width="50px",o.style.height="50px",e.appendChild(o),t.appendChild(e),e.addEventListener("click",(()=>{C(n)}))}}else console.error("Logged-in users list element not found.")}function C(e){document.body.innerHTML="",r.style.display="none";const n=document.createElement("div");n.innerHTML=`<h1>Welcome to ${e.userName}'s page! </br> Status: ${e.status}</h1>`,document.body.appendChild(n);const o=document.createElement("img");o.src=e.imageurl,o.style.width="50px",o.style.height="50px",n.appendChild(o);const a=document.createElement("button");a.textContent="Back to users status wall",document.body.appendChild(a),a.addEventListener("click",(async o=>{o.preventDefault(),console.log("NAMEINPUT FRÅN BACKTOLOGIN",s.value),console.log("USER.USERNAME FRÅN BACKTOLOGIN",e.userName),a.style.display="none",t.style.display="block",i.style.display="block",i.value="",m.textContent=" ",l.textContent=" ";const r=document.createElement("div");document.body.appendChild(r),i.id="status",document.body.appendChild(i),i.style.width="100px",r.appendChild(t);const y=document.createElement("button");y.innerText="Send statusmessage! ",y.style.width="110px",document.body.appendChild(y),n.innerHTML=`Logged-in user:${e.userName}</h1>`,y.addEventListener("click",(async()=>{const t=i.value,n=`${h}users/${e.userName}/status.json`,o={method:"PUT",body:JSON.stringify(t),headers:{"Content-type":"application/json; charset=UTF-8"}};try{const s=await fetch(n,o);if(!s.ok)throw new Error(`Error: ${s.status} ${s.statusText}`);e.status=t}catch(e){throw console.log(e),new Error("Failed to save user information.")}f(await E()),i.value=""}));const p=document.createElement("button");p.innerText="Delete User",document.body.appendChild(p),p?.addEventListener("click",(async e=>{e?.preventDefault(),u.textContent=" ",s?(await async function(e){console.log("Deleting user");const t=`${h}users/${e}.json`,o={method:"DELETE",headers:{"Content-type":"application/json; charset=UTF-8"}};try{const e=await fetch(t,o);if(!e.ok)throw new Error(`Error: ${e.status} ${e.statusText}`);f(await E()),i.style.display="none",r.innerHTML="",y.style.display="none",p.style.display="none",d.textContent=" ",n.innerHTML=" ",console.log("User deleted successfully"),d.textContent="User deleted successfully!",document.body.appendChild(d)}catch(e){throw console.log(e),c.textContent="Failed to delete user. Please try again.",document.body.appendChild(c),new Error("Failed to delete user.")}}(s.value),l.textContent=" "):console.error("Username input element not found.")}))}))}e?e.addEventListener("change",(()=>{const t=e.value;e.value=t})):console.error("Image dropdown element not found."),n&&s&&a?n.addEventListener("click",(async()=>{d.textContent=" ",l.innerText=" ";const t=s.value,o=a.value;if(!t||!o)return l.textContent="Username and / or password cannot be empty.",l.style.color="red",void n.insertAdjacentElement("afterend",l);if(!await async function(e){return!(await E()).some((t=>t.userName===e))}(t))return l.textContent="Username is already taken. Please choose another one.",l.style.color="red",void n.insertAdjacentElement("afterend",l);y.appendChild(m),m.textContent="Your account has been successfully created! You may now log in with your new account.";const r={userName:t,password:o,status:"",imageurl:e?.value??"",newUser:!0};await w(r)})):console.error("One or more DOM elements not found."),o&&s&&a?o.addEventListener("click",(async e=>{e.preventDefault(),m.textContent=" ",l.textContent=" ";const n=a.value,o=(await E()).find((e=>e.userName===s.value));if(l.textContent="Log In Successfull! ",console.log("INPUTUSERNAME FRÅN SUBMIT",s.value),console.log("USER.USERNAME FRÅN SUBMIT",o.userName),!o)return l.textContent="No account found for this user. Please create an account first.",l.style.color="red",void r?.appendChild(l);if(o.password!==n)return l.textContent="Incorrect password. Please try again.",l.style.color="red",void r?.appendChild(l);o.newUser=!1,await w(o),f(await E()),r.style.display="none",p.innerHTML=`<h1>Welcome ${s.value}!</h1> `,document.body.appendChild(p),p.appendChild(t),t.style.display="block",i.style.display="block",i.value="",i.id="status",document.body.appendChild(i),i.style.width="100px";const y=document.createElement("button");y.innerText="Send statusmessage! ",y.style.width="110px",document.body.appendChild(y);const C=document.createElement("button");C.innerText="Delete User",document.body.appendChild(C),C?.addEventListener("click",(async e=>{e?.preventDefault(),u.textContent=" ",s?(await async function(e){console.log("Deleting user");const n=`${h}users/${e}.json`,o={method:"DELETE",headers:{"Content-type":"application/json; charset=UTF-8"}};try{const e=await fetch(n,o);if(!e.ok)throw new Error(`Error: ${e.status} ${e.statusText}`);console.log("User deleted successfully"),d.textContent="User deleted successfully!",document.body.appendChild(d),f(await E()),i.style.display="none",p.innerHTML="",y.style.display="none",g.style.display="none",C.style.display="none",d.textContent=" ",r.style.display="block",a.value="",l.textContent=" ",p.style.display="none",t.style.display="none"}catch(e){throw console.log(e),c.textContent="Failed to delete user. Please try again.",document.body.appendChild(c),new Error("Failed to delete user.")}}(s.value),l.textContent=" "):console.error("Username input element not found.")})),y.addEventListener("click",(async()=>{const e=i.value,t=`${h}users/${o.userName}/status.json`,n={method:"PUT",body:JSON.stringify(e),headers:{"Content-type":"application/json; charset=UTF-8"}};try{const e=await fetch(t,n);if(!e.ok)throw new Error(`Error: ${e.status} ${e.statusText}`)}catch(e){throw console.log(e),new Error("Failed to save user information.")}f(await E()),i.value=""}));const g=document.createElement("button");g.textContent="Log Out",document.body.appendChild(g),g.addEventListener("click",(function(){i.style.display="none",p.innerHTML="",y.style.display="none",g.style.display="none",C.style.display="none",d.textContent=" ",r.style.display="block",a.value="",l.textContent=" ",p.style.display="none",t.style.display="none",window.location.reload()}))})):console.error("One or more DOM elements not found.");
//# sourceMappingURL=index.438c9f2e.js.map
