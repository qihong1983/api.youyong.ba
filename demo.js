var arguments = process.argv.splice(2);
console.log('所传递的参数是：', arguments);

//////////////////////////
// print process.argv
process.argv.forEach(function(val, index, array) {
	console.log(index + ': ' + val);
});