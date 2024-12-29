import { useState } from "react";

import Expense from "./Expense";
import Income from "./Income";

import { transactions } from "../transactionData";
import FormBoard from "./FormBoard";

const menuButtons = [
  {
    id: 1,
    status: false,
  },
  {
    id: 2,
    status: false,
  },
  {
    id: 3,
    status: false,
  },
  {
    id: 4,
    status: false,
  },
];

// ################# calculation balance function ##########
const calculation = (type, allTransactions) => {
  // Filter transactions based on the type

  const balanceItem = allTransactions.filter(
    (transaction) => transaction.type === type // Direct comparison
  );

  let sum = 0;
  for (let i = 0; i < balanceItem.length; i++) {
    let temp = parseInt(balanceItem[i].amount); // convert into integer number
    sum += temp;
  }

  return sum;
};

export default function CalculationBoard() {
  const [allTransactions, setAllTransactions] = useState(transactions);
  const [income, setIncome] = useState(calculation("Income", allTransactions));
  const [expense, setExpense] = useState(
    calculation("Expense", allTransactions)
  );

  const [editTransaction, setEditTransaction] = useState(null);

  const [menuToggler, setMenuToggler] = useState(menuButtons); // set an empty list

  const reInitializeMenuToggler = (
    id = -1 // by default id = -1
  ) => {
    const newToggler = menuToggler.filter((toggler) => {
      if (toggler.id != id) {
        toggler.status = false;
      }
      return toggler;
    });

    setMenuToggler(newToggler);
  };

  const handleSortAndFilter = (event, id) => {
    // const executeState = menuToggler.filter((state) => state.id == id);
    event.stopPropagation();
    event.preventDefault();

    reInitializeMenuToggler(id); // make reinitialize all menu toggler
    const newToggler = [...menuToggler];
    newToggler[id - 1].status = !newToggler[id - 1].status; // inverse previous actions
    // console.log(executeState);
    setMenuToggler(newToggler);
  };

  const handleDeleteTransaction = (transactionId) => {
    const newTransactionsList = [...allTransactions]; // spread
    const filteredList = newTransactionsList.filter(
      (transaction) => transaction.id != transactionId
    );

    const deletedTransaction = newTransactionsList.filter(
      (trnx) => trnx.id == transactionId
    )[0];

    setAllTransactions(filteredList);
    if (deletedTransaction.type === "Expense") {
      setExpense((expense) => expense - deletedTransaction.amount);
    } else {
      setIncome((income) => income - deletedTransaction.amount);
    }
  };

  
  const handleSave = (newTransaction) => {
    setEditTransaction(null); // set Edit transaction with null because form already receive edited transaction object

    const isEdited = allTransactions.filter(
      (transaction) => newTransaction.id == transaction.id
    ); // check if new transaction is edited or not
    // ############# check if props object is edited object or not #############
    if (isEdited.length === 1) {
      console.log("parameter object is edited");
      console.log(
        "previous transaction is",
        isEdited,
        "present transaction is:",
        newTransaction
      );
      const transactionWithoutEdited = allTransactions.filter(
        (transaction) => transaction.id != newTransaction.id
      );

      const latestTransactions = [...transactionWithoutEdited, newTransaction];
      setAllTransactions(latestTransactions);
      //  #############update balance###############
      //##############  2 Object different transaction type ###########
      if (isEdited[0].type != newTransaction.type) {
        // transaction type is changed
        console.log("transaction type different");
        // ################# new object transaction type is income #########
        if (isEdited[0].type === "Expense") {
          console.log("Edited type is expense but previous type was income");
          setExpense(expense - isEdited[0].amount); // deduct previous added balance
          console.log("deduct expense");
          setIncome(income + newTransaction.amount); // increase amount
        }
        // ###################### new object transaction type is expense ######
        else {
          setIncome(income - isEdited[0].amount); // deduct previous added income
          setExpense(expense + newTransaction.amount); // expense will increase
        }
      }
      //############# both transaction type are same ##############
      else {
        /// ############### Logic for Expense ##########
        if (newTransaction.type === "Expense") {
          console.log(
            "transaction is edited transaction and its type same but value is different"
          );

          if (isEdited[0].amount < newTransaction.amount) {
            // newTransaction amount is greater then previous transaction amount
            setExpense(expense + (newTransaction.amount - isEdited[0].amount)); // increase expense from previous expense
          } // newTransaction amount is less then previous transaction amount
          else {
            setExpense(expense - (isEdited[0].amount - newTransaction.amount));
          }
        } else {
          // transaction type is income
          if (isEdited[0].amount < newTransaction.amount) {
            // newTransaction amount is greater then previous transaction amount
            setIncome(income + (newTransaction.amount - isEdited[0].amount)); // increase income from previous expense
          } // newTransaction amount is less then previous transaction amount
          else {
            setIncome(income - (isEdited[0].amount - newTransaction.amount));
          }
        }
      }
    }
    // ############## Props object is new ################
    else {
      const newObjects = [...allTransactions, newTransaction];
      setAllTransactions(newObjects);
      console.log("senary for new transaction");
      if (newTransaction.type === "Expense") {
        //increase expense
        setExpense(expense + newTransaction.amount);
      } else {
        // increase income
        setIncome(income + newTransaction.amount);
      }
    }
  };

  const handleEdit = (transaction) => {
    let newTransaction = { ...transaction };
    setEditTransaction(newTransaction); // newTransaction will be pass through props in another component
    // console.log("preevious object is ", transaction);
  };

  return (
    <>
      <main
        // onClick={reInitializeMenuToggler}
        // need to fixed this later
        className="relative mx-auto mt-10 w-full max-w-7xl"
      >
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* <!-- Calculation Board --> */}

          <FormBoard handleSave={handleSave} oldTransaction={editTransaction} />

          {/* <!-- Right Column --> */}
          <div className="lg:col-span-2">
            {/* <!-- Total Balance Stat--> */}
            <div className="bg-white">
              <div className="mx-auto max-w-7xl">
                <dl className="grid grid-cols-1 text-center lg:grid-cols-3 divide-x-2 border rounded-md overflow-hidden">
                  <div className="bg-[#F9FAFB] flex lg:max-w-xs flex-col px-4 py-4">
                    <dt className="text-base leading-7 text-gray-600">
                      Balance
                    </dt>
                    <dd
                      className={`order-first text-xl font-semibold tracking-tight sm:text-3xl ${
                        income - expense >= 0 ? "text-grey-700" : "text-red-500"
                      }`}
                    >
                      BDT {income - expense}
                    </dd>
                  </div>
                  <div className="bg-[#F9FAFB] flex lg:max-w-xs flex-col px-4 py-4">
                    <dt className="text-base leading-7 text-gray-600">
                      Total Income
                    </dt>
                    <dd className="order-first text-xl font-semibold tracking-tight text-gray-700 sm:text-3xl">
                      BDT {income}
                    </dd>
                  </div>
                  <div className="bg-[#F9FAFB] flex lg:max-w-xs flex-col px-4 py-4">
                    <dt className="text-base leading-7 text-gray-600">
                      Total Expense
                    </dt>
                    <dd className="order-first text-xl font-semibold tracking-tight text-gray-700 sm:text-3xl">
                      BDT {expense}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>

            {/* <!-- List Down --> */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-8">
              {/* <!-- Income --> */}

              <Income
                handleSortAndFilter={handleSortAndFilter}
                allMenu={menuToggler}
                allTransactions={allTransactions}
                handleDeleteTransaction={handleDeleteTransaction}
               
                handleEdit={handleEdit}
              />

              {/* <!-- Expense --> */}
              <Expense
                handleSortAndFilter={handleSortAndFilter}
                allMenu={menuToggler}
                allTransactions={allTransactions}
                handleDeleteTransaction={handleDeleteTransaction}
                
                handleEdit={handleEdit}
              />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
