function createElementWithClass(tagName,arrayClassname){    var createdElement = document.createElement(tagName);    for (var i in arrayClassname){        createdElement.className += arrayClassname[i]+' ';    }    return createdElement;}function changeContent(arrayContainer, arrayColumnPath, fieldType){    var newContent = document.getElementById('newContent').value;    eval('arrayColumn'+arrayColumnPath+'= newContent');    newContent = formatString(newContent, fieldType);    for (var i in arrayContainer){        arrayContainer[i].innerHTML = newContent;    }    localStorage['content'] = JSON.stringify(arrayColumn);}function createArrayColumnPath(arrayKeys){    var arrayColumnPath = '';    for (var i in arrayKeys){        arrayColumnPath+= '['+arrayKeys[i]+']';    }    return arrayColumnPath;}function addClassName(element, className) {    if (element.className.search(className) === -1){        element.className += ' '+className;    }}function suppressElementsBySelector(suppressSelector){    var arrayToSuppress = document.querySelectorAll(suppressSelector);    for (var i in arrayToSuppress){        if (typeof arrayToSuppress[i].style !== 'undefined'){            arrayToSuppress[i].parentNode.removeChild(arrayToSuppress[i]);        }    }}//To suppress a list of elements with the corresponding CSS selectorfunction formatString(string,fieldType){    if (string === '') {        string = '<span class="placeholder">Click here to add a '+fieldType+'</span>';//change class if another is preferred by Antoine.    }else{        string = string.replace('&','&amp;');        string = string.replace('<','&lt;');    }    return string;}//To format the name of a fieldfunction linkButtonOnclickEvent(button){    button['domElement'].onclick = function(){        if (button['action'] === 'close'){            submitForm(document.querySelector('.modificationForm'));            button['domElement'].parentNode.parentNode.removeChild(button['domElement'].parentNode);        }    };}function buttonInit(elementToAppend,action){    var button = {};    button['action'] = action;    button['domElement'] = createElementWithClass('span', [action+'Button']);    button['father'] = elementToAppend;    return button;}function buttonDisplay(button) {    button['domElement'].innerHTML = (button['action'] == 'validate')? '<button>' +        '<i class="fa fa-check" aria-hidden="true"></i></button>' : 'x';    button['father'].appendChild(button['domElement']);    if (window.getComputedStyle(button['father']).getPropertyValue('position') === 'static'){        button['father'].className += ' positioned';    }}function addButton(elementToAppend,action){    var button = buttonInit(elementToAppend,action);    buttonDisplay(button);    linkButtonOnclickEvent(button);    return button;}function appendChilds(father, arrayChild){    for (var i in arrayChild){        father.appendChild(arrayChild[i]);    }}function submitForm(form){    if (form !== null){        for (var i in form.childNodes){            if (typeof form.childNodes[i].className !== 'undefined'){                if (form.childNodes[i].className.search('validateButton') !== -1){                    form.childNodes[i].childNodes[0].click();                }            }        }    }}//Some functions called by openFormRename// and addColumn.function displayForm(form){    form['linkedElement'][0].innerHTML = '';    submitForm(document.querySelector('.' + form['className']));    suppressElementsBySelector('.' + form['className']);    form['domElement'].className = form['className'];    form['linkedElement'][0].appendChild(form['domElement']);    form['domElement'].innerHTML = '<textarea id="newContent" placeholder=\"enter a ' + form['fieldType'] + '\">'    + form['originalContent'] + '</textarea>';}function linkFormOnclickEvent(form, arrayKeys){    document.querySelector('.'+form['className']).onsubmit  = function() {        if (form['fieldType'] === 'description'){            if (document.getElementById('newContent').value !== ''){                addClassName(form['originObject']['originCard']['elements']['domElement'], 'hasDescription');            }else{                form['originObject']['originCard']['elements']['domElement'].className =                form['originObject']['originCard']['elements']['domElement'].className.replace(' hasDescription', '');            }        }        changeContent(form['linkedElement'], createArrayColumnPath(arrayKeys), form['fieldType']);        return false;    };}function initForm(originObject,arrayKeys, fieldType, arrayLinkedElement){    var form = {};    form['originObject'] = originObject;    form['className'] = 'modificationForm';//As usual, give classname according to what Antoine needs.    form['domElement'] = document.createElement('form');    form['fieldType'] = fieldType;    form['linkedElement'] = arrayLinkedElement;    form['originalContent'] = eval('arrayColumn'+createArrayColumnPath(arrayKeys));    return form;}function openFormModif(originObject,arrayKeys, fieldType, arrayLinkedElement){//WARNING!!! DO NOT CALL THIS FUNCTION WITH ARRAYKeys AS USER INPUT                                                 // : IT IS USED IN AN EVAL STATEMENT    if (arrayLinkedElement[0].innerHTML.search('<form') === -1){        var form = initForm(originObject, arrayKeys, fieldType, arrayLinkedElement);        displayForm(form);        document.getElementById('newContent').focus();        linkFormOnclickEvent(form, arrayKeys);        addButton(form['domElement'], 'validate');        return form;    }}//open a form to rename a fieldfunction createElementsForModale(card, column){    var modale = createElementWithClass('div', ['modale']);    var description = createElementWithClass('p', ['cardDescription']);    description.innerHTML = card['elements']['innerElements']['description'].innerHTML;    var divTitles = createElementWithClass('div', ['name']);    var columnTitle = createElementWithClass('h3',['title']);    columnTitle.innerHTML = column['elements']['innerElements']['title'].innerHTML;    var title = createElementWithClass('h2', ['title']);    title.innerHTML = card['elements']['innerElements']['title'].innerHTML;    appendChilds(divTitles, [title, columnTitle]);    return {'domElement' : modale, 'innerElements' : {'divTitles' : divTitles, 'description' : description},    'innerTitles' : {'title' : title, 'columnTitle' : columnTitle}};}function initModale(card, column){    var modale = {};    modale['elements'] = createElementsForModale(card, column);    appendChilds(modale['elements']['domElement'],modale['elements']['innerElements']);    addButton(modale['elements']['domElement'], 'close');    return modale;}function linkModaleOnclickEvent(modale,card, column){    modale['elements']['innerTitles']['title'].onclick = function () {        openFormModif(modale,[column['number'], '\'content\'', card['number'], '\'title\''], 'title',            [this, card['elements']['innerElements']['title']]);    };    modale['elements']['innerTitles']['columnTitle'].onclick = function () {        openFormModif(modale,[column['number'], '\'name\''], 'column title' ,[this, column['elements']['innerElements']['title']]);    };    modale['elements']['innerElements']['description'].onclick = function () {        openFormModif(modale,[column['number'], '\'content\'', card['number'], '\'description\''], 'description',            [this, card['elements']['innerElements']['description']]);    };}function addModale(card, column){    var modale = initModale(card, column);    modale['originCard'] = card;    document.querySelector('.shelf').appendChild(modale['elements']['domElement']);    linkModaleOnclickEvent(modale,card, column);    return modale;}//beginning of functions to add a cardfunction createElementsForCard() {    var newCard = createElementWithClass('div',['card']);//TODO! change style(div.box became div.card)    var cardTitle = createElementWithClass('h2',['cardTitle']);    var cardDescription = createElementWithClass('p', ['cardDescription']);    return {'domElement' : newCard, 'innerElements' : {'title' : cardTitle, 'description' : cardDescription}};}function dragCard(originCard, originColumn, e){    e.dataTransfer.setData('text/plain', '');    movedElement = {'card' : originCard, 'column' : originColumn};}function linkCardEvent(card, column){    card['elements']['domElement'].addEventListener('click',function () {        addModale(card, column);    }, true);    card['elements']['domElement'].draggable = true;    card['elements']['domElement'].addEventListener('dragstart',function (e) {        dragCard(card, column, e);    }, true);}function initCard(cardNumber) {    var card = {};    card['elements'] = createElementsForCard();    card['number'] = cardNumber;    return card;}//end of functions for adding cardsfunction addCard(column,cardNumber) {    var card = initCard(cardNumber);    var containerBox = column['elements']['innerElements']['container'];    //we created the var    card['elements']['domElement'].appendChild(card['elements']['innerElements']['title']);    containerBox.appendChild(card['elements']['domElement']);    linkCardEvent(card,column);    return card;}//CARD CREATIONfunction createElementsForColumn(columnName){    var column = createElementWithClass('div', ['column']);    var title = createElementWithClass('h3', ['title']);    columnName = formatString(columnName, 'column title');    title.innerHTML = columnName;    var container = createElementWithClass('div', ['containerCard']);    var button = createElementWithClass('input', ['addCard']);    button.type = 'button';    button.value = 'add a card';    return {'domElement' : column, 'innerElements' : {'title' : title, 'container' : container, 'button': button}};}function displayElements(elements){    appendChilds(elements['domElement'],elements['innerElements']);    document.querySelector('.shelf').appendChild(elements['domElement']);}function createNewCard(column){    arrayColumn[column['number']]['content'].push({'title' : '', 'description': ''});    localStorage['content'] = JSON.stringify(arrayColumn);    //we update local storage    var card = addCard(column,arrayColumn[column['number']]['content'].length -1);    card['elements']['innerElements']['title'].innerHTML = '<span class="placeholder">click here to change your card title</span>';    card['elements']['innerElements']['description'].innerHTML = '<span class="placeholder">Click here to add a description.' +        '</span>';    var modale = addModale(card, column);    console.log(modale);    modale['elements']['innerTitles']['title'].click();}function applyDragLeaveEvent(element){    element.className.replace('drop-over', '');}function copyCard(originCard, destinationColumn){    var card = addCard(destinationColumn, destinationColumn['elements']['innerElements']['container'].childNodes.length);    card['elements']['innerElements']['title'].innerHTML = originCard['card']['elements']['innerElements']['title'].innerHTML;    card['elements']['innerElements']['description'].innerHTML = originCard['card']['elements']['innerElements']['description'].innerHTML;    card['elements']['domElement'].className = originCard['card']['elements']['domElement'].className;    arrayColumn[destinationColumn['number']]['content'][arrayColumn[destinationColumn['number']]['content'].length] = arrayColumn[originCard['column']['number']]['content'][originCard['card']['number']];}function suppressCard(cardToSuppress) {    cardToSuppress['card']['elements']['domElement'].parentNode.removeChild(cardToSuppress['card']['elements']['domElement']);    arrayColumn[cardToSuppress['column']['number']]['content'].splice(arrayColumn[cardToSuppress['column']['number']]['content'][cardToSuppress['card']['number']], 1);}function applyColumnDropEvent(column){    copyCard(movedElement, column);    suppressCard(movedElement);    localStorage['content'] = JSON.stringify(arrayColumn);}function applyColumnDragOverEvent(column, e){    e.preventDefault();    addClassName(column['elements']['domElement'], 'drop-over');}function linkColumnEvent(column) {    column['elements']['innerElements']['title'].addEventListener('click',function () {        openFormModif(column,[column['number'], '\'name\''], 'column title', [this]);    }, true);    column['elements']['innerElements']['button'].onclick = function () {        createNewCard(column);    };    column['elements']['domElement'].addEventListener('dragover', function (e) {        applyColumnDragOverEvent(column, e);    });    column['elements']['domElement'].addEventListener('dragleave', function () {        applyDragLeaveEvent(column['elements']['domElement']);    });    column['elements']['domElement'].addEventListener('drop', function () {        applyColumnDropEvent(column);    });}function initColumn(columnName,columnNumber){    var column = {};    column['elements'] = createElementsForColumn(columnName);    column['number'] = columnNumber;    return column;}//functions for column creationfunction addColumn(columnName,columnNumber) {//possibly to be changed if Antoine prefers another selector.    var column = initColumn(columnName,columnNumber);    displayElements(column['elements']);    //we link to each column its unique id, the corresponding domElement and an array of the elements into this column    linkColumnEvent(column);    return column;}//END OF COLUMN CREATIONfunction displayContent(arrayColumn) {//TODO!!! IMPORTANT! Implement this function so it shows the page as it was left.    for (var i in arrayColumn){        var column = addColumn(arrayColumn[i]['name'],i);        for (var j in arrayColumn[i]['content']){            var card = addCard(column,j);            card['elements']['innerElements']['title'].innerHTML = formatString(arrayColumn[i]['content'][j]['title'], 'title');            card['elements']['innerElements']['description'].innerHTML = formatString(arrayColumn[i]['content'][j]['description'], 'description');            if (arrayColumn[i]['content'][j]['description'] !== ''){                addClassName(card['elements']['domElement'], 'hasDescription');            }        }    }}var arrayColumn = [];var movedElement;window.onload = function(){    if (typeof localStorage['content'] !== 'undefined'){        if (typeof JSON.parse(localStorage['content']) === 'object'){            arrayColumn = JSON.parse(localStorage['content']);            console.log(arrayColumn);            displayContent(arrayColumn);        }    }    //We display the content with what was stocked in the local storage.    var addAColumn = document.getElementById('addColumn');    addAColumn.onclick = function(){        var name = document.getElementById('columnName').value;        arrayColumn.push({'name': name, 'content': []});        localStorage['content'] = JSON.stringify(arrayColumn);        addColumn(name,arrayColumn.length -1);        document.getElementById('columnName').value = '';    }};