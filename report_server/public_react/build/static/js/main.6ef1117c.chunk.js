(this.webpackJsonpreactadmin=this.webpackJsonpreactadmin||[]).push([[0],{281:function(e,t){e.exports.backendUrl="http://142.93.115.206:3002/",e.exports.webUrl="http://pos.jibuco.com/",e.exports.port=3e3},363:function(e,t,a){e.exports=a(535)},368:function(e,t,a){},535:function(e,t,a){"use strict";a.r(t);var n=a(0),r=a.n(n),c=a(16),o=a.n(c),s=(a(368),a(621)),i=a(620),l=a(315),u=a.n(l),m=a(631),d=a(636),E=a(215),f=a(596),p=a(29),b=a(622),g=a(623),h=a(604),v=a(605),j=a(635),k=a(606),O=a(110),y=a(280),P=a.n(y);var w=function(e){var t=P.a.create({baseURL:e});return t.interceptors.request.use((function(e){var t=localStorage.getItem("token");return Object(O.a)({},e,{headers:Object(O.a)({},e.headers,{},t?{Authorization:"Bearer ".concat(t)}:{})})})),t}(a(281).backendUrl);var x,S=function(e){return r.a.createElement(m.a,e,r.a.createElement(d.a,{label:"Search",source:"customfilter",alwaysOn:!0}))},A=function(e){var t=Object(E.a)(),a=Object(f.a)();return r.a.createElement(p.a,{onClick:function(){var n;window.confirm("Are you sure you want to disable- ".concat(e.record.username))?(n=e.record,w.post("/sema/users/admin/userStatus",n).then((function(e){return console.log("response",e.data),e.data}))).then((function(n){console.log(n),t(e.record.active?"Disable Success":"Activated Sucess"),a()})).catch((function(e){console.log(e)})):console.log("no")}},r.a.createElement("span",{style:{fontSize:10}},"Status: ",e.record.active?" Active":" Disabled"))},I=a(633),C=a(627),T=a(624),U=a(626),N=function(e,t){return"/sema/users/admin"},M=a(625),D=a(334),G=a(608),Q=function(e){return r.a.createElement(D.a,e,r.a.createElement(G.a,null))},B=function(e,t){return"/sema/users/admin"},R={name:"sema/users/admin",options:{label:"Users"},icon:u.a,list:function(e){return r.a.createElement(b.a,Object.assign({title:"Users"},e,{bulkActionButtons:!1,perPage:100,filters:r.a.createElement(S,null)}),r.a.createElement(g.a,null,r.a.createElement(h.a,{source:"id"}),r.a.createElement(h.a,{source:"firstName"}),r.a.createElement(h.a,{source:"lastName"}),r.a.createElement(h.a,{source:"username"}),r.a.createElement(v.a,{source:"email"}),r.a.createElement(j.a,{source:"role",reference:"sema/roles/admin/all",link:!1},r.a.createElement(h.a,{source:"authority"})),r.a.createElement(j.a,{source:"kiosk",reference:"sema/kiosks/admin/all",link:!1},r.a.createElement(h.a,{source:"name"})),r.a.createElement(A,null),r.a.createElement(k.a,null)))},create:function(e){return r.a.createElement(I.a,Object.assign({title:"Register User"},e),r.a.createElement(C.a,{redirect:N},r.a.createElement(d.a,{source:"firstName"}),r.a.createElement(d.a,{source:"lastName"}),r.a.createElement(d.a,{source:"username"}),r.a.createElement(d.a,{source:"password"}),r.a.createElement(T.a,{label:"Franchise",source:"kiosk",reference:"sema/kiosks/admin/all"},r.a.createElement(U.a,{optionText:"name"})),r.a.createElement(d.a,{source:"email"}),r.a.createElement(T.a,{label:"Role",source:"role",reference:"sema/roles/admin"},r.a.createElement(U.a,{optionText:"authority"}))))},edit:function(e){return r.a.createElement(M.a,Object.assign({title:"Edit User"},e),r.a.createElement(C.a,{toolbar:r.a.createElement(Q,null),redirect:B},r.a.createElement(d.a,{source:"firstName"}),r.a.createElement(d.a,{source:"lastName"}),r.a.createElement(d.a,{source:"username"}),r.a.createElement(d.a,{source:"email"}),r.a.createElement(T.a,{label:"Franchise",source:"kiosk",reference:"sema/kiosks/admin/all"},r.a.createElement(U.a,{optionText:"name"})),r.a.createElement(T.a,{label:"Role",source:"role",reference:"sema/roles/admin/all"},r.a.createElement(U.a,{optionText:"authority"}))))}},_=a(613),F=function(e,t,a){return"sema/products/admin"},K=a(612),L=a(128),V=Object(L.a)({toolbar:{display:"flex",justifyContent:"space-between"}}),W=function(e){return r.a.createElement(D.a,Object.assign({},e,{classes:V()}),r.a.createElement(G.a,null))},z=function(e,t){return"/sema/products/admin"},J=a(178),q=function(e){e.id;var t=e.record;e.resource;return r.a.createElement(J.a,null,"Description - ",", ",t.description,r.a.createElement("br",null),"Price Amount - ",", ",t.priceAmount,r.a.createElement("br",null),"Price currency - ",",",t.priceCurrency,r.a.createElement("br",null),"Units Per Product - ",", ",t.unitsPerProduct,r.a.createElement("br",null),"Cost Of Goods - ",", ",t.costOfGoods,",",r.a.createElement("br",null)," ","SKU - "," ,",t.sku,r.a.createElement("br",null),"Min Quantity - ",", ",t.minQuantity,r.a.createElement("br",null),"Max Quantity - ",", ",t.maxQuantity,r.a.createElement("br",null),"Unit Measurement - ",", ",t.unitMeasurement)},$=function(e){return r.a.createElement(m.a,e,r.a.createElement(d.a,{label:"Search",source:"customfilter",alwaysOn:!0}))},H={name:"sema/products/admin",options:{label:"Products"},icon:_.a,create:function(e){return r.a.createElement(I.a,Object.assign({title:"Create Product"},e),r.a.createElement(C.a,{redirect:F},r.a.createElement(d.a,{source:"base64Image",resettable:!0}),r.a.createElement(d.a,{source:"name"}),r.a.createElement(T.a,{label:"Category",source:"category",reference:"sema/product_category/admin"},r.a.createElement(U.a,{optionText:"description"})),r.a.createElement(d.a,{source:"description"}),r.a.createElement(d.a,{source:"sku"}),r.a.createElement(d.a,{source:"priceAmount"}),r.a.createElement(d.a,{source:"priceCurrency"}),r.a.createElement(d.a,{source:"unitMeasurement"}),r.a.createElement(d.a,{source:"minQuantity"}),r.a.createElement(d.a,{source:"maxQuantity"}),r.a.createElement(d.a,{source:"unitsPerProduct"}),r.a.createElement(d.a,{source:"costOfGoods"})))},edit:function(e){return r.a.createElement(M.a,Object.assign({title:"Edit Product"},e),r.a.createElement(C.a,{redirect:z,toolbar:r.a.createElement(W,null)},r.a.createElement(K.a,{label:"Image",source:"base64Image"}),r.a.createElement(d.a,{source:"base64Image",resettable:!0}),r.a.createElement(d.a,{source:"name"}),r.a.createElement(T.a,{label:"Category",source:"category",reference:"sema/product_category/admin"},r.a.createElement(U.a,{optionText:"description"})),r.a.createElement(d.a,{source:"description"}),r.a.createElement(d.a,{source:"sku"}),r.a.createElement(d.a,{source:"priceAmount"}),r.a.createElement(d.a,{source:"priceCurrency"}),r.a.createElement(d.a,{source:"unitMeasurement"}),r.a.createElement(d.a,{source:"minQuantity"}),r.a.createElement(d.a,{source:"maxQuantity"}),r.a.createElement(d.a,{source:"unitsPerProduct"}),r.a.createElement(d.a,{source:"costOfGoods"})))},list:function(e){return r.a.createElement(b.a,Object.assign({title:"Products"},e,{bulkActionButtons:!1,perPage:100,filters:r.a.createElement($,null)}),r.a.createElement(g.a,{rowClick:"edit",expand:r.a.createElement(q,null)},r.a.createElement(h.a,{source:"id"}),r.a.createElement(K.a,{label:"Image",source:"base64Image"}),r.a.createElement(j.a,{source:"category",reference:"sema/product_category/admin",link:!1},r.a.createElement(h.a,{source:"description"})),r.a.createElement(h.a,{source:"name"}),r.a.createElement(h.a,{source:"sku"})))}},X=a(615),Y=a(614),Z=function(e){return r.a.createElement(m.a,e,r.a.createElement(d.a,{label:"Search",source:"customfilter",alwaysOn:!0}))},ee=function(e,t){return"sema/kiosks/admin"},te=Object(L.a)({toolbar:{display:"flex",justifyContent:"space-between"}}),ae=function(e){return r.a.createElement(D.a,Object.assign({},e,{classes:te()}),r.a.createElement(G.a,null))},ne=function(e){var t=e.record;return r.a.createElement("span",null,"Kiosk #",t.id)},re=function(e,t){return"sema/kiosks/admin"},ce={name:"sema/kiosks/admin",options:{label:"Franchises"},icon:X.a,list:function(e){return r.a.createElement(b.a,Object.assign({title:"Kiosks"},e,{bulkActionButtons:!1,perPage:100,filters:r.a.createElement(Z,null)}),r.a.createElement(g.a,{rowClick:"edit"},r.a.createElement(h.a,{source:"id"}),r.a.createElement(h.a,{source:"name"}),r.a.createElement(Y.a,{label:"Created",source:"created_at"})))},create:function(e){return r.a.createElement(I.a,Object.assign({title:"Add Kiosk"},e),r.a.createElement(C.a,{redirect:ee},r.a.createElement(d.a,{source:"name"})))},edit:function(e){return r.a.createElement(M.a,Object.assign({title:r.a.createElement(ne,null)},e),r.a.createElement(C.a,{redirect:re,toolbar:r.a.createElement(ae,null)},r.a.createElement(h.a,{source:"id"}),r.a.createElement(d.a,{source:"name"})))}},oe=a(616),se={name:"sema/roles/admin",options:{label:"Roles"},icon:oe.a},ie={users:R,products:H,kiosks:ce,roles:se,allKiosks:{name:"sema/kiosks/admin/all",options:{label:"All kiosks"},icon:oe.a},allRoles:{name:"sema/roles/admin/all",options:{label:"All Roles"},icon:oe.a},allProductCategories:{name:"sema/product_category/admin",options:{label:"All Product Category"},icon:oe.a}},le={products:H,kiosks:ce,roles:se},ue=a(9),me=a(33),de=a(6),Ee=a(155),fe=a(83),pe=a(316),be=a(317),ge=a(50),he=a(338),ve=a(617),je=a(601),ke=a(603),Oe={date:new Date,users:0,products:0,franchises:0},ye=function(e){function t(e){var a;return Object(Ee.a)(this,t),(a=Object(pe.a)(this,Object(be.a)(t).call(this,e))).state=Oe,a.updateStats=a.updateStats.bind(Object(ge.a)(a)),a}return Object(he.a)(t,e),Object(fe.a)(t,[{key:"updateStats",value:function(e){var t=this;this.setState(e,(function(){return w.get("/sema/overview").then((function(e){return console.log("response",e.data),e.data})).then((function(e){var a=e.users,n=e.products,r=e.franchises;console.log(e),t.setState({users:a,products:n,franchises:r})})).catch((function(e){return t.props.notify(e.message)}))}))}},{key:"componentDidMount",value:function(){this.updateStats({})}},{key:"componentDidUpdate",value:function(e){e.viewVersion!==this.props.viewVersion&&this.updateStats({})}},{key:"render",value:function(){var e=this.props.classes;return r.a.createElement(r.a.Fragment,null,r.a.createElement(J.a,{variant:"headline"},"Overview"),r.a.createElement(ve.a,{className:e.grid,item:!0,xs:12,md:4,container:!0,spacing:16},r.a.createElement(je.a,{className:e.card},r.a.createElement(ke.a,{className:e.content},r.a.createElement(J.a,{variant:"body2"},"Users"),r.a.createElement(ve.a,{container:!0,justify:"space-between"},r.a.createElement(ve.a,{item:!0},r.a.createElement(ve.a,{container:!0,alignItems:"center",spacing:16},r.a.createElement(J.a,{variant:"display1"},this.state.users)))))),r.a.createElement(je.a,{className:e.card},r.a.createElement(ke.a,{className:e.content},r.a.createElement(J.a,{variant:"body2"},"Products"),r.a.createElement(ve.a,{container:!0,justify:"space-between"},r.a.createElement(ve.a,{item:!0},r.a.createElement(ve.a,{container:!0,alignItems:"center",spacing:16},r.a.createElement(J.a,{variant:"display1"},this.state.products)))))),r.a.createElement(je.a,{className:e.card},r.a.createElement(ke.a,{className:e.content},r.a.createElement(J.a,{variant:"body2"},"Franchise"),r.a.createElement(ve.a,{container:!0,justify:"space-between"},r.a.createElement(ve.a,{item:!0},r.a.createElement(J.a,{variant:"display1"},this.state.franchises)))))))}}]),t}(r.a.Component),Pe=Object(ue.c)((function(e){return{viewVersion:e.admin.ui.viewVersion}}),{notify:me.d})(Object(de.a)((function(e){return{grid:{marginTop:2*e.spacing.unit,marginBottom:2*e.spacing.unit},card:{maxWidth:300,margin:"auto",transition:"0.3s",boxShadow:"0 8px 40px -12px rgba(0,0,0,0.3)","&:hover":{boxShadow:"0 16px 70px -12.125px rgba(0,0,0,0.3)"}},content:{textAlign:"left",padding:3*e.spacing.unit}}}))((function(e){return r.a.createElement(r.a.Fragment,null,r.a.createElement(ye,e))}))),we=a(629),xe=function(e){return r.a.createElement(we.a,{backgroundImage:"https://jibuco.com/wp-content/uploads/2020/03/bottlesrackmin-scaled.jpg"})},Se=a(13),Ae=a(113),Ie=a(319),Ce=a.n(Ie),Te=(x={},Object(Se.a)(x,Ae.b,(function(e){if(401===e.status)return Promise.reject();return Promise.resolve()})),Object(Se.a)(x,Ae.d,(function(e,t){var a=e.username,n=e.password;return t.post("/sema/login",{usernameOrEmail:a,password:n}).then((function(e){return console.log("response",e),e.data})).then((function(e){var t=e.token,a=e.userSatus;console.log("active",a),a&&localStorage.setItem("token",t),a||alert("Account is Inactive")}))})),Object(Se.a)(x,Ae.e,(function(e,t){return localStorage.removeItem("token"),Promise.resolve()})),Object(Se.a)(x,Ae.a,(function(e){if(!localStorage.getItem("token"))return Promise.reject();return Promise.resolve()})),Object(Se.a)(x,Ae.c,(function(){var e=function(){var e=localStorage.getItem("token");return e?Ce()(e):null}();return e?Promise.resolve(e):Promise.reject()})),x);function Ue(e){return function(t,a){return(0,Te[t])(a,e)}}var Ne,Me=a(619),De=a(114),Ge=a(42),Qe=(Ne={},Object(Se.a)(Ne,Ge.a,(function(e,t){return{method:"POST",url:e,data:t.data}})),Object(Se.a)(Ne,Ge.b,(function(e,t){return{method:"DELETE",url:"".concat(e,"/").concat(t.id)}})),Object(Se.a)(Ne,Ge.c,(function(e,t){var a=t.ids;return{method:"DELETE",url:"".concat(e,"?").concat(Object(De.stringify)({ids:a}))}})),Object(Se.a)(Ne,Ge.d,(function(e,t){return{method:"GET",url:"".concat(e,"?").concat(Object(De.stringify)(Object(O.a)({},t.pagination,{},t.sort,{filter:t.filter})))}})),Object(Se.a)(Ne,Ge.e,(function(e,t){var a=t.ids;return{method:"GET",url:"".concat(e,"?").concat(Object(De.stringify)({ids:a}))}})),Object(Se.a)(Ne,Ge.f,(function(e,t){var a=t.pagination,n=a.page,r=a.perPage,c=t.sort,o=c.field,s=c.order,i={field:o,order:s,page:n,perPage:r,filter:Object(O.a)({},t.filter,Object(Se.a)({},t.target,t.id))};return{method:"GET",url:"".concat(e,"?").concat(Object(De.stringify)(i))}})),Object(Se.a)(Ne,Ge.g,(function(e,t){return{method:"GET",url:"".concat(e,"/").concat(t.id)}})),Object(Se.a)(Ne,Ge.h,(function(e,t){return{method:"PUT",url:"".concat(e,"/").concat(t.id),data:t.data}})),Object(Se.a)(Ne,Ge.i,(function(e,t){var a=t.ids,n=t.data;return{method:"PUT",url:"".concat(e,"?").concat(Object(De.stringify)({ids:a})),data:n}})),Ne),Be={"sample/resouce":Object(Se.a)({},"SAMPLE_CUSTOM_ACTION",(function(e,t){return{url:e,params:t}}))};var Re,_e=a(335),Fe=function(e){return Object(_e.a)(function(e){return function(t,a,n){if("admin/print-runs"===a&&(t===Ge.d||t===Ge.g))return{subscribe:function(r){var c=setInterval((function(){e(t,a,n).then((function(e){return r.next(e)})).catch((function(e){return r.error(e)}))}),3e3);return{unsubscribe:function(){c&&(clearInterval(c),c=void 0,r.complete())}}}}}}(e))},Ke=(Re=w,function(e,t,a){var n=function(e,t){return Qe[e]?Qe[e]:Be[t]&&Be[t][e]?Be[t][e]:void 0}(e,t);if(!n)return Promise.reject(new Me.a("Unsupported action"));var r=n("/".concat(t),a);return Re(r).then((function(e){return e.data})).catch((function(e){return e.response&&e.response.data&&e.response.data.message?Promise.reject(new Me.a(e.response.data.message,e.response.status)):Promise.reject(new Me.a(e.message))}))});Fe(Ke);var Le=function(){return r.a.createElement(s.a,{dashboard:Pe,authProvider:Ue(w),dataProvider:Ke,customSagas:[Fe],loginPage:xe},(function(e){var t=function(e){if(console.log("user",e.role[0].code),"admin"===e.role[0].code)return ie;if("admin"!==e.role[0].code)return le}(e);return Object.keys(t).map((function(e){return r.a.createElement(i.a,t[e])}))}))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));o.a.render(r.a.createElement(Le,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()}))}},[[363,1,2]]]);
//# sourceMappingURL=main.6ef1117c.chunk.js.map