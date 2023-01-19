// Those are the variables and functions for switching between the welcome page and forms.

const welcomeSpan = document.querySelector('.welcome-span')
const loginButton = document.getElementById('logButton');
const loginDiv = document.querySelector('.login-form');
const registerButton = document.getElementById('regButton');
const registerDiv = document.querySelector('.register-form');
const logoutButton = document.getElementById('logoutButton');
const loggedInUser = document.getElementById('loggedInUser');


const loginButtonHandler = () => {
    loginDiv.style.display = "block";
    welcomeSpan.style.display = "none";
    registerDiv.style.display = "none";
    loginButton.style.display = "none";
    registerButton.style.display = "block";
};

const registerButtonHandler = () => {
    loginDiv.style.display = "none";
    welcomeSpan.style.display = "none";
    registerDiv.style.display = "block";
    loginButton.style.display = "block";
    registerButton.style.display = "none";
}

loginButton.addEventListener("click", loginButtonHandler);
registerButton.addEventListener("click", registerButtonHandler);

// Those are the variables and functions responsible for handling register and login form.

const registerHandler = (e) => {

    const regUsername = document.getElementById('username');
    const regPassword = document.getElementById('password');
    const regEmail = document.getElementById('email');
    const regEmailConfirmation = document.getElementById('confirm');

    const usernameError = document.querySelector('.usernameError');
    const passwordError = document.querySelector('.passwordError');
    const emailError = document.querySelector('.emailError');
    const confirmationError = document.querySelector('.confirmationError');

    // e.preventDefault();
    // const reg = /[A-Za-z]{5,15}[0-9]{1,10}/;
    // const matching = regUsername.value.test(reg);
    // if (matching = true) {
    //     console.log('works');
    // }

    // if (regUsername.value.match(reg)) {
    //     usernameError.innerHTML = "";
    // } else {
    //     usernameError.innerHTML = "Nazwa musi zawierać literę i cyfrę";
    // }

    if (regUsername.value.length < 6) {
        usernameError.innerHTML = "Za krótka nazwa";
    } else {
        usernameError.innerHTML = "";
    }

    if (regPassword.value.length < 6) {
        passwordError.innerHTML = "Za krótkie hasło";
    } else {
        passwordError.innerHTML = "";
    }

    if (regEmail.value.includes('@') == false) {
        emailError.innerHTML = "Niepoprawny e-mail";
    } else
        emailError.innerHTML = "";

    if (regEmail.value !== regEmailConfirmation.value) {
        confirmationError.innerHTML = "Niezgodne adresy email";
    } else {
        confirmationError.innerHTML = "";
    }

    let user = {
        username: regUsername.value,
        email: regEmail.value,
        password: regPassword.value
    }

    if (regUsername.value.length > 5 && regPassword.value.length > 5 && regEmail.value == regEmailConfirmation.value && regEmail.value.includes('@') == true) {
        let allUsers = localStorage.getItem("users") ? JSON.parse(localStorage.getItem("users")) : [];

        if (allUsers.find(users => regUsername.value === users.username)) {
            usernameError.innerHTML = "Nazwa zajęta";
            return;
        }

        if (allUsers.find(users => regEmail.value === users.email)) {
            emailError.innerHTML = "Email zajęty";
            return;
        }

        allUsers.push(user);
        let json = JSON.stringify(allUsers);
        localStorage.setItem("users", json);

        localStorage.setItem("isLoggedIn", user.username);

        loginDiv.style.display = "none";
        registerDiv.style.display = "none";
        loginButton.style.display = "none";
        registerButton.style.display = "none";
        logoutButton.style.display = "block";
        expenses.style.display = "flex";
        canvas.style.display = "flex";
        main.style.height = "40vh";
        loggedInUser.innerHTML = `Witaj ${regUsername.value}`
    }
};

const loginHandler = (e) => {

    e.preventDefault();

    const logUsername = document.getElementById('loginUsername');
    const logPassword = document.getElementById('loginPassword');
    const loginError = document.querySelector('.loginError');
    const emailSpan = document.querySelector('.emailSpan');


    let users = localStorage.getItem("users");
    let data = JSON.parse(users);
    if (data.find(user => (logUsername.value !== user.email && logUsername.value.includes('@') == true))) {
        emailSpan.innerHTML = "Możesz założyć konto na ten email!";
    } else {
        emailSpan.innerHTML = "";
    }

    if (data.find(user => (logUsername.value === user.username || logUsername.value === user.email) && logPassword.value === user.password)) {
        loginDiv.style.display = "none";
        registerDiv.style.display = "none";
        loginButton.style.display = "none";
        registerButton.style.display = "none";
        logoutButton.style.display = "block";
        expenses.style.display = "flex";
        canvas.style.display = "flex";
        main.style.height = "40vh";
        loggedInUser.innerHTML = `Witaj ${logUsername.value}`
        localStorage.setItem("isLoggedIn", logUsername.value);
    } else {
        loginError.innerHTML = "Nieprawidłowa nazwa/email lub hasło";
        return;
    }

}

// Those are the variables and fuctions responsible for logout

const logoutHandler = () => {
    loginButton.style.display = "inline-block";
    registerButton.style.display = "inline-block";
    logoutButton.style.display = "none";
    expenses.style.display = "none";
    canvas.style.display = "none";
    main.style.height = "88vh";
    loggedInUser.innerHTML = ""
    welcomeSpan.style.display = "block";
    localStorage.removeItem("isLoggedIn");
}

const registerSubmit = document.getElementById('registerSubmit');
const loginSubmit = document.getElementById('loginSubmit');

registerSubmit.addEventListener("click", registerHandler);
loginSubmit.addEventListener("click", loginHandler);
logoutButton.addEventListener('click', logoutHandler);

// Those are the variables and functions reponsible for showing data from API

const expenses = document.getElementById('expenses');
const canvas = document.getElementById('canvas');
const main = document.querySelector(".main_div");

const api_url = 'https://api.npoint.io/38edf0c5f3eb9ac768bd/transactions';
const api_url_type = 'https://api.npoint.io/38edf0c5f3eb9ac768bd/transacationTypes';

const typeAndDataHandler = () => {

    async function getData() {
        const response = await fetch(api_url);
        const data = await response.json();


        for (let i = 0; i < data.length; i++) {
            const singleTransaction = `<ul class="expenses-child">
        <li>
        <span id="date">${data[i].date}</span>
        <span id="type">${data[i].type}</span>
        <span id="description">${data[i].description}</span>
        <span id="amount">${data[i].amount} PLN </span>
        <span id="balance">${data[i].balance} PLN</span>
        </li>
        </ul>`
            document.getElementById('expenses').insertAdjacentHTML('beforeend', singleTransaction);
        }

        const ydata = [];
        const xlabels = [];
        for (let i = 0; i < data.length; i++) {
            ydata.push(data[i].balance);
            xlabels.push(data[i].date);
        }

        const ctx = document.getElementById('myChart');

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: xlabels,
                datasets: [{
                    label: 'Saldo',
                    data: ydata,
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });


        let otherIncomeCount = 0;
        let shoppingExpensesCount = 0;
        let salaryIncomeCount = 0;
        let otherExpensesCount = 0;


        for (let i = 0; i < data.length; i++) {
            if (data[i].type == "1") {
                otherIncomeCount++;
            } else if (data[i].type == "2") {
                shoppingExpensesCount++;
            } else if (data[i].type == "3") {
                salaryIncomeCount++;
            } else {
                otherExpensesCount++;
            }
        }

        const ctxpie = document.getElementById('mypieChart');

        new Chart(ctxpie, {
            type: 'pie',
            data: {
                labels: ["Wpływy-inne", "Wydatki-zakupy", "Wpływy-wynagrodzenie", "Wydatki-inne"],
                datasets: [{
                    label: 'Transakcje',
                    data: [otherIncomeCount, shoppingExpensesCount, salaryIncomeCount, otherExpensesCount],
                    borderWidth: 1
                }]
            },
            options: {
                plugins: {
                    legend: false
                }
            }
        })

    }
    async function getType() {
        const response = await fetch(api_url_type);
        const data = await response.json();

        console.log(Object.keys(data)[1])
        console.log(Object.values(data)[1]);
        console.log(data[1]);

        // const singleTransaction = `<li>
        // <span id="type-description">${Object.values(type)[0]}</span>
        // </li>`
        // document.getElementById('expenses').insertAdjacentHTML('beforeend', singleTransaction);
    }
    getData();
    getType();
}

typeAndDataHandler()

// This is the function responsible for checking the status of user

const checkLoggedIn = () => {
    const loggedUser = localStorage.getItem("isLoggedIn");
    let check = loggedUser.valueOf ? true : false;
    if (check = true) {
        loginDiv.style.display = "none";
        registerDiv.style.display = "none";
        loginButton.style.display = "none";
        registerButton.style.display = "none";
        logoutButton.style.display = "block";
        expenses.style.display = "flex";
        canvas.style.display = "flex";
        main.style.height = "40vh";
        welcomeSpan.style.display = "none";
        loggedInUser.innerHTML = `Witaj ${loggedUser}`;
    }
    else {
        return;
    }

}
checkLoggedIn();