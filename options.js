"use strict";
if (typeof localStorage !== "undefined"){
	for(var key in localStorage){
		if (localStorage.hasOwnProperty(key) && key != "debug") exports[key] = localStorage[key];
	}
}
exports.register = function(opt, ele, nopersist){
	var field = ele.type == "checkbox" ? "checked" : "value";
	if (exports[opt]) ele[field] = exports[opt];
	if (!nopersist && typeof localStorage !== "undefined"){
		ele.addEventListener("input", function() {
			if (this[field]){
				exports[opt] = localStorage[opt] = this[field];
			}else{
				delete localStorage[opt];
				delete exports[opt];
			}
		});
	}else{
		ele.addEventListener("input", function() {
			exports[opt] = field == "checked" && !this.checked ? "" : this[field];
		});
	}
}