import { selectors } from "../pagereferences/selectors.js";
var item = {
    itemName: null,
    itemCode: null,
    itemIndex: null,
}
class Item {
    storeData(itemName, itemCode) {
        item.itemName = itemName;
        item.itemCode = itemCode;
    }
    navigateItemPage() {
        cy.get(selectors.navLink).contains('Item').click({ force: true });
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
            var code=$el.text().trim();
            if(code.includes(itemCode)) {
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
    }

    tableCodeOnlyEqualToParam(data) {
        if(this.inputSearch(data)) {
            cy.get(selectors.itemCodeRow).each(($el, index) => {
                var text= $el.text().trim();
                cy.get($el).eq(index).should('contain.text', data);
            })
        }

    }


}

export default Item