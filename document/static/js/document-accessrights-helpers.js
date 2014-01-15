/**
 * @file Handles the access rights dialog.
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

(function () {
    var exports = this,
   /** 
  * Functions for the document access rights dialog. TODO 
  * @namespace accessrightsHelpers
  */
        accessrightsHelpers = {};

    accessrightsHelpers.createAccessRightsDialog = function (documentIds) {
        var dialogHeader = gettext('Share your document with others');
        var document_collaborators = {},
            theAccessRights,
            theTeamMembers,
            i, len;

        // In case this is accessed from the the editor
        if (typeof (window.theAccessRights) === 'undefined') {
            theAccessRights = theDocument.access_rights;
        } else {
            theAccessRights = window.theAccessRights;
        }

        len = theAccessRights.length

        if (typeof (window.theTeamMembers) === 'undefined') {
            theTeamMembers = theDocument.owner.team_members;
        } else {
            theTeamMembers = window.theTeamMembers;
        }

        for (i = 0; i < len; i++) {
            if (_.include(documentIds, theAccessRights[i].document_id)) {
                if ('undefined' == typeof (document_collaborators[
                    theAccessRights[i].user_id])) {
                    document_collaborators[theAccessRights[i].user_id] =
                        theAccessRights[i];
                    document_collaborators[theAccessRights[i].user_id].count =
                        1;
                } else {
                    if (document_collaborators[theAccessRights[i].user_id].rights !=
                        theAccessRights[i].rights);
                    document_collaborators[theAccessRights[i].user_id].rights =
                        'r';
                    document_collaborators[theAccessRights[i].user_id].count +=
                        1;
                }
            }
        }
        document_collaborators = _.select(document_collaborators, function (obj) {
            return obj.count == documentIds.length;
        });

        var dialogBody = tmp_access_right_overview({
            'dialogHeader': dialogHeader,
            'contacts': tmp_access_right_tr({'contacts': theTeamMembers}),
            'collaborators': tmp_collaborators({
                'collaborators': document_collaborators
            })
        });
        $('body').append(dialogBody);

        var diaButtons = {};
        diaButtons[gettext('Add new contact')] = function () {
            contactHelpers.addMemberDialog();
        };
        diaButtons[gettext('Submit')] = function () {
            //apply the current state to server
            var collaborators = [],
                rights = [];
            $('#share-member .collaborator-tr').each(function () {
                collaborators[collaborators.length] = $(this).attr(
                    'data-id');
                rights[rights.length] = $(this).attr('data-right');
            });
            accessrightsHelpers.submitAccessRight(documentIds,
                collaborators, rights);
            $(this).dialog('close');
        };
        diaButtons[gettext('Cancel')] = function () {
            $(this).dialog("close");
        }

        $('#access-rights-dialog').dialog({
            draggable: false,
            resizable: false,
            top: 10,
            width: 820,
            height: 540,
            modal: true,
            buttons: diaButtons,
            create: function () {
                var $the_dialog = $(this).closest(".ui-dialog");
                $the_dialog.find(".ui-dialog-buttonset .ui-button:eq(0)").addClass("fw-button fw-light fw-add-button");
                $the_dialog.find(".ui-dialog-buttonset .ui-button:eq(1)").addClass("fw-button fw-dark");
                $the_dialog.find(".ui-dialog-buttonset .ui-button:eq(2)").addClass("fw-button fw-orange");
            },
            close: function () {
                $('#access-rights-dialog').dialog('destroy').remove();
            }
        });
        $('.fw-checkable').bind('click', function () {
            $.setCheckableLabel($(this));
        });
        $('#add-share-member').bind('click', function () {
            var $selected_members = $('#my-contacts .fw-checkable.checked');
            var selected_data = [];
            $selected_members.each(function () {
                var member_id = $(this).attr('data-id');
                var $collaborator = $('#collaborator-' + member_id);
                if (0 == $collaborator.size()) {
                    selected_data[selected_data.length] = {
                        'user_id': member_id,
                        'user_name': $(this).attr('data-name'),
                        'avatar': $(this).attr('data-avatar'),
                        'rights': 'r'
                    }
                } else if ('d' == $collaborator.attr('data-right')) {
                    $collaborator.removeClass('d').addClass('r').attr(
                        'data-right', 'r');
                }
            });
            $('#my-contacts .checkable-label.checked').removeClass('checked');
            $('#share-member table tbody').append(tmp_collaborators({
                'collaborators': selected_data
            }));
            accessrightsHelpers.collaboratorFunctionsEvent();
        });
        accessrightsHelpers.collaboratorFunctionsEvent();
    };


    accessrightsHelpers.collaboratorFunctionsEvent = function () {
        $('.edit-right').unbind('click');
        $('.edit-right').each(function () {
            $.addDropdownBox($(this), $(this).siblings('.fw-pulldown'));
        });
        var $spans = $(
            '.edit-right-wrapper .fw-pulldown-item, .delete-collaborator');
        $spans.unbind('mousedown');
        $spans.bind('mousedown', function () {
            var new_right = $(this).attr('data-right');
            $(this).closest('.collaborator-tr').attr('class',
                'collaborator-tr ' + new_right);
            $(this).closest('.collaborator-tr').attr('data-right',
                new_right);
        });
    };

    accessrightsHelpers.submitAccessRight = function (documents,
        collaborators, rights) {
        var post_data = {
            'documents[]': documents,
            'collaborators[]': collaborators,
            'rights[]': rights
        }
        $.ajax({
            url: '/document/accessright/save/',
            data: post_data,
            type: 'POST',
            dataType: 'json',
            success: function (response) {
                theAccessRights = response.access_rights;
                $.addAlert('success', gettext(
                    'Access rights have been saved'));
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR.responseText);
            }
        });
    };

    exports.accessrightsHelpers = accessrightsHelpers;

}).call(this);
