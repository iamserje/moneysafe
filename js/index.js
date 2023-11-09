import {convertStringNumber} from './convertStringNumber.js';
// import {OverlayScrollbars} from './overlayscrollbars.esm.min.css'

const API_URL = 'https://showy-sugared-aquarius.glitch.me/api';

const financeForm = document.querySelector('.finance__form');
const financeAmount = document.querySelector('.finance__amount');
const report = document.querySelector('.report');
const financeReport = document.querySelector('.finance__report');
const reportOperationList = document.querySelector('.report__operation-list');
const reportDates = document.querySelector('.report__dates');

const typesOperation = {
   'income': 'income',
   'expenses': 'outcome'
};

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
// --------Get Data fron server---------------
const getData = async (url) => {
   try {
      const response = await fetch(`${API_URL}${url}`);
      if (!response.ok) {
         throw new Error(`HTTP Error, ${response.status}`);
      }
      return await response.json();
   } catch (error) {
      console.error("Error getting data", error);
      throw error;
   }
};
// --------open / close modal---------------
const closeReport = ( {target} ) => {
   if (target.closest('.report__close') || (!target.closest('.report') && target !== financeReport)) {
      report.classList.remove('report__open');
      document.removeEventListener('click', closeReport);
   };
};

const openReport = () => {
   report.classList.add('report__open');
   document.addEventListener('click', closeReport);
};

const reformatDate = (dateStr) => {
   const [year, month, day] = dateStr.split('-');
   return `${day.padStart(2, '0')}.${month.padStart(2, '0')}.${year}`;
};

const renderReport = (data) => {
   reportOperationList.textContent = '';

   const reportRows = data.map(operation => {
      const reportRow = document.createElement('tr');
      reportRow.className = 'report__row';
      reportRow.innerHTML = `
         <td class="report__cell">${operation.category}</td>
         <td class="report__cell">${operation.amount.toLocaleString()} ev</td>
         <td class="report__cell">${operation.description}</td>
         <td class="report__cell">${reformatDate(operation.date)}</td>
         <td class="report__cell">${typesOperation[operation.type]}</td>
         <td class="report__action-cell">
           <button
             class="report__button report__button_table">&#10006;</button>
         </td>
      `;
      return reportRow;
   });
   reportOperationList.append(...reportRows);
};

financeReport.addEventListener('click', async () => {
   openReport();
   const data = await getData('/test');
   renderReport(data);
});
// ---------------------------------------------

reportDates.addEventListener('submit', async (e) => {
   e.preventDefault();
   const formData = Object.fromEntries(new FormData(reportDates));
   const searchParams = new URLSearchParams();
   if (formData.startDate) {
      searchParams.append('startDate', formData.startDate);
   };
   if (formData.endDate) {
      searchParams.append('endDate', formData.endDate);
   };
   const queryString =searchParams.toString();
   const url = queryString ? `/test?${queryString}` : "/test";
   const data = await getData(url);
   console.log(data);
   renderReport(data);
});