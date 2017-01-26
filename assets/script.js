function createElementWithClass(tagName,arrayClassname){    var createdElement = document.createElement(tagName);    for (var i in arrayClassname){        createdElement.className += arrayClassname[i]+' ';    }    return createdElement;}function suppressElementsBySelector(selector){    var arrayToSuppress = document.querySelectorAll(selector);    for (var i in arrayToSuppress){        if (typeof arrayToSuppress[i].style !== 'undefined'){            arrayToSuppress[i].parentNode.removeChild(arrayToSuppress[i]);        }    }}function addColumn(columnName) {//possibly to be changed if Antoine prefers another selector.    var newColumn = createElementWithClass('div', ['column']);    var newTitle = createElementWithClass('h3',['title']);    var newContainer = createElementWithClass('div',['containerBox']);    var newButton = createElementWithClass('input', ['addBox']);    newButton.type = 'button';    newButton.value = 'add a box';    if (columnName === ''){        columnName = '<span class="placeholder">Click here to add a name</span>';//change class if another is preferred by Antoine.    }    newTitle.innerHTML = columnName;    newColumn.appendChild(newTitle);    newColumn.appendChild(newContainer);    newColumn.appendChild(newButton);    document.body.appendChild(newColumn);    //put what follows in function called with parameter newTitle    newTitle.onclick = function(){        var classNameModifForm = 'modificationForm';//As usual, give classname according to what Antoine needs.        suppressElementsBySelector('.'+classNameModifForm);        var formRename = document.createElement('form');        formRename.className = classNameModifForm;        formRename.innerHTML = '<input type="text" placeholder="type your new name here"><input type="submit">';        this.appendChild(formRename);    };}function displayContent(arrayColumn) {//IMPORTANT! Implement this function so it shows the page as it was left.    for (var i in arrayColumn){        addColumn(arrayColumn[i]['name']);    }}window.onload = function(){    var arrayColumn = [];    if (typeof localStorage['content'] !== 'undefined'){        if (typeof JSON.parse(localStorage['content']) === 'object'){            arrayColumn = JSON.parse(localStorage['content']);            displayContent(arrayColumn);        }    }    //We display the content with what was stocked in the local storage.    var addAColumn = document.getElementById('addColumn');    addAColumn.onclick = function(){        var name = document.getElementById('columnName').value;        addColumn(name);        arrayColumn.push({'name': name, 'content': []});        localStorage['content'] = JSON.stringify(arrayColumn);    }};