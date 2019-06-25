let isOdd = function(x) { return x & 1; };
let isEven  = function(x) { return !( x & 1 ); };

function codeFromPage(args) {
    let pages = args;
    pages = pages.replace(/ /gi,'');
    if (/[^0-9,\-]/.test(pages)){
        console.log('ERROR!!! function codeFromPage get wrong parameter: ' + pages);
    }
    pages = pages.split(',');
    let arrPages = [];
    for (let i = 0; i < pages.length; i++) {
        if (/-/.test(pages[i])){
            let fromTo = pages[i].split('-');
            if(!isEven(fromTo[0])){
                fromTo[0] --;
            }
            if(!isEven(fromTo[1])){
                fromTo[1] --;
            }
            console.log(fromTo);
            let pagesQuantity = fromTo[1] - fromTo[0];
            console.log(pagesQuantity);
            for (let j = Number(fromTo[0]); j <= Number(fromTo[1]); j = j + 2) {
                arrPages.push(j);
            }
        } else {
            if (isEven(Number(pages[i]))){
                arrPages.push(Number(pages[i]));
            } else {
                arrPages.push(pages[i]-1);
            }
        }
    }
    console.log(pages);
    console.log(pages.length);
    console.log(arrPages);
}