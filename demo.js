console.log('nhelload ')

function f(x){
    x = "x-" + x;
    return function(y){
        y = "y-" + x;
        return function(z){
            return "z-" + y;
        }
    }
}

let g =f("a")("b")("c")
print(g);
