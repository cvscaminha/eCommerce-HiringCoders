"use strict";

const openModal = () =>
  document.getElementById("modal").classList.add("active");

const closeModal = () => {
  clearFields();
  document.getElementById("modal").classList.remove("active");
};

const getLocalStorage = () =>
  JSON.parse(localStorage.getItem("db_product")) ?? [];
const setLocalStorage = (dbProduto) =>
  localStorage.setItem("db_product", JSON.stringify(dbProduto));

// CRUD - create read update delete
const deleteProduto = (index) => {
  const dbProduto = readProduto();
  dbProduto.splice(index, 1);
  setLocalStorage(dbProduto);
};

const updateProduto = (index, produto) => {
  const dbProduto = readProduto();
  dbProduto[index] = produto;
  setLocalStorage(dbProduto);
};

const readProduto = () => getLocalStorage();

const createProduto = (produto) => {
  const dbProduto = getLocalStorage();
  dbProduto.push(produto);
  setLocalStorage(dbProduto);
};

const isValidFields = () => {
  return document.getElementById("form").reportValidity();
};

//Interação com o layout

const clearFields = () => {
  const fields = document.querySelectorAll(".modal-field");
  fields.forEach((field) => (field.value = ""));
  document.getElementById("nome").dataset.index = "new";
};

const saveProduto = () => {
  debugger;
  if (isValidFields()) {
    const Produto = {
      nome: document.getElementById("nome").value,
      preco: document.getElementById("preco").value,
      marca: document.getElementById("marca").value,
      quant: document.getElementById("quant").value,
    };
    const index = document.getElementById("nome").dataset.index;
    if (index == "new") {
      createProduto(Produto);
      updateTable();
      closeModal();
    } else {
      updateProduto(index, Produto);
      updateTable();
      closeModal();
    }
  }
};

const createRow = (produto, index) => {
  const newRow = document.createElement("tr");
  newRow.innerHTML = `
        <td>${produto.nome}</td>
        <td>${produto.preco}</td>
        <td>${produto.marca}</td>
        <td>${produto.quant}</td>
        <td>
            <button type="button" class="button green" id="edit-${index}">Editar</button>
            <button type="button" class="button red" id="delete-${index}" >Excluir</button>
        </td>
    `;
  document.querySelector("#tableProduto>tbody").appendChild(newRow);
};

const clearTable = () => {
  const rows = document.querySelectorAll("#tableProduto>tbody tr");
  rows.forEach((row) => row.parentNode.removeChild(row));
};

const updateTable = () => {
  const dbProduto = readProduto();
  clearTable();
  dbProduto.forEach(createRow);
};

const fillFields = (produto) => {
  document.getElementById("nome").value = produto.nome;
  document.getElementById("preco").value = produto.preco;
  document.getElementById("marca").value = produto.marca;
  document.getElementById("quant").value = produto.quant;
  document.getElementById("nome").dataset.index = produto.index;
};

const editProduto = (index) => {
  const Produto = readProduto()[index];
  Produto.index = index;
  fillFields(Produto);
  openModal();
};

const editDelete = (event) => {
  if (event.target.type == "button") {
    const [action, index] = event.target.id.split("-");

    if (action == "edit") {
      editProduto(index);
    } else {
      const Produto = readProduto()[index];
      const response = confirm(
        `Deseja realmente excluir o Produto ${Produto.nome}`
      );
      if (response) {
        deleteProduto(index);
        updateTable();
      }
    }
  }
};

updateTable();

// Eventos
document
  .getElementById("cadastrarProduto")
  .addEventListener("click", openModal);

document.getElementById("modalClose").addEventListener("click", closeModal);

document.getElementById("salvar").addEventListener("click", saveProduto);

document
  .querySelector("#tableProduto>tbody")
  .addEventListener("click", editDelete);

document.getElementById("cancelar").addEventListener("click", closeModal);
