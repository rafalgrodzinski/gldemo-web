main();

function main() {
    let gl = setupGl();
}

function setupGl() {
    let canvas = document.querySelector("#gl-view");
    let gl = canvas.getContext("webgl2");
    if(!gl) {
        alert("Unable to initialize WebGL");
        throw new Error();
    }
    return gl;
}
