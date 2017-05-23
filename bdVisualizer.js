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
        return k;
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

    var j = $("#genChart").width();
    var layout = {
      height: $("#genChart").width() - 10,
      width: $("#genChart").width() - 10,
      title: "Ranking geral - Palavras-chave"
    };
    //window.alert("WIDTHHHHHHHHH = "+j);
    return {"data" : data, "layout" :layout};
}

function genPieIngr(json) {
    var arr = new Array();
    var trashFood = ["arroz", "feijão", "integral", "pvt", "opção:", "refresco"];
    trashFood = trashFood.map(i => new RegExp('\\b'+i+'\\b'));

    var globalGambiarra = 0;
    jQuery.each(json["ingrediente"], function(i, val) {
        if(typeof val != 'undefined')
            if(notStaleFood(val["tipo"], trashFood))
                arr[globalGambiarra++] = {"qtd": parseInt(val["qtd"]), "tipo": val["tipo"]};
    });

    var total = arr.reduce(function (t, newQ) { return t + newQ.qtd;}, 0);
    for (var i = 0; i < arr.length; i++) {
        arr[i].qtd /= parseFloat(total);
    }
    arr.sort(function(a, b) {
        var k = b.qtd - a.qtd;
        if(k == 0)
            return ( a.tipo == b.tipo ) ? 0 : ( ( b.tipo > a.tipo ) ? 1 : -1 );
        return k;
    });

    var i = 0;
    for (total = 0; i < arr.length && total < 0.6; i++) {
        total += arr[i].qtd;
        if(arr[i].qtd < 0.015)
            break;
    }
    arr = arr.slice(0, i + 1);
    var data = [{
      values: arr.map(i => i.qtd).concat([1 - total]),
      labels: arr.map(i => i.tipo).concat("Outros"),
      type: 'pie'
    }];

    var j = $("#ingrChart").width();
    var layout = {
      height: $("#ingrChart").width() - 10,
      width: $("#ingrChart").width() - 10,
      title: "Ranking geral - Porções"
    };
    return {"data" : data, "layout" :layout};
}

$.getJSON("cardapio.json", function(json) {
    // Plot general keyword chart
    genChart = genPieAll(json);
    Plotly.newPlot('kwChart', genChart.data, genChart.layout, {displayModeBar: false});
    $('#kwChart').css({'margin' : '0 auto'});
    Plotly.Plots.resize(document.getElementById("kwChart"));

    // Plot ingredient chart
    ingrChart = genPieIngr(json);
    Plotly.newPlot('ingrChart', ingrChart.data, ingrChart.layout, {displayModeBar: false});
    $('#ingrChart').css({'margin' : '0 auto'});
    Plotly.Plots.resize(document.getElementById("ingrChart"));





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

function notStaleFood(food, trashFoods) {
    var notStale = true;
    for (reg of trashFoods)
        if(reg.test(food)) {
            notStale = false;
            break;
        }
    return notStale;
}
