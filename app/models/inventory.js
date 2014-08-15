import AbstractModel from "hospitalrun/models/abstract";

export default AbstractModel.extend({
    purchases: DS.hasMany('inv-purchase'),
    locations: DS.hasMany('inv-location'),
    description: DS.attr('string'),
    friendlyId: DS.attr('string'),
    keywords: DS.attr(),
    name: DS.attr('string'),
    quantity: DS.attr('number'),
    crossReference: DS.attr('string'),
    type: DS.attr('string'),
    price: DS.attr('number'),
    reorderPoint: DS.attr('number'),
    distributionUnit: DS.attr('string'),
    validations: {
        purchaseCost: {
            numericality: {
                if: function(object) {
                    //Only validate on new items that are not assets
                    return (object.get('isNew') && object.get('type') !== 'Asset');
                }
            }
        },
        name: {
            presence: true,
        },
        quantity: {
            numericality: true
        },
        price: {
            numericality: {
                allowBlank: true
            }
        },
        reorderPoint: {
            numericality: {
                allowBlank: true
            }
        }
    },

    updateQuantity: function() {
        if (this.get('type') === 'Asset') {
            //Asset quantity is edited directly
            return;
        }
        var purchases = this.get('purchases');
        var newQuantity = purchases.reduce(function(previousItem, currentItem) {
            var currentQuantity = 0;
            if (!currentItem.get('expired')) {
                currentQuantity = currentItem.get('currentQuantity');
            }
            return previousItem + currentQuantity;
        }, 0);
        this.set('quantity', newQuantity);
    }

});
