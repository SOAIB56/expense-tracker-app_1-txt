import { useEffect, useState } from "react";
export default function FormBoard({ handleSave, oldTransaction }) {
  const [isExpense, setIsExpense] = useState(false);

  /*
      ############### Though in our course useEffect has not described yet #########################
      #                  but in this normal procedure It will face infinite state setting.         #
      #                 So, to resolve this, after googling I use useEffect to resolve this issue  #
      ##############################################################################################
      
    ################# This is normal way #################
    if (oldTransaction) {
      // console.log("[edited transaction is", oldTransaction);
      if (oldTransaction.type === "Expense") {
        setIsExpense(true)
      } else {
        setIsExpense(false)
      }
    }
  
  
    */

  // #################### After using useEffect ########################
  useEffect(() => {
    if (oldTransaction) {
      setIsExpense(oldTransaction.type === "Expense"); // if old transaction type is expense it will true otherwise false
    }
  }, [oldTransaction]); // This effect runs whenever oldTransaction changes

  const [transaction, setTransaction] = useState(
    oldTransaction || {
      id: crypto.randomUUID(),
      type: "",
      category: "",
      amount: 1000,
      date: "",
    }
  );

  // When oldTransaction changes, update the transaction state as well
  useEffect(() => {
    if (oldTransaction) {
      setTransaction(oldTransaction);
    }
  }, [oldTransaction]);

  const handleChange = (evt) => {
    const name = evt.target.name;
    let value = evt.target.value;
    let type = isExpense ? "Expense" : "Income";
    if (name === "amount") {
      if (value === "") {
        value = 100;
      }
      value = parseInt(value); // convert into integer number
    }

    setTransaction({
      ...transaction,
      [name]: value,
      type: type,
    });
  };

  const handleSaveButtonClick = (event) => {
    event.preventDefault();
    const saveTransaction = { ...transaction };
    saveTransaction.type = isExpense ? "Expense" : "Income";
    // console.log("save transaction IsExpense status before save : ", isExpense);
    handleSave(saveTransaction); // sent it parent state

    setTransaction({
      // reset all form field
      id: crypto.randomUUID(),
      type: "",
      category: "",
      amount: 1000,
      date: "",
    });
  };

  return (
    <>
      <div className="p-6 py-8 bg-[#F9FAFB] border rounded-md">
        <h2 className="text-3xl font-semibold leading-7 text-gray-800 text-center">
          Expense Tracker
        </h2>

        <form>
          <div className="flex divide-x divide-slate-400/20 overflow-hidden rounded-md bg-white text-[0.8125rem] font-medium leading-5 text-slate-700 shadow-sm ring-1 ring-slate-700/10 mt-6">
            <div
              onClick={() => setIsExpense(true)}
              className={`cursor-pointer text-center flex-1 px-4 py-2 hover:bg-slate-50 hover:text-slate-900 ${
                isExpense ? "bg-emerald-600 active" : ""
              }`}
            >
              Expense
            </div>
            <div
              className={`cursor-pointer text-center flex-1 px-4 py-2 hover:bg-slate-50 hover:text-slate-900 ${
                !isExpense ? "bg-emerald-600 active" : ""
              }`}
              onClick={() => setIsExpense(false)}
            >
              Income
            </div>
          </div>

          <div className="mt-3">
            <label
              htmlFor="category"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Category
            </label>
            <div className="mt-2">
              <select
                id="category"
                name="category"
                autoComplete="category-name"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6"
                onChange={handleChange}
                value={transaction.category}
                required
              >
                {isExpense ? (
                  <>
                    <option>Education</option>
                    <option>Food</option>
                    <option>Health</option>
                    <option>Bill</option>
                    <option>Insurance</option>
                    <option>Tax</option>
                    <option>Transport</option>
                    <option>Telephone</option>
                  </>
                ) : (
                  <>
                    <option>Salary</option>
                    <option>Outsourcing</option>
                    <option>Band</option>
                    <option>Dividend</option>
                  </>
                )}
              </select>
            </div>
          </div>

          <div className="mt-3">
            <label
              htmlFor="amount"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Amount
            </label>
            <div className="mt-2">
              <input
                type="number"
                name="amount"
                id="amount"
                autoComplete="off"
                placeholder="12931"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6"
                onChange={handleChange}
                value={transaction.amount}
                required
              />
            </div>
          </div>

          <div className="mt-3">
            <label
              htmlFor="date"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Date
            </label>
            <div className="mt-2">
              <input
                type="date"
                name="date"
                id="date"
                autoComplete="off"
                placeholder="12931"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6"
                onChange={handleChange}
                value={transaction.date}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="mt-6 rounded-md bg-teal-600 px-8 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 w-full"
            // onClick={(event) => handleSave(event, transaction)}
            onClick={(event) => handleSaveButtonClick(event)}
          >
            Save
          </button>
        </form>
        {/* latest component part end from here */}
      </div>
    </>
  );
}
