(() => {
  let appArray = [];

  function getDate() {
    const date = new Date();
    const year = date.getFullYear();
    let month = date.getMonth();
    let day = date.getDate();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();

    if (day < 10) {
      day = `0${day}`;
    }

    if (month < 10) {
      month = `0${month}`;
    }

    if (hours < 10) {
      hours = `0${hours}`;
    }

    if (minutes < 10) {
      minutes = `0${minutes}`;
    }

    if (seconds < 10) {
      seconds = `0${seconds}`;
    }

    return {
      day,
      month,
      year,
      hours,
      minutes,
      seconds
    };
  }

  function createClaimObject(inputName, inputPhone, inputMail, selectedProduct, state) {
    const elObject = {
      name: inputName.value,
      phone: inputPhone.value,
      mail: inputMail.value,
      selectedProduct: selectedProduct.value,
      state,
      date: getDate()
    };

    appArray.push(elObject);
  }

  function createUserRaw(field, stateClass) {
    const usersField = document.getElementById(field);
    const tr = document.createElement('tr'),
      th = document.createElement('th'),
      tdDate = document.createElement('td'),
      tdProduct = document.createElement('td'),
      tdName = document.createElement('td'),
      tdMail = document.createElement('td'),
      tdPhone = document.createElement('td'),
      tdState = document.createElement('td'),
      tdEdit = document.createElement('td'),
      link = document.createElement('a'),
      div = document.createElement('div');

    th.setAttribute('scope', 'row');
    div.classList.add('badge', 'badge-pill', stateClass);
    tdProduct.setAttribute('data-filter', '');
    tdState.prepend(div);
    link.setAttribute('href', '03-crm-edit-bid.html');
    link.setAttribute('data-index', '');
    link.classList.add('edit-link');
    link.textContent = 'Редактировать';
    tdEdit.prepend(link);

    usersField.append(tr);
    tr.append(th, tdDate, tdProduct, tdName, tdMail, tdPhone, tdState, tdEdit);

    return {
      th,
      tdDate,
      tdProduct,
      tdName,
      tdMail,
      tdPhone,
      tdState,
      tdEdit,
      link
    };
  }

  function changeValue(value) {
    let formValue;

    if (value === 'course-html') {
      formValue = 'Курс по верстке';
    } else if (value === 'course-js') {
      formValue = 'Курс по JavaScript';
    } else if (value === 'course-vue') {
      formValue = 'Курс по VUE JS';
    } else if (value === 'course-php') {
      formValue = 'Курс по PHP';
    } else if (value === 'course-wordpress') {
      formValue = 'Курс по WordPress';
    }

    return formValue;
  }

  function setStateVal(stateNum) {
    let stateString;

    if (stateNum === '1') {
      stateString = 'Новый';
    } else if (stateNum === '2') {
      stateString = 'В работе';
    } else if (stateNum === '3') {
      stateString = 'Ожидается оплата';
    } else if (stateNum === '4') {
      stateString = 'Завершена';
    } else if (stateNum === '5') {
      stateString = 'Отказ';
    } else if (stateNum === '6') {
      stateString = 'В ахиве';
    }

    return stateString;
  }

  function getClaimState(obj) {
    let stateClass;
    if (obj.state === '1') {
      stateClass = 'badge-danger';
    } else if (obj.state === '2') {
      stateClass = 'badge-warning';
    } else if (obj.state === '3') {
      stateClass = 'badge-info';
    } else if (obj.state === '4') {
      stateClass = 'badge-success';
    } else if (obj.state === '5') {
      stateClass = 'badge-dark';
    } else if (obj.state === '6') {
      stateClass = 'badge-secondary';
    }

    return stateClass;
  }

  function completeUserRaw(arr, field) {
    for (const item of arr) {
      let userRaw = createUserRaw(field, getClaimState(item));
      userRaw.th.textContent = arr.indexOf(item) + 1;
      userRaw.link.dataset.index = arr.indexOf(item);
      userRaw.tdProduct.textContent = changeValue(item.selectedProduct);
      userRaw.tdProduct.dataset.filter = item.selectedProduct;
      userRaw.tdName.textContent = item.name;
      userRaw.tdMail.textContent = item.mail;
      userRaw.tdPhone.textContent = item.phone;
      userRaw.tdState.querySelector('div').textContent = setStateVal(item.state);
      userRaw.tdDate.textContent = `${item.date.day}.${item.date.month}.${item.date.year}`;
    }
  }

  function clickForEdit(searchField) {
    const clickField = document.querySelector(searchField);
    clickField.addEventListener('click', (e) => {
      let target = e.target;

      if (target.classList.contains('edit-link')) {
        const index = target.dataset.index;
        target.setAttribute('href', `03-crm-edit-bid.html?index=${index}`);
      }
    });
  }

  function showArchivedClients() {
    const archiveBtns = document.querySelectorAll('.btn-archive');
    archiveBtns.forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector('#users-table').innerHTML = '';
        const archivedUsers = JSON.parse(localStorage.getItem('archivedClients'));
        completeUserRaw(archivedUsers, 'users-table');
      });
    });
  }

  function showAllClients() {
    const allClientsBtn = document.querySelectorAll('.btn-all-clients');
    allClientsBtn.forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector('#users-table').innerHTML = '';
        completeUserRaw(appArray, 'users-table');
      });
    });
  }

  function filterByState() {
    const stateBtns = document.querySelectorAll('.btn-state');
    const stateArr = [];
    stateBtns.forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        const btnState = btn.dataset.state;
        appArray.forEach(function (obj) {
          if (obj.state === btnState) {
            stateArr.push(obj);
          }
        });
        document.querySelector('#users-table').innerHTML = '';
        completeUserRaw(stateArr, 'users-table');
        stateArr.splice(0);
      });
    });
  }

  const leftPanelLinks = document.querySelectorAll('.left-panel-link');
  function removeActiveClass() {
    leftPanelLinks.forEach(function (link) {
      link.classList.remove('active');
    });
  }

  function leftPanelControl() {
    leftPanelLinks.forEach(function (link, i) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        removeActiveClass();
        link.classList.add('active');
      });
    });
  }

  function showNewClientsNumber() {
    const clientsNum = document.querySelector('.new-clients');
    const newClients = [];
    appArray.forEach(function (clientObj) {
      if (clientObj.state === '1') {
        newClients.push(clientObj);
      }
    });
    if (clientsNum) {
      clientsNum.textContent = newClients.length;
    }
  }

  function changeActivClass() {
    const claimsBtn = document.querySelectorAll('.btn-light');
    const leftPanelBtns = document.querySelectorAll('.left-panel-btn');
    claimsBtn.forEach(function (btn, i) {
      btn.addEventListener('click', function () {
        removeActiveClass();
        leftPanelBtns[i].classList.add('active');
      });
    });
  }

  function applicationFilter(select) {
    const selectFilter = document.querySelector(select);
    const filterArr = [];
    selectFilter.addEventListener('change', function () {
      appArray.forEach(function (obj) {
        if (selectFilter.value === obj.selectedProduct) {
          filterArr.push(obj);
        }
        if (filterArr.length === 0) {
          document.querySelector('#users-table').innerHTML = '';
        } else {
          for (let i = 0; i < filterArr.length; i++) {
            document.querySelector('#users-table').innerHTML = '';
            completeUserRaw(filterArr, 'users-table');
          }
        }
        if (selectFilter.value === 'Все продукты') {
          document.querySelector('#users-table').innerHTML = '';
          completeUserRaw(appArray, 'users-table');
        }
      });
      filterArr.splice(0);
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form'),
      inputName = document.getElementById('name'),
      inputPhone = document.getElementById('phone'),
      inputMail = document.getElementById('mail'),
      tableSelect = document.getElementById('exampleFormControlSelect1');

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        createClaimObject(inputName, inputPhone, inputMail, tableSelect, '1');
        localStorage.setItem('users', JSON.stringify(appArray));
        form.reset();
      });
    }

    let localData = JSON.parse(localStorage.getItem('users'));

    if (localData !== null && localData !== '') {
      for (const item of localData) {
        appArray.push(item);
      }
    }

    if (document.querySelector('#users-table')) {
      completeUserRaw(appArray, 'users-table');
      clickForEdit('#users-table');
    }

    if (document.querySelector('#users-table') && document.querySelector('#inputGroupSelect01')) {
      applicationFilter('#inputGroupSelect01');
    }
    showArchivedClients();
    filterByState();
    showAllClients();
    leftPanelControl();
    showNewClientsNumber();
    changeActivClass();
  });
})();

// Куркмас Шокиров
// +998971654448
// kurkmas@inbox.ru

// Куркмас Шокиров
// +79259882300
// kurkmas94@gmail.com