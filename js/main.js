//主要的函数
window.onload = function() {
    var cvs = new Cvs();
    var bgbox = new Bgbox(cvs);
    showFPS.go();
    var fly1 = new Fly('blue',200,600,cvs);
    var fly2 = new Fly('red',600,600,cvs);
}