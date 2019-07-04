let listOfOffers = {};
let test = ''; // todo remove on prod
let specialOffers = [
    {
        "name": "lipstick",
        "description": "descriptionLipstick",
        "footer": "footerLipstick",
        "condition": "page",
        "conditionQuantity": "2",
        "range": ["67577", "67577", "67570", "68098", "68098", "28728", "23207", "68848", "27175", "23171", "27578", "29297", "26941", "26927", "26873", "27826", "27714", "27769", "23415", "63158", "63158", "63160", "63156", "63198", "63603", "63159", "63155", "65671", "65679", "65510", "65379", "63402", "63604", "65669", "65673", "64733", "63526", "63154", "65632", "65632", "27313", "27135", "27107", "27106", "25870", "65633", "25347", "25726", "25308", "25349", "27137", "25104", "64903", "64903", "64935", "65215", "64858", "64873", "64874", "65036", "65164", "65163", "65455", "64934", "64697", "45153", "45153", "39013", "38995", "39015", "44957", "44955", "65317", "25061", "25061", "24095", "65925", "65925", "65820", "65619", "69005", "76923", "69095", "68857", "64669", "65037"],
        "offer": "page",

    }, {
        "name": "life",
        "description": "life",
        "footer": "footerLife",
        "range": ["11510", "12349", "11865", "15499"]
    },
    {
        "name": "wowFR",
        "description": "wowFR",
        "footer": "wowFR",
        "range": ["41908", "82271", "99194", "26594", "51609", "36419", "34116", "18397", "92070", "75678", "26640", "11967", "55144", "73469", "18973", "27537", "26371"]
    },
    {
        "name": "wowPrice",
        "description": "wowPrice",
        "footer": "wowPrice",
        "range": ["29262", "31825", "64238", "18277", "17730", "17867", "41494", "43736", "26635", "79707", "45620", "77960", "25679", "08395", "19986", "78040", "89850", "14516", "40051", "74951", "01867", "68379", "36770", "94211", "60933", "14572"]
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
        if (document.getElementById('newItems[' + i + '].linenumber').value == '93176') {
            document.getElementById('newItems[' + i + '].linenumber').value = '';
            alert('Цей товар може бути замовлений лише через інтернет-вітрину.');
        }
    }
    // check for special offer
    let flag = false;
    let counter = 0;
    for (let i = 0; i < 49; i++) {
        if (document.getElementById('newItems[' + i + '].linenumber').value !== '') {
            //lipstick
            for (let j = 0; j < specialOffers[0].range.length; j++) {
                // noinspection EqualityComparisonWithCoercionJS
                if (document.getElementById('newItems[' + i + '].linenumber').value == specialOffers[0].range[j]) {
                    counter++;
                    if (counter > 1) {
                        flag = true;
                        listOfOffers[specialOffers[0].name] = specialOffers[0].name;
                    }
                }
            }
            //avon life
            for (let j = 0; j < specialOffers[1].range.length; j++) {
                // noinspection EqualityComparisonWithCoercionJS
                if (document.getElementById('newItems[' + i + '].linenumber').value != specialOffers[1].range[j]) {
                    counter++;
                    if (counter > 0) {
                        flag = true;
                        listOfOffers[specialOffers[1].name] = specialOffers[1].name;
                    }
                }
            }
            //wowFR
            for (let j = 0; j < specialOffers[2].range.length; j++) {
                // noinspection EqualityComparisonWithCoercionJS
                if (document.getElementById('newItems[' + i + '].linenumber').value == specialOffers[2].range[j]) {
                    counter++;
                    if (counter > 1) {
                        flag = true;
                        listOfOffers[specialOffers[2].name] = specialOffers[2].name;
                    }
                }
            }
            //wowPrice
            for (let j = 0; j < specialOffers[3].range.length; j++) {
                // noinspection EqualityComparisonWithCoercionJS
                if (document.getElementById('newItems[' + i + '].linenumber').value == specialOffers[3].range[j]) {
                    counter++;
                    if (counter > 1) {
                        flag = true;
                        listOfOffers[specialOffers[3].name] = specialOffers[3].name;
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
    popupAboutSO.innerHTML = "<div id=\"popupAboutSO\" class=\"popupAboutSO\"><p>Умови спеціальних пропозицій виконані! <!--suppress HtmlUnknownAnchorTarget --><a href=\"#/\" onclick=\"displaySO();\">Детальніше >></a></p></div>";
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
            '                        <div>' + products[i].price + ' грн</div><span>' + products[i].oldPrice + ' грн</span>\n' +
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