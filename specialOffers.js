let listOfOffers = {};
let test = ''; // todo remove on prod
let specialOffers = [
    {
        "name": "aroma-proposition",
        "description": "Ароматна пропозиція",
        "footer": "*твоя ціна за умови придбання будь-яких 2-х продуктів зі сторінок 34-35",
        "condition": "page",
        "conditionQuantity": "2",
        "range": ["16995", "26640", "24190", "26371", "12997", "01851", "34650", "99194"],
        "offer": "page",

    }, {
        "name": "premium-proposition",
        "description": "Преміум пропозиція",
        "footer": "Будь-який преміум аромат за СУПЕРЦІНОЮ. *за умови придбання будь-якого іншого продукту з каталогу. На виконання умов спеціальної пропозиції не впливають продукти благодійних програм, пробні зразки та продукти зі стор. 14-15, 44-45, 58, 136-137, 138, 175, 177, 206, 207, 209, 232-233, 234, 235, 236. Ці продукти також можна замовити окремо за повною вартістю.",
        "condition": "exept",
        "conditionQuantity": "1",
        "range": ["25081", "07003", "16830", "90106", "53863", "62062", "17618", "52796", "25542"],
        "offer": "page",

    }, {
        "name": "any-fragrance",
        "description": "Будь-який аромат 30мл, лише за 119,00 грн. Знижка до 60%",
        "footer": "*за умови придбання будь-якого іншого продукту з каталогу. На виконання умов спеціальної пропозиції не впливають продукти благодійних програм, пробні зразки та продукти зі стор. 14-15, 44-45, 58, 136-137, 138, 175, 177, 206, 207, 209, 232-233, 234, 235, 236. Ці продукти також можна замовити окремо за повною вартістю.",
        "condition": "exept",
        "conditionQuantity": "1",
        "range": ["72835", "07845", "23269", "05084", "09013", "86771"],
        "offer": "page",

    }, {
        "name": "special-proposition",
        "description": "Спеціальна пропозиція!",
        "footer": "*твоя ціна за умови придбання будь-яких 2-х продуктів зі сторінок 100-101",
        "condition": "page",
        "conditionQuantity": "2",
        "range": ["99620", "99620", "98787", "98089", "98889", "99547", "98542", "99774", "99802", "98922", "99669", "99540", "99539", "98894", "98929", "99575", "98521", "99589", "44520", "99619", "98873", "99736", "98856", "99020", "99478", "99612"],
        "offer": "page",

    }, {
        "name": "any-gel",
        "description": "Будь-який гель для душу, лише за 44,99 грн.",
        "footer": "*за умови придбання будь-якого іншого продукту з каталогу. На виконання умов спеціальної пропозиції не впливають продукти благодійних програм, пробні зразки та продукти зі стор. 14-15, 44-45, 58, 136-137, 138, 175, 177, 206, 207, 209, 232-233, 234, 235, 236. Ці продукти також можна замовити окремо за повною вартістю.",
        "condition": "exept",
        "conditionQuantity": "1",
        "range": ["16614", "62896"],
        "offer": "page",

    }
];

let isEven = function (x) { // noinspection JSBitwiseOperatorUsage
    return !(x & 1);
};

// noinspection JSUnusedGlobalSymbols
function codeFromPage(args) {
    return getCodeFromDb(getArrOfPages(args));
}

function getArrOfPages(args) {
    let pages = args;
    pages = pages.replace(/ /gi, '');
    if (/[^0-9,\-]/.test(pages)) {
        console.log('ERROR!!! function codeFromPage get wrong parameter: ' + pages);
    }
    pages = pages.split(',');
    let arrPages = [];
    for (let i = 0; i < pages.length; i++) {
        if (/-/.test(pages[i])) {
            let fromTo = pages[i].split('-');
            if (!isEven(fromTo[0])) {
                fromTo[0]--;
            }
            if (!isEven(fromTo[1])) {
                fromTo[1]--;
            }
            for (let j = Number(fromTo[0]); j <= Number(fromTo[1]); j = j + 2) {
                arrPages.push(j);
            }
        } else {
            if (isEven(Number(pages[i]))) {
                arrPages.push(Number(pages[i]));
            } else {
                arrPages.push(pages[i] - 1);
            }
        }
    }
    return arrPages;
}

function getCodeFromDb(arr) {
    let codes = [];
    db.find({page: {$in: arr}}, function (err, docs) {
        for (let i = 0; i < docs.length; i++) {
            codes.push(docs[i].fsc);
            if (docs[i].hasOwnProperty('shade')) {
                for (let j = 0; j < docs[i].shade.length; j++) {
                    codes.push(docs[i].shade[j]);
                }
            }
        }
    });
    return codes
}

// noinspection JSUnusedGlobalSymbols
function findAllExeptPage(page) {
    let temp = [];
    db.find({$not: {fsc: {$in: codeFromPage(page)}}}, {_id: 0, fsc: 1}, function (err, docs) {
        temp.push(docs);
    });
    return temp
}

// noinspection JSUnusedGlobalSymbols
function checkCodesForSO() {
    //check for promo-codes
    for (let i = 0; i < 49; i++) {
        // noinspection EqualityComparisonWithCoercionJS
        if (document.getElementById('newItems[' + i + '].linenumber').value == '55445' || document.getElementById('newItems[' + i + '].linenumber').value == '26634') {
            document.getElementById('newItems[' + i + '].linenumber').value = '';
            alert('Цей товар може бути замовлений лише через інтернет-вітрину.');
        }
    }
    // todo we suspend experiment on C11
    return;
    // check for special offer
    let flag = false;
    let counter = 0;
    for (let i = 0; i < 49; i++) {
        if (document.getElementById('newItems[' + i + '].linenumber').value !== '') {
            //lipstick
            for (let sp = 0; sp < specialOffers.length; sp++) {
                if (specialOffers[sp].condition === "page") {
                    for (let j = 0; j < specialOffers[sp].range.length; j++) {
                        // noinspection EqualityComparisonWithCoercionJS
                        if (document.getElementById('newItems[' + i + '].linenumber').value == specialOffers[sp].range[j]) {
                            counter++;
                            if (counter > 1) {
                                flag = true;
                                listOfOffers[specialOffers[sp].name] = specialOffers[sp].name;
                            }
                        }
                    }
                } else if (specialOffers[sp].condition === "exept") {
                    for (let j = 0; j < specialOffers[0].range.length; j++) {
                        // noinspection EqualityComparisonWithCoercionJS
                        if (document.getElementById('newItems[' + i + '].linenumber').value != specialOffers[sp].range[j]) {
                            counter++;
                            if (counter > 1) {
                                flag = true;
                                listOfOffers[specialOffers[sp].name] = specialOffers[sp].name;
                            }
                        }
                    }
                }
            }
        }
    }
    if (flag) {
        localStorage.setItem("showPopupWithSO", "true");
        showPopupSO()
    }
}

// noinspection JSUnresolvedFunction
if (page('orderEntry')) {
    let popupAboutSO = document.createElement('div');
    popupAboutSO.id = "popupAboutSO";
    popupAboutSO.className = "popupAboutSO";
    popupAboutSO.style.display = "none";
    popupAboutSO.innerHTML = "<div id=\"popupAboutSO\" class=\"popupAboutSO\"><p>Умови спеціальних пропозицій виконані! <!--suppress HtmlUnknownAnchorTarget --><a href=\"#/\" onclick=\"displaySO();\">Детальніше</a></p></div>";
    document.body.insertBefore(popupAboutSO, document.body.firstChild);

    //SOwindow
    let SOwindow = document.createElement('div');
    SOwindow.id = "popupMessageOverlay";
    SOwindow.className = "SOwindow";
    SOwindow.style.display = "none";
    SOwindow.innerHTML = "<div id=\"SOwindow\" class=\"SOwindow\"></div>";
    document.body.insertBefore(SOwindow, document.body.firstChild);

    cssId = 'myCss';
    if (!document.getElementById(cssId)) {
        let head = document.getElementsByTagName('head')[0];
        let link = document.createElement('link');
        link.id = cssId;
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = 'http://www.avon.com.ua/REPSuite/static/css/specialOffers.css';
        link.media = 'all';
        head.appendChild(link);
    }
}

function showPopupSO() {
    for (let key in listOfOffers) {
        if (listOfOffers.hasOwnProperty(key)) {
            for (let i = 0; i < specialOffers.length; i++) {
                // noinspection EqualityComparisonWithCoercionJS
                if (key == specialOffers[i].name) {
                    db.find({fsc: {$in: specialOffers[i].range}}, function (err, docs) {
                        document.getElementById('SOwindow').innerHTML = '';
                        listOfSOProducts[listOfOffers[key]] = docs;
                        for (let j = 0; j < specialOffers.length; j++){
                            // noinspection EqualityComparisonWithCoercionJS
                            if (specialOffers[j].name == key) {
                                listOfSOProducts[key].header = specialOffers[j].description;
                                listOfSOProducts[key].footer = specialOffers[j].footer;
                            }
                        }
                        for (let key in listOfSOProducts) {
                            if (listOfSOProducts.hasOwnProperty(key)) {
                                console.log('listOfSOProducts[key]');
                                console.log(listOfSOProducts[key]);
                                document.getElementById('SOwindow').innerHTML += generateSOcontent(listOfSOProducts[key].header, listOfSOProducts[key], listOfSOProducts[key].footer);
                            }
                        }
                    });
                }
            }
        }
    }
    $("#popupAboutSO").fadeIn("slow", function () {
        // done
    });
}

let listOfSOProducts = {};

function displaySO() {
    $("#popupAboutSO").fadeOut("slow", function () {
        // done
    });
    $("#popupMessageOverlay").fadeIn("slow", function () {
        // done
    });
    document.getElementById('popupMessageOverlay').style.display = 'block';
    $("#SOwindow").fadeIn("slow", function () {
        // done
    });
}

for (let i = 0; i < 49; i++) {
    document.getElementById('newItems[' + i + '].linenumber').setAttribute('onfocusout', 'checkCodesForSO();')
}

/*
$("#divBioBottom1 > p > input").focusout(function(){
    checkCodesForSO();
    console.log('focus out');
});*/

//html

function getShadeFscDesc(prod) {
    let elem = '';
    if (prod.hasOwnProperty('shade')) {
        test = prod.shadeDesc;
        for (let key in prod.shadeDesc) {
            if (prod.shadeDesc.hasOwnProperty(key)) {
                elem += '<option value="' + key + '">' + prod.shadeDesc[key] + '</option>';
            }
        }
    } else {
        elem = '<option value="' + prod.fsc + '">' + prod.name + '</option>';
    }
    return elem;
}

function generateSOcontent(header, products, footer) {
    let tempHeader = header.toString();
    let tempFooter = footer.toString();
    let elemHeader = '<div class="all-specical-offers-div">\n' +
        '            <div class="e-store-pop-cart-title">' + tempHeader + '</div>';
    let elemContent = '';
    for (let i = 0; i < products.length; i++) {
        elemContent += '<div class="e-store-pop-cart" id="id' + products[i].fsc + '">            <div class="e-store-pop-cart-item">            <div class="e-store-pop-cart-item-num">            <span>' + i + 1 + '</span>' +
            '                    </div>\n' +
            '                    <div class="e-store-pop-cart-item-img">\n' +
            '                        <img alt="" src="' + products[i].urlImg + '">\n' +
            '                    </div>\n' +
            '                    <div class="e-store-pop-cart-item-name">\n' +
            '                        <div class="e-store-pop-cart-item-middle">\n' +
            '                            <span>' + products[i].name + '</span>\n' +
            '                            <div><select onchange="changeFscOnButton(' + products[i].fsc + ',this.options[this.selectedIndex].value)">\n' + getShadeFscDesc(products[i]) +
            '                        </select></div>\n' +
            '                        </div>\n' +
            '                    </div>\n' +
            '\n' +
            '                    <div class="e-store-pop-cart-item-price">\n' +
            '                        <div>' + products[i].oldPrice + ' грн</div><span>' + products[i].price + ' грн</span>\n' +
            '                    </div>\n' +
            '                    <div class="e-store-pop-cart-item-delete">\n' +
            '                        <a href="#" id="button' + products[i].fsc + '" onclick="addSOtoOrder(\'' + products[i].fsc + '\')">Додати до замовлення</a>\n' +
            '                    </div>\n' +
            '                </div>\n' +
            '            </div>';
    }
    let elemFooter = '<div class="specical-text">\n' + tempFooter +
        '            </div>';
    return elemHeader + elemContent + elemFooter;
}

function changeFscOnButton(fsc, value) {
    document.getElementById('button' + fsc).outerHTML = '<a href="#" id="button' + fsc + '" onclick="addSOtoOrder(\'' + value + '\')">Додати до замовлення</a>';
}

function addSOtoOrder(fsc) { //todo rep number price
    for (let i = 0; i < 49; i++) {
        // noinspection EqualityComparisonWithCoercionJS
        if (document.getElementById('newItems[' + i + '].linenumber').value == '') {
            document.getElementById('newItems[' + i + '].linenumber').value = fsc;
            document.getElementById('newItems[' + i + '].quantity').value = 1;
            $("#popupMessageOverlay").fadeOut("slow", function () {
                // done
            });
            $("#SOwindow").fadeOut("slow", function () {
                // done
            });
            $.post( "https://service.avon.ua/templates/atomic/valtest/specialoffer.php", { rep: username, productFsc: fsc } );
            /* vanilla request
            let xhttp = new XMLHttpRequest();
            xhttp.open("POST", "https://service.avon.ua/templates/atomic/valtest/specialoffer.php", true);
            xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhttp.send("rep=" + переменнаяСномеромСчетаРепа + "&fsc=" + переменнаяСкодом);*/
            break
        }
    }
}

// Get the modal
let modal = document.getElementById('popupMessageOverlay');

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target === modal) {
        modal.style.display = "none";
    }
};