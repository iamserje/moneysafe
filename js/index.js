import {convertStringNumber} from './convertStringNumber.js';

const financeForm = document.querySelector('.finance__form');
const financeAmount = document.querySelector('.finance__amount');
const report = document.querySelector('.report');
const financeReport = document.querySelector('.finance__report');
const reportClose = document.querySelector('.report__close');

financeReport.addEventListener('click', () => {
   report.classList.add('report__open');
});

reportClose.addEventListener('click', () => {
   report.classList.remove('report__open');
});

let amount = 0;

financeAmount.textContent = amount;

financeForm.addEventListener("submit", (e) => {
   e.preventDefault();

   const typeOperation = e.submitter.dataset.typeOperation;
   const changeAmount = convertStringNumber(financeForm.amount.value);

   let totalAmount = 0;

   if (typeOperation === 'income') {
      totalAmount = amount + changeAmount;
   };
   if (typeOperation === 'expenses') {
      totalAmount = amount - changeAmount;
   };

   financeAmount.textContent = `${amount} ev`;
});