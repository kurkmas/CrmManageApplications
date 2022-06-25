(() => {
  let archivedClients = [];
  const pageParams = new URLSearchParams(window.location.search);
  const index = pageParams.get('index');
  const remoteData = JSON.parse(localStorage.getItem('users'));
  const editSelect = document.querySelector('#inputGroupSelect01');
  const editFullname = document.querySelector('.input-fullname');
  const editMail = document.querySelector('.input-mail');
  const editPhoneNumber = document.querySelector('.input-phone');
  const editState = document.querySelector('#inputGroupSelect02');
  const claimID = document.querySelector('.claim-id');
  const claimDate = document.querySelector('.claim-date');
  const btnEdit = document.querySelector('.btn-edit');
  const btnArchive = document.querySelector('.btn-archive');

  function createRemoteArchive(obj) {
    archivedClients.push(obj);
    localStorage.setItem('archivedClients', JSON.stringify(archivedClients));
  }

  function addRemoteArchive(obj) {
    const localArchive = JSON.parse(localStorage.getItem('archivedClients'));
    archivedClients = [...localArchive];
    archivedClients.push(obj);
    localStorage.setItem('archivedClients', JSON.stringify(archivedClients));
  }

  function editClaim() {
    editSelect.value = remoteData[index].selectedProduct;
    editFullname.value = remoteData[index].name;
    editMail.value = remoteData[index].mail;
    editPhoneNumber.value = remoteData[index].phone;
    editState.value = remoteData[index].state;
    claimID.textContent = Number(index) + 1;
    claimDate.textContent =
      `${remoteData[index].date.year}-${remoteData[index].date.month}-${remoteData[index].date.day}
     ${remoteData[index].date.hours}:${remoteData[index].date.minutes}:${remoteData[index].date.seconds}`;

    btnEdit.addEventListener('click', function () {
      remoteData[index].selectedProduct = editSelect.value;
      remoteData[index].name = editFullname.value;
      remoteData[index].mail = editMail.value;
      remoteData[index].phone = editPhoneNumber.value;
      remoteData[index].state = editState.value;
      localStorage.setItem('users', JSON.stringify(remoteData));
    });

    btnArchive.addEventListener('click', () => {
      remoteData[index].state = '6';
      if (localStorage.archivedClients) {
        addRemoteArchive(remoteData[index]);
      } else {
        createRemoteArchive(remoteData[index]);
      }
      remoteData.splice(index, 1);
      localStorage.setItem('users', JSON.stringify(remoteData));
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    editClaim();
  });
})();