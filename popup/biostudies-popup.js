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

const rest_search_url = "https://www.ebi.ac.uk/biostudies/api/v1/search"
const rest_study_url = "https://www.ebi.ac.uk/biostudies/api/v1/studies/"

const base_file_url = "https://www.ebi.ac.uk/biostudies/files/"
const base_study_url = "https://www.ebi.ac.uk/biostudies/studies/"


function simpleReport(text) {
    document.body.appendChild(document.createTextNode(text));
}

function reportExecuteScriptError(error) {
    simpleReport(`Failed to execute content script: ${error.message}`);
}

function reportNoDOI() {
    simpleReport("Failed to find DOI for current page.");
}

function reportNoDataPackage(doi) {
    simpleReport(`No BioStudy Data Package for DOI ${doi}`);
}


// TODO: we should be able to provide a box with links to the
// individual files instead of only links to the data package.  We get
// that via REST with api/v1/studies/{acession} and then
// response['section']['subsections'] that has the "files" property.
// Maybe consider cases where none of the studies has any files?

function addLinkToStudy(study_acc) {
    const div = document.createElement("div");
    const study_anchor = document.createElement("a");
    study_anchor.href = base_study_url + study_acc;
    study_anchor.textContent = study_acc;
    div.appendChild(study_anchor);
    document.body.appendChild(div);
}


async function showStudies(doi) {
    const url = `${rest_search_url}?content="${doi}"`;
    const studies = await fetch(url).then(x => x.json());
    if (studies['totalHits'] === 0)
        reportNoDataPackage(doi);
    else {
        const studies_acc = studies['hits'].map(x => x["accession"]);
        for (let study_acc of studies_acc)
            addLinkToStudy(study_acc);
    }
}


function receiveDOI(message, sender, sendResponse) {
    browser.runtime.onMessage.removeListener(receiveDOI);
    const doi = message.doi;
    if (doi === null)
        reportNoDOI();
    else
        showStudies(doi);
}


browser.runtime.onMessage.addListener(receiveDOI);
browser.tabs.executeScript({
    file: "/content-scripts/biostudies-button.js"
}).catch(
    reportExecuteScriptError
);
