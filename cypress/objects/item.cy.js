import { selectors } from "../pagereferences/selectors.js";
var item = {
    itemName: null,
    itemCode: null,
    itemIndex: null,
    isDataExists: false,
    searchData:null,
}
let isDataExist = false;
let isDataRestored = false;
class Item {
    storeData(itemName, itemCode) {
        item.itemName = itemName;
        item.itemCode = itemCode;
    }
    navigateItemPage() {
        cy.get(selectors.navLink).contains('Item').click({ force: true });
    }

    navigateAvailableItemPage(){
        cy.get(selectors.navLink).contains('Available Item').click({ force: true });
    }
    //admin
    navigateRequestPage() {
        cy.get(selectors.navLink).contains('Request').click({ force: true });
    }
    assertRequestPage() {
        cy.url().should('eq', 'http://127.0.0.1:8000/request');
    }

    assertAvailableItemPage() {
        cy.url().should('eq', 'http://127.0.0.1:8000/availableitem');
    }

    assertUrlItemPage() {
        cy.url().should('eq', 'http://127.0.0.1:8000/item')
    }

    assertUserRequestPage() {
        cy.url().should('eq', 'http://127.0.0.1:8000/userrequest');
    }

    navigateToDeletedItem() {
        cy.get(selectors.generalButton).contains('Deleted Item').click({ force: true });
    }

    assertHeaderTwo(value) {
        cy.get('h2').contains(value).should('be.visible');
    }

    triggerCreateButton() {
        cy.get(selectors.generalButton).contains('Create').click({ force: true });
    }

    triggerCreateButtonNoForce() {
        cy.get(selectors.generalButton).contains('Create').click({ timeout: 1000 });
    }

    inputItemDetails(itemName, itemCode) {
        item.itemName = itemName;
        item.itemCode = itemCode;
        cy.log('Item Name Stored: ' + item.itemName);
        cy.log('Item Code Stored: ' + item.itemCode);
        cy.task('setDataStorage', item);
        cy.get(selectors.inputItemName).clear().type(itemName);
        cy.get(selectors.inputItemCode).clear().type(itemCode);

    }

    //span
    triggerSubmit() {
        cy.contains('Submit').click({ force: true });
    }

    successMessage(message) {
        cy.get(selectors.successMessage).contains(message).should('be.visible');
    }

    errorMessage(message) {
        cy.get(selectors.errorMessage).contains(message).should('be.visible');
    }

    validateCreatedItem() {
        this.validateModalNotVisible();
        cy.task('getDataStorage').then((item) => {
            cy.get(selectors.itemCodeRow).each(($el, index) => {
                var code = $el.text().trim();
                if (code == item.itemCode) {
                    cy.log('Created Item Found, Index: ' + index);
                    cy.get($el).eq(index).should('contain', item.itemCode)
                    return false;
                }
                else {
                    cy.log('Looking for item ' + item.itemCode + ' ' + code);
                }
            });
        })
    }

    validateModalNotVisible() {
        cy.get(selectors.modalBox).should('not.exist');
    }

    validateModalVisible() {
        cy.get(selectors.modalBox).should('exist');
    }


    getItemIndexThruCode() {
        cy.task('getDataStorage').then((item) => {
            cy.get(selectors.itemCodeRow).each(($el, index) => {
                var code = $el.text().trim();
                if (code == item.itemCode) {
                    item.itemIndex = index;
                    cy.log('Index: ' + index);
                    cy.task('setDataStorage', item)
                    return false;
                }
                else {
                    cy.log('Looking for item to delete.' + code);
                }
            });
        });
    }

    deleteItemThruItemCode() {
        cy.task('getDataStorage').then((item) => {
            cy.get(selectors.button).eq(item.itemIndex).contains('Delete').click({ force: true });
            cy.get(selectors.cofirmationButton).contains('Confirm').click({ force: true });
        });
    }

    deleteAllItemWithSameItemCode(itemCode) {
        cy.get(selectors.itemCodeRow).each(($el, index) => {
            var code = $el.text().trim();
            if (code.includes(itemCode)) {
                cy.log('Equal to the given code, will delete this.');
                cy.get(selectors.button).eq(index).contains('Delete').click({ force: true });
                cy.get(selectors.cofirmationButton).contains('Confirm').click({ force: true });
            } else {
                cy.log('Not equal to the given code, will not delete this.')
            }
        })
    }

    triggerEditButton() {
        cy.task('getDataStorage').then((item) => {
            //cy.get(selectors.generalButton).eq(item.itemIndex).contains('Edit').click({force:true});
            cy.get(selectors.itemActionRow).eq(item.itemIndex).within(() => {
                cy.contains('Edit').click({ force: true });
            })
        });
    }

    validateItemUpdateData() {
        cy.task('getDataStorage').then((item) => {
            cy.get(selectors.itemNameRow).eq(item.itemIndex).should('contain', item.itemName);
            cy.get(selectors.itemCodeRow).eq(item.itemIndex).should('contain', item.itemCode);
        });
    }

    itemIsNotVisibleOnTable() {
        cy.task('getDataStorage').then((item) => {
            cy.get(selectors.itemNameRow).eq(item.itemIndex).invoke('text').then((text) => {
                var itemname = text.trim();
                expect(itemname).not.to.eq(item.itemName);
            });
            cy.get(selectors.itemCodeRow).eq(item.itemIndex).invoke('text').then((text) => {
                var itemcode = text.trim();
                expect(itemcode).not.to.eq(item.itemCode);
            });
        });
    }

    itemIsVisibleOnTable() {
        cy.task('getDataStorage').then((item) => {
            cy.get(selectors.itemNameRow).eq(item.itemIndex).invoke('text').then((text) => {
                var itemname = text.trim();
                expect(itemname).to.eq(item.itemName);
            });
            cy.get(selectors.itemCodeRow).eq(item.itemIndex).invoke('text').then((text) => {
                var itemcode = text.trim();
                expect(itemcode).to.eq(item.itemCode);
            });
        });
    }

    inputSearch(data) {
        cy.get(selectors.searchBar).clear().type(data);
        item.searchData = data;
    }

    tableCodeOnlyEqualToParam(data) {
        if (this.inputSearch(data)) {
            cy.get(selectors.itemCodeRow).each(($el, index) => {
                var text = $el.text().trim();
                cy.get($el).eq(index).should('contain.text', data);
            })
        }
    }

    tableNoItemToShow() {
        cy.get(selectors.searchBar).invoke('val').then((data) => {
            expect(data).to.eq(item.searchData);
        }).then(()=>{
            cy.get(selectors.itemTableRow).within(() => {
                cy.get('p').contains('There are no items to show.').should('be.visible');
            })
        })
    }

    isDataExist(itemName, itemCode) {
        cy.get(selectors.itemCodeRow).each(($el, index) => {
            var code = $el.text().trim();
            if (code == itemCode) {
                cy.log('item found');
                isDataExist = true;
                cy.log('Data does exist, right? ' + isDataExist);
                item.itemIndex = index;
                item.isDataExists = true;
                item.itemCode = code;
                cy.get(selectors.itemNameRow).eq(index).invoke('text').then((itemname) => {
                    var name = itemname.trim();
                    cy.log('Item name: ' + name);
                    item.itemName = name;
                });
                cy.task('setDataStorage', item);
                return false;
            }
        })
    }

    setDataExistInDeletedItem() {
        cy.task('getDataStorage').then((dataStored) => {
            if (item.isDataExists == false) {
                this.navigateItemPage();
                this.triggerCreateButton();
                this.inputItemDetails(item.itemName, item.itemCode);
                this.triggerSubmit();

                this.validateCreatedItem();
                this.deleteItemThruItemCode();

                this.navigateToDeletedItem();
                this.isDataExist();
                this.setDataExistInDeletedItem();

            }
        });
    }

    setDataNotExistInItem() {
        cy.task('getDataStorage').then((dataStored) => {
            if (item.isDataExists) {
                this.deleteItemThruItemCode();
                this.successMessage('Item was deleted successfully.');
            }
            else {
                cy.log('Data not exist');
            }
        });
    }

    setDataToExistInItem() {
        cy.task('getDataStorage').then((dataStored) => {
            if (item.isDataExists) {
                cy.log('Data exist');
            }
            else {
                this.navigateItemPage();
                this.triggerCreateButton();
                this.inputItemDetails(item.itemName, item.itemCode);
                this.triggerSubmit();

                this.validateCreatedItem();

                this.isDataExist();
                this.setDataToExistInItem();
            }
        });
    }

    restoreDeletedItemThruIndex() {
        cy.task('getDataStorage').then((dataStored) => {
            cy.get(selectors.button).eq(item.itemIndex).contains('Restore').click({ force: true });
            cy.get(selectors.cofirmationButton).contains('Confirm').click({ force: true });

        })
    }

    createItem(itemName, itemCode) {
        cy.get(selectors.itemTableRow).invoke('text').then((text) => {
            if (text.includes('There are no items to show.')) {
                cy.log('No item, proceed.')
            }
            else {
                cy.log('There is an item.');
                this.deleteAllItemWithSameItemCode(itemCode);
            }
        }).then(() => {
            this.triggerCreateButtonNoForce();
            this.validateModalVisible();
            this.inputItemDetails(itemName, itemCode);
            this.triggerSubmit();
            this.successMessage('Item added successfully.');
        })
    }

    userLogout(){
        cy.get('button.flex').click({force:true}).then(()=>{
            cy.get('a').contains('Log Out').click({force:true});
        });
        //cy.clearLocalStorage()
        cy.clearCookies()
    }

    requestItem() {
        cy.task('getDataStorage').then((item)=>{
            cy.get(selectors.itemCodeRow).each(($el, index)=>{
                var code = $el.text().trim();
                if(code==item.itemCode){
                    cy.get(selectors.button).eq(index).contains('Request').click();
                }
            })
        });
    }

    deleteRequest(){
        cy.task('getDataStorage').then((item)=>{
            cy.get(selectors.thirdRow).each(($el, index)=>{
                var code = $el.text().trim();
                if(code==item.itemCode){
                    cy.get(selectors.button).eq(index).contains('Delete').click({force:true});
                    cy.get(selectors.cofirmationButton).contains('Confirm').click({ force: true });
                }
            })
        });
    }


}

export default Item