exports.go_index = function(req,res){
    res.writeHead(200,{
        'Content-Type' : 'text/plain'
    });
    res.end('Hello World');
}
//next is goto next middle