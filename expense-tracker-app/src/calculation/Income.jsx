import {
  DeleteButtonSVG,
  EditButtonSVG,
  FilteringSVG,
  IncomeSVG,
  SortingSVG,
} from "../SVG/SVG";

import { useEffect, useState } from "react";

export default function Income({
  handleSortAndFilter,
  allMenu,
  allTransactions,
  handleDeleteTransaction,
  // handleSorting,
  handleEdit,
}) {
  const [filterArray, setFilterArray] = useState([]); // state for check filter
  const sortingIncomeMenu = allMenu.filter((menu) => menu.id == 1)[0]; // sorting menu for income
  const filteringIncomeMenu = allMenu.filter((menu) => menu.id == 2)[0]; // filtering menu for income

  const incomeList = allTransactions.filter(
    (transaction) => transaction.type === "Income"
  );

  const [filterOperationIncomeList, setFilterOperationIncomeList] =
    useState(incomeList);

  // ############### If I don't use useEffect Income component UI wont update though parent allTransaction state change and to perform filter operation I should do this.
  // ################################################################################

  // Update filterOperationIncomeList whenever allTransactions changes ####
  useEffect(() => {
    setFilterOperationIncomeList(incomeList);
  }, [allTransactions]);

  const incomeItems = filterOperationIncomeList.map((transaction) => (
    <div
      key={transaction.id}
      className="flex justify-between items-center py-2 relative group cursor-pointer"
    >
      <div>
        <h3 className="text-base font-medium leading-7 text-gray-600">
          {transaction.category}
        </h3>
        <p className="text-xs text-gray-600">
          {" "}
          {new Date(transaction.date).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <p className="text-base font-semibold text-gray-600 transition-all group-hover:-translate-x-14">
          BDT {transaction.amount}
        </p>

        {/* <!-- 3 Dots --> */}
        <div className="translate-x-5 group-hover:translate-x-0 opacity-0 group-hover:opacity-100 absolute right-0 top-1/2 -translate-y-1/2 transition-all">
          <button
            className="hover:text-teal-600"
            role="button"
            title="Edit Button"
          >
            <span onClick={() => handleEdit(transaction)}>
              <EditButtonSVG />
            </span>
          </button>

          <button className="hover:text-red-600" role="button" title="Delete">
            <span onClick={() => handleDeleteTransaction(transaction.id)}>
              <DeleteButtonSVG />
            </span>
          </button>
        </div>
      </div>
    </div>
  ));

  const handleSorting = (sortingType) => {
    

    let newSortedTransactionsList = [...filterOperationIncomeList];

    sortingType === "asc"
      ? newSortedTransactionsList.sort((a, b) => a.amount - b.amount)
      : newSortedTransactionsList.sort((a, b) => b.amount - a.amount);

    setFilterOperationIncomeList(newSortedTransactionsList);
  };

  const handleFilterCheckBox = (event) => {
    event.stopPropagation();
    const value = event.target.value;

    let updatedFilterArray;

    // Check if the checkbox is checked or unchecked
    if (event.target.checked) {
      // add new category
      updatedFilterArray = [...filterArray, value];
    } else {
      // remove category
      updatedFilterArray = filterArray.filter((item) => item !== value);
    }

    setFilterArray(updatedFilterArray); // #### update the filterArray state

    // Filter the transactions based on the updated filterArray ########
    if (updatedFilterArray.length === 0) {
      // If no filters are selected, reset to the full income list
      setFilterOperationIncomeList(incomeList);
    } else {
      // Otherwise, filter the income list based on the selected categories
      const newFilteredTransactions = incomeList.filter((transaction) =>
        updatedFilterArray.includes(transaction.category)
      );
      setFilterOperationIncomeList(newFilteredTransactions);
    }
  };

  return (
    <>
      <div className="border rounded-md relative">
        {/* <!-- Header --> */}
        <div className="flex items-center justify-between gap-2 bg-[#F9FAFB] py-4 px-4 rounded-md">
          <div className="flex items-center gap-2">
            {/* <!-- Icon --> */}
            <div className="h-10 w-10 bg-teal-600 text-white rounded-md text-center object-center place-content-center text-base">
              <IncomeSVG />
            </div>
            {/* <!-- Text --> */}
            <div>
              <h3 className="text-xl font-semibold leading-7 text-gray-800">
                Income
              </h3>
            </div>
          </div>
          <div>
            {/* <!-- Sorting --> */}
            <div className="relative inline-block text-left">
              <div>
                <button
                  type="button"
                  className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-2 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                  id="menu-button"
                  aria-expanded={sortingIncomeMenu.status}
                  aria-haspopup="true"
                  onClick={(event) => handleSortAndFilter(event, 1)}
                >
                  <SortingSVG />
                </button>
              </div>

              {sortingIncomeMenu.status && (
                <div className="absolute z-10 mt-2 left-5 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-all"
                      onClick={() => handleSorting("asc")}
                    >
                      Low to High
                    </a>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-all"
                      onClick={() => handleSorting("deasc")}
                    >
                      High to Low
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* <!-- Filtering --> */}
            <div className="relative inline-block text-left">
              <div>
                <button
                  type="button"
                  className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-2 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                  id="filter-button"
                  aria-expanded={filteringIncomeMenu.status}
                  aria-haspopup="true"
                  onClick={(event) => handleSortAndFilter(event, 2)}
                >
                  <FilteringSVG />
                </button>
              </div>

              {filteringIncomeMenu.status && (
                <div className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    <label className="inline-flex items-center px-4 py-2 text-sm text-gray-700">
                      <input
                        type="checkbox"
                        className="form-checkbox h-4 w-4 rounded-md text-gray-600"
                        value="Salary"
                        onChange={handleFilterCheckBox}
                      />
                      <span className="ml-2">Salary</span>
                    </label>
                    <label className="inline-flex items-center px-4 py-2 text-sm text-gray-700">
                      <input
                        type="checkbox"
                        className="form-checkbox h-4 w-4 rounded-md text-gray-600"
                        value="Outsourcing"
                        onChange={handleFilterCheckBox}
                      />
                      <span className="ml-2">Outsourcing</span>
                    </label>
                    <label className="inline-flex items-center px-4 py-2 text-sm text-gray-700">
                      <input
                        type="checkbox"
                        className="form-checkbox h-4 w-4 rounded-md text-gray-600"
                        value="Bond"
                        onChange={handleFilterCheckBox}
                      />
                      <span className="ml-2">Bond</span>
                    </label>

                    <label className="inline-flex items-center px-4 py-2 text-sm text-gray-700">
                      <input
                        type="checkbox"
                        className="form-checkbox h-4 w-4 rounded-md text-gray-600"
                        value="Dividend"
                        onChange={handleFilterCheckBox}
                      />
                      <span className="ml-2">Dividend</span>
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-4 divide-y">
          {/* Income list show form here */}

          {incomeItems}

          {/* Income list show end from here */}
        </div>
      </div>
    </>
  );
}
