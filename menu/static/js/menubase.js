/**
 * @file Sets up the handling of the menu on the menu pages (almost all pages, except the editor).
 * @copyright This file is part of <a href='http://www.fiduswriter.org'>Fidus Writer</a>.
 *
 * Copyright (C) 2013 Takuto Kojima, Johannes Wilm.
 *
 * @license This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <a href='http://www.gnu.org/licenses'>http://www.gnu.org/licenses</a>.
 *
 */

jQuery(document).ready(function () {
    // Mark currently active menu item
    var currentURL = document.location.href.split('//')[1];
    var currentRelativeUrl = currentURL.substring(currentURL.indexOf('/'), currentURL.length)
    var currentRelativeUrlCleaned = currentRelativeUrl.replace('#','')
    jQuery('body > header a').each(function () {
        if (jQuery(this).attr('href') == currentRelativeUrlCleaned) {
            jQuery(this).addClass('active');
            jQuery(this).parent().addClass('active-menu-wrapper')
        }
    });

    var openPreferencePulldown = function(box) {
        var btn_offset = jQuery('#preferences-btn').offset();
        box.css({
            'left': btn_offset.left - 52,
            'top': btn_offset.top + 27
        });
        box.show();
        setTimeout(function() {
            jQuery(document).on('click', {'box': box}, closePreferencePulldown);
        }, 100);
        $.isDropdownBoxOpen = true;
    }

    var closePreferencePulldown = function(e) {
        e.data.box.hide();
        jQuery(document).off('click', closePreferencePulldown);
        $.isDropdownBoxOpen = false;
    }

    jQuery('#preferences-btn').bind('click', function() {
        var $menu_box = jQuery('#user-preferences-pulldown');
        if('none' == $menu_box.css('display')) {
            openPreferencePulldown($menu_box);
        }
    });
});