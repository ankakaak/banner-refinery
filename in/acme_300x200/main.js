setInterval(function(){

    var link = document.createElement('a');
    link.target = '_blank';
    link.style.display = 'block';
    link.href = '//google.com';
    link.innerHTML = 'CLICK ME 2';
    document.body.appendChild(link);

}, 1000);