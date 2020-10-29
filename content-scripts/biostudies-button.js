// Copyright (C) 2020 David Miguel Susano Pinto <carandraug+dev@gmail.com>
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

"use strict";

(function() {

    let doi = null;
    for (const meta of document.head.getElementsByTagName('meta')) {
        if (meta.getAttribute('name') === 'citation_doi'
            || meta.getAttribute('name') === 'DC.Identifier') {
            doi = meta.getAttribute('content');
            if (doi !== null)
                break;
        }
    }
    browser.runtime.sendMessage({"doi": doi});

})();
