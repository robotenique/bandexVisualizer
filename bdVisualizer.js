$.getJSON("cardapio.json", function(json) {
    var arr = new Array();
    var total = 0;
    jQuery.each(json["ingrediente"], function(i, val) {
        arr[i] = {"qtd": parseInt(val["qtd"]), "tipo": val["tipo"]};
        total += arr[i].qtd;
    });
    console.log(arr[3]);
    for (var i = 0; i < arr.length; i++) {
        if(arr[i]){
            arr[i].qtd /= total;
        }
    }

    var st = [].concat.apply([], arr.map(i => i.tipo.split(" ")));
    function upd(narr, ss) {
        for (i of narr) {
            if(i.ingr == )
        }
    }
    for (var i = 0; i < st.length; i++) {
        if(st[i] && ! st[i].match(/^(opção:|de|arroz|feijão|integral|salada|refresco|minipão)$/)){
            upd(narr, st[i]);
        }
    }

    var narr = new Array();
    for (s of st)
        if(s && !s.match(/^(opção:|de|arroz|feijão|integral|salada|)$/))
            if(narr[s])
                narr[s]++;
            else
                narr[s] = 1;
    narr.sort(function(a, b) {
        console.log(a);
        return a - b;
    });
    //console.log(narr);


    //Plotly.newPlot('topinho', data, layout);
});
