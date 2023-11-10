// import {OverlayScrollbars} from './overlayscrollbars.esm.min.css'

import { reformatDate } from "./helper.js";
import { delData, getData, postData } from "./service.js";
import { storage } from "./storage.js";

const report = document.querySelector('.report');
const financeReport = document.querySelector('.finance__report');
const reportOperationList = document.querySelector('.report__operation-list');
const reportTable = document.querySelector('.report__table');
const reportDates = document.querySelector('.report__dates');

const typesOperation = {
   'income': 'income',
   'expenses': 'expenses'
};

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

const delRow = (target) => {
   const row = target.closest('.report__row');
   if (target.dataset.id === row.dataset.id) {
      row.remove();
      delData(`/finance/${row.dataset.id}`);
   };
};

const sortRow = (target) => {
   const targetSort = target.closest("[data-sort]");
   if (targetSort && target.dataset.sort === targetSort.dataset.sort) {
      const sortField = targetSort.dataset.sort;
      renderReport([...storage.data].sort((a, b) => {
         if (targetSort.dataset.direct === 'up') {
            [a, b] = [b, a];
         }
         if (sortField === 'amount') {
            return parseFloat(a[sortField]) < parseFloat(b[sortField]) ? -1 : 1;
         }
         return a[sortField] < b[sortField] ? -1 : 1;
      }));
      if (targetSort.dataset.direct === 'up') {
         targetSort.dataset.direct = 'down';
      } else {
         targetSort.dataset.direct = 'up';
      }
   };
};

export const reportControl = () => {
   reportOperationList.addEventListener('click', async ({ target }) => {
      await delRow(target);
   });

   reportTable.addEventListener('click', ({ target }) => {
      sortRow(target);
   });

   financeReport.addEventListener('click', async () => {
      openReport();
      const data = await getData('/finance');
      storage.data = data;
      renderReport(data);
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
      const data = await getData(url);
      console.log(data);
      renderReport(data);
   });
};