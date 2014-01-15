/**
 * @file Set ups things on the editor page.
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
/** Whether the citation style before the current one was footnote based. This is used to determine whetherthe page needs to be reformatted.
 * @constant lastStyleUsedFootnotes
 */
var lastStyleUsedFootnotes = false;

// Functions to be executed at startup
jQuery(document).ready(function () {
    
    var documentStyleMenu = document.getElementById("documentstyle-list"), documentStyleMenuItem;
    
    // Enable toolbar menu
    jQuery('#menu1').ptMenu();

    //open dropdown for headermenu
    jQuery('.header-nav-item').each(function () {
        $.addDropdownBox(jQuery(this), jQuery(this).siblings(
            '.fw-pulldown'));
    });


    for (i = 0; i < documentStyleList.length; i++) {   
        documentStyleMenuItem=document.createElement("li");
        documentStyleMenuItem.innerHTML = "<span class='fw-pulldown-item style' data-style='"+documentStyleList[i].filename+"' title='"+documentStyleList[i].title+"'>"+documentStyleList[i].title+"</span>";
        documentStyleMenu.appendChild(documentStyleMenuItem);
    }
});

// Functions to be executed when document has loaded
jQuery(document).bind('documentDataLoaded', function () {

    
    // We cannot download BibDB and ImageDB before we know if we are the document owner or not.
    bibliographyHelpers.init();
    usermediaHelpers.init();

    var set_document_style_timer = setTimeout(function () {
        clearTimeout(set_document_style_timer);
        //setDocumentstyle();
        editorHelpers.setDisplay.document('settings.documentstyle',
            theDocument.settings.documentstyle);
    }, 800);

    // Document Style switching
    jQuery("#header-navigation .style").bind('mousedown', function () {
        if (editorHelpers.setDocumentData('settings.documentstyle',
            jQuery(this).attr(
                'data-style'))) {

            editorHelpers.setDisplay.document('settings.documentstyle',
                theDocument.settings.documentstyle);
            editorHelpers.documentHasChanged();
        }
        return false;
    });


    editorHelpers.setDisplay.document('settings.citationstyle', theDocument
        .settings.citationstyle);

    jQuery('span[data-citationstyle=' + theDocument.settings.citationstyle +
        ']').addClass('selected');

    // Citation Style switching
    jQuery("#header-navigation .citationstyle").bind('mousedown', function () {
        if (editorHelpers.setDocumentData('settings.citationstyle',
            jQuery(this).attr(
                'data-citationstyle'))) {
            editorHelpers.setDisplay.document('settings.citationstyle',
                theDocument.settings.citationstyle);
            editorHelpers.documentHasChanged();
            commentHelpers.layoutComments();
        }
        return false;
    });
    // Tools
    jQuery("#header-navigation .tools-item").bind('mousedown', function () {
        toolsHelpers.toolsEventHandler(jQuery(this).data('function'));
        return false;
    });

    editorHelpers.setPlaceholders();

    jQuery(document).on('blur',
        '#document-title,#document-contents,#metadata-subtitle,#metadata-abstract,#metadata-authors,#metadata-keywords',
        function () {
            editorHelpers.setPlaceholders();
        });
    jQuery(document).on('focus',
        '#document-title,#document-contents,#metadata-subtitle,#metadata-abstract,#metadata-authors,#metadata-keywords',
        function () {
            editorHelpers.setPlaceholders(jQuery(this).attr('id'));
        });

    editorHelpers.setDisplay.document('settings.papersize', theDocument.settings
        .papersize);

    // Paper size switching
    jQuery("#header-navigation .papersize").bind('mousedown', function () {
        if (editorHelpers.setDocumentData('settings.papersize',
            parseInt(jQuery(this).attr('data-paperheight')))) {
            editorHelpers.setDisplay.document('settings.papersize',
                theDocument.settings.papersize);
            editorHelpers.documentHasChanged();
        }
        return false;
    });

    editorHelpers.setDisplay.document('id', theDocument.id);


    // Disable papersize menu if we are dealing with a non CSS Regions browser
    if (jQuery('.pagination-simple').length > 0) {
        jQuery('.papersize-menu').unbind('mousedown');
        jQuery('.papersize-menu').addClass('disabled');
    }

    jQuery(document).on('mousedown', '.savecopy:not(.disabled)', function () {
        editorHelpers.getUpdatesFromInputFields(function () {
            editorHelpers.saveDocument();
        });
        exporter.savecopy(theDocument);
    });

    jQuery('.download').bind('mousedown', function () {
        editorHelpers.getUpdatesFromInputFields(function () {
            editorHelpers.saveDocument();
        });
        exporter.downloadNative(theDocument);
    });
    jQuery('.latex').bind('mousedown', function () {
        editorHelpers.getUpdatesFromInputFields(function () {
            editorHelpers.saveDocument();
        });
        exporter.downloadLatex(theDocument);
    });
    jQuery('.epub').bind('mousedown', function () {
        editorHelpers.getUpdatesFromInputFields(function () {
            editorHelpers.saveDocument();
        });
        exporter.downloadEpub(theDocument);
    });
    jQuery('.html').bind('mousedown', function () {
        editorHelpers.getUpdatesFromInputFields(function () {
            editorHelpers.saveDocument();
        });
        exporter.downloadHtml(theDocument);
    });
    jQuery('.print').bind('mousedown', function () {
        window.print();
    });
    jQuery('.close').bind('mousedown', function () {
        editorHelpers.getUpdatesFromInputFields(function () {
            editorHelpers.saveDocument();
        });
        window.location.href = '/';
    });


    editorHelpers.layoutMetadata();

    if (theDocumentValues.rights === 'r') {
        jQuery('#editor-navigation').hide();
        jQuery('.papersize-menu,.metadata-menu,.documentstyle-menu').addClass(
            'disabled');
    } else if (theDocumentValues.rights === 'w') {

        jQuery('.metadata-menu-item').bind('mousedown', editorHelpers.switchMetadata);

        jQuery('#metadata-subtitle, #metadata-abstract, #metadata-authors, #metadata-keywords').bind('blur',
            function () {
                if (jQuery.trim(this.textContent) === '') {
                    this.innerHTML = '<p><br></p>';
                };
            });

        if (!theDocumentValues.is_owner) {
            jQuery('span.share').addClass('disabled');
        }


        window.tracker = new ice.InlineChangeEditor({
            element: document.querySelector('#document-editable'),
            handleEvents: false,
             mergeBlocks: false,
            contentEditable: true,
            currentUser: {
                id: theUser.id,
                name: theUser.name
            },
            plugins: []
        }).startTracking();
        document.querySelector('#document-editable').removeAttribute(
            'contenteditable');
        jQuery('.editable').attr('contenteditable', true);
        mathHelpers.resetMath();


        diffHelpers.setup();

        // Set Auto-save to save every ten seconds
        setInterval(function () {
            if (theDocumentValues.changed) {
                theDocumentValues.sentHash = false;
                editorHelpers.getUpdatesFromInputFields(function () {
                    editorHelpers.saveDocument();
                });
            } else if (theDocumentValues.control && !theDocumentValues.sentHash && theDocumentValues.collaborativeMode) {
                theDocumentValues.sentHash = true;
                console.log('sending hash');
                serverCommunications.send({
                    type: 'hash',
                    hash: editorHelpers.docHash()
                })
            }
        }, 10000);


        // bind the share dialog to the button if the user is the document owner
        if (theDocumentValues.is_owner) {
            jQuery('.share').bind('mousedown', function () {
                accessrightsHelpers.createAccessRightsDialog([
                    theDocument.id
                ]);
            });
        }


        keyEvents.bindEvents();

        // Bind comment functions
        commentHelpers.bindEvents();

        var editableArea = document.querySelector("#document-editable");

        if (editableArea) {
            // Send paste to handlePaste
            editableArea.addEventListener('paste', paste.handlePaste, false);

            // Send cut to handleCut
            editableArea.addEventListener('cut', cut.handleCut, false);

            // Send key events on to the tracker directly.
            jQuery(editableArea).bind('keyup keypress mousedown mouseup',
                function (evt) {
                    if (theDocument.settings.tracking) {
                        return tracker.handleEvent(evt);
                    } else {
                        return true;
                    }
                });
        }

        // Set webpage title when document title changes
        jQuery('#document-title').bind('keyup paste change',
            function () {
                editorHelpers.setDisplay.document('title', jQuery(this).text()
                    .trim());
            });

        // When contents of document have changed, mark it as such
        jQuery('#document-editable').bind(
            'keyup paste change', function () {
                editorHelpers.documentHasChanged();
            });
        jQuery('.save').bind('mousedown', function () {
            editorHelpers.getUpdatesFromInputFields(function () {
                editorHelpers.saveDocument();
            });
            exporter.uploadNative(theDocument);
        });

        /* jQuery(window).on('beforeunload', function(){
            editorHelpers.getUpdatesFromInputFields(function () {
                editorHelpers.saveDocument();
            });
            if (theDocumentValues.collaborativeMode) {
                diffHelpers.handleChanges();
            }
            return gettext('Leave editor');
        }); */


        jQuery(document).on('click', '.pagination-footnote-item-container',
            function (e) {
                var footnote = document.getElementById(this.dataset.footnoteId);
                tracker._addNodeTracking(footnote, false, false);
            }
        );

            jQuery('.multibuttonsCover').each(function () {
                $.addDropdownBox(jQuery(this), jQuery(this).siblings(
                    '.fw-pulldown'));
            });


        //ice pulldown
        $.addDropdownBox(jQuery('#ice-control'), jQuery(
            '#ice-control .fw-pulldown'));

        editorHelpers.setDisplay.document('settings.tracking', theDocument.settings
            .tracking);
        editorHelpers.setDisplay.document('settings.tracking_show',
            theDocument.settings.tracking_show);


        jQuery('.ice-display').bind('mousedown', function () {
            editorHelpers.setDocumentData('settings.tracking_show', (!
                theDocument.settings
                .tracking_show));
            editorHelpers.setDisplay.document('settings.tracking_show',
                theDocument.settings.tracking_show);
            editorHelpers.documentHasChanged();
            return false;
        });

        if (theDocumentValues.is_owner) {
            jQuery('.ice-track').bind('mousedown', function () {
                editorHelpers.setDocumentData('settings.tracking', (!
                    theDocument.settings.tracking));
                editorHelpers.setDisplay.document('settings.tracking',
                    theDocument.settings.tracking);
                editorHelpers.documentHasChanged();
                return false;
            });

            jQuery('.ice-accept-all').bind('mousedown', function () {
                window.tracker.acceptAll();
                editorHelpers.documentHasChanged();
                return false;
            });

            jQuery('.ice-reject-all').bind('mousedown', function () {
                window.tracker.rejectAll();
                editorHelpers.documentHasChanged();
                return false;
            });

            // Bind in-text tracking menu
            trackingHelpers.bindEvents();
        } else {
            jQuery('.ice-track').addClass('disabled');
            jQuery('.ice-accept-all').addClass('disabled');
            jQuery('.ice-reject-all').addClass('disabled');
        }


        //open and close header
        jQuery('#open-close-header').bind('click', function () {
            var header_top = -92,
                toolnav_top = 0,
                content_top = 108;
            if (jQuery(this).hasClass('header-closed')) {
                jQuery(this).removeClass('header-closed');
                header_top = 0,
                toolnav_top = 92,
                content_top = 200;
            } else {
                jQuery(this).addClass('header-closed');
            }
            jQuery('#header').stop().animate({
                'top': header_top
            });
            jQuery('#editor-navigation').stop().animate({
                'top': toolnav_top
            });
            jQuery('#pagination-layout').stop()
                .animate({
                    'top': content_top
                }, {
                    'complete': function () {
                        commentHelpers.layoutComments();
                    }
                });
        });

    }
});

jQuery(document).bind("bibliography_ready", function (event) {
                        jQuery('.citationstyle-menu, .exporter-menu').each(function () {
                        jQuery.addDropdownBox(jQuery(this), jQuery(this).siblings('.fw-pulldown'));
                        jQuery(this).removeClass('disabled');
                        jQuery(this).removeClass('header-nav-item-disabled');
                        jQuery(this).addClass('header-nav-item');
                    });
                    citationHelpers.formatCitationsInDoc();
});
