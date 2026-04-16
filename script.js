const MAX_INCOME = 1e12;
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

function _calculate_general_tax(income, percent) {
    return Math.ceil(income * (percent / 100));
}

function _calculate_taxable_income(income, high, low) {
    taxable = Math.min(income, high) - low;
    
    if (taxable < 0) return 0;
    return taxable;
}

function _calculate_income_tax(income, percent, high, low) {
    return _calculate_general_tax(_calculate_taxable_income(income, high, low), percent);
}

let selected_system = -1;
function tax_system_selector(obj) {
    
}

let selected_bracket = -1;
function tax_bracket_selector(obj) {
    
}

let calculatorMode = 0;
function calculator_mode_selector(obj) {

}

function _() {

}