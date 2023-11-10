// import {OverlayScrollbars} from './overlayscrollbars.esm.min.css'

import { financeControl } from "./financeControl.js";
import { clearChart, generateChart } from "./generateChart.js";
import { reformatDate } from "./helper.js";
import { delData, getData, postData } from "./service.js";

const report = document.querySelector('.report');
const financeReport = document.querySelector('.finance__report');
const reportOperationList = document.querySelector('.report__operation-list');
const reportDates = document.querySelector('.report__dates');
const generateChartButton = document.querySelector('#generateChartButton');


const typesOperation = {
   'income': 'income',
   'expenses': 'expenses'
};

let actualData = [];

// OverlayScrollbars(report, {});

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

const renderReport = (data) => {
   reportOperationList.textContent = '';

   const reportRows = data.map(operation => {
      const reportRow = document.createElement('tr');
      reportRow.className = 'report__row';
      reportRow.dataset.id = operation.id;
      reportRow.innerHTML = `
         <td class="report__cell">${operation.category}</td>
         <td class="report__cell">${operation.amount.toLocaleString()} ev</td>
         <td class="report__cell">${operation.description}</td>
         <td class="report__cell">${reformatDate(operation.date)}</td>
         <td class="report__cell">${typesOperation[operation.type]}</td>
         <td class="report__action-cell">
           <button
             class="report__button report__button_table" data-id=${operation.id}>&#10006;</button>
         </td>
      `;
      return reportRow;
   });
   reportOperationList.append(...reportRows);
};

// const delRow = (target) => {
//    const row = target.closest('.report__row');
//    if (target.dataset.id === row.dataset.id) {
//       row.remove();
//       delData(`/finance/${row.dataset.id}`);
//    };
// };

export const reportControl = () => {
   reportOperationList.addEventListener('click', async ({ target }) => {
      // delRow(target);
      const buttonDel = target.closest('.report__button_table');
      if (buttonDel) {
         await delData(`/finance/${buttonDel.dataset.id}`);
         const reportRow = buttonDel.closest('.report__row');
         reportRow.remove();
         financeControl();
         clearChart();
      }
   });

   financeReport.addEventListener('click', async () => {
      openReport();
      actualData = await getData('/finance');
      renderReport(actualData);
   });

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
      const url = queryString ? `/finance?${queryString}` : "/finance";
      actualData = await getData(url);
      renderReport(actualData);
      clearChart();
   });
};

generateChartButton.addEventListener('click', () => {
   generateChart(actualData);
});