import { selectors } from "../pagereferences/selectors.js";
var item = {
    itemName: null,
    itemCode:null,
    itemIndex:null,
}
class Item {
    storeData(itemName, itemCode) {
        item.itemName = itemName;
        item.itemCode = itemCode;
    }
    navigateItemPage() {
        cy.get(selectors.navLink).contains('Item').click({force:true});
    }
    
    triggerCreateButton() {
        cy.get(selectors.generalButton).contains('Create').click({force:true});
    }

    inputItemDetails(itemName, itemCode) {
        item.itemName = itemName;
        item.itemCode = itemCode;
        cy.task('setDataStorage', item);
        cy.get(selectors.inputItemName).clear().type(itemName);
        cy.get(selectors.inputItemCode).clear().type(itemCode);

    }

    //span
    triggerSubmit() {
        cy.contains('Submit').click({force:true});
    }

    successMessage(message) {
        cy.get(selectors.successMessage).contains(message).should('be.visible');
    }

    validateCreatedItem() {
        this.validateModalNotVisible();
        cy.task('getDataStorage').then((item) => {
            cy.get(selectors.itemCodeRow).each(($el, index) => {
                var code = $el.text().trim();
                if(code == item.itemCode) {
                    cy.log('Created Item Found, Index: '+index);
                    cy.get($el).eq(index).should('contain', item.itemCode)
                    return false;
                }
                else {
                    cy.log('Looking for item '+item.itemCode+ ' '+code);
                }
            })
        })
    }

    validateModalNotVisible() {
        cy.get(selectors.modalBox).should('not.exist');
    }

    getItemIndexThruCode() {
        cy.task('getDataStorage').then((item) => {
            cy.get(selectors.itemCodeRow).each(($el, index) => {
                var code = $el.text().trim();
                if(code == item.itemCode) {
                    item.itemIndex = index;
                    cy.log('Index: '+index);
                    cy.task('setDataStorage', item)
                    return false;
                }
                else {
                    cy.log('Looking for item to delete.'+code);
                }
            });
        });
    }

    deleteItemThruItemCode() {
        cy.task('getDataStorage').then((item) => {
            cy.get(selectors.button).eq(item.itemIndex).contains('Delete').click({force:true});
            cy.get(selectors.cofirmationButton).contains('Confirm').click({force:true});
        });
    }

    triggerEditButton() {
        cy.task('getDataStorage').then((item) => {
            //cy.get(selectors.generalButton).eq(item.itemIndex).contains('Edit').click({force:true});
            cy.get(selectors.itemActionRow).eq(item.itemIndex).within(() => {
                cy.contains('Edit').click({force:true});
            })
        });
    }

    validateItemUpdateData() {
        cy.task('getDataStorage').then((item) => {
            cy.get(selectors.itemNameRow).eq(item.itemIndex).should('contain', item.itemName);
            cy.get(selectors.itemCodeRow).eq(item.itemIndex).should('contain', item.itemCode);
        });
    }

}

export default Item