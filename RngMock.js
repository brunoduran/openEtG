exports = module.exports = Object.create(require("./Thing").prototype);
exports.rng = Math.random;
exports.upto = function(x){ return Math.floor(Math.random()*x); }
exports.uptoceil = function(x){ return Math.ceil((1-Math.random())*x); }
