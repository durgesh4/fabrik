var fabrikCalendar=new Class({Implements:[Options],options:{days:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],shortDays:["Sun","Mon","Tues","Wed","Thur","Fri","Sat"],months:["January","Feburary","March","April","May","June","July","August","September","October","November","December"],shortMonths:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sept","Oct","Nov","Dec"],viewType:"month",calendarId:1,tmpl:"default",Itemid:0,colors:{bg:"#F7F7F7",highlight:"#FFFFDF",headingBg:"#C3D9FF",today:"#dddddd",headingColor:"#135CAE",entryColor:"#eeffff"},eventLists:[],listid:0,popwiny:0,urlfilters:[],url:{add:"index.php?option=com_fabrik&controller=visualization.calendar&view=visualization&task=getEvents&format=raw",del:"index.php?option=com_fabrik&controller=visualization.calendar&view=visualization&task=deleteEvent&format=raw"},monthday:{width:90,height:80}},initialize:function(a){this.el=document.id(a);this.SECOND=1e3;this.MINUTE=this.SECOND*60;this.HOUR=this.MINUTE*60;this.DAY=this.HOUR*24;this.WEEK=this.DAY*7;this.date=new Date;this.selectedDate=new Date;this.entries=$H();this.droppables={month:[],week:[],day:[]};this.fx={};this.ajax={};if(typeOf(this.el.getElement(".calendar-message"))!=="null"){this.fx.showMsg=new Fx.Morph(this.el.getElement(".calendar-message"),{duration:700});this.fx.showMsg.set({opacity:0})}this.colwidth=[];this.windowopts={id:"addeventwin",title:"add/edit event",loadMethod:"xhr",minimizable:false,evalScripts:true,width:380,height:320,onContentLoaded:function(a){a.fitToContent()}.bind(this)};Fabrik.addEvent("fabrik.form.submitted",function(a,b){this.ajax.updateEvents.send();Fabrik.Windows.addeventwin.close()}.bind(this))},removeFormEvents:function(a){this.entries.each(function(b,c){if(typeof b!=="undefined"&&b.formid===a){this.entries.dispose(c)}}.bind(this))},_makeEventRelDiv:function(a,b,c){var d;var e=a.label;b.left===b.left?b.left:0;b["margin-left"]===b["margin-left"]?b["margin-left"]:0;b.height=b.height?b.height:1;var f=a.colour!==""?a.colour:this.options.colors.entryColor;if(b.startMin===0){b.startMin=b.startMin+"0"}if(b.endMin===0){b.endMin=b.endMin+"0"}var g=b.view?b.view:"dayView";var h={"background-color":this._getColor(f,c),width:b.width,cursor:"pointer","margin-left":b["margin-left"],height:b.height.toInt()+"px",top:b.top.toInt()+"px",position:"absolute",border:"1px solid #666666","border-right":"0","border-left":"0",overflow:"auto",opacity:.6};if(b.left){h.left=b.left.toInt()+1+"px"}var i="fabrikEvent_"+a._listid+"_"+a.id;if(b.view==="monthView"){h.width-=1}var j=new Element("div",{"class":"fabrikEvent",id:i,styles:h});j.addEvent("mouseenter",this.doPopupEvent.bindWithEvent(this,[a,e]));if(a.link!==""&&this.options.readonly==0){d=(new Element("a",{href:a.link,"class":"fabrikEditEvent",events:{click:function(a){a.stop();var b={};var c=a.target.getParent(".fabrikEvent").id.replace("fabrikEvent_","").split("_");b.rowid=c[1];b.listid=c[0];this.addEvForm(b)}.bind(this)}})).appendText(e)}else{d=(new Element("span")).appendText(e)}j.adopt(d);return j},doPopupEvent:function(a,b,c){var d;var e=this.activeHoverEvent;this.activeHoverEvent=a.target.hasClass("fabrikEvent")?a.target:a.target.getParent(".fabrikEvent");if(!b._canDelete){this.popWin.getElement(".popupDelete").hide()}else{this.popWin.getElement(".popupDelete").show()}if(!b._canEdit){this.popWin.getElement(".popupEdit").hide();this.popWin.getElement(".popupView").show()}else{this.popWin.getElement(".popupEdit").show();this.popWin.getElement(".popupView").hide()}if(this.activeHoverEvent){d=this.activeHoverEvent.getCoordinates()}else{d={top:0,left:0}}var f=this.popup.getElement("div[class=popLabel]");f.empty();f.set("text",c);this.activeDay=a.target.getParent();var g=d.top-this.popWin.getSize().y;var h={opacity:[0,1],top:[d.top+50,d.top-10]};this.inFadeOut=false;this.popWin.setStyles({left:d.left+20,top:d.top});this.fx.showEventActions.cancel().set({opacity:0}).start.delay(500,this.fx.showEventActions,h)},_getFirstDayInMonthCalendar:function(a){var b=new Date;b.setTime(a.valueOf());if(a.getDay()!==this.options.first_week_day){var c=a.getDay()-this.options.first_week_day;if(c<0){c=7+c}a.setTime(a.valueOf()-c*24*60*60*1e3)}if(b.getMonth()===a.getMonth()){var d=7*24*60*60*1e3;while(a.getDate()>1){a.setTime(a.valueOf()-this.DAY)}}return a},showMonth:function(){var a=new Date;a.setTime(this.date.valueOf());a.setDate(1);a=this._getFirstDayInMonthCalendar(a);var b=this.el.getElements(".monthView tr");var c=0;for(var d=1;d<b.length;d++){var e=b[d].getElements("td");var f=0;e.each(function(b){b.setProperties({"class":""});b.addClass(a.getTime());if(a.getMonth()!==this.date.getMonth()){b.addClass("otherMonth")}if(this.selectedDate.isSameDay(a)){b.addClass("selectedDay")}b.empty();b.adopt((new Element("div",{"class":"date",styles:{"background-color":this._getColor("#E8EEF7",a)}})).appendText(a.getDate()));var c=0;this.entries.each(function(e){if(e.enddate!==""&&a.isDateBetween(e.startdate,e.enddate)||e.enddate===""&&e.startdate.isSameDay(a)){var g=b.getElements(".fabrikEvent").length;var h=20;var k=b.getSize().y*(d-1)+this.el.getElement(".monthView .dayHeading").getSize().y+b.getElement(".date").getSize().y;this.colwidth[".monthView"]=this.colwidth[".monthView"]?this.colwidth[".monthView"]:b.getSize().x;var l=b.getSize().x;l=this.colwidth[".monthView"];k=k+g*h;var m=l*f;var n={width:l,height:h,view:"monthView"};n.top=k;if(window.ie){n.left=m}n.startHour=e.startdate.getHours();n.endHour=e.enddate.getHours();n.startMin=e.startdate.getMinutes();n.endMin=e.enddate.getMinutes();n["margin-left"]=0;b.adopt(this._makeEventRelDiv(e,n,a))}c++}.bind(this));a.setTime(a.getTime()+this.DAY);f++}.bind(this))}document.addEvent("mousemove",function(a){var b=a.target;var c=a.client.x;var d=a.client.y;var e=this.activeArea;if(typeOf(e)!=="null"&&typeOf(this.activeDay)!=="null"){if(c<=e.left||c>=e.right||d<=e.top||d>=e.bottom){if(!this.inFadeOut){var f=this.activeHoverEvent.getCoordinates();var g={opacity:[1,0],top:[f.top-10,f.top+50]};this.fx.showEventActions.cancel().start.delay(500,this.fx.showEventActions,g)}this.activeDay=null}}}.bind(this));this.entries.each(function(a){var b=this.el.getElement(".fabrikEvent_"+a._listid+"_"+a.id);if(b){}}.bind(this));this._highLightToday();this.el.getElement(".monthDisplay").innerHTML=this.options.months[this.date.getMonth()]+" "+this.date.getFullYear()},_makePopUpWin:function(){if(typeOf(this.popup)==="null"){var a=new Element("div",{"class":"popLabel"});var b=(new Element("div",{"class":"popupDelete"})).adopt((new Element("a",{href:"#",events:{mouseenter:function(){},mouseleave:function(){},click:function(a){a.stop();this.deleteEntry(a)}.bind(this)}})).adopt(new Element("img",{src:Fabrik.liveSite+"plugins/fabrik_visualization/calendar/views/calendar/tmpl/"+this.options.tmpl+"/images/del.png",alt:"del","class":"fabrikDeleteEvent"})).appendText(Joomla.JText._("PLG_VISUALIZATION_CALENDAR_DELETE")));var c=(new Element("div")).adopt((new Element("a",{href:"#",events:{mouseenter:function(){},mouseleave:function(){},click:function(a){this.editEntry(a)}.bind(this)}})).adopt([(new Element("span",{"class":"popupEdit"})).adopt(new Element("img",{src:Fabrik.liveSite+"plugins/fabrik_visualization/calendar/views/calendar/tmpl/"+this.options.tmpl+"/images/edit.png",alt:Joomla.JText._("PLG_VISUALIZATION_CALENDAR_EDIT"),"class":"fabrikEditEvent"})).appendText(Joomla.JText._("PLG_VISUALIZATION_CALENDAR_EDIT")),(new Element("span",{"class":"popupView"})).adopt(new Element("img",{src:Fabrik.liveSite+"media/com_fabrik/images/view.png",alt:Joomla.JText._("PLG_VISUALIZATION_CALENDAR_VIEW"),"class":"fabrikViewEvent"})).appendText(Joomla.JText._("PLG_VISUALIZATION_CALENDAR_VIEW"))]));b.addEvent("mousewithin",function(){});this.popup=(new Element("div",{"class":"popWin",styles:{position:"absolute"}})).adopt([a,b,c]);this.popup.inject(document.body);this.activeArea=null;this.fx.showEventActions=new Fx.Morph(this.popup,{duration:500,transition:Fx.Transitions.Quad.easeInOut,onCancel:function(){}.bind(this),onComplete:function(a){if(this.activeHoverEvent){var b=this.popup.getCoordinates();var c=this.activeHoverEvent.getCoordinates();var d=window.getScrollTop();var e={};e.left=b.left<c.left?b.left:c.left;e.top=b.top<c.top?b.top:c.top;e.top=e.top-d;e.right=b.right>c.right?b.right:c.right;e.bottom=b.bottom>c.bottom?b.bottom:c.bottom;e.bottom=e.bottom-d;this.activeArea=e;this.inFadeOut=false}}.bind(this)})}return this.popup},makeDragMonthEntry:function(a){},showWeek:function(){var a;var b=this.date.getDay();b=b-this.options.first_week_day.toInt();var c=new Date;c.setTime(this.date.getTime()-b*this.DAY);var d=new Date;d.setTime(this.date.getTime()-b*this.DAY);var e=new Date;e.setTime(this.date.getTime()+(6-b)*this.DAY);this.el.getElement(".monthDisplay").innerHTML=c.getDate()+"  "+this.options.months[c.getMonth()]+" "+c.getFullYear()+" - ";this.el.getElement(".monthDisplay").innerHTML+=e.getDate()+"  "+this.options.months[e.getMonth()]+" "+e.getFullYear();var f=this.el.getElements(".weekView tr");var g=f[0].getElements("th");for(var h=1;h<f.length;h++){c.setHours(h-1,0,0);if(h!==1){c.setTime(c.getTime()-6*this.DAY)}var i=f[h].getElements("td");for(a=1;a<i.length;a++){if(a!==1){c.setTime(c.getTime()+this.DAY)}var j=i[a];j.empty();j.className="";j.addClass("day");j.addClass(c.getTime()-this.HOUR);if(this.selectedDate.isSameWeek(c)&&this.selectedDate.isSameDay(c)){j.addClass("selectedDay")}else{j.removeClass("selectedDay")}}}d=new Date;d.setTime(this.date.getTime()-b*this.DAY);for(h=0;h<g.length;h++){g[h].className="dayHeading";g[h].addClass(d.getTime());g[h].innerHTML=this.options.shortDays[d.getDay()]+" "+d.getDate()+"/"+this.options.shortMonths[d.getMonth()];a=0;this.entries.each(function(b){if(b.enddate!==""&&d.isDateBetween(b.startdate,b.enddate)||b.enddate===""&&b.startdate.isSameDay(d)){var c=this._buildEventOpts({entry:b,curdate:d,divclass:".weekView",tdOffset:h});j.adopt(this._makeEventRelDiv(b,c));a++}}.bind(this));d.setTime(d.getTime()+this.DAY)}},_buildEventOpts:function(a){var b=a.curdate;var c=new CloneObject(a.entry,true,["enddate","startdate"]);var d=this.el.getElements(a.divclass+" tr");var e=c.startdate.isSameDay(b)?c.startdate.getHours()-this.options.open:0;e<0?e=0:e=e;var f=a.tdOffset;c.label=c.label?c.label:"";var g=d[e+1].getElements("td")[f+1];var h=c.startdate.getHours();var i=g.getSize().y;this.colwidth[a.divclass]=this.colwidth[a.divclass]?this.colwidth[a.divclass]:g.getSize().x;var j=this.el.getElement(a.divclass).getElement("tr").getSize().y;colwidth=this.colwidth[a.divclass];var k=colwidth*f;k+=this.el.getElement(a.divclass).getElement("td").getSize().x;var l=Math.ceil(c.enddate.getHours()-c.startdate.getHours());if(l===0){l=1}if(c.startdate.getDay()!==c.enddate.getDay()){l=this.options.open!=0||this.options.close!=24?this.options.close-this.options.open+1:24;if(c.startdate.isSameDay(b)){l=this.options.open!=0||this.options.close!=24?this.options.close-this.options.open+1:24-c.startdate.getHours()}else{c.startdate.setHours(0);if(c.enddate.isSameDay(b)){l=this.options.open!=0||this.options.close!=24?this.options.close-this.options.open:c.enddate.getHours()}}}j=j+i*e;var m=i*l;if(c.enddate.isSameDay(b)){m+=c.enddate.getMinutes()/60*i}if(c.startdate.isSameDay(b)){j+=c.startdate.getMinutes()/60*i;m-=c.startdate.getMinutes()/60*i}var n=g.getElements(".fabrikEvent");var o=colwidth/(n.length+1);var p=o*n.length;n.setStyle("width",o+"px");var q=a.divclass.substr(1,a.divclass.length);o-=g.getStyle("border-width").toInt();a={"margin-left":p+"px",width:o+"px",height:m,view:"weekView","background-color":this._getColor(this.options.colors.headingBg)};a.left=k;a.top=j;a.color=this._getColor(this.options.colors.headingColor,c.startdate);a.startHour=c.startdate.getHours();a.endHour=a.startHour+l;a.startMin=c.startdate.getMinutes();a.endMin=c.enddate.getMinutes();c.startdate.setHours(h);return a},showDay:function(){var a;var b=new Date;b.setTime(this.date.valueOf());b.setHours(0,0);var c=this.el.getElements(".dayView tr");c[0].childNodes[1].innerHTML=this.options.days[this.date.getDay()];for(var d=1;d<c.length;d++){b.setHours(d-1,0);var e=c[d].getElements("td")[1];if(typeOf(e)!=="null"){e.empty();e.className="";e.addClass("day");e.addClass(b.getTime()-this.HOUR)}}this.entries.each(function(a){if(a.enddate!==""&&this.date.isDateBetween(a.startdate,a.enddate)||a.enddate===""&&a.startdate.isSameDay(b)){var c=this._buildEventOpts({entry:a,curdate:this.date,divclass:".dayView",tdOffset:0});e.adopt(this._makeEventRelDiv(a,c))}}.bind(this));this.el.getElement(".monthDisplay").innerHTML=this.date.getDate()+"  "+this.options.months[this.date.getMonth()]+" "+this.date.getFullYear()},renderMonthView:function(){var a,b;this.popWin.setStyle("opacity",0);var c=this._getFirstDayInMonthCalendar(new Date);var d=this.options.days.slice(this.options.first_week_day).concat(this.options.days.slice(0,this.options.first_week_day));var e=new Date;e.setTime(c.valueOf());if(c.getDay()!==this.options.first_week_day){var f=c.getDay()-this.options.first_week_day;e.setTime(c.valueOf()-f*24*60*60*1e3)}this.options.viewType="monthView";if(!this.mothView){tbody=new Element("tbody",{"class":"viewContainerTBody"});b=new Element("tr");for(a=0;a<7;a++){b.adopt((new Element("th",{"class":"dayHeading",styles:{width:"80px",height:"20px","text-align":"center",color:this._getColor(this.options.colors.headingColor,e),"background-color":this._getColor(this.options.colors.headingBg,e)}})).appendText(d[a]));e.setTime(e.getTime()+this.DAY)}tbody.appendChild(b);var g=this.options.colors.highlight;var h=this.options.colors.bg;var i=this.options.colors.today;for(var j=0;j<6;j++){b=new Element("tr");var k=this;for(a=0;a<7;a++){var l=this.options.colors.bg;var m=this.selectedDate.isSameDay(c)?"selectedDay":"";b.adopt(new Element("td",{"class":"day "+c.getTime()+m,styles:{width:this.options.monthday.width+"px",height:this.options.monthday.height+"px","background-color":l,"vertical-align":"top",padding:0,border:"1px solid #cccccc"},events:{mouseenter:function(){this.setStyles({"background-color":g})},mouseleave:function(){this.set("morph",{duration:500,transition:Fx.Transitions.Sine.easeInOut});var a=this.hasClass("today")?i:h;this.morph({"background-color":[g,a]})},click:function(a){k.selectedDate.setTime(this.className.split(" ")[1]);k.date.setTime(k._getTimeFromClassName(this.className));k.el.getElements("td").each(function(a){a.removeClass("selectedDay");if(a!==this){a.setStyles({"background-color":"#F7F7F7"})}}.bind(this));this.addClass("selectedDay")},dblclick:function(a){this.openAddEvent(a)}.bind(this)}}));c.setTime(c.getTime()+this.DAY)}tbody.appendChild(b)}this.mothView=(new Element("div",{"class":"monthView",styles:{position:"relative"}})).adopt((new Element("table",{styles:{"border-collapse":"collapse"}})).adopt(tbody));this.el.getElement(".viewContainer").appendChild(this.mothView)}this.showView("monthView")},_getTimeFromClassName:function(a){return a.replace("today","").replace("selectedDay","").replace("day","").replace("otherMonth","").trim()},openAddEvent:function(a){var b;if(this.options.canAdd===0){return}a.stop();if(a.target.className==="addEventButton"){var c=new Date;b=c.getTime()}else{b=this._getTimeFromClassName(a.target.className)}this.date.setTime(b);d=0;if(!isNaN(b)&&b!==""){var e=new Date;e.setTime(b);var f=e.getMonth()+1;f=f<10?"0"+f:f;var g=e.getDate();g=g<10?"0"+g:g;var h=e.getHours();h=h<10?"0"+h:h;var i=e.getMinutes();i=i<10?"0"+i:i;this.doubleclickdate=e.getFullYear()+"-"+f+"-"+g+" "+h+":"+i+":00";d="&jos_fabrik_calendar_events___start_date="+this.doubleclickdate}if(this.options.eventLists.length>1){this.openChooseEventTypeForm(this.doubleclickdate,b)}else{var j={};j.rowid=0;j.id="";d="&"+this.options.eventLists[0].startdate_element+"="+this.doubleclickdate;j.listid=this.options.eventLists[0].value;this.addEvForm(j)}},openChooseEventTypeForm:function(a,b){var c="index.php?option=com_fabrik&tmpl=component&view=visualization&controller=visualization.calendar&task=chooseaddevent&id="+this.options.calendarId+"&d="+a+"&rawd="+b;this.windowopts.contentURL=c;this.windowopts.id="chooseeventwin";this.windowopts.onContentLoaded=function(){var a=(new Fx.Scroll(window)).toElement("chooseeventwin")};Fabrik.getWindow(this.windowopts)},addEvForm:function(a){var b="index.php?option=com_fabrik&controller=visualization.calendar&view=visualization&task=addEvForm&format=raw&listid="+a.listid+"&rowid="+a.rowid;b+="&jos_fabrik_calendar_events___visualization_id="+this.options.calendarId;b+="&visualizationid="+this.options.calendarId;if(typeof this.doubleclickdate!=="undefined"){b+="&start_date="+this.doubleclickdate}this.windowopts.type="window";this.windowopts.contentURL=b;this.windowopts.id="addeventwin";var c=this.options.filters;this.windowopts.onContentLoaded=function(a){var b=(new Fx.Scroll(window)).toElement("addeventwin");c.each(function(a){if($(a.key)){switch($(a.key).get("tag")){case"select":$(a.key).selectedIndex=a.val;break;case"input":$(a.key).value=a.val;break}}});a.fitToContent()}.bind(this);Fabrik.getWindow(this.windowopts)},_highLightToday:function(){var a=new Date;this.el.getElements(".viewContainerTBody td").each(function(b){var c=new Date(this._getTimeFromClassName(b.className).toInt());if(a.equalsTo(c)){b.addClass("today")}else{b.removeClass("today")}}.bind(this))},centerOnToday:function(){this.date=new Date;this.showView()},renderDayView:function(){var a,b;this.popWin.setStyle("opacity",0);this.options.viewType="dayView";if(!this.dayView){tbody=new Element("tbody");a=new Element("tr");for(b=0;b<2;b++){if(b===0){a.adopt(new Element("td",{"class":"day"}))}else{a.adopt((new Element("th",{"class":"dayHeading",styles:{width:"80px",height:"20px","text-align":"center",color:this.options.headingColor,"background-color":this.options.colors.headingBg}})).appendText(this.options.days[this.date.getDay()]))}}tbody.appendChild(a);this.options.open=this.options.open<0?0:this.options.open;this.options.close>24||this.options.close<this.options.open?this.options.close=24:this.options.close;for(i=this.options.open;i<this.options.close+1;i++){a=new Element("tr");for(b=0;b<2;b++){if(b===0){var c=i.length===1?i+"0:00":i+":00";a.adopt((new Element("td",{"class":"day"})).appendText(c))}else{a.adopt(new Element("td",{"class":"day",styles:{width:"100%",height:"10px","background-color":"#F7F7F7","vertical-align":"top",padding:0,border:"1px solid #cccccc"},events:{mouseenter:function(a){this.setStyles({"background-color":"#FFFFDF"})},mouseleave:function(a){this.setStyles({"background-color":"#F7F7F7"})},dblclick:function(a){this.openAddEvent(a)}.bind(this)}}))}}tbody.appendChild(a)}this.dayView=(new Element("div",{"class":"dayView",styles:{position:"relative"}})).adopt((new Element("table",{"class":"",styles:{"border-collapse":"collapse"}})).adopt(tbody));this.el.getElement(".viewContainer").appendChild(this.dayView)}this.showDay();this.showView("dayView")},showView:function(a){if(this.el.getElement(".dayView")){this.el.getElement(".dayView").style.display="none"}if(this.el.getElement(".weekView")){this.el.getElement(".weekView").style.display="none"}if(this.el.getElement(".monthView")){this.el.getElement(".monthView").style.display="none"}this.el.getElement("."+this.options.viewType).style.display="block";switch(this.options.viewType){case"dayView":this.showDay();break;case"weekView":this.showWeek();break;default:case"monthView":this.showMonth();break}Cookie.write("fabrik.viz.calendar.view",this.options.viewType)},renderWeekView:function(){var a,b,c,d,e;this.popWin.setStyle("opacity",0);e=this.options.showweekends==0?6:8;this.options.viewType="weekView";if(!this.weekView){d=new Element("tbody");c=new Element("tr");for(b=0;b<e;b++){if(b===0){c.adopt(new Element("td",{"class":"day"}))}else{c.adopt((new Element("th",{"class":"dayHeading",styles:{width:this.options.weekday.width+"px",height:this.options.weekday.height-10+"px","text-align":"center",color:this.options.headingColor,"background-color":this.options.colors.headingBg},events:{click:function(a){a.stop();this.selectedDate.setTime(a.target.className.replace("dayHeading ","").toInt());var b=new Date;a.target.getParent().getParent().getElements("td").each(function(a){var c=a.className.replace("day ","").replace(" selectedDay").toInt();b.setTime(c);if(b.getDayOfYear()===this.selectedDate.getDayOfYear()){a.addClass("selectedDay")}else{a.removeClass("selectedDay")}}.bind(this))}.bind(this)}})).appendText(this.options.days[b-1]))}}d.appendChild(c);this.options.open=this.options.open<0?0:this.options.open;this.options.close>24||this.options.close<this.options.open?this.options.close=24:this.options.close;for(a=this.options.open;a<this.options.close+1;a++){c=new Element("tr");for(b=0;b<e;b++){if(b===0){var f=a.length===1?a+"0:00":a+":00";c.adopt((new Element("td",{"class":"day"})).appendText(f))}else{c.adopt(new Element("td",{"class":"day",styles:{width:this.options.weekday.width+"px",height:this.options.weekday.height+"px","background-color":"#F7F7F7","vertical-align":"top",padding:0,border:"1px solid #cccccc"},events:{mouseenter:function(a){if(!this.hasClass("selectedDay")){this.setStyles({"background-color":"#FFFFDF"})}},mouseleave:function(a){if(!this.hasClass("selectedDay")){this.setStyles({"background-color":"#F7F7F7"})}},dblclick:function(a){this.openAddEvent(a)}.bind(this)}}))}}d.appendChild(c)}this.weekView=(new Element("div",{"class":"weekView",styles:{position:"relative"}})).adopt((new Element("table",{styles:{"border-collapse":"collapse"}})).adopt(d));this.el.getElement(".viewContainer").appendChild(this.weekView)}this.showWeek();this.showView("weekView")},render:function(a){this.setOptions(a);this.windowopts.title=Joomla.JText._("PLG_VISUALIZATION_CALENDAR_ADD_EDIT_EVENT");this.windowopts.y=this.options.popwiny;this.popWin=this._makePopUpWin();var b=this.options.urlfilters;b.visualizationid=this.options.calendarId;this.ajax.updateEvents=new Request({url:this.options.url.add,data:b,evalScripts:true,onComplete:function(a){var b=a.stripScripts(true);var c=JSON.decode(b);this.addEntries(c);this.showView()}.bind(this)});this.ajax.deleteEvent=new Request({url:this.options.url.del,data:{visualizationid:this.options.calendarId},onComplete:function(a){a=a.stripScripts(true);var b=JSON.decode(a);this.entries=$H();this.addEntries(b)}.bind(this)});if(typeOf(this.el.getElement(".addEventButton"))!=="null"){this.el.getElement(".addEventButton").addEvent("click",this.openAddEvent.bindWithEvent(this))}var c=[];c.push((new Element("li",{"class":"centerOnToday"})).appendText(Joomla.JText._("PLG_VISUALIZATION_CALENDAR_TODAY")));if(this.options.show_day){c.push((new Element("li",{"class":"dayViewLink"})).appendText(Joomla.JText._("PLG_VISUALIZATION_CALENDAR_DAY")))}if(this.options.show_week){c.push((new Element("li",{"class":"weekViewLink"})).appendText(Joomla.JText._("PLG_VISUALIZATION_CALENDAR_WEEK")))}if(this.options.show_week||this.options.show_day){c.push((new Element("li",{"class":"monthViewLink"})).appendText(Joomla.JText._("PLG_VISUALIZATION_CALENDAR_MONTH")))}var d=(new Element("div",{"class":"calendarNav"})).adopt(new Element("input",{"class":"previousPage",type:"button",value:Joomla.JText._("PLG_VISUALIZATION_CALENDAR_PREVIOUS")}),new Element("input",{"class":"nextPage",type:"button",value:Joomla.JText._("PLG_VISUALIZATION_CALENDAR_NEXT")}),new Element("div",{"class":"monthDisplay"}),(new Element("ul",{"class":"viewMode"})).adopt(c));this.el.appendChild(d);this.el.appendChild(new Element("div",{"class":"viewContainer",styles:{"background-color":"#EFEFEF",padding:"5px"}}));if($type(Cookie.read("fabrik.viz.calendar.date"))!==false){this.date=new Date(Cookie.read("fabrik.viz.calendar.date"))}var e=typeOf(Cookie.read("fabrik.viz.calendar.view"))==="null"?this.options.viewType:Cookie.read("fabrik.viz.calendar.view");switch(e){case"dayView":this.renderDayView();break;case"weekView":this.renderWeekView();break;default:case"monthView":this.renderMonthView();break}this.showView();this.el.getElement(".nextPage").addEvent("click",this.nextPage.bindWithEvent(this));this.el.getElement(".previousPage").addEvent("click",this.previousPage.bindWithEvent(this));if(this.options.show_day){this.el.getElement(".dayViewLink").addEvent("click",this.renderDayView.bindWithEvent(this))}if(this.options.show_week){this.el.getElement(".weekViewLink").addEvent("click",this.renderWeekView.bindWithEvent(this))}if(this.options.show_week||this.options.show_day){this.el.getElement(".monthViewLink").addEvent("click",this.renderMonthView.bindWithEvent(this))}this.el.getElement(".centerOnToday").addEvent("click",this.centerOnToday.bindWithEvent(this));this.showMonth();this.watchFilters();this.ajax.updateEvents.send()},watchFilters:function(){var a=this.el.getElement(".clearFilters");if(a){a.addEvent("click",function(b){b.stop();a.findUp("form").getElements(".fabrik_filter").each(function(a){if(a.get("tag")==="select"){a.selectedIndex=0}else{a.value=""}});a.findUp("form").submit()}.bind(this))}},showMessage:function(a){this.el.getElement(".calendar-message").set("html",a);this.fx.showMsg.start({opacity:[0,1]}).chain(function(){this.start.delay(2e3,this,{opacity:[1,0]})})},addEntry:function(a,b){var c,d,e,f;if(b.startdate){c=b.startdate.split(" ");c=c[0];if(c.trim()===""){return}f=b.startdate.split(" ");f=f[1];f=f.split(":");c=c.split("-");d=new Date;e=c[1].toInt()-1;d.setYear(c[0]);d.setMonth(e,c[2]);d.setDate(c[2]);d.setHours(f[0].toInt());d.setMinutes(f[1].toInt());d.setSeconds(f[2].toInt());b.startdate=d;this.entries.set(a,b);if(b.enddate){c=b.enddate.split(" ");c=c[0];if(c.trim()===""){return}if(c==="0000-00-00"){b.enddate=b.startdate;return}f=b.enddate.split(" ");f=f[1];f=f.split(":");c=c.split("-");d=new Date;e=c[1].toInt()-1;d.setYear(c[0]);d.setMonth(e,c[2]);d.setDate(c[2]);d.setHours(f[0].toInt());d.setMinutes(f[1].toInt());d.setSeconds(f[2].toInt());b.enddate=d}}},deleteEntry:function(a){var b=this.activeHoverEvent.id.replace("fabrikEvent_","");var c=b.split("_");var d=c[0];if(!this.options.deleteables.contains(d)){return}if(confirm(Joomla.JText._("PLG_VISUALIZATION_CALENDAR_CONF_DELETE"))){this.ajax.deleteEvent.options.data={id:c[1],listid:d};this.ajax.deleteEvent.send();document.id(this.activeHoverEvent).fade("out");this.fx.showEventActions.start({opacity:[1,0]});this.removeEntry(b);this.activeDay=null}},editEntry:function(a){var b={};b.id=this.options.formid;var c=this.activeHoverEvent.id.replace("fabrikEvent_","").split("_");b.rowid=c[1];b.listid=c[0];this.addEvForm(b)},addEntries:function(a){a=$H(a);a.each(function(a,b){this.addEntry(b,a)}.bind(this));this.showView()},removeEntry:function(a){this.entries.erase(a);this.showView()},nextPage:function(){this.popWin.setStyle("opacity",0);switch(this.options.viewType){case"dayView":this.date.setTime(this.date.getTime()+this.DAY);this.showDay();break;case"weekView":this.date.setTime(this.date.getTime()+this.WEEK);this.showWeek();break;case"monthView":this.date.setDate(1);this.date.setMonth(this.date.getMonth()+1);this.showMonth();break}Cookie.write("fabrik.viz.calendar.date",this.date)},previousPage:function(){this.popWin.setStyle("opacity",0);switch(this.options.viewType){case"dayView":this.date.setTime(this.date.getTime()-this.DAY);this.showDay();break;case"weekView":this.date.setTime(this.date.getTime()-this.WEEK);this.showWeek();break;case"monthView":this.date.setMonth(this.date.getMonth()-1);this.showMonth();break}Cookie.write("fabrik.viz.calendar.date",this.date)},addLegend:function(a){var b=new Element("ul");a.each(function(a){var c=new Element("li");c.adopt(new Element("div",{styles:{"background-color":a.colour}}),(new Element("span")).appendText(a.label));b.appendChild(c)}.bind(this));(new Element("div",{"class":"legend"})).adopt([(new Element("h3")).appendText(Joomla.JText._("PLG_VISUALIZATION_CALENDAR_KEY")),b]).inject(this.el,"after")},_getGreyscaleFromRgb:function(a){var b=parseInt(a.substring(1,3),16);var c=parseInt(a.substring(3,5),16);var d=parseInt(a.substring(5),16);var e=parseInt(.3*b+.59*c+.11*d,10);return"#"+e.toString(16)+e.toString(16)+e.toString(16)},_getColor:function(a,b){if(this.options.greyscaledweekend===0){return a}var c=new Color(a);if(typeOf(b)!=="null"&&(b.getDay()===0||b.getDay()===6)){return this._getGreyscaleFromRgb(a)}else{return a}}});Date._MD=new Array(31,28,31,30,31,30,31,31,30,31,30,31);Date.SECOND=1e3;Date.MINUTE=60*Date.SECOND;Date.HOUR=60*Date.MINUTE;Date.DAY=24*Date.HOUR;Date.WEEK=7*Date.DAY;Date.prototype.getMonthDays=function(a){var b=this.getFullYear();if(typeof a==="undefined"){a=this.getMonth()}if(0===b%4&&(0!==b%100||0===b%400)&&a===1){return 29}else{return Date._MD[a]}};Date.prototype.isSameWeek=function(a){return this.getFullYear()===a.getFullYear()&&this.getMonth()===a.getMonth()&&this.getWeekNumber()===a.getWeekNumber()};Date.prototype.isSameDay=function(a){return this.getFullYear()===a.getFullYear()&&this.getMonth()===a.getMonth()&&this.getDate()===a.getDate()};Date.prototype.isSameHour=function(a){return this.getFullYear()===a.getFullYear()&&this.getMonth()===a.getMonth()&&this.getDate()===a.getDate()&&this.getHours()===a.getHours()};Date.prototype.isDateBetween=function(a,b){var c=a.getFullYear()*1e4+(a.getMonth()+1)*100+a.getDate();var d=b.getFullYear()*1e4+(b.getMonth()+1)*100+b.getDate();var e=this.getFullYear()*1e4+(this.getMonth()+1)*100+this.getDate();return c<=e&&e<=d}