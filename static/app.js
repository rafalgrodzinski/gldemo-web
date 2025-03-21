requirejs.config({
    baseUrl: "./",
    paths: {"main": "gldemo"}
});

requirejs(["main"]);