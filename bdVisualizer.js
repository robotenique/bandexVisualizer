function genPieAll(json) {
    var arr = new Array();
    jQuery.each(json["ingrediente"], function(i, val) {
        arr[i] = {"qtd": parseInt(val["qtd"]), "tipo": val["tipo"]};
    });
    var st = [].concat.apply([], arr.map(i => i.tipo.split(" ")));
    var narr = new Array();

    for (var i = 0; i < st.length; i++) {
        if(typeof st[i] != 'undefined' && !st[i].match(/(opção:|de|arroz|feijão|integral|salada|refresco|minipão|com|pvt|ao|á|à|em|e)$/)){
            st[i] = st[i].replace(",", "");
            var upd = false;
            var j = 0;
            while(!upd && j < narr.length) {
                if(narr[j].ingr == st[i]){
                    narr[j].qtd++;
                    upd = true;
                }
                j++;
            }
            if(!upd)
                narr.push({"qtd" : 1, "ingr" : st[i]});

        }
    }
    narr.sort(function(a, b) {
        var k = parseInt(b["qtd"]) - parseInt(a["qtd"]);
        if(k == 0){
            return ( a.ingr == b.ingr ) ? 0 : ( ( b.ingr > a.ingr ) ? 1 : -1 );
        }
        return parseInt(b["qtd"]) - parseInt(a["qtd"]);
    });
    var total = narr.reduce(function (t, newQ) { return t + newQ.qtd;}, 0);
    for (var i = 0; i < narr.length; i++) {
        newQtd = parseFloat(narr[i].qtd) / total;
        narr[i] =  {"qtd" : newQtd, "ingr" : narr[i].ingr};
    }

    // Assertion
    if(!isSorted(narr)) { window.alert("BADDDDDD FORMAT!!!11");}

    var i = 0;
    for (total = 0; i < narr.length && total < 0.5; i++) {
        total += narr[i].qtd;
        if(narr[i].qtd < 0.009)
            break;
    }
    narr = narr.slice(0, i + 1);

    var data = [{
      values: narr.map(i => i.qtd).concat([1 - total]),
      labels: narr.map(i => i.ingr).concat("Outros"),
      type: 'pie'
    }];

    var layout = {
      height: 700,
      width: 700,
      title: "Ranking geral - Palavras-chave"
    };

    var ret = {"data" : data, "layout" :layout};

    return ret;
}


$.getJSON("cardapio.json", function(json) {
    genChart = genPieAll(json);
    Plotly.newPlot('topinho', genChart.data, genChart.layout, {displayModeBar: false});
});


// ########## AUXILIAR FUNCTIONS ##########
// Just checks if sorted
function isSorted(arr) {
    var sorted = true;
    for (var i = 0; i < arr.length - 1; i++) {
        if(arr[i] < arr[i + 1]){
            sorted = false;
            break;
        }
    }
    return sorted;
}
