/*
 Dynamic List v 1.0.0
 Copyright (c) 2012 Ike Lin.  All rights reserved.  Licensed under the GPL v3.
 */
(function($) {

    $.fn.dynamiclist = function(options) {

        $(this).each(function() {
            
            // dynamic list
            var list = $(this);

            // setting plugin default settings and overriding options
            var settings = $.extend( {
                itemClass: "list-item",
                addClass: "list-add",
                removeClass: "list-remove",
                minSize: 1,
                maxSize: 10,
                withEvents: false,
                addCallbackFn: null,
                removeCallbackFn: null
            }, options);

            // initializes the list
            if (settings.minSize == 0)
                list.find("." + settings.itemClass + ":first").hide();
            var length = list.find("." + settings.itemClass).length;
            while (settings.minSize > length) {
                handleAdd(list, null, settings);
                length++;
            }

            // when add link is clicked
            list.find("." + settings.addClass).click(function(event) {
                handleAdd(list, event, settings);
            });

            // when remove link is clicked
            list.find("." + settings.removeClass).click(function(event) {
                handleRemove(list, $(this), event, settings);
            });
        });

        // Appends new item to the list by cloning the template item. The new
        // item is normalized and cleared of value before adding to the list.
        function handleAdd(list, event, settings) {
            var length = list.find("." + settings.itemClass).length;          
            if (length < settings.maxSize) {
                // clone new item from first item
                var item = list.find("." + settings.itemClass + ":first").clone(
                    settings.withEvents);
                item.show();

                // register new item remove link
                item.find("." + settings.removeClass).click(function(event) {
                    handleRemove(list, $(this), event, settings);
                });

                // clean up new item
                normalizeItem(item, length);
                clearItem(item);

                // add new item
                list.find("." + settings.itemClass + ":last").after(item);
				
                // call back before adding
                if (settings.addCallbackFn != null)
                    settings.addCallbackFn(item);
            }

            if (event != null)
                event.preventDefault();
        }

        // Handles remove link action. Removes an item from the list. Normalizes
        // the list before returning. If there is only minimal item left, clear
        // the value but do not remove the item.
        function handleRemove(list, alink, event, settings) {
            var length = list.find("." + settings.itemClass).length;
            var item = alink.parents("." + settings.itemClass + ":first");

            if (length == settings.minSize)
                clearItem(item);
            else
                item.remove();

            normalizeList(list, settings);
			
            if (settings.removeCallbackFn != null)
                settings.removeCallbackFn(item);

            event.preventDefault();
        }

        // Normalizes the list but changing all id, name and for attribute
        // inside the item to the current item number.
        function normalizeItem(item, itemNum) {
            item.find("label, input, select, textarea").each(function() {
                var attributes = ["class", "name", "id", "for"]
                for (var i = 0; i < attributes.length; i++) {
                    var attr = $(this).attr(attributes[i]);
                    if (attr) {
                        attr = attr.replace(/\d+\./, itemNum + ".");
                        attr = attr.replace(/\[\d+\]\./, "[" + itemNum + "].");
                        $(this).attr(attributes[i], attr);
                    }
                }
            });
        }

        // Normalizes the entire list.
        function normalizeList(list, settings) {
            list.find("." + settings.itemClass).each(function() {
                var index = list.find("." + settings.itemClass).index(this);
                var element = $(this);
                normalizeItem(element, index);
            });
        }

        // Clears value from all input text items.
        function clearItem(item) {
            item.find("input[type=text], textarea").val("");
            item.find("input[type=radio]").attr({
                checked: false
            });
            item.find("input[type=checkbox]").attr({
                checked: false
            });
        }

    }

})(jQuery);