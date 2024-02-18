"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data

const account1 = {
    owner: "Jonas Schmedtmann",
    movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
    interestRate: 1.2, // %
    pin: 1111,

    movementsDates: [
        "2019-11-18T21:31:17.178Z",
        "2019-12-23T07:42:02.383Z",
        "2020-01-28T09:15:04.904Z",
        "2020-04-01T10:17:24.185Z",
        "2020-05-08T14:11:59.604Z",
        "2020-07-26T17:01:17.194Z",
        "2020-07-28T23:36:17.929Z",
        "2020-08-01T10:51:36.790Z",
    ],
    currency: "EUR",
    locale: "pt-PT", // de-DE
};

const account2 = {
    owner: "Jessica Davis",
    movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
    interestRate: 1.5,
    pin: 2222,

    // ISOString format date time ...
    movementsDates: [
        "2019-11-01T13:15:33.035Z",
        "2019-11-30T09:48:16.867Z",
        "2019-12-25T06:04:23.907Z",
        "2020-01-25T14:18:46.235Z",
        "2020-02-05T16:33:06.386Z",
        "2020-04-10T14:43:26.374Z",
        "2020-06-25T18:49:59.371Z",
        "2020-07-26T12:01:20.894Z",
    ],
    currency: "USD",
    locale: "en-US",
};

const accounts = [account1, account2];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
    ["USD", "United States dollar"],
    ["EUR", "Euro"],
    ["GBP", "Pound sterling"],
    // ["IND", "Indian Rupees"],
]);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const displayMovement = function (acc, sort = false) {
    containerMovements.innerHTML = "";

    const movsSort = sort ? acc.movements.slice().sort((a, b) => a - b) : acc.movements;

    movsSort.forEach(function (mov, i) {
        const type = mov > 0 ? "deposit" : "withdrawal";

        const date = new Date(acc.movementsDates[i]);

        const day = `${date.getDate()}`.padStart(2, 0);
        const month = `${date.getMonth() + 1}`.padStart(2, 0);
        const year = date.getFullYear();

        const displayDate = `${day}/${month}/${year}`;

        const html = `
            <div class="movements__row">
                <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
                <div class="movements__date">${displayDate}</div>
                <div class="movements__value">₹ ${mov}</div>
            </div>
        `;
        containerMovements.insertAdjacentHTML("afterbegin", html);
        // beforeend..
    });
};
// displayMovement(account1.movements);

// Display balance

const calcBalance = function (acc) {
    acc.balance = acc.movements.reduce((acc, currNo) => {
        return acc + currNo;
    });

    labelBalance.textContent = `₹ ${acc.balance}`;
};
// calcBalance(movements);

const calcDisplaySummary = function (acc) {
    const income = acc.movements
        .filter((mov) => mov > 0)
        .reduce((acc, curr) => {
            return acc + curr;
        }, 0);

    const out = acc.movements
        .filter((mov) => mov < 0)
        .reduce((acc, curr) => {
            return acc + curr;
        }, 0);

    const interest = acc.movements
        .filter((mov) => mov > 0)
        .map((deposit) => (deposit * acc.interestRate) / 100)
        .filter((int, i, arr) => {
            // console.log(arr);
            return int >= 1;
        })
        .reduce((acc, curr) => acc + curr, 0);

    labelSumIn.textContent = `₹ ${income}`;
    labelSumOut.textContent = `₹ ${Math.round(out)}`;
    labelSumInterest.textContent = `₹ ${Math.abs(interest)}`;
};
// calcDisplaySummary(account1.movements);

// accounts array is accs.....

const createUserName = function (accs) {
    accs.forEach(function (acc) {
        acc.username = acc.owner
            .toLowerCase()
            .split(" ")
            .map((name) => name[0])
            .join("");
    });
};

createUserName(accounts);

// console.log(accounts);
// let currentAccount1;

// currentAccount1 = account1;
// updateUI(currentAccount1);
// containerApp.style.opacity = 100;

const now = new Date();
const date = `${now.getDate()}`.padStart(2, 0);
const month = `${now.getMonth() + 1}`.padStart(2, 0);
const year = now.getFullYear();
const hour = `${now.getHours()}`.padStart(2, 0);
const min = `${now.getMinutes()}`.padStart(2, 0);

labelDate.textContent = `${date}/${month}/${year}, ${hour}:${min}`;

// Login functionality....

const updateUI = function (acc) {
    // Display movements
    displayMovement(acc);

    // Display balance
    calcBalance(acc);

    // Display Summary
    calcDisplaySummary(acc);
};

const startLogoutTimer = function () {
    // call the timer every second

    const tick = function () {
        const min = String(Math.trunc(time / 60)).padStart(2, 0);
        const sec = String(time % 60).padStart(2, 0);

        // In each call print the remaining time to UI
        labelTimer.textContent = `${min}:${sec}`;

        if (time === 0) {
            clearInterval(timer);
            labelWelcome.textContent = "Log in to get started";
            containerApp.style.opacity = 0;
            // alert("Timed out!!! Again Log in");
        }
        // Decrease 1s
        time--;

        // clearInterval()
    };

    // set time to 5 minutes
    let time = 60;
    tick();

    timer = setInterval(tick, 1000);

    return timer;
};

// /////////////////////////////////
// Event handlers
let currentAccount, timer;

btnLogin.addEventListener("click", function (e) {
    e.preventDefault();

    currentAccount = accounts.find((acc) => acc.username === inputLoginUsername.value);
    console.log(currentAccount);

    if (currentAccount?.pin === Number(inputLoginPin.value)) {
        // Display UI ansd message
        labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(" ")[0]}`;
        containerApp.style.opacity = 100;

        // Clear input fields
        inputLoginUsername.value = "";
        inputLoginPin.value = "";
        inputLoginPin.blur();

        // update ui

        updateUI(currentAccount);
        startLogoutTimer();
    }
});

btnTransfer.addEventListener("click", function (e) {
    e.preventDefault();

    const amount = Number(inputTransferAmount.value);
    const receiverAcc = accounts.find((acc) => acc.username === inputTransferTo.value);

    inputTransferAmount.value = inputTransferTo.value = "";
    // console.log(amount, receiverAcc);

    if (
        amount > 0 &&
        receiverAcc &&
        currentAccount.balance >= amount &&
        receiverAcc?.username !== currentAccount.username
    )
        // Doing the transfer
        currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // Add transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    updateUI(currentAccount);

    // Reset timer
    clearInterval(timer);
    timer = startLogoutTimer();
});

btnLoan.addEventListener("click", function (e) {
    e.preventDefault();

    const amount = Number(inputLoanAmount.value);

    // some => some method checks like filter but given boolean values

    if (amount > 0 && currentAccount.movements.some((mov) => mov >= amount * 0.1)) {
        currentAccount.movements.push(amount);

        // update UI

        setTimeout(() => {
            currentAccount.movementsDates.push(new Date().toISOString());
            updateUI(currentAccount);

            // Reset timer
            clearInterval(timer);

            timer = startLogoutTimer();
        }, 3000);
    }

    inputLoanAmount.value = "";

    // Reset timer
    clearInterval(timer);

    timer = startLogoutTimer();
});

btnClose.addEventListener("click", function (e) {
    e.preventDefault();

    if (inputCloseUsername.value === currentAccount.username && Number(inputClosePin.value) === currentAccount.pin) {
        const index = accounts.findIndex((acc) => acc.username === currentAccount.username);
        // console.log(index );

        // Account delete
        accounts.splice(index, 1);

        // hide ui

        containerApp.style.opacity = 0;
        labelWelcome.textContent = `Log in to get started`;
    }
    inputClosePin.value = "";
    inputCloseUsername.value = "";

    // Reset timer
    clearInterval(timer);
});

let sorted = false;
btnSort.addEventListener("click", function (e) {
    e.preventDefault();
    displayMovement(currentAccount.movements, !sorted);
    sorted = !sorted;
});

// Lecture ......

// console.log(accounts);

// const account = accounts.forEach((acc) => {
//     if (acc.owner === "Jessica Davis") {
//         console.log(acc.owner);
//
// });
// account();

// Find method....

// const account = accounts.find((acc) => acc.owner === "Jessica Davis");
// console.log(account.username);

// Exercise.......................
// const dogs = [
//     { weight: 22, curFood: 250, owners: ["Alice", "Bob"] },
//     { weight: 8, curFood: 200, owners: ["Matilda"] },
//     { weight: 13, curFood: 275, owners: ["Sarah", "John"] },
//     { weight: 32, curFood: 340, owners: ["Michael"] },
// ];

// dogs.forEach((dog) => {
//     dog.recFood = Math.trunc(dog.weight ** 0.75) * 28;
// });

// const dogSarah = dogs.find((dog) => dog.owners.includes("Sarah"));
// console.log(dogSarah);
