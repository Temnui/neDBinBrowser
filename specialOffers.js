let listOfOffers = {};
let specialOffers = [
    {
        "name": "lipstick",
        "condition": "page",
        "conditionQuantity": "2",
        "range": ["67577", "67577", "67570", "68098", "68098", "28728", "23207", "68848", "27175", "23171", "27578", "29297", "26941", "26927", "26873", "27826", "27714", "27769", "23415", "63158", "63158", "63160", "63156", "63198", "63603", "63159", "63155", "65671", "65679", "65510", "65379", "63402", "63604", "65669", "65673", "64733", "63526", "63154", "65632", "65632", "27313", "27135", "27107", "27106", "25870", "65633", "25347", "25726", "25308", "25349", "27137", "25104", "64903", "64903", "64935", "65215", "64858", "64873", "64874", "65036", "65164", "65163", "65455", "64934", "64697", "45153", "45153", "39013", "38995", "39015", "44957", "44955", "65317", "25061", "25061", "24095", "65925", "65925", "65820", "65619", "69005", "76923", "69095", "68857", "64669", "65037"],
        "offer": "page",

    }, {
        "name": "life",
        "range": ["11510", "12349", "11865", "15499"]
    },
    {
        "name": "wowFR",
        "range": ["41908", "82271", "99194", "26594", "51609", "36419", "34116", "18397", "92070", "75678", "26640", "11967", "55144", "73469", "18973", "27537", "26371"]
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

function findAllExeptPage(page) {
    let temp = [];
    db.find({$not: {fsc: {$in: codeFromPage(page)}}}, {_id: 0, fsc: 1}, function (err, docs) {
        temp.push(docs);
    });
    return temp
}

function checkCodesForSO() {
    console.log('fucus out');
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
                if (document.getElementById('newItems[' + i + '].linenumber').value == specialOffers[1].range[j]) {
                    counter++;
                    if (counter > 0) {
                        flag = true;
                        listOfOffers[specialOffers[1].name] = specialOffers[1].name;
                    }
                }
            }
        }
    }
    if (flag) {
        localStorage.setItem("showPopupWithSO", "true");
        localStorage.setItem("listOfOffers", listOfOffers);
        showPopupSO()
    }
}

if (page('orderEntry')) {
    let popupAboutSO = document.createElement('div');
    popupAboutSO.id = "popupAboutSO";
    popupAboutSO.className = "popupAboutSO";
    popupAboutSO.style.display = "none";
    popupAboutSO.innerHTML = "<div id=\"popupAboutSO\" class=\"popupAboutSO\" style=\"position: fixed; color: white; bottom: 0; z-index: 600; height: 40px; width: 100%; background-color: black; text-align: center\">We have special offer for You, <a href=\"#/\" onclick=\"displaySO();\">check it out >></a></div>";
    document.body.insertBefore(popupAboutSO, document.body.firstChild);
}

function showPopupSO() {
    console.log(listOfOffers);
    $("#popupAboutSO").fadeIn("slow", function () {
        // done
    });
}

function displaySO() {
    $("#popupAboutSO").fadeOut("slow", function () {
        // done
    });
    for (let key in listOfOffers) {
        if (listOfOffers.hasOwnProperty(key)) {
            for (let i = 0; i < specialOffers.length; i++) {
                // noinspection EqualityComparisonWithCoercionJS
                if (key == specialOffers[i].name) {
                    db.find({fsc: {$in: specialOffers[i].range}}, function (err, docs) {
                        console.log('We get:');
                        console.log(docs);
                    });
                }
            }
        }
    }
}

for (let i = 0; i < 49; i++) {
    document.getElementById('newItems[' + i + '].linenumber').setAttribute('onfocusout', 'checkCodesForSO();')
}

/*
$("#divBioBottom1 > p > input").focusout(function(){
    checkCodesForSO();
    console.log('fucus out');
});*/
