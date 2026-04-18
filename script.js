const MAX_INCOME = 1e9;
const bracket_eng_2627 = [
    [12570, 0],
    [50270, 20],
    [150000, 40],
    [MAX_INCOME, 45]
];
const bracket_sct_2627 = [
    [12570, 0],
    [14585, 19],
    [25295, 20],
    [43430, 21],
    [150000, 41],
    [MAX_INCOME, 46],
];
const bracket_usa_2627 = [
    [10275, 10],
    [41775, 12],
    [89075, 22],
    [170050, 24],
    [215950, 32],
    [539900, 35],
    [MAX_INCOME, 37]
];

function _calculate_general_tax(income, percent) {
    let result = Math.ceil(income * (percent / 100));
    console.log(`Calculating tax: ${income} * (${percent} / 100) = ${result}`);
    return result;
}

function _calculate_taxable_income(income, high, low) {
    let taxable = Math.min(income, high) - low;
    
    if (taxable < 0) {
        console.log(`Calculating taxable income: min(${income}, ${high}) - ${low} = 0`);
        return 0;
    }

    console.log(`Calculating taxable income: min(${income}, ${high}) - ${low} = ${taxable}`);
    return taxable;
}

function _calculate_income_tax(income, percent, high, low) {
    console.log(`Calculating income tax for income: ${income}, percent: ${percent}, high: ${high}, low: ${low}`);
    return _calculate_general_tax(_calculate_taxable_income(income, high, low), percent);
}

let valid_inputs = [false, false, false, false];
let income_inp = 0;
let percentage_inp = 0;
let selected_mode = -1;
let selected_system = -1;
function _get_current_system() {
    switch(selected_system) {
        case 0:
        console.log("Selected system: UK 2026-2027");    
        return bracket_eng_2627;
        case 1:
        console.log("Selected system: Scotland 2026-2027");    
        return bracket_sct_2627;
        case 2:
        console.log("Selected system: USA 2026-2027");
        return bracket_usa_2627;
        default:
        console.log("No valid tax system selected.");
        return [];
    };
}

function populate_doc_list(list, target) {
    const docList = document.getElementById(target);
    
    while (docList.firstChild) {
        docList.removeChild(docList.firstChild);
    }

    console.log(`Populating ${docList.id} list with options: ${list.join(", ")}`);

    list.forEach((item, index) => {        
        const li = document.createElement("li");
        li.textContent = item;
        li.dataset.modeIndex = index;
        li.id = `${docList.id}_option_${index}`;
        docList.appendChild(li);
    });

    console.log(`Populated ${docList.id} list`);
}

function mode_controller() {
    const general_container = document.getElementById("general_mode");
    const income_mode = document.getElementById("income_mode");
    
    switch(selected_mode) {
        case 0:
            console.log("Selected General mode.");
            general_container.classList.remove("hidden");
            income_mode.classList.add("hidden");
        break;
        case 1:
            console.log("Selected Income mode.");
            income_mode.classList.remove("hidden");
            general_container.classList.add("hidden");
        break;
        default:
            console.log("No mode selected.");
            general_container.classList.add("hidden");
            income_mode.classList.add("hidden");
        break;
    }
}

const modes = ["General", "Income"];
function init_mode_selector() {
    populate_doc_list(modes, "mode_list");
}

const systems = ["UK 2026-2027", "Scotland 2026-2027", "USA 2026-2027"]; // Example systems
function init_system_selector() {
    populate_doc_list(systems, "system_list");
}

let totalTax = 0;
function update_bracket_table() {
    const income_output = document.getElementById("income_breakdown_table_body");

    // Clear existing rows
    income_output.innerHTML = '';

    const brackets = _get_current_system();
    let remainingIncome = income_inp;
    brackets.forEach((bracket, index) => {
        const [threshold, rate] = bracket;
        const taxable = Math.min(remainingIncome, threshold - (index > 0 ? brackets[index - 1][0] : 0));
        const tax = taxable * (rate / 100);
        totalTax += tax;
        remainingIncome -= taxable;
        // Add row to income breakdown table
        const row = income_output.insertRow();
        row.insertCell(0).textContent = `£${threshold}`;
        row.insertCell(1).textContent = `${rate}%`;
        row.insertCell(2).textContent = `£${taxable.toFixed(2)}`;
        row.insertCell(3).textContent = `£${tax.toFixed(2)}`;
        if (remainingIncome <= 0) return;
    });
}

function solver() {
    switch (selected_mode) {
        case 0:
            const output = document.getElementById("general_output");
            let result = _calculate_general_tax(income_inp, percentage_inp);
            output.textContent = `The total tax to pay is: ${result}`;
        break;
        case 1:
            const takehome_output = document.getElementById("takehome_breakdown_table_body");

            // Clear existing rows
            takehome_output.innerHTML = '';

            const takehome = income_inp - totalTax;

            // Add row to takehome breakdown table
            const timePeriods = ["Yearly", "Monthly", "Weekly", "Daily"];
            const timeDivisors = [1, 12, 52, 365];

            for (var i = 0; i < timePeriods.length; i++) {
                const row = takehome_output.insertRow();
                row.insertCell(0).textContent = `${timePeriods[i]}`;
                row.insertCell(1).textContent = `£${(income_inp / timeDivisors[i]).toFixed(2)}`;
                row.insertCell(2).textContent = `£${(totalTax / timeDivisors[i]).toFixed(2)}`;
                row.insertCell(3).textContent = `£${(takehome / timeDivisors[i]).toFixed(2)}`;
            }
        break;
    }
}

function validate_inputs() {
    for (var i = 0; i < valid_inputs.length; i++) {
        if (!valid_inputs[i]) {
            solver_button.classList.remove("hidden");
            return;
        }
    }

    solver_button.classList.add("hidden");
}

function init_calculator() {
    // Initialize static lists
    init_mode_selector();
    init_system_selector();

    // Initialize event listeners for inputs
    const income_input = document.querySelector("input[name='income_inp']");
    const percentage_input = document.querySelector("input[name='percentage_inp']");
    const mode_input = document.querySelector("input[name='mode_inp']");
    const system_input = document.querySelector("input[name='system_inp']");
    const solver_button = document.querySelector("button[name='solve_btn']")

    income_input.addEventListener("input", (event) => {
        income_inp = parseInt(event.target.value);
        if (!(0 < income_input && income_input < MAX_INCOME)) valid_inputs[0] = false;
        else valid_inputs[0] = true;
    });

    percentage_input.addEventListener("input", (event) => {
        percentage_inp = parseInt(event.target.value);
        if (!(0 < percentage_inp && percentage_inp < 100)) valid_inputs[1] = false;
        else valid_inputs[1] = true;
    });

    mode_input.addEventListener("input", (event) => {
        selected_mode = parseInt(event.target.value) - 1;
        if (!(0 <= selected_mode && selected_mode < modes.length)) valid_inputs[2] = false;
        else valid_inputs[2] = true;
        mode_controller();
    });

    system_input.addEventListener("input", (event) => {
        selected_system = parseInt(event.target.value) - 1;
        if (!(0 <= selected_system && selected_system < systems.length)) valid_inputs[3] = false;
        else valid_inputs[3] = true;
        update_bracket_table();
    });

    solver_button.addEventListener("click", () => {
        console.log("Solver button clicked. Solving...");
        solver();
    });
    console.log("Calculator initialized with event listeners.");
}

// Initialize the calculator when the page loads
document.addEventListener("DOMContentLoaded", () => {
    init_calculator();
});