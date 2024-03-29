export const selectors = {
    navLink: '.inline-flex',

    //buttons
    generalButton: '.genButton',
    cofirmationButton: 'button[dusk="splade-confirm-confirm"]',
    button: 'button[type="submit"]',
    greenButton:'.greenButton',

    //input
    inputItemName: 'input[name="item_name"]',
    inputItemCode: 'input[name="item_code"]',
    searchBar:'input[name="searchInput-global"]',
    selectStatus:'select[name="status"]',

    //display
    successMessage: '.text-green-800',
    errorMessage: '.text-orange-800',
    modalBox: 'div[dusk="modal-dialog"]',

    //table
    itemNameRow: 'tbody > tr > td:nth-child(1)',
    itemCodeRow: 'tbody > tr > td:nth-child(2)',
    itemActionRow: 'tbody > tr > td:nth-child(4)',
    itemTableRow: 'tbody',
    thirdRow:'tbody > tr > td:nth-child(3)',

    //request page
    tableDataFive: 'tbody > tr > td:nth-child(5)',

    //login object
    inputEmail:'#email',
    inputPassword:'#password',

    //logout
    optionProfile:'button.flex',
}