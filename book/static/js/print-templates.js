/**
 * @ Templates for printing of books.
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
/** A template for the initial pages of a book before the contents begin. */
var tmp_book_print_start = _.template('\
    <h1 id="document-title"><%= theBook.title %></h1>\
    <% if (theBook.metadata.subtitle && theBook.metadata.subtitle != "" ) { %>\
        <h2 id="metadata-subtitle"><%= theBook.metadata.subtitle %></h2>\
    <% } %>\
    <% if (theBook.metadata.author && theBook.metadata.author != "" ) { %>\
        <h3><%= theBook.metadata.author %></h3>\
    <% } %>\
<div class="pagination-pagebreak"></div>\
    <% if (theBook.metadata.publisher && theBook.metadata.publisher != "" ) { %>\
        <div class="publisher"><%= theBook.metadata.publisher %></div>\
    <% } %>\
    <% if (theBook.metadata.copyright && theBook.metadata.copyright != "" ) { %>\
        <div class="copyright"><%= theBook.metadata.copyright %></div>\
    <% } %>\
<div class="pagination-pagebreak">\
');
/** A template for the print view of a book. */
var tmp_book_print = _.template('\
<% _.each(theBook.chapters, function (chapter) { %>\
    <% var tempNode; %>\
    <% if (chapter.part && chapter.part != "") { %>\
        <div class="part">\
            <h1><%= chapter.part %></h1>\
        </div>\
    <% } %>\
    <div class="chapter">\
        <h1 class="title"><%= chapter.title %></h1>\
        <% if (chapter.settings.metadata) { %>\
            <% if (chapter.settings.metadata.subtitle && chapter.metadata.subtitle) { %>\
                <% tempNode = jsonToHtml(chapter.metadata.subtitle) %>\
                <% if (tempNode.textContent.length > 0) { %>\
                    <h2 class="metadata-subtitle"><%= tempNode.textContent %></h2>\
                <% } %>\
            <% } %>\
            <% if (chapter.settings.metadata.abstract && chapter.metadata.abstract ) { %>\
                <% tempNode = jsonToHtml(chapter.metadata.abstract) %>\
                <% if (tempNode.textContent.length > 0) { %>\
                    <h2 class="metadata-abstract"><%= tempNode.textContent %></h2>\
                <% } %>\
            <% } %>\
        <% } %>\
        <%= nodeConverter.toView(jsonToHtml(JSON.parse(chapter.contents))).innerHTML %>\
    </div>\
<% }); %>\
');