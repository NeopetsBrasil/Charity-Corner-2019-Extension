document.querySelector("div#invNav").innerHTML = document.querySelector("div#invNav").innerHTML + "<br><br><div id=\"count\" style=\"font-weight: bold;\">Selected: <span>0</span> / 10</div><br><input type=\"button\" class=\"donate_button cc_button_donate\" name=\"Donate to charity\" value=\"Donate!\"></input><br><div id=\"coin\"></div>";

document.querySelector("body").innerHTML = document.querySelector("body").innerHTML + "<style type=\"text/css\">\n.cc_button_donate {\n	-moz-box-shadow: 0px 1px 0px 0px #fff6af;\n	-webkit-box-shadow: 0px 1px 0px 0px #fff6af;\n	box-shadow: 0px 1px 0px 0px #fff6af;\n	background:-webkit-gradient(linear, left top, left bottom, color-stop(0.05, #ffec64), color-stop(1, #ffab23));\n	background:-moz-linear-gradient(top, #ffec64 5%, #ffab23 100%);\n	background:-webkit-linear-gradient(top, #ffec64 5%, #ffab23 100%);\n	background:-o-linear-gradient(top, #ffec64 5%, #ffab23 100%);\n	background:-ms-linear-gradient(top, #ffec64 5%, #ffab23 100%);\n	background:linear-gradient(to bottom, #ffec64 5%, #ffab23 100%);\n	filter:progid:DXImageTransform.Microsoft.gradient(startColorstr='#ffec64', endColorstr='#ffab23',GradientType=0);\n	background-color:#ffec64;\n	-moz-border-radius:6px;\n	-webkit-border-radius:6px;\n	border-radius:6px;\n	border:1px solid #ffaa22;\n	display:inline-block;\n	cursor:pointer;\n	color:#bd82bd;\n	font-family:Arial;\n	font-size:12px;\n	font-weight:bold;\n	padding:7px;\n	text-decoration:none;\n	text-shadow:0px 1px 0px #ffee66;\n}\n.cc_button_donate:hover {\n	background:-webkit-gradient(linear, left top, left bottom, color-stop(0.05, #ffab23), color-stop(1, #ffec64));\n	background:-moz-linear-gradient(top, #ffab23 5%, #ffec64 100%);\n	background:-webkit-linear-gradient(top, #ffab23 5%, #ffec64 100%);\n	background:-o-linear-gradient(top, #ffab23 5%, #ffec64 100%);\n	background:-ms-linear-gradient(top, #ffab23 5%, #ffec64 100%);\n	background:linear-gradient(to bottom, #ffab23 5%, #ffec64 100%);\n	filter:progid:DXImageTransform.Microsoft.gradient(startColorstr='#ffab23', endColorstr='#ffec64',GradientType=0);\n	background-color:#ffab23;\n}\n.cc_button_donate:active {\n	position:relative;\n	top:1px;\n}\n.cs_button{\n	margin: 1em auto;\n	text-align: center;\n}\n.cs_button p { margin: .5em; auto; font-weight: bold;}\n</style>";

document.querySelector("input.donate_button").addEventListener('click', function(){
    doar();
});

var itemsElement = document.querySelector("table.inventory").querySelectorAll("td");

if (itemsElement != null) {
    for (itemElement of itemsElement) {
        var itemID = itemElement.innerHTML.substring(itemElement.innerHTML.indexOf("(")+1, itemElement.innerHTML.indexOf(")"));
        var input = "<hr noshade size=\"1\" color=\"#DEDEDE\"><input type=\"button\" class=\"ID"+itemID+" cc_button_donate\" name=\"Add to charity\" value=\"I Don't Need It\"></input><br><span class=\"ID"+itemID+"\">0 / 1</span>"
        itemElement.innerHTML = itemElement.innerHTML + input;
        var inputElement = itemElement.querySelector("input");
        inputElement.addEventListener('click', function(e){
            process((e.target.name == "Add to charity" ? 1:2), e.target.className.split(" ")[0].split("ID")[1]);
        });
    }
}

function process(cc2019type, cc2019ObjId) {
    if(cc2019type!='' && cc2019ObjId!='') {
        var inputElement = document.querySelector("input.ID"+cc2019ObjId);
        var spanElement = document.querySelector("span.ID"+cc2019ObjId);
        inputElement.disabled = true;
        inputElement.value = "Process...";
        $.ajax({
            url: 'charitycorner/2019/ajax/donate_inventory.php',
            type: 'post',
            data: { type: cc2019type , id: cc2019ObjId },
            success: function(data) {
                if (data.success) {
                    if (cc2019type == 1) {
                        inputElement.name = "Remove from charity";
                        inputElement.value = "I'll Keep It";
                        spanElement.innerHTML = "1 / 1";
                        document.querySelector("div#count span").innerHTML = parseInt(document.querySelector("div#count span").innerHTML) + 1;
                        console.log("add: "+cc2019ObjId);
                        inputElement.disabled = false;
                    }
                    else {
                        inputElement.name = "Add to charity";
                        inputElement.value = "I Don't Need It";
                        spanElement.innerHTML = "0 / 1";
                        document.querySelector("div#count span").innerHTML = parseInt(document.querySelector("div#count span").innerHTML) - 1;
                        console.log("rem: "+cc2019ObjId);
                        inputElement.disabled = false;
                    }
                }
            }
        });
    }
}

function doar() {
    if (parseInt(document.querySelector("div#count span").innerHTML) > 0 && parseInt(document.querySelector("div#count span").innerHTML) <= 10) {
        var buttonElement = document.querySelector("input.donate_button");
        buttonElement.disabled = true;
        buttonElement.value = "Process...";
        var state = 1;
        $.ajax({
            url: '/charitycorner/2019/donateNp.php',
            async: false,
            type: 'post',
            data: { donationType: state },
            dataType: "json",
            success: function(data) {							
                if (data.success) {
                    coin = data.coin;
                    document.querySelector("div#coin").innerHTML = "You won "+coin+" points! This page will be reloaded automatically."
                    setTimeout(function(){ window.location.reload(); }, 3000);
                }
            },
            error: function(data) {
                document.querySelector("div#coin").innerHTML = "Something went wrong !!! Try again."
                buttonElement.disabled = false;
            }
        });
    }
    else {
        document.querySelector("div#coin").innerHTML = "You must donate at least 1 or at most 10 items!"
    }
}